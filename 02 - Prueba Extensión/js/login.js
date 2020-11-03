$(document).ready(function(){
    ocultarLabelProblema();
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

function ocultarLabelProblema(){
    $("#problema").hide();
}

function EventoRegistrarse(){
    $("#registrarse").click(function(){
        var usuario = $("#usuario").val();
        var contrasena = $("#contrasena").val();

        console.log("usuario: " + usuario);
        console.log("contraseña: " + contrasena);

        if(usuario != null && contrasena != null && usuario != "" && contrasena != ""){
            getearSessionId().then(id => {
              var usuarioServidor = {
                  usuario: usuario,
                  contrasena: contrasena,
                  sessionId: id
                }
              
              var request = $.ajax({
                  type: "POST",
                  url: "http://localhost:3000/altaUsuario",
                  data: usuarioServidor
              });
              request.done(function(response) {
                console.log(response);
                obtenerSessionIdABM(response.sessionId);
                if(response.usuarioRegistrado == false){
                  $("#problema").text("El nombre de usuario ya esta en uso");
                  $("#problema").show();
                }
                else{
                  alert("Registrado con éxito!");
                  window.close();
                }
              });
            });
           
        }
        else if(usuario == null || contrasena == null || usuario == "" || contrasena == ""){
            $("#problema").text("Hay campos vacios");
            $("#problema").show();
        }
          
    });
}

function EventoRetroceder(){
    $("#retroceso").click(function(){
        window.close();
    });
}


