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
                const storageTodos: Todo[] =
                    jsonValue != null ? JSON.parse(jsonValue) : null;

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

    // 🎨 Generate dynamic styles based on theme
    const styles = createStyles(theme, colorScheme);


    // 💾 Save updated todo
    const handleSave = async () => {

        // Prevent saving empty title
        if (!todo || !todo.title.trim()) return;

        try {

            // Trim title and prepare updated object
            const savedTodo: Todo = {
                ...todo,
                title: todo.title.trim()
            };

            // Get existing todos from storage
            const jsonValue = await AsyncStorage.getItem('TodoApp');
            const storageTodos: Todo[] =
                jsonValue != null ? JSON.parse(jsonValue) : null;

            if (storageTodos && storageTodos.length) {

                // Remove old version of edited todo
                const otherTodos =
                    storageTodos.filter(t => t.id !== savedTodo.id);

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
                    maxLength={30}
                    placeholder="Edit todo"
                    placeholderTextColor="gray"

                    // Show current title
                    value={todo?.title || ''}

                    // Update state when typing
                    onChangeText={(text) =>
                        setTodo(prev =>
                            prev ? { ...prev, title: text } : null
                        )
                    }

                    // Save when user presses enter
                    onSubmitEditing={handleSave}
                />

                {/* Theme Toggle Button */}
                <Pressable
                    onPress={() =>
                        setColorScheme(
                            colorScheme === 'light'
                                ? 'dark'
                                : 'light'
                        )
                    }
                    style={styles.themeButton}
                >
                    <Octicons
                        name={
                            colorScheme === 'dark'
                                ? "moon"
                                : "sun"
                        }
                        size={36}
                        color={theme.text}
                        style={{ width: 36 }}
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
                    <Text style={styles.saveButtonText}>
                        Save
                    </Text>
                </Pressable>

                {/* Cancel Button */}
                <Pressable
                    onPress={() => router.push('/')}
                    style={[styles.button, styles.cancelButton]}
                >
                    <Text style={styles.cancelButtonText}>
                        Cancel
                    </Text>
                </Pressable>

            </View>

            {/* Status Bar Theme */}
            <StatusBar
                style={
                    colorScheme === 'dark'
                        ? 'light'
                        : 'dark'
                }
            />

        </SafeAreaView>
    );
}
