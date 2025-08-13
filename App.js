import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(null);
  const handlePress = () => {
    setCount(count + 1);
  };

  const handleClearCounter = () => {
    setCount(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.txt}>Contagem: {count}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.press} onPress={handlePress}>
          <Text>Press</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clear} onPress={handleClearCounter}>
          <Text>Clear</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  txt: {
    color: "green",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    width: 100,
    justifyContent: "space-between",
    margin: 10,
  },
  press: {
    padding: 5,
    borderRadius: 5,
    margin: 5,
    backgroundColor: "#ffc2b8",
  },
  clear: {
    padding: 5,
    borderRadius: 5,
    margin: 5,
    backgroundColor: "#ffc2b8",
  },
});
