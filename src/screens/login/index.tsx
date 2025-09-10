import { useState } from "react";
import { Text, View, Alert, useColorScheme } from "react-native";
import { PasswordInput } from "@components/inputs/password";
import { useNavigation } from "@react-navigation/native";
import { EmailInput } from "@components/inputs/email";
import { Home } from "@screens/home";
import Button from "@components/buttons/button";
import LogoTaskly from "@components/logo";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    Alert.alert("Login", `Bem-vindo, ${email}!`);
    navigation.navigate("Home" as never);
  };

  const theme = useColorScheme();

  console.log(theme);

  return (
    <View
      className={`${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      } flex-1 justify-center items-center px-6`}
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
      />
      <Button
        onPress={handleLogin}
        // onPress={() => {
        //   navigation.navigate("/home" as never);
        // }}
        title="Entrar"
      />

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
          >
            Cadastre-se!
          </Text>
        </Text>
      </View>
    </View>
  );
};
export { Login };
