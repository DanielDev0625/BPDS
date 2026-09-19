```tsx
"use client";

import { useEffect, useState } from "react";

/* ---------------------------------- */
/* TIPOS                              */
/* ---------------------------------- */

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

/* ---------------------------------- */
/* COMPONENTE                         */
/* ---------------------------------- */

export default function TodoList() {
  /* -------------------------------- */
  /* ESTADOS                          */
  /* -------------------------------- */

  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  /* -------------------------------- */
  /* LOCAL STORAGE                    */
  /* -------------------------------- */

  // Cargar tareas guardadas al iniciar
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch {
        console.error("No se pudieron cargar las tareas.");
      }
    }
  }, []);

  // Guardar tareas cada vez que cambian
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  /* -------------------------------- */
  /* AGREGAR TAREA                    */
  /* -------------------------------- */

  const addTask = () => {
    const text = inputValue.trim();

    if (!text) return;

    const newTask: Task = {
      id: Date.now(),
      text,
      completed: false,
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
    setInputValue("");
  };

  const handleInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      addTask();
    }
  };

  /* -------------------------------- */
  /* COMPLETAR TAREA                  */
  /* -------------------------------- */

  const toggleComplete = (id: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  /* -------------------------------- */
  /* EDITAR TAREA                     */
  /* -------------------------------- */

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              text: editText.trim() || task.text,
            }
          : task
      )
    );

    setEditingId(null);
    setEditText("");
  };

  const handleEditKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) => {
    if (event.key === "Enter") {
      saveEdit(id);
    }

    if (event.key === "Escape") {
      setEditingId(null);
      setEditText("");
    }
  };

  /* -------------------------------- */
  /* ELIMINAR TAREA                   */
  /* -------------------------------- */

  const deleteTask = (id: number) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  };

  /* -------------------------------- */
  /* ESTADÍSTICAS                     */
  /* -------------------------------- */

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.length - completedTasks;

  /* -------------------------------- */
  /* INTERFAZ                         */
  /* -------------------------------- */

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 font-sans">
      <section className="mx-auto w-full max-w-md">
        {/* ENCABEZADO */}
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-zinc-800">
            TODO List
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Organiza tus tareas fácilmente
          </p>
        </header>

        {/* TARJETA PRINCIPAL */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          {/* INPUT */}
          <div className="mb-5">
            <label
              htmlFor="new-task"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              Nueva tarea
            </label>

            <div className="flex gap-2">
              <input
                id="new-task"
                type="text"
                value={inputValue}
                onChange={(event) =>
                  setInputValue(event.target.value)
                }
                onKeyDown={handleInputKeyDown}
                placeholder="Escribe una tarea..."
                className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              <button
                type="button"
                onClick={addTask}
                disabled={!inputValue.trim()}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Agregar
              </button>
            </div>
          </div>

          {/* ESTADÍSTICAS */}
          {tasks.length > 0 && (
            <div className="mb-4 flex justify-between rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-500">
              <span>Total: {tasks.length}</span>
              <span>Pendientes: {pendingTasks}</span>
              <span>Completadas: {completedTasks}</span>
            </div>
          )}

          {/* LISTA */}
          {tasks.length > 0 ? (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 transition hover:border-zinc-300"
                >
                  {/* CHECKBOX */}
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    className="h-5 w-5 shrink-0 cursor-pointer accent-blue-600"
                    aria-label={`Marcar "${task.text}" como ${
                      task.completed
                        ? "pendiente"
                        : "completada"
                    }`}
                  />

                  {/* CONTENIDO */}
                  <div className="min-w-0 flex-1">
                    {editingId === task.id ? (
                      <input
                        type="text"
                        value={editText}
                        autoFocus
                        onChange={(event) =>
                          setEditText(event.target.value)
                        }
                        onBlur={() => saveEdit(task.id)}
                        onKeyDown={(event) =>
                          handleEditKeyDown(event, task.id)
                        }
                        className="w-full rounded-md border border-blue-400 bg-white px-2 py-1.5 text-sm text-zinc-800 outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEditing(task)}
                        className={`w-full cursor-pointer text-left text-sm ${
                          task.completed
                            ? "text-zinc-400 line-through"
                            : "text-zinc-800"
                        }`}
                        title="Haz clic para editar"
                      >
                        {task.text}
                      </button>
                    )}
                  </div>

                  {/* ELIMINAR */}
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                    aria-label={`Eliminar ${task.text}`}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            /* ESTADO VACÍO */
            <div className="py-8 text-center">
              <p className="text-sm font-medium text-zinc-500">
                No hay tareas todavía
              </p>

              <p className="mt-1 text-xs text-zinc-400">
                Agrega una tarea para comenzar.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
```
