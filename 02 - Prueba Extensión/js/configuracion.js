var suscripcion = 0;

$(document).ready(function(){
    setSuscripcion();
  
    EventosBotones();
    EventosOpciones();
    ConfiguracionInformacionProducto();
    
  });

  function redireccionar(suscripcion){
    if(suscripcion<2){
      alert("Necesitas tener una suscripción VIP o KING CAPY para acceder a esta pestaña.")
      window.location.replace("suscripciones.html");
    }
  }

  function ConfiguracionInformacionProducto(){
    chrome.storage.local.get(['ConfiguracionInformacionProducto'], function(result) {
    if(typeof result.ConfiguracionInformacionProducto == "undefined" || typeof result.ConfiguracionInformacionProducto == null){
      CrearConfiguracionInformacionProductoPorDefecto();
      ConfiguracionInformacionProducto();
    } else{
      AplicarConfiguracionInformacionProducto(result);
    }
    });
  }
  function CrearConfiguracionInformacionProductoPorDefecto(){
    var value = [true, true, true, true, true, false, false, false, false, false, false];
    chrome.storage.local.set({'ConfiguracionInformacionProducto': value}, function() {    
    });
  }

  function AplicarConfiguracionInformacionProducto(result){

      for(i=0; i<Object.keys(result.ConfiguracionInformacionProducto).length; i++){
        if(!result.ConfiguracionInformacionProducto[i]){
          var boton = '#inp' + i;
          $(boton).removeAttr('Checked'); 
        }
      }
  }

function EventoBotonesConfiguracionInformacionProducto(){
      $('.toggle-control :checkbox').each(function(idx, checkBox) {
      checkBox.addEventListener('click', event => {
      
      chrome.storage.local.get(['ConfiguracionInformacionProducto'], function(result) {
        var nuevaConfig = [];
        for(i=0; i<Object.keys(result.ConfiguracionInformacionProducto).length; i++){
          nuevaConfig.push(result.ConfiguracionInformacionProducto[i]);
        }
                    var indiceCheckbox = checkBox.id.substring(3);
        console.log(indiceCheckbox);

        if(nuevaConfig[indiceCheckbox]){
          nuevaConfig[indiceCheckbox]=false;
        }else{
          nuevaConfig[indiceCheckbox]=true;
        }
        chrome.storage.local.set({'ConfiguracionInformacionProducto': nuevaConfig}, function() {    
        });
      });
    });
  });
}


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
    EventoBotonesConfiguracionInformacionProducto();
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
        redireccionar(suscripcion);
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
  
    