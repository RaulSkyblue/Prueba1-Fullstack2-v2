// ====================================
// PASTELERÍA MIL SABORES - JAVASCRIPT
// ====================================

// Variables globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let totalCarrito = 0;

// ====================================
// FUNCIONES DEL CARRITO DE COMPRAS
// ====================================

// Agregar producto al carrito
function agregarAlCarrito(nombre, precio, tamaño, mensaje) {
  const producto = {
    id: Date.now(),
    nombre: nombre,
    precio: precio,
    tamaño: tamaño || 'Mediana',
    mensaje: mensaje || '',
    cantidad: 1
  };
  
  carrito.push(producto);
  actualizarCarrito();
  mostrarMensaje(`${nombre} agregado al carrito`, 'success');
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Actualizar carrito en la página
function actualizarCarrito() {
  const carritoBody = document.getElementById('carrito-body');
  const totalElement = document.getElementById('total');
  
  if (!carritoBody) return;
  
  carritoBody.innerHTML = '';
  totalCarrito = 0;
  
  carrito.forEach(item => {
    totalCarrito += item.precio * item.cantidad;
    
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>
        <strong>${item.nombre}</strong><br>
        <small>Tamaño: ${item.tamaño}</small>
        ${item.mensaje ? `<br><small>Mensaje: ${item.mensaje}</small>` : ''}
      </td>
      <td>$${item.precio.toLocaleString()}</td>
      <td>
        <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
        ${item.cantidad}
        <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
      </td>
      <td>$${(item.precio * item.cantidad).toLocaleString()}</td>
      <td>
        <button onclick="eliminarDelCarrito(${item.id})" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 5px;">
          Eliminar
        </button>
      </td>
    `;
    carritoBody.appendChild(fila);
  });
  
  if (totalElement) {
    totalElement.textContent = `Total: $${totalCarrito.toLocaleString()}`;
  }
}

// Cambiar cantidad de producto
function cambiarCantidad(id, cambio) {
  const item = carrito.find(producto => producto.id === id);
  if (item) {
    item.cantidad += cambio;
    if (item.cantidad <= 0) {
      eliminarDelCarrito(id);
    } else {
      actualizarCarrito();
      localStorage.setItem('carrito', JSON.stringify(carrito));
    }
  }
}

// Eliminar producto del carrito
function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  actualizarCarrito();
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarMensaje('Producto eliminado del carrito', 'warning');
}

// Vaciar carrito completo
function vaciarCarrito() {
  if (carrito.length === 0) {
    mostrarMensaje('El carrito ya está vacío', 'warning');
    return;
  }
  
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    carrito = [];
    actualizarCarrito();
    localStorage.removeItem('carrito');
    mostrarMensaje('Carrito vaciado exitosamente', 'success');
  }
}

// Procesar compra
function procesarCompra() {
  if (carrito.length === 0) {
    mostrarMensaje('Tu carrito está vacío', 'warning');
    return;
  }
  
  // Actualizar total en modal
  const totalModal = document.getElementById('total-modal');
  if (totalModal) {
    totalModal.textContent = `$${totalCarrito.toLocaleString()}`;
  }
  
  // Mostrar modal
  const modal = document.getElementById('modal-compra');
  if (modal) {
    modal.classList.add('show');
  }
  
  // Vaciar carrito después de la compra
  carrito = [];
  localStorage.removeItem('carrito');
  actualizarCarrito();
}

// ====================================
// FUNCIONES DE FORMULARIOS
// ====================================

// Validar formulario de registro
function validarRegistro(event) {
  event.preventDefault();
  
  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const fechaNacimiento = document.getElementById('fecha-nacimiento').value;
  
  // Validaciones
  if (!nombre || nombre.length < 2) {
    mostrarMensaje('El nombre debe tener al menos 2 caracteres', 'error');
    return;
  }
  
  if (!email || !email.includes('@') || !email.includes('.')) {
    mostrarMensaje('Ingresa un email válido', 'error');
    return;
  }
  
  if (!password || password.length < 6) {
    mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error');
    return;
  }
  
  if (password !== confirmPassword) {
    mostrarMensaje('Las contraseñas no coinciden', 'error');
    return;
  }
  
  if (!fechaNacimiento) {
    mostrarMensaje('La fecha de nacimiento es obligatoria', 'error');
    return;
  }
  
  // Registro exitoso
  localStorage.setItem('usuario', JSON.stringify({
    nombre: nombre,
    email: email,
    fechaNacimiento: fechaNacimiento
  }));
  
  mostrarMensaje('¡Cuenta creada exitosamente!', 'success');
  document.getElementById('registro-form').reset();
}

// Validar formulario de perfil
function validarPerfil(event) {
  event.preventDefault();
  
  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  
  if (!nombre || nombre.length < 2) {
    mostrarMensaje('El nombre debe tener al menos 2 caracteres', 'error');
    return;
  }
  
  if (!email || !email.includes('@') || !email.includes('.')) {
    mostrarMensaje('Ingresa un email válido', 'error');
    return;
  }
  
  mostrarMensaje('Perfil actualizado exitosamente', 'success');
}

// ====================================
// FUNCIONES DE PEDIDOS Y ENVÍOS
// ====================================

let estadosPedido = ['Pedido Confirmado', 'En Preparación', 'En Camino', 'Entregado'];
let estadoActual = 0;

function actualizarEstado() {
  if (estadoActual < estadosPedido.length - 1) {
    estadoActual++;
    
    const statusElements = document.querySelectorAll('#estadoPedido p');
    statusElements.forEach((element, index) => {
      element.classList.remove('active');
      if (index <= estadoActual) {
        element.classList.add('active');
      }
    });
    
    mostrarMensaje(`Estado actualizado: ${estadosPedido[estadoActual]}`, 'success');
  } else {
    mostrarMensaje('Tu pedido ya ha sido entregado', 'success');
  }
}

let ubicaciones = ['Centro de distribución', 'En ruta', 'Cerca de tu ubicación', 'Entregado'];
let ubicacionActual = 0;

function simularEnvio() {
  if (ubicacionActual < ubicaciones.length - 1) {
    ubicacionActual++;
    
    const estadoEnvio = document.getElementById('estadoEnvio');
    const ubicacionElement = document.getElementById('ubicacionActual');
    
    if (estadoEnvio) {
      estadoEnvio.textContent = ubicaciones[ubicacionActual];
    }
    
    if (ubicacionElement) {
      ubicacionElement.textContent = 'Santiago, Chile';
    }
    
    mostrarMensaje(`Envío actualizado: ${ubicaciones[ubicacionActual]}`, 'success');
  } else {
    mostrarMensaje('Tu pedido ya ha sido entregado', 'success');
  }
}

function guardarFecha() {
  const fechaEntrega = document.getElementById('fechaEntrega').value;
  const fechaConfirmada = document.getElementById('fechaConfirmada');
  
  if (!fechaEntrega) {
    mostrarMensaje('Selecciona una fecha de entrega', 'warning');
    return;
  }
  
  const fecha = new Date(fechaEntrega);
  const fechaFormateada = fecha.toLocaleDateString('es-CL');
  
  if (fechaConfirmada) {
    fechaConfirmada.textContent = `Fecha de entrega confirmada: ${fechaFormateada}`;
    fechaConfirmada.style.color = '#8B4513';
    fechaConfirmada.style.fontWeight = 'bold';
  }
  
  mostrarMensaje('Fecha de entrega guardada exitosamente', 'success');
}

// ====================================
// FUNCIONES DE CATÁLOGO
// ====================================

// Filtrar productos por tipo
function filtrarProductos() {
  const filtro = document.getElementById('filtro-tipo').value;
  const productos = document.querySelectorAll('.producto');
  
  productos.forEach(producto => {
    const tipo = producto.dataset.tipo;
    
    if (filtro === 'todos' || tipo === filtro) {
      producto.style.display = 'flex';
    } else {
      producto.style.display = 'none';
    }
  });
}

// ====================================
// FUNCIONES AUXILIARES
// ====================================

// Mostrar mensajes flotantes
function mostrarMensaje(mensaje, tipo = 'success') {
  const mensajeElement = document.getElementById('mensaje-flotante') || crearElementoMensaje();
  
  mensajeElement.textContent = mensaje;
  mensajeElement.className = `show ${tipo}`;
  
  // Colores según tipo
  switch(tipo) {
    case 'success':
      mensajeElement.style.backgroundColor = '#4CAF50';
      break;
    case 'error':
      mensajeElement.style.backgroundColor = '#f44336';
      break;
    case 'warning':
      mensajeElement.style.backgroundColor = '#ff9800';
      break;
  }
  
  // Ocultar después de 3 segundos
  setTimeout(() => {
    mensajeElement.classList.remove('show');
  }, 3000);
}

// Crear elemento de mensaje si no existe
function crearElementoMensaje() {
  const elemento = document.createElement('div');
  elemento.id = 'mensaje-flotante';
  documento.body.appendChild(elemento);
  return elemento;
}

// Cerrar modal
function cerrarModal() {
  const modal = document.getElementById('modal-compra');
  if (modal) {
    modal.classList.remove('show');
  }
}

// ====================================
// INICIALIZACIÓN
// ====================================

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar carrito
  actualizarCarrito();
  
  // Event listeners para formularios
  const registroForm = document.getElementById('registro-form');
  if (registroForm) {
    registroForm.addEventListener('submit', validarRegistro);
  }
  
  const perfilForm = document.getElementById('perfil-form');
  if (perfilForm) {
    perfilForm.addEventListener('submit', validarPerfil);
  }
  
  // Event listeners para filtros
  const filtroTipo = document.getElementById('filtro-tipo');
  if (filtroTipo) {
    filtroTipo.addEventListener('change', filtrarProductos);
  }
  
  // Event listeners para botones de agregar al carrito
  const botonesAgregar = document.querySelectorAll('.btn-agregar');
  botonesAgregar.forEach(boton => {
    boton.addEventListener('click', function(event) {
      const producto = event.target.closest('.producto');
      const nombre = producto.querySelector('h3').textContent;
      const tamaño = producto.querySelector('select').value;
      const mensaje = producto.querySelector('input[type="text"]').value;
      
      // Precios según el tamaño
      let precio = 25000; // Precio base mediano
      if (tamaño === 'Pequeña') precio = 18000;
      if (tamaño === 'Grande') precio = 35000;
      
      agregarAlCarrito(nombre, precio, tamaño, mensaje);
    });
  });
  
  // Cerrar modal al hacer clic fuera
  const modal = document.getElementById('modal-compra');
  if (modal) {
    modal.addEventListener('click', function(event) {
      if (event.target === modal) {
        cerrarModal();
      }
    });
  }
});