import React, { useState } from "react";
import { View, Text } from "react-native";
import { LogoTaskly } from "@components/logo";
import { Button } from "@components/buttons/button";
import { SubjectModal } from "@screens/newSubject";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const Header: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState<Boolean>(false);
  return (
    console.log(modalIsOpen),
    (
      <>
        <View
          className="w-screen h-40 bg-bgLight shadow-lg shadow-slate-400  flex flex-row  items-center  justify-between gap-2
       dark:bg-gray-950 dark:shadow-lg dark:shadow-slate-800"
        >
          <View className="flex flex-row items-center justify-center mt-6">
            <LogoTaskly width={100} height={100} alt="Taskly Logo" />
            <View className="">
              <Text className="text-black text-lg font-extrabold dark:text-white">
                TASKLY
              </Text>
              <Text className="text-gray-600 text-sm font-medium dark:text-gray-400">
                Organizar acadêmico
              </Text>
            </View>
          </View>

          <Button
            onPress={() => setModalIsOpen(true)}
            style="h-12 w-12 rounded-lg items-center justify-center mr-8 mt-10"
            icon={<FontAwesome5 name="plus" size={22} color="white" />}
          />
        </View>
        {modalIsOpen && (
          <SubjectModal modalIsOpen={true} setModalIsOpen={setModalIsOpen} />
        )}
      </>
    )
  );
};

export { Header };
