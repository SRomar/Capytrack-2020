
$(document).ready(function(){

    EventosBotones();
    EventosOpciones();
  

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

  function EventosOpciones(){
    try {
      $(".opcionConfiguracion").unbind().mousedown(function(e){ //Obenter nombre li
        var nombreOpcion;
        if(e.button == 0){
          nombreOpcion = $(e.target).text();
          console.log(nombreOpcion);
          funcion = nombreOpcion;
        }
        $('#contenidoOpcion').empty();
        nombreOpcion = "#"+nombreOpcion+"Contenido";
        $('#contenidoOpcion').append($(nombreOpcion).html());
        funcion = "Evento" + funcion;
        window[funcion](); //Como no se pueden agregar eventos a elementos ocultos, se los agrega acá
      });
    } catch (err) {
      console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
    }

  }

  function EventoTemas(){ //Cambio de color 
    try {
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
    } catch (err) {
      console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
    }

  }

  function EventoProductos(){
    console.log("EventoProducto");
  }
  
