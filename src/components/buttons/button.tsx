import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
interface ButtonProps {
  onPress: () => void;
  title?: string;
  style?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}
const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  style,
  icon,
  loading,
}: {
  onPress: () => void;
  title?: string;
  style?: string;
  loading?: boolean;
  icon?: React.ReactNode;
}) => {
  return (
    <TouchableOpacity
      className={` ${style} bg-[#4F5DFF]  shadow-lg shadow-slate-400 dark:shadow-lg dark:shadow-slate-700`}
      onPress={onPress}
      disabled={loading}
    >
      {icon && <View>{icon}</View>}
      {title && !loading && (
        <Text className="text-white text-base font-semibold">{title}</Text>
      )}
      {loading && <ActivityIndicator color="white" />}
    </TouchableOpacity>
  );
};
export { Button };
