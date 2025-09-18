import React, { useState } from "react"; // Corrigido: era "Reac"
import { View, Text, Modal, TextInput, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
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
  const { handleSubmit, control } = useForm();

  const handlecolorSelect = (color: string) => {
    setIsColorSelected(true);
    setcolorSelected(color);
    console.log("Cor selecionada:", color);
  };

  const handleSaveSubject = (data: any) => {
    console.log(data);
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
          />
        </View>

        <View className="w-full h-full flex flex-col items-center gap-8 mt-10">
          <View className="w-full flex flex-col items-center justify-start ">
            <View className="w-full flex flex-col ml-36 justify-center p-2">
              <Text className="italic">Subject Name *</Text>
            </View>
            <Controller
              control={control}
              name="subjectName"
              rules={{ required: "Subject name is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="h-12 w-3/4 bg-white rounded-lg p-4 border"
                  value={value}
                  placeholder="Enter subject name"
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          <View className="w-full flex flex-col items-center justify-start">
            <View className="w-full flex flex-col ml-36 justify-center p-2">
              <Text className="italic">Teacher Name *</Text>
            </View>
            <Controller
              control={control}
              name="teacherName"
              rules={{ required: "Teacher name is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="h-12 w-3/4 bg-white rounded-lg p-4 border"
                  value={value}
                  placeholder="Enter teacher name"
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          <View className="w-full flex flex-col items-center justify-start ">
            <View className="w-full flex flex-col ml-36 justify-center p-2">
              <Text className="italic">Room Number *</Text>
            </View>
            <Controller
              control={control}
              name="roomNumber"
              rules={{ required: "Room number is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="h-12 w-3/4 bg-white rounded-lg p-4 border"
                  value={value}
                  placeholder="Enter room number"
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          <View className="w-full flex flex-col items-center justify-start">
            <View className="w-full flex flex-col ml-36 justify-center p-2">
              <Text className="italic">Class Time *</Text>
            </View>
            <Controller
              control={control}
              name="classTime"
              rules={{ required: "Class time is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="h-12 w-3/4 bg-white rounded-lg p-4 border"
                  value={value}
                  placeholder="Enter class time"
                  onChangeText={onChange}
                />
              )}
            />
          </View>
          <View className="w-full flex flex-col ml-36 justify-start">
            <View className="w-full flex flex-row items-center gap-2 p-2">
              <Ionicons name="color-palette-outline" size={24} color="black" />
              <Text className="italic ">Subject Color *</Text>
            </View>

            <View className="w-4/6 flex flex-row flex-wrap gap-2">
              <TouchableOpacity
                onPress={() => handlecolorSelect("#3B82F6")}
                className="w-12 h-12 rounded-lg border border-gray-300 bg-[#3B82F6]"
              />

              <TouchableOpacity
                onPress={() => handlecolorSelect("#9333EA")}
                className="w-12 h-12 rounded-lg border border-gray-300 bg-[#9333EA]"
              />

              <TouchableOpacity
                onPress={() => handlecolorSelect("#10B981")}
                className="w-12 h-12 rounded-lg border border-gray-300 bg-[#10B981]"
              />

              <TouchableOpacity
                onPress={() => handlecolorSelect("#F59E0B")}
                className="w-12 h-12 rounded-lg border border-gray-300 bg-[#F59E0B]"
              />

              <TouchableOpacity
                onPress={() => handlecolorSelect("#EF4444")}
                className="w-12 h-12 rounded-lg border border-gray-300 bg-[#EF4444]"
              />

              <TouchableOpacity
                onPress={() => handlecolorSelect("#06B6D4")}
                className="w-12 h-12 rounded-lg border border-gray-300 bg-[#06B6D4]"
              />

              <TouchableOpacity
                onPress={() => handlecolorSelect("#F97316")}
                className="w-12 h-12 rounded-lg border border-gray-300 bg-[#F97316]"
              />

              <TouchableOpacity
                onPress={() => handlecolorSelect("#EC4899")}
                className="w-12 h-12 rounded-lg border border-gray-300 bg-[#EC4899]"
              />

              <TouchableOpacity
                onPress={() => handlecolorSelect("#84CC16")}
                className="w-12 h-12 rounded-lg border border-gray-300 bg-[#84CC16]"
              />

              <TouchableOpacity
                onPress={() => handlecolorSelect("#D946EF")}
                className="w-12 h-12 rounded-lg border border-gray-300 bg-[#D946EF]"
              />

              {isColorSelected && (
                <View className="flex flex-row items-center gap-2 mt-4">
                  <Text>Cor selecionada:</Text>
                  <View
                    style={{ backgroundColor: colorSelected }}
                    className="w-8 h-8 rounded-lg border-2 border-black"
                  />
                </View>
              )}

              <View className="w-full flex flex-row items-center justify-start gap-8 mt-8">
                <Button
                  onPress={() => setModalIsOpen(false)}
                  style="bg-red-500 p-2 rounded-lg"
                  title="Cancelar"
                />
                <Button
                  onPress={handleSubmit(handleSaveSubject)}
                  style="bg-blue-500 pt-2 pb-2 px-4 rounded-lg"
                  title="Salvar"
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export { SubjectModal };
