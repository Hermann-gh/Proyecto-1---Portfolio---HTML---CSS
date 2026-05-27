const input = document.getElementById("buscador");
const botonBuscar = document.getElementById("buscar");
const contenedor = document.querySelector(".contenedor");
const selector = document.getElementById("modo");

const modalColores = document.getElementById("modalPersonalizado");
const btnAplicar = document.getElementById("aplicarColores");
const btnCerrar = document.getElementById("cerrarModal");
const inputHeader = document.getElementById("colorHeader");
const inputMain = document.getElementById("colorMain");
const inputFooter = document.getElementById("colorFooter");

const modalTarjeta = document.getElementById("modalTarjeta");
const abrirTarjeta = document.getElementById("abrirModalTarjeta");
const cerrarTarjeta = document.getElementById("cerrarModalTarjeta");
const crearTarjeta = document.getElementById("crearTarjeta");
const preview = document.createElement("img");
preview.id = "previewImagen";
preview.style.display = "none";
preview.style.maxWidth = "100%";
preview.style.marginTop = "10px";
modalTarjeta.querySelector(".modal-contenido").appendChild(preview);

// Array donde guardamos las obras cargadas desde XML
let obrasData = [];

function cargarDatos() {
    fetch("data/data.xml")
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "text/xml");
            const obras = xml.getElementsByTagName("obra");

            obrasData = [];

            for (let i = 0; i < obras.length; i++) {
                const o = obras[i];
                obrasData.push({
                    id: o.getAttribute("id"),
                    pintor: o.getElementsByTagName("pintor")[0].textContent,
                    nombre: o.getElementsByTagName("nombre")[0].textContent,
                    anio: o.getElementsByTagName("anio")[0].textContent,
                    imagen: o.getElementsByTagName("imagen")[0].textContent
                });
            }

            mostrarDatos(obrasData);
        });
}

function mostrarDatos(obras) {
    contenedor.innerHTML = "";

    if (obras.length === 0) {
        contenedor.innerHTML = `<p>No se encontraron obras</p>`;
        return;
    }

    obras.forEach(o => {
        contenedor.innerHTML += `
        <div class="tarjeta">
            <div class="imagen">
                <img src="${o.imagen}" alt="${o.nombre}">
            </div>
            <div class="pie">
                <h3>${o.pintor}</h3>
                <h4>${o.nombre}</h4>
                <p>${o.anio}</p>
            </div>
        </div>
        `;
    });
}

function filtrar() {
    const texto = input.value.toLowerCase();

    const filtradas = obrasData.filter(o => {
        return o.nombre.toLowerCase().includes(texto) ||
               o.pintor.toLowerCase().includes(texto);
    });

    mostrarDatos(filtradas);
}

botonBuscar.addEventListener("click", filtrar);
input.addEventListener("input", filtrar);

selector.addEventListener("change", () => {
    const modo = selector.value;
    const body = document.body;

    body.classList.remove("nocturno", "personalizado");

    if (modo === "nocturno") {
        body.classList.add("nocturno");
    } 
    else if (modo === "personalizado") {
        body.classList.add("personalizado");
        abrirModalColores();
    } 
    else if (modo === "diurno") {
        document.documentElement.style.removeProperty("--header-color");
        document.documentElement.style.removeProperty("--main-color");
        document.documentElement.style.removeProperty("--footer-color");
    }
});

function abrirModalColores() {
    modalColores.style.display = "flex";
}

btnAplicar.addEventListener("click", () => {
    document.documentElement.style.setProperty("--header-color", inputHeader.value);
    document.documentElement.style.setProperty("--main-color", inputMain.value);
    document.documentElement.style.setProperty("--footer-color", inputFooter.value);

    modalColores.style.display = "none";
});

btnCerrar.addEventListener("click", () => {
    modalColores.style.display = "none";
});

abrirTarjeta.onclick = () => modalTarjeta.style.display = "flex";
cerrarTarjeta.onclick = () => {
    modalTarjeta.style.display = "none";
    limpiarModalTarjeta();
};

// Preview de imagen al seleccionar archivo
document.getElementById("inputImagen").addEventListener("change", function() {
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            preview.src = e.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(this.files[0]);
    } else {
        preview.style.display = "none";
    }
});

function limpiarModalTarjeta() {
    document.getElementById("inputPintor").value = "";
    document.getElementById("inputObra").value = "";
    document.getElementById("inputAño").value = "";
    document.getElementById("inputImagen").value = "";
    preview.style.display = "none";
}

// Crear nueva tarjeta
crearTarjeta.onclick = function () {
    const pintor = document.getElementById("inputPintor").value.trim();
    const obra = document.getElementById("inputObra").value.trim();
    const anio = document.getElementById("inputAño").value.trim();
    const inputImagen = document.getElementById("inputImagen");

    if (!pintor || !obra || !anio || inputImagen.files.length === 0) {
        alert("Rellena todos los campos y selecciona una imagen");
        return;
    }

    const archivo = inputImagen.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const nuevaTarjeta = document.createElement("div");
        nuevaTarjeta.classList.add("tarjeta");

        nuevaTarjeta.innerHTML = `
            <div class="imagen">
                <img src="${e.target.result}" alt="${pintor}">
            </div>
            <div class="pie">
                <h3>${pintor}</h3>
                <h4>${obra}</h4>
                <p>${anio}</p>
            </div>
        `;

        contenedor.appendChild(nuevaTarjeta);

        limpiarModalTarjeta();
        modalTarjeta.style.display = "none";
    };

    reader.readAsDataURL(archivo);
};

document.addEventListener("DOMContentLoaded", cargarDatos);