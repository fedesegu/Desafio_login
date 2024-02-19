const socket = io();

socket.on('productosActualizados', (productos) => {
    const listaDeProductos = document.getElementById('listaDeProductos');
    listaDeProductos.innerHTML = ''; 
    console.log(productos);
    productos.forEach((producto) => {
        const li = document.createElement('li');
        li.textContent = `
        TITLE: ${producto.title}
        DESCRIPTION: ${producto.description}
        PRICE: $${producto.price}
        STOCK: ${producto.stock}
        CODE: ${producto.code}
        CATEGORY: ${producto.category};`       
        listaDeProductos.appendChild(li);
    });
});

const formAgregar = document.getElementById('formAgregar');
const formEliminar = document.getElementById('formEliminar');

formAgregar.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(formAgregar);
    const nuevoProducto = {};
    formData.forEach((value, key) => {
        nuevoProducto[key] = value;
    });
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Product added',
        showConfirmButton: false,
        timer: 2000
    })
    socket.emit('agregado', nuevoProducto);
    formAgregar.reset();
};

formEliminar.onsubmit = (e) => {
    e.preventDefault();

    Swal.fire({
        title: 'Are you sure?',
        icon: 'Warning!',
        showCancelButton: true,
        confirmButtonColor: '#5d6',
        cancelButtonColor: '#000',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            const id = document.getElementById('id').value;
            socket.emit('eliminar', +id);
            formEliminar.reset();
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            );
        }
    });
};