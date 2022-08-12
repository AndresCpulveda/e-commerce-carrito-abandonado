//Variables
const carrito = document.querySelector('#carrito')
const contenedorCarrito = document.querySelector('#lista-carrito tbody')
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito')
const listaCursos = document.querySelector('#lista-cursos')
let listaSelecciones = []

//Events
function cargarEventListeners() {
    //Cuando agregas un curso clickando el boton de agregar al carrito
    listaCursos.addEventListener('click', agregarCurso)
    contenedorCarrito.addEventListener('click', removerCurso)
    vaciarCarritoBtn.addEventListener('click', ()=> {
        listaSelecciones = [];
        limpiarHtml();
    })
}
document.addEventListener('DOMContentLoaded', iniciarApp)

//Funciones
function iniciarApp() {
    cargarEventListeners();
    getFromStorage();
}

//Obtiene los datos de cursos guardados previamente en el local storage
function getFromStorage() {
    const test = JSON.parse( localStorage.getItem('carrito') ) //Revisa si la key solicitada en el local storage si tiene algun valor I.e. si el local storage esta vacio
    if(test == null) { //Si el ls esta vacio asigan listaSelecciones como array vacio
      return
    }else{ 
      listaSelecciones = JSON.parse( localStorage.getItem('carrito') ) //Si local storage no esta vacio asigna sus valores al array
      carritoHtml(); //LLama la funcion para llenar carrito con valores del ls
    }
}

//Identifica el curso que se ha seleccionado
function agregarCurso(e){
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        let seleccion = e.target.parentElement.parentElement;
        leerInfoCurso(seleccion);
    }
}
//Obtiene y guarda los datos del curso seleccionadoo
function leerInfoCurso(seleccion) {
    let curso = {
        titulo: seleccion.querySelector('h4').innerText,
        precio: seleccion.querySelector('p span').innerText,
        imagen: seleccion.querySelector('img').src,
        id: seleccion.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    };
    modificarLista(curso);
}
//Modifica la lista del carrito segun la seleccion
function modificarLista(curso) {
    //Comprobar si curso seleccionado ya existe
    const existe = listaSelecciones.some(seleccion => seleccion.id == curso.id)
    //Asigna valor de cantidad al curso seleccionado y modifica la lista
    if(existe){
        const newList = listaSelecciones.map(seleccion => {
            if(seleccion.id == curso.id){
                seleccion.cantidad ++;
                return seleccion
            }else{
                return seleccion;
            }
        })
        listaSelecciones = [...newList]
    }else{
        listaSelecciones = [...listaSelecciones, curso]
    }
    localStorage.setItem('carrito', JSON.stringify(listaSelecciones));
    carritoHtml();
}
//Muestra los datos de la lista de selecciones en el carrito 
function carritoHtml() {
    //Limpia el HTML
    limpiarHtml();
    //Crea un elemento html para cada curso con incluyendo sus datos
    if(listaSelecciones) {
      listaSelecciones.forEach( curso => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td><img src='${curso.imagen}' width='100' </td>
              <td>${curso.titulo}</td>
              <td>${curso.precio}</td>
              <td>${curso.cantidad}</td>
              <td> <a href='#' class='borrar-curso' data-id='${curso.id}'>X</a> </td>
          `;
          //Agregar el HTML en el tbody del carrito
          contenedorCarrito.appendChild(row);
      })
    }
}
//Elimina un curso del carrito 
function removerCurso(e) {
    if(e.target.classList.contains('borrar-curso')){
        const cursoABorrar = e.target.getAttribute('data-id');
        //Identifica el curso a borrar en la lista y le resta la cantidad si esta es mas de 1 y lo elimina por completo si esta es 1
        const filteredList = listaSelecciones.filter(curso => {
            if(curso.id === cursoABorrar && curso.cantidad > 1){
                curso.cantidad --;
                return true;
            }else if(curso.id === cursoABorrar && curso.cantidad == 1){
                return false;
            }else{
                return true;
            }
        })
        listaSelecciones = [...filteredList]
        localStorage.setItem('carrito', JSON.stringify(listaSelecciones));
        carritoHtml();
    }
}
//Elimina los cursos del tbody
function limpiarHtml(){
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}
