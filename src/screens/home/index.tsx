import { Text, View } from "react-native";
import { Header } from "@src/components/header";
const Home: React.FC = () => {
  return (
    <View className="flex-1 items-center">
      <View>
        <Header />
      </View>
      <Text>Home</Text>
    </View>
  );
};

export { Home };
