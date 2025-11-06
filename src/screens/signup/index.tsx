import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@contexts/authContext";
import { useState } from "react";
import { PasswordInput } from "@components/inputs/password";
import { EmailInput } from "@components/inputs/email";
import { Button } from "@components/buttons/button";
import { LogoTaskly } from "@components/logo";
import {
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { register } = useAuth();

  const handleSignup = async () => {
    setLoading(true);
    if (!email || !password || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      console.log("Signing up with:", email, password);
      await register(email, password).then(() => {
        navigation.navigate("Home");
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível realizar o cadastro.");
    } finally {
      setLoading(false);
    }
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
        <View className="bg-blue-50 flex-1 justify-center items-center px-4 min-h-full dark:bg-gray-900">
          <LogoTaskly width={200} height={200} alt="Taskly Logo" />
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
          <Button
            loading={loading}
            onPress={handleSignup}
            title="Cadastrar-se"
            style="w-full h-12 rounded-lg flex items-center justify-center"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export { Signup };
