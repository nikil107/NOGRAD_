import React, { useState } from "react";
import { View, StyleSheet, Text, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import * as FileSystem from 'expo-file-system';

const auth = getAuth();
const GEMINI_API_KEY = "AIzaSyBSD04p241E__QMiA2_wWY_87Do99osRtU"; 

const Upload = () => {
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const fileToGenerativePart = async (uri) => {
    const base64Data = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return {
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg'
      }
    };
  };

  const verifyWithGemini = async () => {
    try {
      if (!image) {
        Alert.alert("Error", "Please select an image first");
        return { success: false, message: "No image selected" };
      }
  
      const imagePart = await fileToGenerativePart(image);
  
      const prompt = {
        text: `Carefully analyze this image and the following description. 
        The description is: "${description}".
        The category is: ${category}.
        The programming language is: ${language}.
        
        Your task is to determine if the image clearly demonstrates or represents the described contribution.
        
        Consider:
        1. If the image shows code, does it match the described language and purpose?
        2. If the image shows a project/achievement, does it visually represent the description?
        3. If the image shows open source contribution, does it show relevant GitHub/activity proof?
        
        If the image clearly relates to and supports the description, return exactly "1".
        If the image is unrelated or doesn't support the description, return exactly "0".
        
        Only return "1" or "0" - no other text or explanation.`
      };
  
      const requestBody = {
        contents: [{
          parts: [prompt, imagePart]
        }]
      };
  
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Gemini API Response:", data);
      
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      
      if (!aiResponse) {
        throw new Error("No valid response from AI");
      }
      
      if (aiResponse === "1") {
        return { success: true, message: "Verification successful" };
      } else if (aiResponse === "0") {
        return { success: false, message: "Fake!! , Verification Failed" };
      } else {
        console.error("Unexpected AI response:", aiResponse);
        return { success: false, message: "Could not verify your submission. Please try again." };
      }
    } catch (error) {
      console.error("Error with Gemini API:", error);
      return { success: false, message: "Verification service unavailable. Please try again later." };
    }
  };

  const updateLeaderboard = async (userId, pointsToAdd) => {
    try {
      const db = getFirestore();
      const leaderboardRef = doc(db, "leaderboard", userId);
      
      const docSnap = await getDoc(leaderboardRef);
      
      if (docSnap.exists()) {
        const currentPoints = docSnap.data().points || 0;
        await setDoc(leaderboardRef, {
          points: currentPoints + pointsToAdd,
          userId: userId,
          lastUpdated: new Date()
        }, { merge: true });
      } else {
        await setDoc(leaderboardRef, {
          points: pointsToAdd,
          userId: userId,
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      console.error("Error updating leaderboard:", error);
      throw error;
    }
  };

  const calculatePoints = (category) => {
    switch (category) {
      case "Open Source":
        return 40;
      case "CP":
        return 30;
      case "Achievements":
        return 20;
      case "Projects":
        return 10;
      default:
        return 0;
    }
  };

  const uploadDoc = async () => {
    if (isUploading) return;
    setIsUploading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "Please login first!");
        return;
      }

      if (!description || !language || !category || !image) {
        Alert.alert("Error", "Please fill all fields and select an image");
        return;
      }

      const verification = await verifyWithGemini();
      if (!verification.success) {
        Alert.alert("Verification Failed", verification.message || "The AI verification failed. Please make sure your image matches the description.");
        return;
      }

      const db = getFirestore();
      await addDoc(collection(db, "data"), {
        userId: user.uid,
        image: image,
        category,
        language,
        description,
        aiAnalysis: verification.success ? 1 : 0,
        timestamp: new Date(),
        verified: verification.success
      });

      if (verification.success) {
        const pointsToAdd = calculatePoints(category);
        await updateLeaderboard(user.uid, pointsToAdd);
        Alert.alert("Success", `Upload successful! You earned ${pointsToAdd} points.`);
      } else {
        Alert.alert("Upload Complete", "Your submission has been recorded but didn't earn points as verification failed.");
      }

      // Reset form
      setImage(null);
      setDescription("");
      setLanguage("");
      setCategory("");
    } catch (error) {
      console.error("Error uploading:", error);
      Alert.alert("Error", error.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Contribution</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.selectImageText}>Tap to select image</Text>
        )}
      </TouchableOpacity>

      <Picker
        selectedValue={category}
        onValueChange={setCategory}
        style={styles.picker}
        dropdownIconColor="#4B0082"
      >
        <Picker.Item label="Select Category" value="" />
        <Picker.Item label="Open Source" value="Open Source" />
        <Picker.Item label="Competitive Programming" value="CP" />
        <Picker.Item label="Projects" value="Projects" />
        <Picker.Item label="Achievements" value="Achievements" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Programming Language (e.g., JavaScript, Python)"
        value={language}
        onChangeText={setLanguage}
      />

      <TextInput
        style={[styles.input, styles.description]}
        placeholder="Detailed description of your contribution"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity
        style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
        onPress={uploadDoc}
        disabled={isUploading}
      >
        {isUploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadText}>{isUploading ? 'Processing...' : 'Upload & Verify'}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#4B0082",
  },
  imagePicker: {
    width: "100%",
    height: 200,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  selectImageText: {
    color: "#888",
    fontSize: 16,
  },
  picker: {
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  description: {
    height: 120,
    textAlignVertical: "top",
  },
  uploadButton: {
    backgroundColor: "#4B0082",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  uploadButtonDisabled: {
    opacity: 0.7,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default Upload;