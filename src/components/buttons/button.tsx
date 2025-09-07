import { Text, TouchableOpacity } from "react-native";

export default function Button({
  onPress,
  title,
}: {
  onPress: () => void;
  title: string;
}) {
  return (
    <TouchableOpacity
      className="w-full h-12 rounded-lg flex items-center justify-center bg-[#4F5DFF]"
      onPress={onPress}
    >
      <Text className="text-white text-base font-semibold">{title}</Text>
    </TouchableOpacity>
  );
}
