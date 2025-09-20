import type React from "react";
import { TextInput, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
interface PasswordInputProps {
  placeholder?: string;

  password: string;
  setPassword: (password: string) => void;

  isPasswordVisible: boolean;
  setIsPasswordVisible: (isPasswordVisible: boolean) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  isPasswordVisible,
  setIsPasswordVisible,

  password,
  setPassword,

  placeholder,
}) => {
  const handlePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  return (
    <>
      <View className="relative w-full">
        <TextInput
          className="w-full h-12 px-4 mb-4 border rounded-lg text-base bg-[#F3F6FF] color-[#233A6A] border-[#233A6A]"
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
        />
        <View className="absolute right-3 top-3">
          <FontAwesome
            name={isPasswordVisible ? "eye" : "eye-slash"}
            size={24}
            color="black"
            onPress={handlePasswordVisibility}
          />
        </View>
      </View>
    </>
  );
};
export { PasswordInput };
