import { Text, View , TextInput,Pressable } from "react-native";
import { useState } from "react";
import { data, Todo } from "../data/todo"; // adjust path if needed

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>(
    [...data].sort((a: Todo, b: Todo) => b.id - a.id)
  );

  const [text, setText] = useState<string>("");

  const addTodo =()=>{
    if(text.trim()) {
      const newId = todos.length ? todos[0].id + 1 : 1;
      setTodos([{ id: newId, title: text, completed: false }, ...todos]);
      setText("");
    }
  } 


  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }
        return todo;
      })
    );
  }

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
