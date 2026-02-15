import {
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Platform,
} from "react-native";
import { useState, useContext } from "react";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";

import { ThemeContext } from "../context/ThemeContext";
import { data, Todo } from "../data/todo";

export default function Index() {
  // ✅ useContext MUST be inside component
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("Index must be used inside ThemeProvider");
  }

  const { colorScheme, setColorScheme, theme } = themeContext;

  const [todos, setTodos] = useState<Todo[]>(
    [...data].sort((a, b) => b.id - a.id)
  );

  const [text, setText] = useState("");

  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  if (!loaded && !error) {
    return null;
  }

  const addTodo = () => {
    if (!text.trim()) return;

    const newId = todos.length
      ? Math.max(...todos.map((t) => t.id)) + 1
      : 1;

    const newTodo: Todo = {
      id: newId,
      title: text,
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setText("");
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  const removeTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={[styles.todoItem, { borderBottomColor: theme.border }]}>
      <Pressable onPress={() => toggleTodo(item.id)} style={styles.todoTextContainer}>
        <Text
          style={[
            styles.todoText,
            { color: theme.text },
            item.completed && styles.completedText,
          ]}
        >
          {item.title}
        </Text>
      </Pressable>

      <Pressable onPress={() => removeTodo(item.id)} style={styles.deleteButton}>
        <MaterialCommunityIcons
          name="delete-circle"
          size={36}
          color="red"
        />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>My Todos</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5',
              },
            ]}
            placeholder="Add a new todo"
            placeholderTextColor="gray"
            value={text}
            onChangeText={setText}
            onSubmitEditing={addTodo}
          />

          <Pressable onPress={addTodo} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>

          <Pressable
            onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')} 
            style={styles.themeButton}
          >
            <Octicons 
              name={colorScheme === 'dark' ? "moon" : "sun"} 
              size={36} 
              color={theme.text} 
              selectable={undefined} 
              style={{ width: 36 }} 
            />
          </Pressable>
        </View>

        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(todo) => todo.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={Platform.OS === 'web'}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
    ...Platform.select({
      web: {
        marginHorizontal: 'auto',
      },
    }),
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: "Inter_500Medium",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
    width: "100%",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    minHeight: 48,
  },
  addButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: '600',
  },
  themeButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    minHeight: 60,
  },
  todoTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  todoText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    lineHeight: 22,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "gray",
    opacity: 0.6,
  },
  deleteButton: {
    padding: 4,
  },
});