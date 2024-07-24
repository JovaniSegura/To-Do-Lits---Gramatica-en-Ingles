const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Leer el JSON existente
let data = JSON.parse(fs.readFileSync('datos.json', 'utf8'));

function mostrarCategorias() {
  console.log('\n');
  console.log("Categorías disponibles:");
  data.forEach((categoria, index) => {
    console.log(`${index + 1}. ${categoria.categoria}`);
  });
  console.log(`${data.length + 1}. [Agregar nueva categoría]`);
  console.log('\n');
}

function solicitarEntrada(pregunta, callback) {
  rl.question(pregunta, (respuesta) => {
    if (respuesta.trim() === '') {
      console.log("La entrada no puede estar vacía. Inténtelo de nuevo.");
      solicitarEntrada(pregunta, callback);
    } else {
      callback(respuesta);
    }
  });
}

function agregarEnlace(categoriaSeleccionada) {
  solicitarEntrada("Ingrese el título del nuevo enlace: ", (titulo) => {
    solicitarEntrada("Ingrese la URL del nuevo enlace: ", (url) => {
      categoriaSeleccionada.enlaces.push({ titulo, url });
      fs.writeFileSync('datos.json', JSON.stringify(data, null, 2));
      console.log("Enlace agregado exitosamente.");
      agregarOtroEnlace();
    });
  });
}

function agregarNuevaCategoria() {
  solicitarEntrada("Ingrese el nombre de la nueva categoría: ", (nombre) => {
    const nuevaCategoria = { categoria: nombre, enlaces: [] };
    data.splice(data.length, 0, nuevaCategoria);  // Agregar antes de "Agregar nueva categoría"
    fs.writeFileSync('datos.json', JSON.stringify(data, null, 2));
    console.log("Categoría agregada exitosamente.");
    seleccionarCategoria();
  });
}

function seleccionarCategoria() {
  mostrarCategorias();
  solicitarEntrada("Seleccione el número de la categoría: ", (seleccion) => {
    const indiceSeleccionado = parseInt(seleccion) - 1;
    if (indiceSeleccionado === data.length) {
      agregarNuevaCategoria();
    } else {
      const categoriaSeleccionada = data[indiceSeleccionado];
      agregarEnlace(categoriaSeleccionada);
    }
  });
}

async function agregarOtroEnlace() {
  solicitarEntrada("¿Desea agregar otro enlace? (sí/no): ", async (respuesta) => {
    if (respuesta.toLowerCase() === 'sí' || respuesta.toLowerCase() === 'si' || respuesta.toLowerCase() === 'yes') {
      seleccionarCategoria();
    } else {
      // Importar clipboardy dinámicamente y copiar el contenido del JSON al portapapeles
      const clipboardy = await import('clipboardy');
      clipboardy.default.writeSync(JSON.stringify(data, null, 2));
      console.log("Contenido del JSON copiado en el portapapeles.");
      rl.close();
    }
  });
}

// Iniciar el proceso
seleccionarCategoria();
