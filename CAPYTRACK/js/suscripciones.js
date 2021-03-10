var suscripcion = 0;
var registrado = false;
$(document).ready(function(){
    siRegistrado();
    EventosBotones();
    EventoBotonesPaquetes();
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
    // $("#btnSuscripciones").mouseleave(function(){
        
    //   $("#btnSuscripciones").css("background", "linear-gradient(360deg, rgb(22, 27, 39) 1%, #2e3542 100%)");
    
    // });
  
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
  $("#btnContacto").mouseleave(function(){
        
    $("#btnContacto").css("background", "linear-gradient(360deg, rgb(22, 27, 39) 1%, #2e3542 100%)");
  
  });
  
  }
  
  

  function EventoBotonesPaquetes(){
    $(document).on('click','#paquete1', function() {
      console.log(registrado);
      if(registrado){
      getearSessionId().then(id => {
        if(id != 0){
      var sessionUsuario = {
        sessionId: id,
        tipoSuscripcion: 1
      }
      var request = $.ajax({
        type: "POST",
        url: "http://localhost:3000/setSuscripcion",
        data: sessionUsuario,
        error: function(xhr, status, error){
          console.log("Error al contactar con el servidor, xhr: " + xhr.status);
        }
        });
        setSuscripcion();
      }
     
    });
  }else{
    alert("Debe registrarse antes de contratar una suscripcion.")
  }
    });

    $(document).on('click','#paquete2', function() {
      if(registrado){

      getearSessionId().then(id => {
        if(id != 0){
      var sessionUsuario = {
        sessionId: id,
        tipoSuscripcion: 2
      }
      var request = $.ajax({
        type: "POST",
        url: "http://localhost:3000/setSuscripcion",
        data: sessionUsuario,
        error: function(xhr, status, error){
          console.log("Error al contactar con el servidor, xhr: " + xhr.status);
        }
        });
        setSuscripcion();
      }
    });
  }else{
    alert("Debe registrarse antes de contratar una suscripcion.")
  }
    });

    $(document).on('click','#paquete3', function() {
      if(registrado){

      getearSessionId().then(id => {
        if(id != 0){
      var sessionUsuario = {
        sessionId: id,
        tipoSuscripcion: 3
      }
      var request = $.ajax({
        type: "POST",
        url: "http://localhost:3000/setSuscripcion",
        data: sessionUsuario,
        error: function(xhr, status, error){
          console.log("Error al contactar con el servidor, xhr: " + xhr.status);
        }
        });
        setSuscripcion();
      }
    });
  }else{
    alert("Debe registrarse antes de contratar una suscripcion.")
  }
    });

  }


  function getSuscripcion(id){
        var sessionUsuario = {
          sessionId: id
        }
        var request = $.ajax({
          type: "POST",
          url: "http://localhost:3000/getSuscripcion",
          data: sessionUsuario,
          error: function(xhr, status, error){
            console.log("Error al contactar con el servidor, xhr: " + xhr.status);
          }
          });
          request.done(function(response) {
            suscripcion = response.suscripcion;
          });
  }


  function setSuscripcion(){
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
            getSuscripcion(id);
          }
        });
      }
    });
  }

  function siRegistrado(){
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
          registrado = response.usuario;
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
  console.log("id: " + id);
  if(id == undefined){
    return 0;
  }
  else{
    return id;
  }
  
}