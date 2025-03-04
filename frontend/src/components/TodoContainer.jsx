import { faTrash, faCheckCircle, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { use, useEffect, useState } from "react";

export default function TodoContainer({ shortDesc,todo,handleDelete}) {
  const [checked, setChecked] = useState(false);
  const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
  function handleClick() {
    setChecked((prev) => !prev);
  }

 useEffect(() => {
  async function deleteReminder() {
    if (checked){try {
      const response = await fetch(`${API_URL}/todo/tasks/${todo.task_id}`, {
        method: "DELETE",
      });
      console.log(todo.task_id)
      if (!response.ok) throw new Error("Failed to delete task");

    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }}
    
  deleteReminder()

    },[checked])

  return (
    <div className={`w-2/5 bg-gray-800 p-4 rounded-xl flex items-center shadow-md transition-transform transform hover:scale-105 m-2 ${checked ? "opacity-50" : ""}`}>
      {/* Checkbox */}
      <button
        onClick={handleClick}
        className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-400 hover:border-gray-200 transition-all"
      >
        <FontAwesomeIcon icon={checked ? faCheckCircle : faCircle} className={checked ? "text-green-400 text-2xl" : "text-gray-400 text-2xl"} />
      </button>

      {/* Task Description */}
      <p className="ml-4 flex-grow text-white font-semibold text-lg truncate">
        {shortDesc}
      </p>

      {/* Delete Button */}
      <button onClick={() => handleDelete(todo.id)} className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-500 transition-all">
        <FontAwesomeIcon icon={faTrash} className="text-xl" />
      </button>
    </div>
  );
}
