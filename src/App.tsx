// @ts-ignore
import "./global.css";
import { Login } from "@screens/login";
import { Signup } from "@src/screens/signup";
import { Home } from "@screens/home";
import { AuthProvider, useAuth } from "@contexts/authContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";

const Stack = createNativeStackNavigator();
const App: React.FC = () => {
  function RootStack() {
    useEffect(() => {
      useAuth().getIsAuthenticated();
    }, []);

    const { isAuthenticated } = useAuth();
    return (
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Home" : "Login"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
