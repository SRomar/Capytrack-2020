
$(document).ready(function(){

    EventosBotones();
    EventoEnviar();
  
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

  function EventoEnviar(){
      try {
        $(document).on('click','#botonEnviar', function() {
  
          var mail = $('#mail').val();
          var mensaje = $('#mensaje').val();
  
          if(mail === "" || mensaje === ""){
            alert("Complete todos los campos!");
          }
          else if(ValidarMail(mail)){
  
            var mailOptions = {
              from: 'capytrack@gmail.com',
              to: 'capytrack@gmail.com',
              subject: 'CONTACTO',
              text: 'Mensaje de: '+mail+'\n\nMensaje: '+mensaje
            };
  
            $.ajax({
              type: "POST",
              url: "http://localhost:3000/reciboMail",
              data: mailOptions,
              error: function(xhr, status, error){
                  console.log("Error al contactar con el servidor, xhr: " + xhr.status);
              }
            });
           }
          });
      } catch (err) {
        console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
      }
  }
  
  function ValidarMail(inputText)
{
  var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if(inputText.value.match(mailformat))
  {
  document.form1.text1.focus();
  return true;
  }
  else
  {
  alert("E-Mail invalido!");
  document.form1.text1.focus();
  return false;
  }
}