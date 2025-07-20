import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  ActivityIndicator
} from "react-native";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  const insertionSort = (arr) => {
    const sortedArray = [...arr];
    for (let i = 1; i < sortedArray.length; i++) {
      let current = sortedArray[i];
      let j = i - 1;
      
      while (j >= 0 && sortedArray[j].points < current.points) {
        sortedArray[j + 1] = sortedArray[j];
        j--;
      }
      sortedArray[j + 1] = current;
    }
    return sortedArray;
  };

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const globalSnapshot = await getDocs(collection(db, "leaderboard"));
        let globalData = [];

        globalSnapshot.forEach(doc => {
          globalData.push({ id: doc.id, ...doc.data() });
        });

        globalData = insertionSort(globalData);
        setLeaderboardData(globalData);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  useEffect(() => {
    const fetchUserNames = async () => {
      const updatedLeaderboard = await Promise.all(
        leaderboardData.map(async (item) => {
          if (!item.userId) return { ...item, name: "Anonymous" };

          try {
            const userDoc = await getDoc(doc(db, "users", item.userId));
            const userName = userDoc.exists() ? userDoc.data().name : "Anonymous";
            return { ...item, name: userName };
          } catch (error) {
            console.error("Error fetching user name:", error);
            return { ...item, name: "Anonymous" };
          }
        })
      );

      setLeaderboardData(updatedLeaderboard);
    };

    if (leaderboardData.length > 0) {
      fetchUserNames();
    }
  }, [leaderboardData]);

  const renderItem = ({ item, index }) => (
    <View style={styles.item}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Image 
        source={{ uri: item.avatar || "https://via.placeholder.com/50" }} 
        style={styles.avatar} 
      />
      <Text style={styles.name}>{item.name || "Anonymous"}</Text>
      <Text style={styles.score}>{item.points || 0} Points</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Global Leaderboard</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4B0082" style={styles.loader} />
      ) : leaderboardData.length === 0 ? (
        <Text style={styles.noDataText}>No leaderboard data available</Text>
      ) : (
        <FlatList
          data={leaderboardData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#4B0082",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  rank: {
    width: 30,
    fontSize: 18,
    fontWeight: "bold",
    color: "#4B0082",
    textAlign: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#4B0082",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 15,
    color: "#333",
  },
  score: {
    fontSize: 16,
    color: "#2575fc",
    fontWeight: "bold",
  },
  loader: {
    marginTop: 50,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#666",
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default Leaderboard;
