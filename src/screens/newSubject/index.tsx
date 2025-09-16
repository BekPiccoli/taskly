import React from "react";
import { View, Alert, Text } from "react-native";
import Modal from "react-native-modal";
import Fontisto from "@expo/vector-icons/Fontisto";

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
  return (
    <View className="flex-1 justify-center items-center">
      <Modal
        isVisible={true}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <Fontisto
          name="close-a"
          size={24}
          color="black"
          onPress={() => setModalIsOpen(false)}
        />
        <Text>Modal is Open</Text>
      </Modal>
    </View>
  );
};
export { SubjectModal };
