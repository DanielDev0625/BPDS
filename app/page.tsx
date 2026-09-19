"use client";

// client le dice a next que este componente se renderiza en la pagina //

import { useState, useEffect } from "react";

// useState y useEffect son HOOKS de react para manejar memoria y sincronizar el almacenamiento //

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

// task es el contrato TypeScript que define cómo luce una tarea //

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  
  // Estado para controlar el menú lateral deslizante (Sidebar / Drawer) de la papelera //
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Carga inicial desde localStorage //
  useEffect(() => {
    setIsMounted(true);
    const savedTasks = localStorage.getItem("tasks");
    const savedDeleted = localStorage.getItem("deletedTasks");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedDeleted) setDeletedTasks(JSON.parse(savedDeleted));
  }, []);

  // Sincronización con localStorage //
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("deletedTasks", JSON.stringify(deletedTasks));
    }
  }, [deletedTasks, isMounted]);

  // Manejador para enviar el formulario y crear tarea al presionar Enter //
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: inputVal.trim(), completed: false }]);
      setInputVal("");
    }
  };

  const toggleComplete = (id: number) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id: number) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, text: editText.trim() || task.text } : task))
    );
    setEditingId(null);
  };

  // Mueve la tarea a la papelera antes de eliminarla //
  const deleteTask = (id: number) => {
    const taskToDelete = tasks.find((task) => task.id === id);
    if (taskToDelete) {
      setDeletedTasks([taskToDelete, ...deletedTasks]);
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  // Restaura una tarea desde el menú lateral //
  const restoreTask = (task: Task) => {
    setDeletedTasks(deletedTasks.filter((t) => t.id !== task.id));
    setTasks([...tasks, task]);
  };

  // Vacía la papelera por completo //
  const clearTrash = () => {
    setDeletedTasks([]);
  };

  // Cálculo del total de tareas creadas //
  const totalTasksCount = tasks.length;

  if (!isMounted) return null;

  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-50 p-6 font-sans relative overflow-x-hidden">
      
      {/* Contenedor Principal de la Aplicación */}
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md border border-zinc-200">
        
        {/* Título limpio en inglés y centrado */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-zinc-800">TodoList</h1>
        </div>

        {/* Formulario para añadir tareas asegurando el Enter nativo */}
        <form onSubmit={handleAddTask} className="mb-2">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-800 bg-white text-sm"
            placeholder="Escribe una tarea y presiona Enter..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
        </form>

        {/* Fila inferior con el contador de total de tareas y el botón de papelera bien jerarquizados */}
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-xs font-medium text-zinc-500">
            Total de las tareas: <strong className="text-zinc-700">{totalTasksCount}</strong>
          </span>

          {/* Botón de papelera con mini-contador integrado */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 rounded-lg text-xs font-semibold text-zinc-700 transition cursor-pointer"
          >
            <span>🗑️ Papelera</span>
            <span className="bg-red-500 text-white px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              {deletedTasks.length}
            </span>
          </button>
        </div>

        {/* Lista de Tareas Activas */}
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
                    className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-800 bg-white text-sm"
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
                    className={`flex-1 cursor-pointer select-none text-sm ${
                      task.completed ? "line-through text-zinc-400" : "text-zinc-800"
                    }`}
                  >
                    {task.text}
                  </span>
                )}
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="ml-3 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition cursor-pointer"
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

      {/* --- MENÚ LATERAL DESLIZANTE (SIDEBAR / DRAWER) PARA TAREAS ELIMINADAS --- */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
          <div className="w-80 max-w-full bg-white h-full shadow-2xl p-5 flex flex-col border-l border-zinc-200">
            
            {/* Cabecera del Menú Lateral */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <span className="text-lg">🗑️</span>
                <h2 className="font-bold text-zinc-800">Papelera</h2>
                <span className="bg-zinc-100 text-zinc-700 text-xs px-2 py-0.5 rounded-full font-bold border border-zinc-200">
                  {deletedTasks.length}
                </span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg text-sm font-bold cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            {/* Acciones de la papelera */}
            {deletedTasks.length > 0 && (
              <div className="py-3 flex justify-between items-center">
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Historial</span>
                <button
                  onClick={clearTrash}
                  className="text-xs text-red-500 hover:underline font-medium cursor-pointer"
                >
                  Vaciar papelera
                </button>
              </div>
            )}

            {/* Contenido de la lista de eliminadas */}
            <div className="flex-1 overflow-y-auto space-y-2 py-2">
              {deletedTasks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
                  <span className="text-3xl mb-2">📭</span>
                  <p className="text-sm">La papelera está vacía.</p>
                </div>
              ) : (
                deletedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 text-sm gap-2"
                  >
                    <span className="text-zinc-400 line-through truncate flex-1">
                      {task.text}
                    </span>
                    <button
                      onClick={() => restoreTask(task)}
                      className="px-2.5 py-1 bg-emerald-500 text-white text-xs rounded hover:bg-emerald-600 transition shrink-0 font-medium cursor-pointer"
                    >
                      Restaurar
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Pie del menú lateral */}
            <div className="pt-3 border-t border-zinc-200 text-center">
              <p className="text-[11px] text-zinc-400">Las tareas eliminadas se almacenan de forma segura.</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
