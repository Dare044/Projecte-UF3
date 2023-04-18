const socket = io();

const preguntas = [];

fetch('preguntas.json')
  .then(response => response.json())
  .then(data => {
    preguntas.push(...data.preguntas); // Agregar preguntas al arreglo
    mostrarPreguntaAleatoria();
  })
  .catch(error => console.error(error));

function mostrarPreguntaAleatoria() {
  const indicePregunta = Math.floor(Math.random() * preguntas.length);
  const pregunta = preguntas[indicePregunta];

  // Mostrar la pregunta y las opciones en la interfaz gráfica
  const preguntaContainer = document.getElementById("pregunta-container");
  preguntaContainer.style.display = "block"; // Mostrar el contenedor de la pregunta
  document.getElementById("pregunta").textContent = pregunta.pregunta;

  const opcionesContainer = document.getElementById("opciones");
  opcionesContainer.innerHTML = ""; // Limpiar el contenedor de opciones
  pregunta.opciones.forEach(opcion => {
    const label = document.createElement("label");
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "opcion";
    radio.value = opcion;
    label.appendChild(radio);
    label.appendChild(document.createTextNode(opcion));
    opcionesContainer.appendChild(label);
  });

  // Agregar evento de click al botón "Enviar"
  const sendButton = document.getElementById("sendButton");
  sendButton.addEventListener("click", function() {
    comprobarRespuesta(pregunta.respuesta);
  });
}

function comprobarRespuesta(respuestaCorrecta) {
  // Obtener las opciones
  const opciones = document.getElementsByName("opcion");

  // Comprobar si se ha seleccionado una opción
  let respuestaSeleccionada = "";
  for (let i = 0; i < opciones.length; i++) {
    if (opciones[i].checked) {
      respuestaSeleccionada = opciones[i].value;
      break;
    }
  }

  if (respuestaSeleccionada === "") {
    alert("Por favor, selecciona una respuesta");
    return;
  }

  // Comprobar si la respuesta seleccionada es la correcta
  if (respuestaSeleccionada === respuestaCorrecta) {
    alert("¡Respuesta correcta!");
  } else {
    alert("Respuesta incorrecta");
  }

  // Eliminar la pregunta del arreglo para que no se repita
  const indicePregunta = preguntas.findIndex(pregunta => pregunta.respuesta === respuestaCorrecta);
  preguntas.splice(indicePregunta, 1);

  // Mostrar una nueva pregunta aleatoria o el mensaje de fin de juego
  if (preguntas.length > 0) {
    mostrarPreguntaAleatoria();
  } else {
    const preguntaContainer = document.getElementById("pregunta-container");
    preguntaContainer.style.display = "none"; // Ocultar el contenedor de la pregunta
    alert("¡Juego terminado!");
  }
}

const nicknameInput = document.getElementById("nicknameInput");
const sendButton = document.getElementById("sendButton");
sendButton.addEventListener("click", function(event) {
  event.preventDefault(); // Prevenir el envío del formulario
  socket.emit("nickname", {nickname: nicknameInput.value} );
});

socket.on('nickname rebut', function(data) {
  console.log(data);
  mostrarPreguntaAleatoria(); // Mostrar la primera pregunta al recibir el nombre de usuario
});
