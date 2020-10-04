
$(document).ready(function(){
    if($( "#listaDeListas" ).val() !== null){
      chrome.storage.sync.get(null, function(items) {
          var allKeys = Object.keys(items);
          for (i = 0; i < allKeys.length; i++) {
              $("#listaDeListas").append('<li><a class="elementoLista" href="#">'+allKeys[i]+'</a></li>');
          }
      });
    }
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
  
  