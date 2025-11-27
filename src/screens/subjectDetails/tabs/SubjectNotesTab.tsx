import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createNote, deleteNote, getNotes, updateNote } from "@functions/index";
import { type Note, type Subject } from "@functions/types";
import { getId } from "@src/asyncStorageData/index";
import { NoteCard } from "@src/components/noteCard";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { NoteFormModal } from "./NoteFormModal";
import { NoteViewModal } from "./NoteViewModal";

interface SubjectNotesTabProps {
  subject: Subject;
}

const SubjectNotesTab: React.FC<SubjectNotesTabProps> = ({ subject }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const isDarkMode = useColorScheme() === "dark";

  const loadNotes = useCallback(async () => {
    if (!subject.id) return;

    setLoading(true);
    try {
      const userId = await getId();
      if (!userId) {
        Alert.alert("Erro", "Usuário não encontrado");
        return;
      }

      const filters: { subjectId: string; search?: string } = {
        subjectId: subject.id,
      };
      
      if (searchQuery) {
        filters.search = searchQuery;
      }

      const response = await getNotes(userId, filters);
      setNotes(response.notes || []);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Não foi possível carregar as anotações"
      );
    } finally {
      setLoading(false);
    }
  }, [subject.id, searchQuery]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleCreateOrUpdateNote = async (
    noteData: Omit<Note, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const userId = await getId();
      if (!userId) {
        Alert.alert("Erro", "Usuário não encontrado");
        return;
      }

      if (selectedNote) {
        // Atualizar nota existente
        await updateNote(userId, selectedNote.id!, noteData);
        Alert.alert("Sucesso", "Anotação atualizada com sucesso!");
      } else {
        // Criar nova nota
        await createNote(userId, noteData);
        Alert.alert("Sucesso", "Anotação criada com sucesso!");
      }

      setFormModalVisible(false);
      setSelectedNote(null);
      await loadNotes();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Não foi possível salvar a anotação"
      );
      throw error;
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const userId = await getId();
      if (!userId) {
        Alert.alert("Erro", "Usuário não encontrado");
        return;
      }

      await deleteNote(userId, noteId);
      Alert.alert("Sucesso", "Anotação excluída com sucesso!");
      setFormModalVisible(false);
      setViewModalVisible(false);
      setSelectedNote(null);
      await loadNotes();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Não foi possível excluir a anotação"
      );
      throw error;
    }
  };

  const handleNotePress = (note: Note) => {
    setSelectedNote(note);
    setViewModalVisible(true);
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setFormModalVisible(true);
  };

  const handleEditNote = () => {
    setViewModalVisible(false);
    setFormModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setViewModalVisible(false);
    setSelectedNote(null);
  };

  const handleCloseFormModal = () => {
    setFormModalVisible(false);
    setSelectedNote(null);
  };

  if (loading && notes.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-50 dark:bg-gray-900">
        <ActivityIndicator size="large" color={subject.color} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-blue-50 dark:bg-gray-900">
      {/* Barra de busca */}
      <View className="px-4 pt-4 pb-2">
        <View
          className="flex flex-row items-center px-4 py-3 rounded-lg border"
          style={{
            backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
            borderColor: isDarkMode ? "#374151" : "#E5E7EB",
          }}
        >
          <Ionicons
            name="search"
            size={20}
            color={isDarkMode ? "#9CA3AF" : "#6B7280"}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar anotações..."
            placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
            className="flex-1 ml-2"
            style={{ color: isDarkMode ? "#F9FAFB" : "#111827" }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={isDarkMode ? "#9CA3AF" : "#6B7280"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-2"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {notes.length === 0 ? (
          <View className="flex-1 justify-center items-center py-16">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: isDarkMode ? "#374151" : "#E5E7EB" }}
            >
              <Ionicons
                name="document-text-outline"
                size={40}
                color={isDarkMode ? "#9CA3AF" : "#6B7280"}
              />
            </View>
            <Text className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
              {searchQuery
                ? "Nenhuma anotação encontrada"
                : "Nenhuma anotação ainda"}
            </Text>
            <Text className="text-center text-gray-600 dark:text-gray-400 px-8">
              {searchQuery
                ? "Tente buscar com outras palavras"
                : "Crie anotações para registrar informações importantes desta disciplina"}
            </Text>
          </View>
        ) : (
          <>
            <View className="flex flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-gray-800 dark:text-gray-200">
                {notes.length} {notes.length === 1 ? "Anotação" : "Anotações"}
              </Text>
              {notes.filter((n) => n.pinned).length > 0 && (
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: "#FEF3C7" }}
                >
                  <Text className="text-xs font-semibold" style={{ color: "#F59E0B" }}>
                    {notes.filter((n) => n.pinned).length} Fixada
                    {notes.filter((n) => n.pinned).length !== 1 ? "s" : ""}
                  </Text>
                </View>
              )}
            </View>
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onPress={() => handleNotePress(note)}
              />
            ))}
          </>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={handleNewNote}
        className="absolute bottom-6 right-6 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        style={{
          backgroundColor: subject.color,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
        }}
      >
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Modal de visualização */}
      <NoteViewModal
        visible={viewModalVisible}
        note={selectedNote}
        subject={subject}
        onClose={handleCloseViewModal}
        onEdit={handleEditNote}
      />

      {/* Modal de criação/edição */}
      <NoteFormModal
        visible={formModalVisible}
        subject={subject}
        note={selectedNote}
        onClose={handleCloseFormModal}
        onSubmit={handleCreateOrUpdateNote}
        onDelete={handleDeleteNote}
      />
    </View>
  );
};

export { SubjectNotesTab };
