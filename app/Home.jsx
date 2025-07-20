import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, FlatList, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default function HomeScreen() {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
      const fetchUserData = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;

      if (user) {
        try {
       
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }

         
          const pointsDoc = await getDoc(doc(db, "leaderboard", user.uid));
          if (pointsDoc.exists()) {
            setUserPoints(pointsDoc.data().points || 0);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    
    const fetchNews = async () => {
      const url = 'https://newsapi.org/v2/everything?' +
        'q=computer science students&computer science internship' +
        'from=2025-03-07&' +
        'sortBy=popularity&' +
        'apiKey=526d0ea136724f79b3334e15a124f0ab';

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.articles && data.articles.length > 0) {
          setNews(data.articles.slice(0, 50)); 
        }
      } catch (error) {
        console.error('Error fetching tech news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchNews();
  }, []);

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
     
    >
      {item.urlToImage && (
        <Image source={{ uri: item.urlToImage }} style={styles.newsImage} />
      )}
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle}>{item.title || 'No title available'}</Text>
        <Text style={styles.newsDescription} numberOfLines={3}>
          {item.description || 'No description available'}
        </Text>
        <Text style={styles.readMore}>Read more →</Text>
      </View>
    </TouchableOpacity>
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.name}>
              {userData?.name || 'User'}
              {userData?.name?.endsWith('s') ? "'" : "'s"} Dashboard
            </Text>
          </View>
          
          {userData?.avatar ? (
            <Image source={{ uri: userData.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <FontAwesome name="user" size={24} color="#fff" />
            </View>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#4B0082' }]}>
            <MaterialIcons name="leaderboard" size={30} color="#fff" />
            <Text style={styles.statNumber}>{userPoints}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#2575fc' }]}>
            <MaterialIcons name="trending-up" size={30} color="#fff" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Contributions</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Tech News For You</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#4B0082" style={styles.loader} />
        ) : (
          <FlatList
            data={news}
            renderItem={renderNewsItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.newsContainer}
          />
        )}

    
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/upload')}
          >
            <MaterialIcons name="cloud-upload" size={30} color="#4B0082" />
            <Text style={styles.actionText}>Upload Contribution</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/progress')}
          >
            <MaterialIcons name="insights" size={30} color="#4B0082" />
            <Text style={styles.actionText}>View Progress</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

    
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <MaterialIcons name="home" size={24} color="#4B0082" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/progress')}>
          <MaterialIcons name="trending-up" size={24} color="#2575fc" />
          <Text style={styles.navText}>Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/leaderboard')}>
          <MaterialIcons name="leaderboard" size={24} color="#2575fc" />
          <Text style={styles.navText}>Leaderboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <MaterialIcons name="person" size={24} color="#2575fc" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    color: '#666',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#4B0082',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4B0082',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 16,
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
    marginBottom: 15,
  },
  newsContainer: {
    paddingLeft: 20,
    paddingBottom: 10,
  },
  card: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginRight: 15,
    elevation: 3,
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  newsContent: {
    padding: 15,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  newsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  readMore: {
    fontSize: 14,
    color: '#4B0082',
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4B0082',
    marginTop: 10,
  },
  loader: {
    marginVertical: 30,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#2575fc',
    marginTop: 5,
  },
  
});