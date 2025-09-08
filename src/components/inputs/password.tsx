import type React from "react";
import { TextInput, Keyboard } from "react-native";
interface PasswordInputProps {
  password: string;
  setPassword: (password: string) => void;
  isKeyboardVisible?: boolean;
  setIsKeyboardVisible?: (isKeyboardVisible: boolean) => boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  isKeyboardVisible,
  setIsKeyboardVisible,
  password,
  setPassword,
}) => {
  return (
    <TextInput
      className="w-full h-12 px-4 mb-4 border rounded-lg text-base bg-[#F3F6FF] color-[#233A6A] border-[#233A6A]"
      placeholder="Senha"
      placeholderTextColor="#233A6A"
      value={password}
      onChangeText={setPassword}
      onSubmitEditing={Keyboard.dismiss}
      secureTextEntry
    />
  );
};
export { PasswordInput };
