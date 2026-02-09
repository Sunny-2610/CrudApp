// todo.ts
export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export const data: Todo[] = [
  {
    id: 1,
    title: "Finish reading the book",
    completed: true,
  },
  {
    id: 2,
    title: "Buy groceries",
    completed: false,
  },
  // ... (rest of your items, same as you sent)
];
