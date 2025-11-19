import React, { useState } from "react"; // Corrigido: era "Reac"
import { useForm } from "react-hook-form";
import { Button } from "@components/buttons/button";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import { type Subject } from "@functions/types";
import { Picker } from "@react-native-picker/picker";
import {
  SubjectInput,
  SubjectColorPicker,
  colors,
} from "@components/inputs/subjects";

import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  useColorScheme,
  Platform,
} from "react-native";
interface subjectModalProps {
  currentData?: Subject;
  modalIsOpen: Boolean;
  setModalIsOpen: (value: Boolean) => void;
  onSaveSubject: (data: Subject) => void;
}

const SubjectModal: React.FC<subjectModalProps> = ({
  currentData,
  modalIsOpen,
  setModalIsOpen,
  onSaveSubject,
}: {
  currentData?: Subject;
  modalIsOpen: Boolean;
  setModalIsOpen: (value: Boolean) => void;
  onSaveSubject: (data: Subject) => void;
}) => {
  const [isColorSelected, setIsColorSelected] = useState<Boolean>(false);
  const [colorSelected, setcolorSelected] = useState<string>("");
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<string>("");
  const [pickerModalVisible, setPickerModalVisible] = useState(false);

  const { handleSubmit, control } = useForm();
  const isDarkMode = useColorScheme() === "dark";
  const daysOptions = [
    { label: "Segunda-Feira", value: "monday" },
    { label: "Terça-Feira", value: "tuesday" },
    { label: "Quarta-Feira", value: "wednesday" },
    { label: "Quinta-Feira", value: "thursday" },
    { label: "Sexta-Feira", value: "friday" },
    { label: "Sábado", value: "saturday" },
    { label: "Domingo", value: "sunday" },
  ];
  const inputData = [
    {
      title: "Matéria",
      required: "Matéria é obrigatória",
      name: "subjectName",
      placeholder: "Digite o nome da matéria",
      value: currentData ? currentData.subjectName : null,
      numericType: false,
    },
    {
      title: "Nome do Professor",
      required: "Nome do professor é obrigatório",
      name: "teacherName",
      placeholder: "Digite o nome do professor",
      value: currentData ? currentData.teacherName : null,
      numericType: false,
    },
    {
      title: "Período da Faculdade",
      required: "Período da faculdade é obrigatório",
      name: "collegePeriod",
      placeholder: "Digite o período da faculdade",
      value: currentData ? currentData.collegePeriod : null,
      numericType: true,
    },
    {
      title: "Aulas Totais",
      required: "Número de aulas totais é obrigatório",
      name: "classTime",
      placeholder: "Digite o número de aulas total da matéria",
      value: currentData ? currentData.classTime : null,
      numericType: true,
    },
    {
      title: "Horário de encerramento da Aula",
      required: "Horário da aula é obrigatório",
      name: "classEndTime",
      placeholder: "Digite o horário da aula",
      value: currentData ? currentData.classTime : null,
      numericType: true,
    },
  ];

  const selectedLabel =
    daysOptions.find((d) => d.value === selectedDaysOfWeek)?.label ||
    "Selecione um dia";

  const handlecolorSelect = (color: string) => {
    setIsColorSelected(true);
    setcolorSelected(color);
  };

  const handleSaveSubject = (data: any) => {
    const subjectData = {
      ...data,
      daysOfWeek: selectedDaysOfWeek,
      color: colorSelected,
      ...(currentData?.id ? { id: currentData.id } : {}),
    };
    console.log(subjectData);
    // onSaveSubject(subjectData);
    setModalIsOpen(false);
  };

  return (
    <Modal animationType="slide" transparent={false}>
      {/*  -- PRECISO ARRUMAR ESSE KEYBOARDAVOIDINGVIEW.
         A TELA FCA BRANCA AO ABRIR O TECLADO COM ELE INSERIDO  --
         */}
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={0}
      > */}
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
                {currentData ? "Editar Matéria" : "Adicionar Nova Matéria"}
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
              (
                { title, required, name, placeholder, value, numericType },
                index
              ) => {
                return (
                  <SubjectInput
                    key={index}
                    title={title}
                    control={control}
                    required={required}
                    name={name}
                    placeholder={placeholder}
                    value={value != null ? String(value) : ""}
                    numericType={numericType}
                  />
                );
              }
            )}
            <View className="w-full flex flex-col items-center px-8 mt-4">
              <View className="w-full flex flex-col ml-8 justify-start p-2">
                <Text className="italic dark:text-white">Dias da Semana *</Text>
              </View>

              {Platform.OS === "ios" ? (
                <>
                  <TouchableOpacity
                    onPress={() => setPickerModalVisible(true)}
                    className="w-[325px] h-14 bg-white rounded-lg border border-[#233A6A] justify-center px-4"
                  >
                    <Text
                      style={{ color: selectedDaysOfWeek ? "#000" : "#6B7280" }}
                    >
                      {selectedLabel}
                    </Text>
                  </TouchableOpacity>

                  <Modal
                    visible={pickerModalVisible}
                    transparent={true}
                    animationType="slide"
                  >
                    <View className="flex-1 justify-end bg-black/50">
                      <View className="bg-white dark:bg-gray-800 rounded-t-xl">
                        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                          <TouchableOpacity
                            onPress={() => setPickerModalVisible(false)}
                          >
                            <Text className="text-blue-500 text-lg">
                              Cancelar
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => setPickerModalVisible(false)}
                          >
                            <Text className="text-blue-500 text-lg font-semibold">
                              Confirmar
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <Picker
                          selectedValue={selectedDaysOfWeek}
                          onValueChange={(itemValue) =>
                            setSelectedDaysOfWeek(itemValue)
                          }
                          style={{ height: 250 }}
                        >
                          {daysOptions.map((day) => (
                            <Picker.Item
                              key={day.value}
                              label={day.label}
                              value={day.value}
                            />
                          ))}
                        </Picker>
                      </View>
                    </View>
                  </Modal>
                </>
              ) : (
                <View className="w-3/4 h-14 bg-white rounded-lg border border-[#233A6A] overflow-hidden">
                  <Picker
                    selectedValue={selectedDaysOfWeek}
                    onValueChange={(itemValue) =>
                      setSelectedDaysOfWeek(itemValue)
                    }
                    style={{ width: "100%", height: "100%", color: "#000" }}
                    dropdownIconColor="#000"
                  >
                    <Picker.Item label="Selecione um dia" value="" />
                    {daysOptions.map((day) => (
                      <Picker.Item
                        key={day.value}
                        label={day.label}
                        value={day.value}
                      />
                    ))}
                  </Picker>
                </View>
              )}
            </View>

            <View className="w-full flex flex-col ml-36 justify-start">
              <View className="w-full flex flex-row items-center gap-2 p-2">
                <Ionicons
                  name="color-palette-outline"
                  size={24}
                  color={isDarkMode ? "white" : "black"}
                />
                <Text className="italic dark:text-white ">Color *</Text>
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
      {/* </KeyboardAvoidingView> */}
    </Modal>
  );
};

export { SubjectModal };
