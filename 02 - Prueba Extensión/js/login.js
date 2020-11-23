$(document).ready(function(){
    EventoRegistrarse();
    EventoRetroceder();
    obtenerSessionId();
});


function obtenerSessionId(){

    getearSessionId().then(id => {
      var SI;
      if(id === undefined){
        SI = 0;
      }
      else{
        SI = id;
      }
      var sessionId = {
        sessionId: SI
      }
  
      var request = $.ajax({
        type: "POST",
        url: "http://localhost:3000/session",
        data: sessionId,
        error: function(xhr, status, error){
          console.log("Error al contactar con el servidor, xhr: " + xhr.status);
        }
      });
      request.done(function(response) {
        if(SI == 0){
          chrome.storage.local.set({'sessionId_NUEVO': response.sessionID});
        }
      });
    });
    
    /*
    fetch('http://localhost:3000/session').then(data => data.text()).then(data =>{
      var i = data;
      chrome.storage.local.get(['sessionId_NUEVO'], function(result){
        if(result.sessionId_NUEVO === undefined){
          chrome.storage.local.set({'sessionId_NUEVO': i}, function() {
            console.log('sessionId_NUEVO: ' + i);
          });
        }      
      });      
    });*/
 
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

function ValidarMail(mailUsuario)
{
  var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if(mailUsuario.match(mailformat)){
    return true;
  }
  else{
    return false;
  }
}

function ValidarContrasena(contraUsuario){
  if(contraUsuario.length >= 5){
    return true;
  }
  else{
    return false;
  }
}

function EventoRegistrarse(){
    $("#registrarse").click(function(){
        var usr = $("#usuario").val();
        var contr = $("#contrasena").val();

        if(usr != null && contr != null && usr != "" && contr != ""){
            if(ValidarMail(usr) == true){
              if(ValidarContrasena(contr) == true){
                getearSessionId().then(id => {
                  var usuarioServidor = {
                      usuario: usr,
                      contrasena: contr,
                      sessionId: id
                    }
                  
                  var request = $.ajax({
                      type: "POST",
                      url: "http://localhost:3000/altaUsuario",
                      data: usuarioServidor,
                      error: function(xhr, status, error){
                        console.log("Error al contactar con el servidor, xhr: " + xhr.status);
                    }
                  });
                  request.done(function(response) {
                    console.log(response);
                    // obtenerSessionIdABM(response.sessionId);
                    if(response.usuarioRegistrado == false){
                      alert("El nombre de usuario ya esta en uso!");
                    }
                    else{
                      alert("Registrado con éxito!");
                      window.close();
                    }
                  });
                });
              }
              else{
                alert("Contraseña debil. Debe contener al menos 5 caracteres.");
              }  
            }
            else{
              alert("E-Mail inválido!");
            }
        }
        else if(usr == null || contr == null || usr == "" || contr == ""){
            alert("Hay campos vacios!");
        }
          
    });
}

function EventoRetroceder(){
    try {
        $("#retroceso").click(function(){
            window.close();
        });
    } catch (err) {
        console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
    }
}


