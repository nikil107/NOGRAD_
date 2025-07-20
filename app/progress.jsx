import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get('window');

const progress = () => {
  const router = useRouter();
  return (
      <View style={styles.container}>
          <Text style={styles.name}>Progress</Text>
          <View style={styles.h}>
              <View style={styles.h1}>
                  <TouchableOpacity style={styles.h2} onPress={()=>router.push('cat?category=Open Source')}>
                      <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStL_S6g_UMlzIC-loKdc8iWQbikn8iUMuqVA&s' }} style={styles.image} />
                      
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.h2} onPress={()=>router.push('cat?category=CP')}>
                      <Image source={{ uri: 'https://kislayverma.com/wp-content/uploads/2021/08/competitive-programming.png' }} style={styles.image} />
                      
                  </TouchableOpacity>
              </View>
              <View style={styles.h1}>
                  <TouchableOpacity style={styles.h2}onPress={()=>router.push('cat?category=Projects')}>
                      <Image source={{ uri: 'https://s3-ap-south-1.amazonaws.com/static.awfis.com/wp-content/uploads/2017/07/07184649/ProjectManagement.jpg' }} style={styles.image} />
                    
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.h2}onPress={()=>router.push('cat?category=Achievements')}>
                      <Image source={{ uri: 'https://img.freepik.com/premium-vector/goals-achievements-vector-flat-illustration_93208-321.jpg?semt=ais_hybrid' }} style={styles.image} />
                      
                  </TouchableOpacity>
              </View>
          </View>
          <TouchableOpacity style={styles.upload} onPress={() => router.push('upload')}>
              <View style={styles.ul}>
                  <MaterialIcons name="add" size={24} color="#2575fc" />
                  <Text>Upload</Text>
              </View>
          </TouchableOpacity>
          <View style={styles.bottom}>
              <TouchableOpacity style={styles.opt} onPress={() => router.push("/Home")}>
                  <MaterialIcons name="home" size={24} color="#2575fc" />
                  <Text style={styles.text}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.opt} onPress={() => router.push("/progress")}>
                  <MaterialIcons name="trending-up" size={24} color="#4B0082" />
                  <Text style={styles.text1}>Progress</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.opt} onPress={() => router.push("/leaderboard")}>
                  <MaterialIcons name="leaderboard" size={24} color="#2575fc" />
                  <Text style={styles.text}>Leaderboard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.opt} onPress={() => router.push("/profile")}>
                  <MaterialIcons name="person" size={24} color="#2575fc" />
                  <Text style={styles.text}>Profile</Text>
              </TouchableOpacity>
          </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "white",
  },
  bottom: {
      flexDirection: "row",
      justifyContent: "space-around",
      backgroundColor: "#e3f2fd",
      paddingVertical: 15,
      width: "100%",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: height * 0.121
  },
  opt: {
      alignItems: "center",
  },
  text: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#2575fc",
      marginTop: 5,
  },
  text1: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#4B0082",
      marginTop: 5,
  },
  h: {
      marginTop: height * 0.064
  },
  h1: {
      flexDirection: "row",
      justifyContent: "center",
      paddingVertical: height * 0.015,
      gap: width * 0.05,
  },
  h2: {
      width: "45%",
      height: height * 0.25,
      backgroundColor: "#e3f2fd",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 15,
      elevation: 5,
      shadowColor: "#4B0082",
      shadowOffset: { width: 12, height: 12 },
      shadowOpacity: 10.2,
      shadowRadius: 3,
  },
  upload: {
      alignItems: "center",
      backgroundColor: "#e3f2fd",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      marginTop: height * 0.03,
      alignSelf: "center",
  },
  ul: {
      flexDirection: 'row',
      padding: 20
  },
  name: {
      fontSize: 35
  },
  image: {
      width:"90%",
      height: "90%",
      marginBottom: 10,
      resizeMode:'stretch'
  },
  count: {
      marginTop: 5,
      fontSize: 14,
      fontWeight: "bold",
      color: "#333",
  }
});

export default progress;
