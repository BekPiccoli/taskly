import React, { useState } from "react"; // Corrigido: era "Reac"
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  useColorScheme,
} from "react-native";
import { useForm } from "react-hook-form";
import { Button } from "@components/buttons/button";
import {
  SubjectInput,
  SubjectColorPicker,
  colors,
} from "@components/inputs/subjects";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";

interface subjectModalProps {
  modalIsOpen: Boolean;
  setModalIsOpen: (value: Boolean) => void;
  onSaveSubject: (data: object) => void;
}

const SubjectModal: React.FC<subjectModalProps> = ({
  modalIsOpen,
  setModalIsOpen,
  onSaveSubject,
}: {
  modalIsOpen: Boolean;
  setModalIsOpen: (value: Boolean) => void;
  onSaveSubject: (data: object) => void;
}) => {
  const [isColorSelected, setIsColorSelected] = useState<Boolean>(false);
  const [colorSelected, setcolorSelected] = useState<string>("");
  const { handleSubmit, control } = useForm();
  const isDarkMode = useColorScheme() === "dark";
  const inputData = [
    {
      title: "Subject Name",
      required: "Subject name is required",
      name: "subjectName",
      placeholder: "Enter subject name",
    },
    {
      title: "Teacher Name",
      required: "Teacher name is required",
      name: "teacherName",
      placeholder: "Enter teacher name",
    },
    {
      title: "Room Number",
      required: "Room number is required",
      name: "roomNumber",
      placeholder: "Enter room number",
    },
    {
      title: "Class Time",
      required: "Class time is required",
      name: "classTime",
      placeholder: "Enter class time",
    },
  ];

  const handlecolorSelect = (color: string) => {
    setIsColorSelected(true);
    setcolorSelected(color);
  };

  const handleSaveSubject = (data: any) => {
    const subjectData = { ...data, color: colorSelected };
    onSaveSubject(subjectData);
    setModalIsOpen(false);
  };

  return (
    <Modal animationType="slide" transparent={false}>
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1  flex-col items-center bg-blue-50 dark:bg-gray-900">
            <View className="w-full h-32 flex flex-row justify-between items-center p-6  border-b-[1px] border-gray-200 dark:border-gray-700">
              <View className="h-10  rounded-lg items-center justify-center p-2 mt-16">
                <Text className=" text-lg font-semibold dark:text-white">
                  Subjects
                </Text>
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
              {inputData.map(
                ({ title, required, name, placeholder }, index) => {
                  return (
                    <SubjectInput
                      key={index}
                      title={title}
                      control={control}
                      required={required}
                      name={name}
                      placeholder={placeholder}
                    />
                  );
                }
              )}

              <View className="w-full flex flex-col ml-36 justify-start">
                <View className="w-full flex flex-row items-center gap-2 p-2">
                  <Ionicons
                    name="color-palette-outline"
                    size={24}
                    color={isDarkMode ? "white" : "black"}
                  />
                  <Text className="italic dark:text-white ">
                    Subject Color *
                  </Text>
                </View>

                <View className="w-4/6 flex flex-row flex-wrap gap-2">
                  {colors.map((color: string, index: number) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handlecolorSelect(color)}
                      className={`w-12 h-12 rounded-lg border border-gray-300  dark:shadow-lg dark:shadow-slate-700`}
                      style={{ backgroundColor: color }}
                    />
                  ))}

                  {isColorSelected && (
                    <SubjectColorPicker colorSelected={colorSelected} />
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
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export { SubjectModal };
