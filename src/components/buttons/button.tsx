import { Text, TouchableOpacity, View } from "react-native";
interface ButtonProps {
  onPress: () => void;
  title: string;
  style?: string;
  icon?: React.ReactNode;
}
const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  style,
  icon,
}: {
  onPress: () => void;
  title: string;
  style?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <TouchableOpacity className={` ${style} bg-[#4F5DFF]`} onPress={onPress}>
      {icon && <View>{icon}</View>}
      <Text className="text-white text-base font-semibold">{title}</Text>
    </TouchableOpacity>
  );
};
export { Button };
