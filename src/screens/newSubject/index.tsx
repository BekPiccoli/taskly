import Reac, { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity } from "react-native";
import { Button } from "@components/buttons/button";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";

interface subjectModalProps {
  modalIsOpen: Boolean;
  setModalIsOpen: (value: Boolean) => void;
}

const SubjectModal: React.FC<subjectModalProps> = ({
  modalIsOpen,
  setModalIsOpen,
}: {
  modalIsOpen: Boolean;
  setModalIsOpen: (value: Boolean) => void;
}) => {
  const [isColorSelected, setIsColorSelected] = useState<Boolean>(false);
  const [colorSelected, setcolorSelected] = useState<string>("");
  const handlecolorSelect = (color: string) => {
    // Lógica para selecionar a cor
    setIsColorSelected(true);
    setcolorSelected(color);
    console.log("Cor selecionada:", color);
  };
  return (
    <Modal animationType="slide" transparent={false}>
      <View className="flex-1  flex-col items-center bg-blue-50">
        <View className="w-full h-32 flex flex-row justify-between items-center p-6  border-b-2 border-gray-300">
          <View className="h-10  rounded-lg items-center justify-center p-2 mt-16">
            <Text className=" text-lg font-semibold">Subjects</Text>
          </View>

          <Button
            onPress={() => setModalIsOpen(false)}
            style="h-10 w-10 rounded-lg items-center justify-center mt-16"
            icon={
              <Fontisto
                name="close-a"
                size={14}
                color="white"
                onPress={() => setModalIsOpen(false)}
              />
            }
          ></Button>
        </View>

        <View className="w-full h-full flex flex-col items-center gap-8 mt-10">
          <View className="w-full flex flex-col items-center justify-start ">
            <View className="w-full flex flex-col ml-36 justify-center p-2">
              <Text className="italic">Subject Name *</Text>
            </View>
            <TextInput className="h-12 w-3/4 bg-white rounded-lg p-4 border" />
          </View>

          <View className="w-full flex flex-col items-center justify-start">
            <View className="w-full flex flex-col ml-36 justify-center p-2">
              <Text className="italic">Teacher Name *</Text>
            </View>
            <TextInput className="h-12 w-3/4 bg-white rounded-lg p-4 border" />
          </View>

          <View className="w-full flex flex-col items-center justify-start ">
            <View className="w-full flex flex-col ml-36 justify-center p-2">
              <Text className="italic">Room Number *</Text>
            </View>
            <TextInput className="h-12 w-3/4 bg-white rounded-lg p-4 border" />
          </View>

          <View className="w-full flex flex-col items-center justify-start">
            <View className="w-full flex flex-col ml-36 justify-center p-2">
              <Text className="italic">Class Time *</Text>
            </View>
            <TextInput className="h-12 w-3/4 bg-white rounded-lg p-4 border" />
          </View>
          <View className="w-full flex flex-col ml-36 justify-start">
            <View className="w-full flex flex-row items-center gap-2 p-2">
              <Ionicons name="color-palette-outline" size={24} color="black" />
              <Text className="italic ">Subject Color *</Text>
            </View>
            <View className="w-3/5 flex flex-row flex-wrap gap-2">
              <TouchableOpacity
                onPress={() => setIsColorSelected(true)}
                className="w-12 h-12 rounded-lg border border-gray-300 bg-[#3B82F6]"
              ></TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsColorSelected(true)}
                className="w-12 h-12 rounded-lg border border-gray-300 bg-[#9333EA]"
              ></TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsColorSelected(true)}
                className="w-12 h-12 rounded-lg border border-gray-300 bg-[#10B981]"
              ></TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsColorSelected(true)}
                className="w-12 h-12 rounded-lg border border-gray-300 bg-[#F59E0B]"
              ></TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsColorSelected(true)}
                className="w-12 h-12 rounded-lg border border-gray-300 bg-[#EF4444]"
              ></TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsColorSelected(true)}
                className="w-12 h-12 rounded-lg border border-gray-300 bg-[#06B6D4]"
              ></TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsColorSelected(true)}
                className="w-12 h-12 rounded-lg border border-gray-300 bg-[#F97316]"
              ></TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsColorSelected(true)}
                className="w-12 h-12 rounded-lg border border-gray-300 bg-[#EC4899]"
              ></TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsColorSelected(true)}
                className="w-12 h-12 rounded-lg border border-gray-300 bg-[#84CC16]"
              ></TouchableOpacity>
              <TouchableOpacity
                onPress={() => handlecolorSelect("#D946EF")}
                className="w-12 h-12 rounded-lg border border-gray-300 bg-[#D946EF]"
              ></TouchableOpacity>
              {isColorSelected && (
                <View
                  className={`w-12 h-12 rounded-lg border border-gray-300 bg-[${colorSelected}]`}
                ></View>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
export { SubjectModal };
