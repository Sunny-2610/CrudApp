import {
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Platform,
} from "react-native";
import { useState, useContext, useEffect } from "react";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Animated, { LinearTransition } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

import { ThemeContext } from "../context/ThemeContext";
import { data, Todo } from "../data/todo";

export default function Index() {
  const themeContext = useContext(ThemeContext);
  const router = useRouter();

  if (!themeContext) {
    throw new Error("Index must be used inside ThemeProvider");
  }

  const { colorScheme, setColorScheme, theme } = themeContext;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");

  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  // ✅ Load todos from storage (FIXED: removed [data] dependency)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageTodos = jsonValue ? JSON.parse(jsonValue) : null;

        if (storageTodos && storageTodos.length) {
          setTodos(storageTodos.sort((a: Todo, b: Todo) => b.id - a.id));
        } else {
          setTodos([...data].sort((a, b) => b.id - a.id));
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  // ✅ Save todos to storage
  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(todos);
        await AsyncStorage.setItem("TodoApp", jsonValue);
      } catch (e) {
        console.error(e);
      }
    };

    storeData();
  }, [todos]);

  if (!loaded && !error) {
    return null;
  }

  const addTodo = () => {
    if (!text.trim()) return;

    const newId =
      todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;

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

  const handlePress = (id: number) => {
    router.push(`/todos/${id}`);
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <Pressable
      onPress={() => handlePress(item.id)}
      onLongPress={() => toggleTodo(item.id)}
    >
      <View
        style={[
          styles.todoItem,
          { borderBottomColor: theme.border },
        ]}
      >
        <View style={styles.todoTextContainer}>
          <Text
            style={[
              styles.todoText,
              { color: theme.text },
              item.completed && styles.completedText,
            ]}
          >
            {item.title}
          </Text>
        </View>

        <Pressable
          onPress={() => removeTodo(item.id)}
          style={styles.deleteButton}
        >
          <MaterialCommunityIcons
            name="delete-circle"
            size={32}
            color="red"
          />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            My Todos
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.border,
                backgroundColor:
                  colorScheme === "dark"
                    ? "#1a1a1a"
                    : "#f5f5f5",
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
            onPress={() =>
              setColorScheme(
                colorScheme === "light" ? "dark" : "light"
              )
            }
            style={styles.themeButton}
          >
            <Octicons
              name={colorScheme === "dark" ? "moon" : "sun"}
              size={28}
              color={theme.text}
            />
          </Pressable>
        </View>

        <Animated.FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(todo) => todo.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={Platform.OS === "web"}
          itemLayoutAnimation={LinearTransition}
          keyboardDismissMode="on-drag"
        />
      </View>

      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
      />
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
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Inter_500Medium",
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
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  themeButton: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
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
