
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
  


  