import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const CategoryScreen = () => {
  const auth = getAuth();
  const route = useRoute();
  const { category } = route.params;
  const [dataCollection, setDataCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const db = getFirestore();
        const q = query(
          collection(db, "data"),
          where("userId", "==", user.uid),
          where("category", "==", category)
        );
        
        const querySnapshot = await getDocs(q);
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        
        setDataCollection(items);
      } catch (e) {
        console.log("Error fetching data: ", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [category]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{category}</Text>
      {dataCollection.length > 0 ? (
        <FlatList
          data={dataCollection}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              {item.image && (
                <Image 
                  source={{ uri: item.image }}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}
              <Text style={styles.content}>{item.description}</Text>
              <View style={styles.metaContainer}>
                <Text style={styles.meta}>Language: {item.language}</Text>
                <Text style={styles.meta}>
                  Posted: {item.timestamp?.toDate?.()?.toLocaleDateString() || "N/A"}
                </Text>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.empty}></Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#fff" 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d'
  },
  header: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20,
    color: "#2c3e50",
    textAlign: 'center'
  },
  item: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: "#eee",
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  content: { 
    fontSize: 16, 
    marginBottom: 12,
    lineHeight: 22,
    color: "#34495e"
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  meta: {
    fontSize: 14,
    color: "#7f8c8d",
    fontStyle: 'italic'
  },
  empty: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
    color: "#95a5a6"
  }
});

export default CategoryScreen;