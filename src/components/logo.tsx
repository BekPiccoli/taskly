import { Image } from "react-native";
export default function LogoTaskly() {
  return (
    <Image
      source={require("../assets/taskly_logo.png")}
      className="w-28 h-28 mb-4"
      resizeMode="contain"
      accessibilityLabel="Logo Taskly"
    />
  );
}
