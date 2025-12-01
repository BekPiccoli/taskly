import { Button } from "@components/buttons/button";
import { EmailInput } from "@components/inputs/email";
import { PasswordInput } from "@components/inputs/password";
import { LogoTaskly } from "@components/logo";
import { useNavigation } from "@react-navigation/native";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { register } from "@src/functions/index";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

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
            style="w-full h-14 rounded-full flex items-center justify-center"
          />

          <View className="flex gap-4 mt-8 w-full items-center">
            <TouchableOpacity
              onPress={() => navigation.navigate("Login" as never)}
              className="w-full h-14 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm"
              activeOpacity={0.8}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Text className="text-[#233A6A] dark:text-blue-300 font-bold text-base">
                Já tenho uma conta
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export { Signup };
