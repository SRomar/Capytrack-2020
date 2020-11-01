
$(document).ready(function(){

    EventosBotones();
    EventosOpciones();
  

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

  function EventosOpciones(){
    
    
    $(".opcionConfiguracion").unbind().mousedown(function(e){ //Obenter nombre li
      var nombreOpcion;
      if(e.button == 0){
        nombreOpcion = $(e.target).text();
        funcion = nombreOpcion;
      }
      $('#contenidoOpcion').empty();
      nombreOpcion = "#"+nombreOpcion+"Contenido";
      $('#contenidoOpcion').append($(nombreOpcion).html());

      funcion = "Evento" + funcion;
      window[funcion](); //Se agrega la funcion del li
    });

  }

  function EventoTemas(){
    document.getElementById("fondoPagInput").addEventListener("change", function() {
      console.log($(this).val());
      document.documentElement.style.setProperty('--fondoPag', $(this).val());
    });
    document.getElementById("bordesInput").addEventListener("change", function() {
      console.log($(this).val());
      document.documentElement.style.setProperty('--borde', $(this).val());
    });
    document.getElementById("contenedorInput").addEventListener("change", function() {
      console.log($(this).val());
      document.documentElement.style.setProperty('--contenedor', $(this).val());
    });
    document.getElementById("lineasInput").addEventListener("change", function() {
      console.log($(this).val());
      document.documentElement.style.setProperty('--lineas', $(this).val());
    });
    document.getElementById("textoInput").addEventListener("change", function() {
      console.log($(this).val());
      document.documentElement.style.setProperty('--texto', $(this).val());
    });

  }
  
