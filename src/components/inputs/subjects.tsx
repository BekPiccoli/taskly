import { Text, View, TextInput } from "react-native";
import { Controller } from "react-hook-form";

interface SubjectInputProps {
  title: string;
  control: any;
  required: string;
  placeholder: string;
  name: string;
}

interface SubjectColorPickerProps {
  isColorSelected?: Boolean;
  colorSelected: string;
}

const SubjectInput: React.FC<SubjectInputProps> = ({
  title,
  control,
  required,
  placeholder,
  name,
}: {
  title: string;
  control: any;
  required: string;
  placeholder: string;
  name: string;
}) => {
  return (
    <View className="w-full flex flex-col items-center">
      <View className="w-full flex flex-col items-center justify-start ">
        <View className="w-full flex flex-col ml-36 justify-center p-2">
          <Text className="italic">{title} *</Text>
        </View>
        <Controller
          control={control}
          name={name}
          rules={{ required: required }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="h-12 w-3/4 bg-white rounded-lg p-4 border"
              value={value}
              placeholder={placeholder}
              onChangeText={onChange}
            />
          )}
        />
      </View>
    </View>
  );
};

const SubjectColorPicker: React.FC<SubjectColorPickerProps> = ({
  isColorSelected,
  colorSelected,
  control,
  name,
}: {
  isColorSelected?: Boolean;
  colorSelected: string;
  control: any;
  name: string;
}) => {
  return (
    <View className="flex flex-row items-center gap-2 mt-4">
      <Text>Cor selecionada:</Text>
      <Controller
        control={control}
        name={name}
        rules={{ required: "Color is required" }}
        render={({ field: { onChange, value } }) => (
          <View
            className={`w-8 h-8 rounded-lg border-2 border-black bg-[${colorSelected}]`}
          />
        )}
      />
    </View>
  );
};

const colors = [
  "#3B82F6",
  "#9333EA",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#F97316",
  "#EC4899",
  "#84CC16",
  "#D946EF",
];

export { SubjectInput, SubjectColorPicker, colors };
