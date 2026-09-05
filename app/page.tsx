"use client";

//client le dice a next que este componente se renderiza en la pagina//

import { useState, useEffect } from "react";

// useState y useEffect son HOOKS de react, useState maneja la memoria de los componentes y useEffect sirve para sincronizar datos en el almacenamiento del navegador//

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

//task es un contrato de typeScript que define como luce una tarea, ID es un identificador numerico, text el contenido del texto, y un booleano sirve para marcar una tarea completa o no//

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  //tasks almacena las tareas creadas, inputVal guarda temporalmente lo que el usuario escribe en la barra para crear una tarea//
  //editingID guarda el id de la tarea que se esta editando en el momento es null si no se esta editando ninguna tarea//
  //editText guarda el texto temporal mientras lo editas//

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  //useEffect carga las tareas guardadas en la memoria del navegador//
  //el segundo useEffect actualiza el almacenamiento local "localstorage" cada vez que la tarea sufre cambios//

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputVal.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: inputVal.trim(), completed: false }]);
      setInputVal("");
    }
  };

  //handleKeyDown es una funcion que se ejecuta cuando el usuario presiona una tecla en la barra de entrada, si la tecla es "Enter" y el valor no esta vacio, se crea una nueva tarea con un ID unico basado en la fecha actual, el texto ingresado y un estado de completado falso. Luego se limpia el valor del input//

  const toggleComplete = (id: number) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  //toggleComplete es la funcion que cambia el estado de la tarea a completado//

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  //startEditing activa el modo de edicion haciendo click en el texto de una tarea//

  const saveEdit = (id: number) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, text: editText.trim() || task.text } : task))
    );
    setEditingId(null);
  };

  //saveEdit guarda los cambios cuando sales del cuadro de texto//

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  //filtra todas las tareas buscando el ID de la tarea que se quiere eliminar//

  //del <div> para abajo es la estructura visual de la aplicacion//

  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-50 p-6 font-sans">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md border border-zinc-200">
        <h1 className="text-2xl font-bold mb-4 text-zinc-800 text-center">TODO List</h1>

        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-800"
          placeholder="Escribe una tarea y presiona Enter..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-200"
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />

                {editingId === task.id ? (
                  <input
                    type="text"
                    autoFocus
                    className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-800 bg-white"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => saveEdit(task.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(task.id);
                    }}
                  />
                ) : (
                  <span
                    onClick={() => startEditing(task)}
                    className={`flex-1 cursor-pointer select-none ${
                      task.completed ? "line-through text-zinc-400" : "text-zinc-800"
                    }`}
                  >
                    {task.text}
                  </span>
                )}
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="ml-3 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>

        {tasks.length === 0 && (
          <p className="text-center text-zinc-400 mt-4 text-sm">No hay tareas pendientes.</p>
        )}
      </div>
    </div>
  );
}