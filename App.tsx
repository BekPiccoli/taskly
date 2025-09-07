// @ts-ignore
import "./global.css";
import { useState } from "react";
import { Text, View, Alert } from "react-native";
import EmailInput from "@components/inputs/email";
import PasswordInput from "@components/inputs/password";
import Button from "@components/buttons/button";
import LogoTaskly from "@components/logo";
export default function App() {
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
      <LogoTaskly />
      <Text className="text-2xl font-bold mb-8" style={{ color: "#233A6A" }}>
        camila te amo S2
      </Text>
      <EmailInput email={email} setEmail={setEmail} />
      <PasswordInput password={password} setPassword={setPassword} />
      <Button onPress={handleLogin} title="Entrar" />
    </View>
  );
}
