import { useState } from "react";
import { PasswordInput } from "@components/inputs/password";
import { useNavigation } from "@react-navigation/native";
import { EmailInput } from "@components/inputs/email";
import Button from "@components/buttons/button";
import LogoTaskly from "@components/logo";
import {
  Text,
  View,
  Alert,
  useColorScheme,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

const Login: React.FC = () => {
  const theme = useColorScheme();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const navigation = useNavigation();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    Alert.alert("Login", `Bem-vindo, ${email}!`);
    navigation.navigate("Home" as never);
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
        <View
          className={`${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } flex-1  justify-center items-center px-4 pb-20`}
        >
          <LogoTaskly />
          <Text
            className={`${
              theme === "dark" ? "color-white" : " color-[#233A6A]"
            } text-2xl font-bold mb-8`}
          >
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
          <Button onPress={handleLogin} title="Entrar" />

          <View className="flex direction-row gap-4 mt-4 w-10/12 items-center">
            <Text
              className={`${theme === "dark" ? "text-white" : "text-[#233A6A]"}`}
            >
              Esqueceu sua senha?
            </Text>
            <Text
              className={`${theme === "dark" ? "text-white" : "text-[#233A6A]"}  `}
            >
              Não possuí conta ainda?{" "}
              <Text
                className={`${
                  theme === "dark" ? "text-white" : "text-[#233A6A]"
                } underline`}
                onPress={() => navigation.navigate("Singin" as never)}
              >
                Cadastre-se!
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export { Login };
