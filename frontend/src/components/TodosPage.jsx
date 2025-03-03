import { useRef, useEffect, useState } from "react";
import TodoContainer from "./TodoContainer";

function TodosPage() {
  const [added, setAdded] = useState(2);
  const [todos, setTodos] = useState([]);
  const [token, setToken] = useState(null); // Manage token in state
  const shortDesc = useRef();

  // Fetch the token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    console.log(storedToken)
    if (storedToken) {
      setToken(storedToken); // Set token in state
    }
  }, []);

  // Add a new todo
  async function handleAdd() {
    if (!token) {
      console.error("No token found, user is not authenticated.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ short_desc: shortDesc.current.value }),
      });

      if (!response.ok) throw new Error("Failed to add todo");

      await response.json();
      setAdded(prev => prev + 1);
      shortDesc.current.value = "";
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }

  // Delete a todo
  async function handleDelete(id) {
    if (!token) {
      console.error("No token found, user is not authenticated.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/todo/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete todo");

      setAdded(prev => prev + 1);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  // Fetch todos when added changes
  useEffect(() => {
    if (!token) return; // Do not make API request if token is missing

    async function fetchTodos() {
      try {
        const response = await fetch("http://127.0.0.1:8000/todos", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch todos");

        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    }
    fetchTodos();
  }, [added, token]);

  return (
    <>
      {/* Todo input section */}
      <div className="w-full h-16 flex justify-center items-center mt-8 px-4">
        <input
          type="text"
          placeholder="Enter a task..."
          ref={shortDesc}
          className="w-1/3 h-10 px-4 border-2 border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:border-blue-400"
        />
        <button
          onClick={handleAdd}
          className="ml-3 px-6 h-10 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 transition-all"
        >
          Add
        </button>
      </div>

      {/* Todo list section */}
      <div className="w-full min-h-64 flex flex-col items-center py-4 mt-6 rounded-lg">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <TodoContainer
              key={todo.id}
              id={todo.id}
              handleDelete={handleDelete}
              shortDesc={todo.short_desc}
            />
          ))
        ) : (
          <p className="text-gray-400 mt-6">No tasks here. Add one above!</p>
        )}
      </div>
    </>
  );
}

export default TodosPage;
