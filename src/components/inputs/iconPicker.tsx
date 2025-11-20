import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
}

export const availableIcons = [
  { name: "book", library: "MaterialIcons" },
  { name: "science", library: "MaterialIcons" },
  { name: "calculate", library: "MaterialIcons" },
  { name: "biotech", library: "MaterialIcons" },
  { name: "psychology", library: "MaterialIcons" },
  { name: "language", library: "MaterialIcons" },
  { name: "brush", library: "MaterialIcons" },
  { name: "music-note", library: "MaterialIcons" },
  { name: "sports-soccer", library: "MaterialIcons" },
  { name: "computer", library: "MaterialIcons" },
  { name: "gavel", library: "MaterialIcons" },
  { name: "business", library: "MaterialIcons" },
  { name: "history-edu", library: "MaterialIcons" },
  { name: "engineering", library: "MaterialIcons" },
  { name: "theater-comedy", library: "MaterialIcons" },
  { name: "chemistry", library: "MaterialCommunityIcons" },
  { name: "flask", library: "MaterialCommunityIcons" },
  { name: "atom", library: "MaterialCommunityIcons" },
  { name: "dna", library: "MaterialCommunityIcons" },
  { name: "brain", library: "MaterialCommunityIcons" },
  { name: "math-compass", library: "MaterialCommunityIcons" },
  { name: "calculator-variant", library: "MaterialCommunityIcons" },
  { name: "laptop", library: "MaterialCommunityIcons" },
  { name: "code-tags", library: "MaterialCommunityIcons" },
  { name: "earth", library: "MaterialCommunityIcons" },
  { name: "basketball", library: "MaterialCommunityIcons" },
  { name: "palette", library: "MaterialCommunityIcons" },
  { name: "guitar-acoustic", library: "MaterialCommunityIcons" },
  { name: "file-document-outline", library: "MaterialCommunityIcons" },
  { name: "scale-balance", library: "MaterialCommunityIcons" },
  { name: "book-open-variant", library: "FontAwesome5" },
  { name: "graduation-cap", library: "FontAwesome5" },
  { name: "flask", library: "FontAwesome5" },
  { name: "microscope", library: "FontAwesome5" },
  { name: "chalkboard-teacher", library: "FontAwesome5" },
  { name: "globe-americas", library: "FontAwesome5" },
  { name: "star", library: "Ionicons" },
  { name: "rocket", library: "Ionicons" },
  { name: "bulb", library: "Ionicons" },
  { name: "telescope", library: "Ionicons" },
];

const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  onSelectIcon,
}) => {
  const renderIcon = (iconData: typeof availableIcons[0] | undefined, size = 28) => {
    if (!iconData) {
      return <MaterialIcons name="book" size={size} color="#000" />;
    }
    
    const { name, library } = iconData;
    const isSelected = selectedIcon === name;
    const color = isSelected ? "#fff" : "#000";

    switch (library) {
      case "MaterialIcons":
        return <MaterialIcons name={name as any} size={size} color={color} />;
      case "MaterialCommunityIcons":
        return (
          <MaterialCommunityIcons name={name as any} size={size} color={color} />
        );
      case "FontAwesome5":
        return <FontAwesome5 name={name as any} size={size} color={color} />;
      case "Ionicons":
        return <Ionicons name={name as any} size={size} color={color} />;
      default:
        return <MaterialIcons name="book" size={size} color={color} />;
    }
  };

  return (
    <View className="w-full px-8 mt-4">
      <View className="w-full flex flex-row items-center gap-2 p-2 ml-8">
        <MaterialIcons name="apps" size={24} color="#000" />
        <Text className="italic dark:text-white">Ícone *</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="w-full"
        contentContainerStyle={{ paddingHorizontal: 8 }}
      >
        <View className="flex flex-row flex-wrap gap-3 py-4">
          {availableIcons.map((iconData, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onSelectIcon(iconData.name)}
              className={`w-14 h-14 rounded-xl border-2 items-center justify-center ${
                selectedIcon === iconData.name
                  ? "bg-blue-500 border-blue-600"
                  : "bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600"
              }`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              {renderIcon(iconData, 26)}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {selectedIcon && (
        <View className="flex flex-row items-center gap-2 mt-2 ml-8">
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            Ícone selecionado:
          </Text>
          <View className="w-10 h-10 rounded-lg bg-blue-500 items-center justify-center">
            {renderIcon(
              availableIcons.find((i) => i.name === selectedIcon),
              24
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export { IconPicker };
