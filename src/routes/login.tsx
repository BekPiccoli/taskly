import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";

export default function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    Alert.alert("Login", `Bem-vindo, ${email}!`);
  };
  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Image
        source={require("./src/assets/taskly_logo.png")}
        className="w-28 h-28 mb-4"
        resizeMode="contain"
        accessibilityLabel="Logo Taskly"
      />
      <Text className="text-2xl font-bold mb-8" style={{ color: "#233A6A" }}>
        Taskly
      </Text>
      <TextInput
        className="w-full h-12 px-4 mb-4 border rounded-lg text-base"
        style={{
          borderColor: "#233A6A",
          backgroundColor: "#F3F6FF",
          color: "#233A6A",
        }}
        placeholder="Email"
        placeholderTextColor="#233A6A"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="w-full h-12 px-4 mb-6 border rounded-lg text-base"
        style={{
          borderColor: "#233A6A",
          backgroundColor: "#F3F6FF",
          color: "#233A6A",
        }}
        placeholder="Senha"
        placeholderTextColor="#233A6A"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        className="w-full h-12 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: "#4F5DFF" }}
        onPress={handleLogin}
      >
        <Text className="text-white text-base font-semibold">Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}
