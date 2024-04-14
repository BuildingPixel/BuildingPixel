// Obtener el elemento del mural
const mural = document.getElementById('mural');

// Obtener el elemento del selector de color
const colorPicker = document.getElementById('colorPicker');

// Obtener los botones de borrar, limpiar y guardar
const borrarBtn = document.getElementById('borrar');
const limpiarBtn = document.getElementById('limpiar');
const guardarBtn = document.getElementById('guardar');

// Variable para indicar si la herramienta de borrar está activa o no
let borrarActivo = false;

// Función para activar el botón
function activarBoton(boton) {
    boton.classList.add('active'); // Agregar la clase 'active' al botón
}

// Función para desactivar el botón
function desactivarBoton(boton) {
    boton.classList.remove('active'); // Eliminar la clase 'active' del botón
}

// Función para crear los píxeles del mural
function crearPixeles(numColumnas, numFilas) {
    const numPixeles = numColumnas * numFilas;
    for (let i = 0; i < numPixeles; i++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');

        // Comprobar si hay datos almacenados para este píxel y establecer el color correspondiente
        const pixelColor = localStorage.getItem(`pixel-${i}`);
        if (pixelColor) {
            pixel.style.backgroundColor = pixelColor;
        }

        pixel.addEventListener('mousedown', () => {
            // Si la herramienta de borrar está activa y el píxel está coloreado, borrarlo
            if (borrarActivo && pixel.style.backgroundColor !== 'white') {
                pixel.style.backgroundColor = 'white'; // Borrar el color del píxel
                // Eliminar el color del píxel del almacenamiento local
                localStorage.removeItem(`pixel-${i}`);
            } else if (!borrarActivo) {
                // Obtener el color seleccionado por el usuario
                const selectedColor = colorPicker.value;
                pixel.style.backgroundColor = selectedColor; // Cambiar el color del píxel al hacer clic en él
            }
        });

        mural.appendChild(pixel); // Agregar el píxel al mural
    }
}

// Lógica para activar y desactivar el botón de borrar
borrarBtn.addEventListener('click', () => {
    borrarActivo = !borrarActivo; // Alternar el estado de la herramienta de borrar
    if (borrarActivo) {
        activarBoton(borrarBtn); // Activar el botón si la herramienta de borrar está activa
    } else {
        desactivarBoton(borrarBtn); // Desactivar el botón si la herramienta de borrar está inactiva
    }
});

// Función para guardar los cambios en el mural
guardarBtn.addEventListener('click', () => {
    const pixeles = mural.querySelectorAll('.pixel');
    pixeles.forEach((pixel, index) => {
        const color = pixel.style.backgroundColor;
        localStorage.setItem(`pixel-${index}`, color);
    });
    alert('¡Los cambios han sido guardados!');
});

// Función para limpiar el mural
limpiarBtn.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que deseas limpiar el mural?')) {
        const pixeles = mural.querySelectorAll('.pixel');
        pixeles.forEach((pixel, index) => {
            pixel.style.backgroundColor = 'white';
            localStorage.removeItem(`pixel-${index}`);
        });
    }
});

// Llamar a la función para crear los píxeles del mural con un tamaño predeterminado
crearPixeles(100, 60); // 100 columnas y 60 filas

// Función para generar una figura aleatoria del Tetris
function generarFiguraTetris() {
    const coloresTetris = ['#FF0000', '#008000', '#0000FF', '#FFFF00', '#FFA500', '#800080', '#00FFFF']; // Colores propios del Tetris
    const figurasTetris = ['O', 'I', 'S', 'Z', 'L', 'J', 'T']; // Figuras del Tetris
    const color = coloresTetris[Math.floor(Math.random() * coloresTetris.length)]; // Color aleatorio
    const figura = figurasTetris[Math.floor(Math.random() * figurasTetris.length)]; // Figura aleatoria
    return { color, figura };
}

// Función para generar una figura aleatoria y añadirla al mural
function generarFiguraAleatoria() {
    const figura = generarFiguraTetris(); // Generar figura del Tetris

    // Crear un div para la figura
    const divFigura = document.createElement('div');
    divFigura.classList.add('figura');
    divFigura.textContent = figura.figura;
    divFigura.style.color = figura.color;
    divFigura.style.fontSize = '30px'; // Tamaño de la figura aumentado
    divFigura.style.pointerEvents = 'none'; // Evitar que la figura afecte los eventos del ratón

    // Asignar posición aleatoria en la página
    const posX = Math.random() * (window.innerWidth - 100); // Restar el ancho de la figura
    const posY = Math.random() * (window.innerHeight - 100); // Restar el alto de la figura
    divFigura.style.left = `${posX}px`;
    divFigura.style.top = `${posY}px`;

    // Agregar la figura al mural
    document.getElementById('figuras').appendChild(divFigura);
}

// Generar figuras aleatorias cada 1 segundo hasta un máximo de 50 figuras
const intervaloFiguras = setInterval(() => {
    if (document.querySelectorAll('.figura').length < 50) {
        generarFiguraAleatoria();
    } else {
        clearInterval(intervaloFiguras);
    }
}, 1000);

// Obtener la imagen
const imagenMovil = document.getElementById('imagenMovil');

// Obtener las dimensiones del mural y la ventana del navegador
const muralRect = document.getElementById('mural').getBoundingClientRect();
const ventanaAncho = window.innerWidth;
const ventanaAlto = window.innerHeight;

// Variables para la posición y velocidad de la imagen
let posX = Math.random() * (ventanaAncho - muralRect.width);
let posY = Math.random() * ventanaAlto;
let velocidadX = (Math.random() - 0.5) * 4; // Velocidad horizontal entre -2 y 2
let velocidadY = (Math.random() - 0.5) * 4; // Velocidad vertical entre -2 y 2

// Función para mover la imagen
function moverImagen() {
    posX += velocidadX;
    posY += velocidadY;

    // Rebotar en los bordes de la ventana
    if (posX <= 0 || posX >= ventanaAncho - imagenMovil.width) {
        velocidadX *= Math.random() < 0.5 ? -1 : 1; // Cambiar la dirección horizontal aleatoriamente
    }
    if (posY <= 0 || posY >= ventanaAlto - imagenMovil.height) {
        velocidadY *= Math.random() < 0.5 ? -1 : 1; // Cambiar la dirección vertical aleatoriamente
    }

    // Rebotar en el marco del mural
    if (posX >= muralRect.left && posX <= muralRect.right - imagenMovil.width &&
        posY >= muralRect.top && posY <= muralRect.bottom - imagenMovil.height) {
        if (posX <= muralRect.left || posX >= muralRect.right - imagenMovil.width) {
            velocidadX *= -1;
        }
        if (posY <= muralRect.top || posY >= muralRect.bottom - imagenMovil.height) {
            velocidadY *= -1;
        }
    }

    // Actualizar la posición de la imagen
    imagenMovil.style.left = `${posX}px`;
    imagenMovil.style.top = `${posY}px`;
}


// Establecer intervalo para mover la imagen
setInterval(moverImagen, 25);







