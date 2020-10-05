var itemLista;
var itemProducto;
var lista = false;
var producto = false;
var listaSeleccionada;

$(document).ready(function(){
    if($( "#listaDeListas" ).val() !== null){
      chrome.storage.sync.get(null, function(items) {
          var allKeys = Object.keys(items);
          for (i = 0; i < allKeys.length; i++) {

              //$("#listaDeListas").append('<li><a class="elementoLista" href="#">'+allKeys[i]+'</a></li>');  
              $("#listaDeListas").append('<li class="elementoLista">'+allKeys[i]+'</li>');  

          }
      });
    }
    document.querySelectorAll('.elementoLista').forEach(item => {
      item.addEventListener('click', event => {
        

        $(function(){
          $('.elementoLista').click(function(){
           $('#productosUl').empty()
            var nombreLista = $(this).text(); //Obtiene el nombre de li

            chrome.storage.sync.get(nombreLista, function (lista) { //Obtiene la lista
            
              $.map(lista, function(productosEnLista, nombreProducto) { //Obtiene los productos en la lista
             
                  $.map(productosEnLista, function(producto, llaveProducto) {  //Separa los productos
  
                    $.map(producto, function(datosProducto, categoryID) { //Separa los datos del producto
  
                      $("#productosUl").append('<li class="productoEnLista">'+datosProducto[0]+'</li>'); //De aca se pueden sacar los datos del producto usando el indice
                      
                      $('.productoEnLista').click(function(){
                        
                        
                        $("#contenedorImagen").append('<img src="'+datosProducto[4]+'" class="imagenProducto" alt="celular"></img>');
                        nombre.innerHTML = datosProducto[0];
                        estado.innerHTML = datosProducto[2];      
                        precio.innerHTML = datosProducto[1];
                        urlProducto.innerHTML = '<a href="'+datosProducto[3]+'">ver</a>';

                      });




                    });
                  });
              });
  
  
            });
          });
        });
      });
    });

    
    $("#menu").hide();

    $(document).bind("contextmenu", function(e){
      comprobacion();
      return false;
    });
    
    function comprobacion(){
      $("#listaDeListas li a").mousedown(function(e){
        if(e.button == 2){
          lista = true;
          itemLista = e.target.text;
          $("#menu").css({'display':'block', 'left':e.pageX, 'top':e.pageY});
        }
      });
      $("#productosUl li a").mousedown(function(e){
        if(e.button == 2){
          producto = true;
          itemProducto = e.target.text;
          $("#menu").css({'display':'block', 'left':e.pageX, 'top':e.pageY});
        }
      });
    }
    
    

    $("#eliminar").click(function(e){
      if(lista == true){
        chrome.storage.sync.remove(itemLista);
      }
      else if(producto == true){
        var productosLista = [];
        var listaNueva = {};

        chrome.storage.sync.get(listaSeleccionada, function (lista) { //Obtiene la lista
            
          $.map(lista, function(productosEnLista, listaSeleccionada) { //Obtiene los productos en la lista
            
            
            $.map(productosEnLista, function(producto, llaveProducto) {  //Separa a los productos
              
              
              $.map(producto, function(datosProducto, categoryID) { //Separa a los datos del producto
                if(datosProducto[0] !== itemProducto){
                  productosLista.push(producto);
                }
              });
            });
          });
          listaNueva[listaSeleccionada] = productosLista;        
          chrome.storage.sync.remove(listaSeleccionada);
          chrome.storage.sync.set(listaNueva);
        });
      }
      $("#menu").hide();
      location.reload();
      lista = false;
      producto = false;
    });



    
    $("#menu").mouseleave(function(){
        lista = false;
        producto = false;
        $("#menu").hide();
    })


  });


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
  


  