$(document).ready(function(){
    EventoRegistrarse();
    EventoRetroceder();
    obtenerSessionId();
});

function obtenerSessionIdABM(id){
  chrome.storage.local.get(['sessionId_NUEVO'], function(result){
    var sessionId_anterior = result.sessionId_NUEVO;
    console.log("sessionId_anterior: " + sessionId_anterior);
    chrome.storage.local.set({'sessionId_NUEVO': id}, function(){
      console.log("sessionId_NUEVO: " + id);
    });
    var sessionIds = {
      idAnterior: sessionId_anterior,
      idNuevo: id
    }

    $.ajax({
      type: "POST",
      url: "http://localhost:3000/updateSessionId",
      data: sessionIds
    });

  });
 

} 

function obtenerSessionId(){
    fetch('http://localhost:3000/session').then(data => data.text()).then(data =>{
      var i = data;
      console.log("i: " + i);
      chrome.storage.local.get(['sessionId_NUEVO'], function(result){
        var sessionId_anterior = "";
        if(result.sessionId_NUEVO !== undefined){
          sessionId_anterior = result.sessionId_NUEVO;
          console.log("sessionId_anterior: " + sessionId_anterior);
        }
        chrome.storage.local.set({'sessionId_NUEVO': i}, function() {
          console.log('sessionId_NUEVO: ' + i);
        });
        var sessionIds = {
          idAnterior: sessionId_anterior,
          idNuevo: i 
        }
  
        $.ajax({
          type: "POST",
          url: "http://localhost:3000/updateSessionId",
          data: sessionIds
        });
      });
       
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
                    obtenerSessionIdABM(response.sessionId);
                    if(response.usuarioRegistrado == "usuario_no_registrado"){
                      alert("El nombre de usuario ya esta en uso!");
                    }
                    else if(response.usuarioRegistrado == "usuario_registrado"){
                      alert("Registrado con éxito!");
                      window.close();
                    }
                    else if(response.usuarioRegistrado == "usuario_inicio_sesion"){
                      alert("Inició sesión con éxito!");
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


