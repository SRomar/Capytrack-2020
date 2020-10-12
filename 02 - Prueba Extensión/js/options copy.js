var itemLista;
var itemProducto;
var lista = false;
var producto = false;
var listaSeleccionada;

$(document).ready(function(){

  EventosBotones();
  DesplegarListas();
  EventoListas();
  CrearContextMenu();

});


function EventosBotones(){
  $(document).on('click','#btnSeguimientos', function() {

      
      $("#suscripcionesHTML").hide();
      $("#h2SuscripcionesHTML").hide();
      $("#configuracionContenedor").hide();
      $("#contactoContenedor").hide();
      $('#productosUl > li').remove();


      $("#btnConfiguracion").css("background-color","#C4C4C4");
      $("#btnSuscripciones").css("background-color","#C4C4C4");
      $("#btnContacto").css("background-color","#C4C4C4");
      $("#btnSeguimientos").css("background-color","#858585");


      $("#seguimientosHTML").show();
    });
    
  $(document).on('click','#btnSuscripciones', function() {
      
      $("#seguimientosHTML").hide();
      $("#configuracionContenedor").hide();
      $("#contactoContenedor").hide();
      $('#productosUl > li').remove();


      $("#btnSeguimientos").css("background-color","#C4C4C4")
      $("#btnConfiguracion").css("background-color","#C4C4C4");
      $("#btnContacto").css("background-color","#C4C4C4");
      $("#btnSuscripciones").css("background-color","#858585");

      $("#h2SuscripcionesHTML").show();
      $("#suscripcionesHTML").show();
    
  });

  $(document).on('click','#btnConfiguracion', function() {

    $("#seguimientosHTML").hide();
    $("#suscripcionesHTML").hide();
    $("#h2SuscripcionesHTML").hide();
    $("#contactoContenedor").hide();
    $('#productosUl > li').remove();

    $("#btnSeguimientos").css("background-color","#C4C4C4");
    $("#btnContacto").css("background-color","#C4C4C4");
    $("#btnSuscripciones").css("background-color","#C4C4C4");
    $("#btnConfiguracion").css("background-color","#858585");


    $("#configuracionContenedor").show();

  });
    
  $(document).on('click','#btnContacto', function() {

  $("#seguimientosHTML").hide();
  $("#suscripcionesHTML").hide();
  $("#h2SuscripcionesHTML").hide();
  $("#configuracionContenedor").hide();
  $('#productosUl > li').remove();


  $("#btnSeguimientos").css("background-color","#C4C4C4");
  $("#btnContacto").css("background-color","#858585");
  $("#btnSuscripciones").css("background-color","#C4C4C4");
  $("#btnConfiguracion").css("background-color","#C4C4C4");


  $("#contactoContenedor").show();

});
}

function DesplegarListas(){

  if($( "#listasUl" ).val() !== null){
    chrome.storage.sync.get(null, function(items) {
        var allKeys = Object.keys(items);
        for (i = 0; i < allKeys.length; i++) {

            $("#listasUl").append('<li class="elementoLista" id="'+allKeys[i]+'">'+allKeys[i]+'</li>');  

        }

    });
  } 
}

function EventoListas(){
  chrome.storage.sync.get(null, function(items) {
  document.querySelectorAll('.elementoLista').forEach(item => {

    $(item).on('click', function() {      
      $('#productosUl').empty()
      var nombreLista = $(this).text(); //Obtiene el nombre de li
      listaSeleccionada = nombreLista;
      desplegarProductos(nombreLista);
    });  
  });
  });
}

function desplegarProductos(nombreLista){
  chrome.storage.sync.get(nombreLista, function (lista) { //Obtiene la lista

    $.map(lista, function(productosEnLista, nombreProducto) { //Obtiene los productos en la lista
  
        $.map(productosEnLista, function(producto, llaveProducto) {  //Separa los productos

          $.map(producto, function(datosProducto, categoryID) { //Separa los datos del producto

            $("#productosUl").append('<li class="productoEnLista" id="'+datosProducto[5]+'">'+datosProducto[0]+'</li>'); //De aca se pueden sacar los datos del producto usando el indice
        
            var idProducto = "#"+datosProducto[5];
            EventoProducto(idProducto, datosProducto);
            
        });
      });
    });
  });
}

function EventoProducto(idProducto, datosProducto){
      $(idProducto).on('click', function() {
        $('#contenedorImagen').empty()
        $("#contenedorImagen").append('<img src="'+datosProducto[4]+'" class="imagenProducto" alt="celular"></img>');
        nombre.innerHTML = datosProducto[0];
        estado.innerHTML = datosProducto[2];      
        precio.innerHTML = datosProducto[1];
        urlProducto.innerHTML = '<a href="'+datosProducto[3]+'">ver</a>';
    });
}

function CrearContextMenu(){
  $(document).bind("contextmenu", function(e){
    eventoOcultarMenu();
    comprobacion();
    eventoEliminar();
    eventoCambiarNombreLista();
    return false;
  });
}

function comprobacion(){

  $(".elementoLista").mousedown(function(e){
    if(e.button == 2){
      producto = false;
      lista = true;
      itemLista = $(e.target).text();
      itemSeleccionado.innerHTML = " "+itemLista;
      document.getElementById("cambiarNombreLista").style.display = "inline";
      if(itemLista.toString() == ''){
        lista = false;
      }
      $("#menu").css({'display':'block', 'left':e.pageX, 'top':e.pageY});
    }
  });

  $(".productoEnLista").mousedown(function(e){

    if(e.button == 2){
      lista = false;
      producto = true;
      itemProducto = $(e.target).text();
      itemSeleccionado.innerHTML = " "+itemProducto;
      document.getElementById("cambiarNombreLista").style.display = "none";
      if(itemProducto.toString() == ''){
        producto = false;
      }
      $("#menu").css({'display':'block', 'left':e.pageX, 'top':e.pageY});
    }
  });
}


function eventoCambiarNombreLista(){ 
  $("#cambiarNombreLista").click(function(e){

      var resp = window.prompt("Nuevo nombre:");
      var existe = false;
      
      if(resp != null && resp != ""){

        chrome.storage.sync.get(null, function(items) {
          var allKeys = Object.keys(items);
          for (i = 0; i < allKeys.length; i++) {
              if(resp == allKeys[i]){
                existe = true;
              }
          }
          if(existe == false){
            var productosLista = [];
            var listaNueva = {};

            chrome.storage.sync.get(itemLista, function (lista) { //Obtiene la lista
                
              $.map(lista, function(productosEnLista, itemLista) { //Obtiene los productos en la lista
                
                
                $.map(productosEnLista, function(producto, llaveProducto) {  //Separa a los productos
                  
                  
                  $.map(producto, function(datosProducto, categoryID) { //Separa a los datos del producto
                      productosLista.push(producto);
                  });
                });
              });
              
              listaNueva[resp] = productosLista;        
              chrome.storage.sync.remove(itemLista);
              chrome.storage.sync.set(listaNueva);
              
              
            });
            location.reload();
          }
          else if(existe == true){
            alert("Ya hay una lista con ese nombre!");
          }
        });
      }
      lista = false;
      producto = false;

  });
}


function eventoEliminar(){
  $("#eliminar").click(function(e){
    if(lista == true){
      chrome.storage.sync.remove(itemLista);
      $('#listasUl').empty();
      DesplegarListas();
    }
    else if(producto == true){
      var productosLista = [];
      var listaNueva = {};
      var existe = false;

      chrome.storage.sync.get(listaSeleccionada, function (lista) { //Obtiene la lista
          
        $.map(lista, function(productosEnLista, listaSeleccionada) { //Obtiene los productos en la lista
          
          
          $.map(productosEnLista, function(producto, llaveProducto) {  //Separa a los productos
            
            
            $.map(producto, function(datosProducto, categoryID) { //Separa a los datos del producto
              if(datosProducto[0] !== itemProducto){
                productosLista.push(producto);
              }
              else if(datosProducto[0] == itemProducto){
                existe = true;
              }
            });
          });
        });
        if(existe == true){
          listaNueva[listaSeleccionada] = productosLista;        
          chrome.storage.sync.remove(listaSeleccionada);
          chrome.storage.sync.set(listaNueva);
        }
        
      });
      
    
      setTimeout(function (){
        $('#productosUl').empty();
        desplegarProductos(listaSeleccionada);
      }, 100);
      
    }
    lista = false;
    producto = false;
  });
}

function eventoOcultarMenu(){
  $(window).click(function() {
    lista = false;
    producto = false;
    producto = false;
  $("#menu").hide();
    });
}