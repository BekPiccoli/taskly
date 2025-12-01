import { useState } from "react";
import { EmailInput } from "@components/inputs/email";
import { useNavigation } from "@react-navigation/native";
import { Button } from "@components/buttons/button";
import { LogoTaskly } from "@components/logo";
import {
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();

  const handleForgotPassword = async () => {
    setLoading(true);

    if (!email) {
      Alert.alert("Erro", "Por favor, insira seu email.");
      setLoading(false);
      return;
    }

    try {
      // Aqui você deve implementar a função de recuperação de senha
      // Exemplo: await sendPasswordResetEmail(email);

      Alert.alert(
        "Email enviado!",
        "Verifique sua caixa de entrada para redefinir sua senha.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login" as never),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível enviar o email. Verifique o endereço informado."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-blue-50 dark:bg-gray-900"
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          minHeight: "100%",
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="flex-1 justify-center items-center px-4 py-8">
          <LogoTaskly width={200} height={200} alt="Taskly Logo" />
          <Text className="text-[#233A6A] text-2xl font-bold mb-4 dark:color-white">
            Recuperar senha
          </Text>
          <Text className="text-[#233A6A] text-sm text-center mb-8 px-4 dark:text-gray-300">
            Digite seu email e enviaremos instruções para redefinir sua senha
          </Text>

          <EmailInput email={email} setEmail={setEmail} />

          <Button
            onPress={handleForgotPassword}
            title="Enviar email"
            loading={loading}
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
                Voltar para login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export { ForgotPassword };
