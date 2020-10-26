
$(document).ready(function(){

    EventosBotones();
    EventoEnviar();
  
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

  function EventoEnviar(){
      $(document).on('click','#botonEnviar', function() {

        var mail = $('#mail').val();
        var mensaje = $('#mensaje').val();

        if(mail === "" || mensaje === ""){
          alert("Complete todos los campos!");
        }
        else{

          var mailOptions = {
            from: 'capytrack@gmail.com',
            to: 'capytrack@gmail.com',
            subject: 'CONTACTO',
            text: 'Mensaje de: '+mail+'\n\nMensaje: '+mensaje
          };

          $.ajax({
            type: "POST",
            url: "http://localhost:3000/reciboMail",
            data: mailOptions
          });
  
        }
      
  
      
      });
  }
  