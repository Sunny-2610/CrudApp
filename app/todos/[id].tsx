// ✅ Get dynamic route param from URL (expo-router)
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";

// ✅ Theme context for dark/light mode
import { ThemeContext } from "@/context/ThemeContext";

// ✅ Control status bar color
import { StatusBar } from "expo-status-bar";

// ✅ Load custom font
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";

// ✅ Icon library
import Octicons from "@expo/vector-icons/Octicons";

// ✅ Local storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Navigation
import { useRouter } from "expo-router";

// ✅ Todo type
import { Todo } from "@/data/todo";

export default function EditScreen() {
  // 🔥 Get dynamic ID from route (example: /edit/5)
  const { id } = useLocalSearchParams<{ id: string }>();

  // 🧠 State to store the todo being edited
  const [todo, setTodo] = useState<Todo | null>(null);

  // 🌙 Access theme context
  const themeContext = useContext(ThemeContext);

  // Safety check (ensures ThemeProvider wraps app)
  if (!themeContext) {
    throw new Error("EditScreen must be used inside ThemeProvider");
  }

  const { colorScheme, setColorScheme, theme } = themeContext;

  // 🚀 Router for navigation
  const router = useRouter();

  // 🎨 Load custom font
  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  // 🔄 Fetch todo from AsyncStorage when screen loads
  useEffect(() => {
    // Function to get data from storage
    const fetchData = async (todoId: string) => {
      try {
        // Get stored todos
        const jsonValue = await AsyncStorage.getItem("TodoApp");

        // Convert JSON string into array
        const storageTodos: Todo[] = jsonValue != null ? JSON.parse(jsonValue) : null;

        // If data exists
        if (storageTodos && storageTodos.length) {
          // Find the todo matching the dynamic ID
          const myTodo = storageTodos.find(
            todo => todo.id.toString() === todoId
          );

          // If found → update state
          if (myTodo) {
            setTodo(myTodo);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    // Call function only if ID exists
    if (id) {
      fetchData(id as string);
    }
  }, [id]); // Runs whenever ID changes

  // Wait until font loads
  if (!loaded && !error) {
    return null;
  }

  // 💾 Save updated todo
  const handleSave = async () => {
    // Prevent saving empty title
    if (!todo || !todo.title.trim()) return;

    try {
      // Trim title and prepare updated object
      const savedTodo: Todo = { ...todo, title: todo.title.trim() };

      // Get existing todos from storage
      const jsonValue = await AsyncStorage.getItem('TodoApp');
      const storageTodos: Todo[] = jsonValue != null ? JSON.parse(jsonValue) : null;

      if (storageTodos && storageTodos.length) {
        // Remove old version of edited todo
        const otherTodos = storageTodos.filter(t => t.id !== savedTodo.id);

        // Add updated todo back
        const allTodos = [...otherTodos, savedTodo];

        // Save updated list
        await AsyncStorage.setItem(
          'TodoApp',
          JSON.stringify(allTodos)
        );
      } else {
        // If no todos exist, save new one
        await AsyncStorage.setItem(
          'TodoApp',
          JSON.stringify([savedTodo])
        );
      }

      // Navigate back to home screen
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  // 🎨 Create styles based on theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 10,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      gap: 10,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      fontFamily: 'Inter_500Medium',
      minHeight: 48,
      color: theme.text,
      backgroundColor: theme.background,
    },
    themeButton: {
      padding: 6,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      padding: 10,
      gap: 10,
    },
    button: {
      flex: 1,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 20,
      minHeight: 48,
      justifyContent: 'center',
      alignItems: 'center',
    },
    saveButton: {
      backgroundColor: '#007AFF',
    },
    cancelButton: {
      backgroundColor: '#888',
    },
    buttonText: {
      fontSize: 16,
      color: 'white',
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Edit Todo</Text>
      </View>

      {/* Input + Theme Toggle */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={todo?.title || ''}
          onChangeText={(text) =>
            setTodo(prev => prev ? { ...prev, title: text } : null)
          }
          // Save when user presses enter
          onSubmitEditing={handleSave}
        />

        {/* Theme Toggle Button */}
        <Pressable
          onPress={() =>
            setColorScheme(
              colorScheme === 'light' ? 'dark' : 'light'
            )
          }
          style={styles.themeButton}
        >
          <Octicons
            name={colorScheme === 'light' ? 'moon' : 'sun'}
            size={24}
            color={theme.icon}
          />
        </Pressable>
      </View>

      {/* Save & Cancel Buttons */}
      <View style={styles.buttonContainer}>
        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          style={[styles.button, styles.saveButton]}
        >
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>

        {/* Cancel Button */}
        <Pressable
          onPress={() => router.push('/')}
          style={[styles.button, styles.cancelButton]}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
      </View>

      {/* Status Bar Theme */}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}