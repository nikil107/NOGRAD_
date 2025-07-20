import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, Dimensions, ScrollView } from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";

const { height, width } = Dimensions.get("window");

const Profile = () => {
  const [userProfile, setUserProfile] = useState({
    name: "",
    avatar: "",
    bio: "",
    college: "",
    points: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const db = getFirestore();
        const user = auth.currentUser;

        if (user) {
   
          const userDoc = await getDoc(doc(db, "users", user.uid));
  
          const leaderboardDoc = await getDoc(doc(db, "leaderboard", user.uid));
          
          if (userDoc.exists()) {
            const profileData = userDoc.data();
            const points = leaderboardDoc.exists() ? leaderboardDoc.data().points || 0 : 0;
            
            setUserProfile({
              name: profileData.name || "",
              avatar: profileData.avatar || "",
              bio: profileData.bio || "",
              college: profileData.college || "",
              points: points
            });
          }
        }
      } catch (e) {
        console.error("Error fetching user data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getBadge = (points) => {
    if (points >= 500) return { name: "LEGEND", color: "#FF4500", icon: "star" };
    if (points >= 300) return { name: "DIAMOND", color: "#00BFFF", icon: "diamond" };
    if (points >= 200) return { name: "PLATINUM", color: "#E5E4E2", icon: "verified" };
    if (points >= 100) return { name: "GOLD", color: "#FFD700", icon: "star" };
    if (points >= 50) return { name: "SILVER", color: "#C0C0C0", icon: "star" };
    return { name: "BRONZE", color: "#CD7F32", icon: "star" };
  };

  const badge = getBadge(userProfile.points);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>My Profile</Text>
        
        <View style={styles.profileCard}>
  
          <View style={styles.avatarContainer}>
            {userProfile.avatar ? (
              <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <MaterialIcons name="person" size={50} color="#4B0082" />
              </View>
            )}
            <Text style={styles.name}>{userProfile.name || "Anonymous"}</Text>
            <Text style={styles.tagline}>{userProfile.bio || "No bio yet"}</Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <MaterialIcons name="school" size={24} color="#4B0082" />
              <Text style={styles.infoText}>{userProfile.college || "Not specified"}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <MaterialIcons name="leaderboard" size={24} color="#4B0082" />
              <Text style={styles.infoText}>{userProfile.points} Points</Text>
            </View>
          </View>

     
          <View style={[styles.badgeContainer, { backgroundColor: badge.color }]}>
            <MaterialIcons name={badge.icon} size={30} color="#333" />
            <Text style={styles.badgeText}>{badge.name}</Text>
            <Text style={styles.pointsText}>You have {userProfile.points} points</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Contributions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: 20,
  },
  profileCard: {
    width: width * 0.9,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#4B0082",
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#4B0082",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  tagline: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 5,
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "#e3f2fd",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  badgeContainer: {
    width: "100%",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    flexDirection: "row",
  },
  badgeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  pointsText: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 12,
    color: "#333",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4B0082",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
});

export default Profile;