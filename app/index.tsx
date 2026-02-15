import {
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
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
      <Text
        style={[
          styles.todoText,
          { color: theme.text },
          item.completed && styles.completedText,
        ]}
        onPress={() => toggleTodo(item.id)}
      >
        {item.title}
      </Text>

      <Pressable onPress={() => removeTodo(item.id)}>
        <MaterialCommunityIcons
          name="delete-circle"
          size={36}
          color="red"
        />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder="Add a new todo"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />

        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>

         <Pressable
          onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')} style={{ marginLeft: 10 }}>

          <Octicons name={colorScheme === 'dark' ? "moon" : "sun"} size={36} color={theme.text} selectable={undefined} style={{ width: 36 }} />

        </Pressable>
      </View>

      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(todo) => todo.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    fontFamily: "Inter_500Medium",
  },
  addButton: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
  },
  addButtonText: {
    fontSize: 18,
    color: "black",
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
  },
  todoText: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Inter_500Medium",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
});
