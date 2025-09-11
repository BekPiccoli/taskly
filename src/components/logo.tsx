import { Image } from "react-native";

interface LogoTasklyProps {
  width: number;
  height: number;
  alt: string;
}

const LogoTaskly: React.FC<LogoTasklyProps> = ({ width, height, alt }) => {
  return (
    <Image
      source={require("../assets/taskly_logo.png")}
      style={{ width, height }}
      resizeMode="contain"
      accessibilityLabel={alt}
    />
  );
};
export { LogoTaskly };
