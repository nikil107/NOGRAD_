import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, addDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [bio, setBio] = useState('');
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();

  const handlSignup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

    
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: user.email,
        college: college,
        bio: bio,
      });

      Alert.alert("Success", "User account created & signed in!");
      router.push('\login');
      
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image style={styles.img} source={require("../assets/images/logo.png")} />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Name"
          placeholderTextColor="#666"
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Your Email"
          placeholderTextColor="#666"
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Your Password" 
          placeholderTextColor="#666"
          secureTextEntry
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Your College"
          placeholderTextColor="#666"
          onChangeText={setCollege}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Your Bio"
          placeholderTextColor="#666"
          multiline
          onChangeText={setBio}
          numberOfLines={3}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => handlSignup(email, password)} 
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f8ff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  img: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  formContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#4B0082",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Signup;
