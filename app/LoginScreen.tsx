import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "expo-router";
import { registerForPushNotificationsAsync } from "./utils/notifications";
import { auth } from "@/config/firebase";
import ErrorModal from "./ErrorModal"; // համոզվիր՝ ճիշտ ճանապարհ է

const LoginScreen = () => {
  const { login, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Սխալ 🚫", "Լրացրու բոլոր դաշտերը");
      return;
    }

    try {
      await login(email, password);
      const userId = auth.currentUser?.uid;

      if (!userId) {
        throw new Error("Օգտատերը մուտք չի գործել");
      }

      await registerForPushNotificationsAsync(userId);

      router.replace({ pathname: "/NewsListScreen" as any });
    } catch (error) {
      console.error("Մուտքի սխալ:", error);
      setShowError(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Մուտք</Text>

      <TextInput
        style={styles.input}
        placeholder="Էլ․ փոստ"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Գաղտնաբառ"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>
          {loading ? "Սպասեք..." : "Մուտք գործել"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 16 }}
        onPress={() => router.push("/reset-password")}
      >
        <Text style={{ color: "#00798c" }}>Մոռացե՞լ ես գաղտնաբառը</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginTop: 16 }}
        onPress={() => router.push("/RegisterScreen")}
      >
        <Text style={{ color: "#00798c" }}>Գրանցվել</Text>
      </TouchableOpacity>

      {/* ✅ Error Modal */}
      <ErrorModal
        visible={showError}
        onClose={() => setShowError(false)}
        message="Սխալ տվյալներ են մուտքագրվել։"
      />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#006d77",
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 14,
    marginBottom: 16,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#00798c",
    padding: 14,
    borderRadius: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
