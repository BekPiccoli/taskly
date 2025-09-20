import { TextInput } from "react-native";
interface EmailInputProps {
  email: string;
  setEmail: (email: string) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({
  email,
  setEmail,
}: {
  email: string;
  setEmail: (email: string) => void;
}) => {
  return (
    <TextInput
      className="w-full h-12 px-4 mb-4 border rounded-lg text-base bg-[#F3F6FF] color-[#233A6A] border-[#233A6A]"
      placeholder="Email"
      placeholderTextColor="#6B7280"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
    />
  );
};
export { EmailInput };
