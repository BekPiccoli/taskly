import { useState } from "react";
import { PasswordInput } from "@components/inputs/password";
import { EmailInput } from "@components/inputs/email";
import Button from "@components/buttons/button";
import { LogoTaskly } from "@components/logo";
import {
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

const Singin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const handleSingin = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }
    Alert.alert("Login", `Bem-vindo, ${email}!`);
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1"
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white flex-1 justify-center items-center px-4 min-h-full dark:bg-gray-900">
          <LogoTaskly width={52} height={52} alt="Taskly Logo" />
          <Text className="text-[#233A6A] text-2xl font-bold mb-8 dark:color-white">
            Taskly
          </Text>
          <EmailInput email={email} setEmail={setEmail} />
          <PasswordInput
            password={password}
            setPassword={setPassword}
            placeholder="Senha"
            isPasswordVisible={isPasswordVisible}
            setIsPasswordVisible={setIsPasswordVisible}
          />
          <PasswordInput
            password={confirmPassword}
            setPassword={setConfirmPassword}
            placeholder="Confirmar senha"
            isPasswordVisible={isPasswordVisible}
            setIsPasswordVisible={setIsPasswordVisible}
          />
          <Button onPress={handleSingin} title="Cadastrar-se" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export { Singin };
