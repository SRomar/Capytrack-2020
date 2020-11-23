$(document).ready(function(){

    EventosBotones();
    EventoEnviar();
    mostrarUsuario();

  });

  function mostrarUsuario(){
    getearSessionId().then(id => {
      if(id != 0){
        var sessionIdServidor = {
          sessionId: id
        }
        var request = $.ajax({
          type: "POST",
          url: "http://localhost:3000/usuarioRegistrado",
          data: sessionIdServidor,
          error: function(xhr, status, error){
            console.log("Error al contactar con el servidor, xhr: " + xhr.status);
          }
        });
        request.done(function(response) {
          
          if(response.usuario == true){    
            nombreUsuario.innerHTML = response.mail;     
          }
          else{
            nombreUsuario.innerHTML = 'Usuario no registrado';
          }
        });
      }
    });
  }



  
async function getearSessionId(){
  var p = new Promise(function(resolve, reject){
    chrome.storage.local.get(['sessionId_NUEVO'], function(result){
      var id = result.sessionId_NUEVO;
      resolve(id); 
    });
  });
  const id = await(p);
  return id;
}
  function EventosBotones(){
    $(document).on('click','#btnSeguimientos', function() {
        window.location.replace("options.html");
      });
      $("#btnSeguimientos").mouseover(function(){
  
        $("#btnSeguimientos").css("background", "linear-gradient(360deg, rgb(22, 27, 39) 1%, #4e5155 100%)");
      
      });
      $("#btnSeguimientos").mouseleave(function(){
        
        $("#btnSeguimientos").css("background", "linear-gradient(360deg, rgb(22, 27, 39) 1%, #2e3542 100%)");
      
      });
      
    $(document).on('click','#btnSuscripciones', function() {
        window.location.replace("suscripciones.html");
    });
  
    $("#btnSuscripciones").mouseover(function(){
  
      $("#btnSuscripciones").css("background", "linear-gradient(360deg, rgb(22, 27, 39) 1%, #4e5155 100%)");
    
    });
    $("#btnSuscripciones").mouseleave(function(){
        
      $("#btnSuscripciones").css("background", "linear-gradient(360deg, rgb(22, 27, 39) 1%, #2e3542 100%)");
    
    });
  
    $(document).on('click','#btnConfiguracion', function() {
      window.location.replace("configuracion.html");
    });
      
    $("#btnConfiguracion").mouseover(function(){
  
      $("#btnConfiguracion").css("background", "linear-gradient(360deg, rgb(22, 27, 39) 1%, #4e5155 100%)");
    
    });
    $("#btnConfiguracion").mouseleave(function(){
        
      $("#btnConfiguracion").css("background", "linear-gradient(360deg, rgb(22, 27, 39) 1%, #2e3542 100%)");
    
    });
  
    $(document).on('click','#btnContacto', function() {
      window.location.replace("contacto.html");
  });
  
  $("#btnContacto").mouseover(function(){
  
    $("#btnContacto").css("background", "linear-gradient(360deg, rgb(22, 27, 39) 1%, #4e5155 100%)");
  
  });
  // $("#btnContacto").mouseleave(function(){
        
  //   $("#btnContacto").css("background", "linear-gradient(360deg, rgb(22, 27, 39) 1%, #2e3542 100%)");
  
  // });
  
  }
  

  function EventoEnviar(){
      try {
        $(document).on('click','#botonEnviar', function() {
  
          var mail = $('#mail').val();
          var mensaje = $('#mensaje').val();
          console.log(typeof mensaje);
          if(mail === "" || mensaje === ""){
            alert("Complete todos los campos!");
          }
          else if(ValidarMail(mail)){
  
            var mailOptions = {
              from: 'capytrack@gmail.com',
              to: 'capytrack@gmail.com',
              subject: 'CONTACTO',
              text: 'Mensaje de: '+mail+'\n\nMensaje: '+mensaje,
              // text: 'Mensaje de: '+"""+'\n\nMensaje: '+mensaje
            };
            //   $.ajax({
            //   type: "POST",
            //   url: "http://localhost:3000/reciboMail",
            //   data: mailOptions,
            //   error: function(xhr, status, error){
            //       console.log("Error al contactar con el servidor, xhr: " + xhr.status);
            //   }
            // });
           }
          });
      } catch (err) {
        console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
      }
  }
  
  function ValidarMail(email){
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if(re.test(String(email).toLowerCase()))
  {
  return true;
  }
  else
  {
  alert("E-Mail invalido!");
  return false;
  }
}
