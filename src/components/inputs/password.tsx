import { TextInput } from "react-native";
export default function PasswordInput({
  password,
  setPassword,
}: {
  password: string;
  setPassword: (password: string) => void;
}) {
  return (
    <TextInput
      className="w-full h-12 px-4 mb-4 border rounded-lg text-base bg-[#F3F6FF] color-[#233A6A] border-[#233A6A]"
      placeholder="Senha"
      placeholderTextColor="#233A6A"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
    />
  );
}
