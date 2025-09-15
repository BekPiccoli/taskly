// @ts-ignore
import "./global.css";
import { Login } from "@screens/login";
import { Singin } from "@screens/singin";
import { Home } from "@screens/home";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
const App: React.FC = () => {
  const isAutenticated = false;
  function RootStack() {
    return (
      <Stack.Navigator
        initialRouteName={isAutenticated ? "Home" : "Login"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Singin" component={Singin} />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};

export default App;
