import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { fonts } from "../utils/fonts";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/color";

interface LoginScreenProps {
  onLogin: () => void; // Callback function to handle successful login
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [secureEntery, setSecureEntery] = useState(true);

  const handleLogin = () => {
    // Mock login logic - replace this with actual authentication
    if (username === "staff" && password === "password") {
      onLogin(); // Call the onLogin callback if login is successful
    } else {
      alert("Invalid credentials");
    }
  };
  return (
    <View style={styles.container}>
      <View style={{ marginTop: "30%", marginVertical: 20 }}>
        <Text style={styles.headingText}>Hey,</Text>
        <Text style={styles.headingText}>Welcome</Text>
        <Text style={styles.headingText}>Back</Text>
      </View>
      {/* form  */}
      <View style={{ marginTop: 20 }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.secondary,
            borderRadius: 100,
            paddingHorizontal: 25,
            paddingVertical: 10,
            flexDirection: "row",
            alignItems: "center",
            padding: 2,
            marginVertical: 10,
          }}
        >
          <Ionicons name={"mail-outline"} size={30} color={colors.secondary} />
          <TextInput
            style={{ flex: 1, paddingHorizontal: 10, fontWeight: "400" }}
            placeholder="Enter your email"
            placeholderTextColor={colors.secondary}
            keyboardType="email-address"
            onChangeText={setUsername}
            value={username}
          />
        </View>
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.secondary,
            borderRadius: 100,
            paddingHorizontal: 25,
            paddingVertical: 10,
            flexDirection: "row",
            alignItems: "center",
            padding: 2,
            marginVertical: 10,
          }}
        >
          <SimpleLineIcons name={"lock"} size={30} color={colors.secondary} />
          <TextInput
            style={{ flex: 1, paddingHorizontal: 10, fontWeight: "400" }}
            placeholder="Enter your password"
            placeholderTextColor={colors.secondary}
            secureTextEntry={secureEntery}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity
            onPress={() => {
              setSecureEntery((prev) => !prev);
            }}
          >
            <SimpleLineIcons name={"eye"} size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Text
            style={{
              textAlign: "right",
              color: colors.primary,
              fontWeight: "500",
              marginVertical: 10,
            }}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            borderRadius: 100,
            marginTop: 10,
          }}
          onPress={handleLogin}
        >
          <Text
            style={{
              color: colors.white,
              fontSize: 20,
              fontWeight: "700",
              textAlign: "center",
              padding: 15,
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },

  headingText: {
    fontSize: 42,
    color: colors.primary,
    fontWeight: "600",
  },
});
