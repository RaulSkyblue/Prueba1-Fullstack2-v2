// ==========================
// CARRITO DE COMPRAS
// ==========================

let carrito = []; // Carrito vacío

// Agregar producto al carrito
function agregarAlCarrito(nombre, precio) {
  const index = carrito.findIndex(item => item.nombre === nombre);
  if (index !== -1) {
    carrito[index].cantidad++; // Si ya existe, aumentamos cantidad
  } else {
    carrito.push({ nombre, precio, cantidad: 1 }); // Nuevo producto
  }
  guardarYRenderizar();
}

// Mostrar el carrito en consola
function renderCarrito() {
  if (carrito.length === 0) {
    console.log("El carrito está vacío.");
    return;
  }
  let total = 0;
  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    console.log(`${item.nombre} x${item.cantidad} - Subtotal: $${subtotal}`);
  });
  console.log(`TOTAL: $${total}`);
}

// Cambiar cantidad de producto
function cambiarCantidad(index, nuevaCantidad) {
  nuevaCantidad = parseInt(nuevaCantidad);
  if (isNaN(nuevaCantidad) || nuevaCantidad < 1) return;
  carrito[index].cantidad = nuevaCantidad;
  guardarYRenderizar();
}

// Eliminar producto
function eliminarProducto(index) {
  carrito.splice(index, 1);
  guardarYRenderizar();
}

// Vaciar carrito
function vaciarCarrito() {
  carrito = [];
  guardarYRenderizar();
}

// Procesar compra
function procesarCompra() {
  if (carrito.length === 0) {
    mostrarMensaje('El carrito está vacío', 'error');
    return;
  }
  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  console.log(`Compra procesada. Total: $${total}`);
  carrito = [];
  guardarYRenderizar();
  mostrarMensaje('¡Gracias por tu compra!', 'success');
}

// Guardar y renderizar
function guardarYRenderizar() {
  renderCarrito();
}

// Mostrar mensajes
function mostrarMensaje(texto, tipo = 'success') {
  if (tipo === 'error') {
    console.error(texto);//sirve para mostrar mensajes resultantes en la consola por si acaso lo anoto 
  } else {
    console.log(texto);
  }
}

// ==========================
// FILTRO DE PRODUCTOS
// ==========================

function initFiltro() {
  const filtro = document.getElementById("filtro-tipo"); // document sirve para manipular la página web en tiempo real
  const productos = document.querySelectorAll(".producto"); // document Todos los productos
// profe soy el cris por si pregummta document es un objeto global que crea automáticamente cuando carga una página web en este caso
//lo estoy utilisando para que filtre a tiempo reeal el html parte 2 catalogo lo conversamos en la sala asi que  hoy lo dejo explicado
  filtro.addEventListener("change", () => {
    const valor = filtro.value; // Valor elegido
// aqui ya solo dejo los filtrfo por if para mostrar y filtrar las tortas 
    productos.forEach(producto => {
      const tipo = producto.getAttribute("data-tipo");
      if (valor === "todos" || valor === tipo) {
        producto.style.display = "block"; // Mostrar
      } else {
        producto.style.display = "none"; // Ocultar
      }
    });
  });
}

// ==========================
// INICIALIZACIÓN DIRECTA
// ==========================

// Arranca el sistema
console.log("Sistema listo.");
renderCarrito();   // Muestra el carrito vacío al inicio
initFiltro();      // Activa el filtro de productos
