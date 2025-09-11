import { Image } from "react-native";
export default function LogoTaskly() {
  return (
    <Image
      source={require("../assets/taskly_logo.png")}
      className="w-52 h-52"
      resizeMode="contain"
      accessibilityLabel="Logo Taskly"
    />
  );
}
