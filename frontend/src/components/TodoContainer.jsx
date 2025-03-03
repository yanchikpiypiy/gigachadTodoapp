import { faTrash, faCheckCircle, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function TodoContainer({ shortDesc,id,handleDelete}) {
  const [checked, setChecked] = useState(false);

  function handleClick() {
    setChecked((prev) => !prev);
  }

 

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
      <button onClick={() => handleDelete(id)} className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-500 transition-all">
        <FontAwesomeIcon icon={faTrash} className="text-xl" />
      </button>
    </div>
  );
}
