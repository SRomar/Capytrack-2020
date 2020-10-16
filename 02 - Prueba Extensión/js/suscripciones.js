$(document).ready(function(){

    EventosBotones();
  
  });


  function EventosBotones(){
    $(document).on('click','#btnSeguimientos', function() {
        window.location.replace("options.html");
      });
      
    $(document).on('click','#btnSuscripciones', function() {
        window.location.replace("suscripciones.html");
    });
  
    $(document).on('click','#btnConfiguracion', function() {
      window.location.replace("configuracion.html");
    });
      
    $(document).on('click','#btnContacto', function() {
      window.location.replace("contacto.html");
  });
  }
  