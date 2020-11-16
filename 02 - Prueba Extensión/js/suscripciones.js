$(document).ready(function(){

    EventosBotones();
  
  });


  function EventosBotones(){
    try {
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
    } catch (err) {
      console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
    }
  }
  