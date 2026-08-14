const buenasPracticas = [
    "Escribir código limpio y legible.",
    "Utilizar nombres descriptivos para variables y funciones.",
    "Comentar únicamente cuando sea necesario.",
    "Usar control de versiones como Git.",
    "Realizar pruebas antes de desplegar el software.",
    "Seguir principios de diseño y arquitectura.",
    "Mantener una estructura organizada del proyecto.",
    "Documentar el funcionamiento del sistema."
];

const lista = document.getElementById("practicas");

buenasPracticas.forEach(practica => {
    const li = document.createElement("li");
    li.textContent = practica;
    lista.appendChild(li);
});