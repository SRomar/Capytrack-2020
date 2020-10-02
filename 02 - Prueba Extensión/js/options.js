
$(document).ready(function(){
    if($( "#listaDeListas" ).val() !== null){
      chrome.storage.sync.get(null, function(items) {
          var allKeys = Object.keys(items);
          for (i = 0; i < allKeys.length; i++) {
              $("#listaDeListas").append('<li><a class="elementoLista" href="#">'+allKeys[i]+'</a></li>');  
          }
      });
    }

    document.querySelectorAll('.elementoLista').forEach(item => {
      item.addEventListener('click', event => {
      
        $(function(){
          $('.elementoLista').click(function(){

            var nombreLista = $(this).text(); //Obtiene el nombre de li


            chrome.storage.sync.get(nombreLista, function (lista) { //Obtiene la lista
            
              $.map(lista, function(productosEnLista, nombreLista) { //Obtiene los productos en la lista
             
                  $.map(productosEnLista, function(producto, llaveProducto) {  //Separa a los productos

                    $.map(producto, function(datosProducto, categoryID) { //Separa a los datos del producto

                      $("#productosUl").append('<li><a class="elementoLista" href="#">'+datosProducto[0]+'</a></li>'); //De aca se pueden sacar los datos del producto usando el indice
             
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


  $("#btnSeguimientos").css("background-color","#C4C4C4");
  $("#btnContacto").css("background-color","#858585");
  $("#btnSuscripciones").css("background-color","#C4C4C4");
  $("#btnConfiguracion").css("background-color","#C4C4C4");


  $("#contactoContenedor").show();

});
  


  