import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { colors } from "../utils/color";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import PrimaryButton from "../components/PrimaryButton";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface LoginScreenProps {
  onLogin: () => void; // Callback function to handle successful login
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const theme = useTheme();
  const dimensions = useWindowDimensions();
  const [secureEntery, setSecureEntery] = useState(true);

  // const handleLogin = () => {
  //   // Mock login logic - replace this with actual authentication
  //   if (username === "staff" && password === "password") {
  //     onLogin(); // Call the onLogin callback if login is successful
  //   } else {
  //     alert("Invalid credentials");
  //   }
  const handleLogin = async () => {
    try {
      const response = await axios.post('https://bfrsserver.azurewebsites.net/api/Accounts/login', {
        username,
        password
      });
      
      const { token, account } = response.data;
      
      if (account.role === 'Seller') {
        await AsyncStorage.setItem('token', token);
        onLogin(); // Call the onLogin callback if login is successful
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      alert("Invalid credentials");
    }
  };

  return (
    <KeyboardAvoidingView behavior="position" style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.colors.card,
          minHeight: dimensions.height,
        }}
      >
        <Animated.View
          entering={FadeInUp.delay(200).duration(1000).springify()}
          style={{
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
          }}
          
        >
          <Image source={require('../assets/images/JewelryLogo.png')} style={{width: 688, height: 688}}/>
        </Animated.View>

        <View style={{ padding: 27, marginBottom: 30 }}>
          <Animated.Text
            entering={FadeInDown.duration(1000).springify()}
            style={{
              fontSize: 40,
              fontWeight: "800",
              color: theme.colors.text,
            }}
          >
            {`Let's\nStarted`}
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(100).duration(1000).springify()}
            style={{
              opacity: 0.5,
              marginTop: 16,
              fontSize: 16,
              color: theme.colors.text,
            }}
          >
            To Register account, please contact to Admin
          </Animated.Text>

          <View style={{ alignItems: "center", gap: 16, marginTop: 32 }}>
            <Animated.View
              entering={FadeInDown.delay(200).duration(1000).springify()}
              style={{ position: "relative", width: "100%" }}
            >
              <TextInput
                placeholder="Tài Khoản"
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: theme.colors.text,
                  paddingLeft: 48,
                  paddingRight: 12,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: theme.colors.background,
                  width: "100%",
                }}
                keyboardType="email-address"
                onChangeText={setUsername}
                value={username}
              />
              <Ionicons
                name={"mail-outline"}
                size={24}
                color={theme.colors.text}
                style={{
                  position: "absolute",
                  left: 12,
                  top: 12,
                  opacity: 0.5,
                }}
              />
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(400).duration(1000).springify()}
              style={{
                position: "relative",
                width: "100%",
                flexDirection: "row",
              }}
            >
              <TextInput
                placeholder="Mật Khảu"
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: theme.colors.text,
                  paddingLeft: 48,
                  paddingRight: 12,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: theme.colors.background,
                  width: "100%",
                }}
                secureTextEntry={secureEntery}
                onChangeText={setPassword}
                value={password}
              />

              <SimpleLineIcons
                name={"lock"}
                size={24}
                color={theme.colors.text}
                style={{
                  position: "absolute",
                  left: 12,
                  top: 12,
                  opacity: 0.5,
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  setSecureEntery((prev) => !prev);
                }}
                style={{
                  position: "relative",
                  right: 33,
                  top: 12,
                  opacity: 0.5,
                }}
              >
                <SimpleLineIcons
                  name={"eye"}
                  size={20}
                  color={colors.black}
                />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(600).duration(1000).springify()}
            >
              <PrimaryButton label="Log In" onPress={handleLogin} />
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
});
