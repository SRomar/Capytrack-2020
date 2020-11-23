var listaSeleccionada;
var animacion1Ejecutada = false;
var animacion2Ejecutada = false; 
var elementoAnterior = "";
var productoAnterior = "";
var suscripcion = 0;


$(document).ready(function(){

  setSuscripcion();
  EventosBotones();
  DesplegarListas();
  EventoListas();
  CrearContextMenu();
  EventoIluminar();
  obtenerSessionId();

  mostrarUsuario();
  mensajeNoExistenListas();
});


function mensajeNoHayProductosEnLista(){
  var a = 0;
  chrome.storage.sync.get(listaSeleccionada, function (lista) { //Obtiene la lista
  
    $.map(lista, function(productosEnLista, nombreProducto) { //Obtiene los productos en la lista
  
      if(productosEnLista.length == 0){
        alert("no se agregaron productos");
        a = 1;
      }       
    });

    if(a == 1){
      return true;
    }
    else{
      return false;
    }
  });

}

function mensajeNoExistenListas(){
  chrome.storage.sync.get(null, function(items) {
    var allKeys = Object.keys(items);
    if(allKeys.length == 0){
      alert("no hay listas");
    }
  });
}



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



// function obtenerSessionIdABM(id){
//   chrome.storage.local.get(['sessionId_NUEVO'], function(result){
//     var sessionId_anterior = result.sessionId_NUEVO;
//     console.log("sessionId_anterior: " + sessionId_anterior);
//     chrome.storage.local.set({'sessionId_NUEVO': id}, function(){
//       console.log("sessionId_NUEVO: " + id);
//     });
//     var sessionIds = {
//       idAnterior: sessionId_anterior,
//       idNuevo: id
//     }

//     $.ajax({
//       type: "POST",
//       url: "http://localhost:3000/updateSessionId",
//       data: sessionIds
//     });

//   });
 

// } 

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
  }

function EventosBotones(){
  $(document).on('click','#btnSeguimientos', function() {
      window.location.replace("options.html");
    });
    $("#btnSeguimientos").mouseover(function(){

      $("#btnSeguimientos").css("background", "linear-gradient(360deg, rgb(22, 27, 39) 1%, #4e5155 100%)");
    
    });
    // $("#btnSeguimientos").mouseleave(function(){
      
    //   $("#btnSeguimientos").css("background", "linear-gradient(360deg, rgb(22, 27, 39) 1%, #2e3542 100%)");
    
    // });
    
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
$("#btnContacto").mouseleave(function(){
      
  $("#btnContacto").css("background", "linear-gradient(360deg, rgb(22, 27, 39) 1%, #2e3542 100%)");

});

}

function DesplegarListas(){
  if($( "#listasUl" ).val() !== null){

    try{
      chrome.storage.sync.get(null, function(items) {
          var allKeys = Object.keys(items);
          $("#listasUl").empty();
          for (i = 0; i < allKeys.length; i++) {

            var id = allKeys[i];
            if (/\s/.test(id)) {
              id = id.replace(/\s/g, "_");
            }

              $("#listasUl").append('<li class="elementoLista" id="'+id+'">'+allKeys[i]+'</li>');


              EventoIluminar("#"+id);
              Animacion("#"+id);
          }
      });
  } catch(err){
    console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
  }
  } 
}

function EventoListas(){
  
    try {
      chrome.storage.sync.get(null, function(items) {
      document.querySelectorAll('.elementoLista').forEach(item => {
  
        $(item).on('click', function() {      
          
          $('#productosUl').empty()
          var nombreLista = $(this).text(); //Obtiene el nombre de li

          // if (/\s/.test(nombreLista)) {
          //   nombreLista = nombreLista.replace(/\s/g, "_");
          // }
          listaSeleccionada = nombreLista;
         
          if(mensajeNoHayProductosEnLista() == false){
            console.log("mensajeNoHayProductosEnLista(): " + mensajeNoHayProductosEnLista());
             DesplegarProductos(nombreLista);
          }
          
          
          
        });  
      });
      });
    } catch (err) {
      console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
    }


}

function DesplegarProductos(nombreLista){
  try {
    chrome.storage.sync.get(nombreLista, function (lista) { //Obtiene la lista
  
      $.map(lista, function(productosEnLista, nombreProducto) { //Obtiene los productos en la lista
    
          $.map(productosEnLista, function(producto, llaveProducto) {  //Separa los productos
  
            $.map(producto, function(datosProducto, categoryID) { //Separa los datos del producto
  
              $("#productosUl").append('<li class="productoEnLista" id="'+datosProducto[5]+'">'+datosProducto[0]+'</li>'); //De aca se pueden sacar los datos del producto usando el indice
              
              var idProducto = "#"+datosProducto[5];
              EventoIluminarProductos(idProducto);
              Animacion2(idProducto);
              EventoProducto(idProducto, datosProducto);
              
          });
        });
      });
    });
  } catch (err) {
    console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
  }
}

function EventoProducto(idProducto, datosProducto){
     try {
        $(idProducto).on('click', function() {
          $('#inp1').empty()
          $("#inp1").append('<img src="'+datosProducto[4]+'" class="imagenProducto" alt="celular"></img>');
          nombre.innerHTML = datosProducto[0];
          estado.innerHTML = datosProducto[2];      
          precio.innerHTML = datosProducto[1];
          localidad.innerHTML = datosProducto[6];
          condicion.innerHTML = datosProducto[7];
          envioGratis.innerHTML = datosProducto[8];
          cantidadDisponible.innerHTML = datosProducto[9];
          garantia.innerHTML = datosProducto[10];
          productID.innerHTML = datosProducto[5];
          urlProducto.innerHTML = '<a href="'+datosProducto[3]+'">ver</a>';
      });
     } catch (err) {
      console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
     }
}

function CrearContextMenu(){
  try {
    $(document).bind("contextmenu", function(e){
      EventoOcultarMenu();
      Comprobacion();
      EventoCambiarNombreLista();
      EventoContextMenu();
      return false;
    });
  } catch (err) {
    console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
  }
}

function EventoOcultarMenu(){
  $(window).click(function() {
    lista = false;
    producto = false;
    producto = false;
  $("#menu").hide();
    });
}

function Comprobacion(){

  try {
    $(".elementoLista").mousedown(function(e){
      if(e.button == 2){
     
        itemLista = $(e.target).text();
        
        itemSeleccionado.innerHTML = " "+itemLista;
        document.getElementById("cambiarNombreLista").style.display = "inline";
        EventoEliminarLista(itemLista);
        $("#menu").css({'display':'block', 'left':e.pageX, 'top':e.pageY});
      }
    });
  
    $(".productoEnLista").mousedown(function(e){
      if(e.button == 2){
  
        itemProducto = $(e.target).text();
        itemSeleccionado.innerHTML = " "+itemProducto;
        document.getElementById("cambiarNombreLista").style.display = "none";
        EventoEliminarProducto(itemProducto);
        $("#menu").css({'display':'block', 'left':e.pageX, 'top':e.pageY});
      }
    });
  } catch (err) {
    console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
  }
}

function EventoCambiarNombreLista(){ 
  try{
  $("#cambiarNombreLista").unbind().click(function(e){

      var resp = window.prompt("Nuevo nombre:");
      var existe = false;
      //EventoOcultarMenu();

      if(resp != null && resp != ""){
        if(typeof(resp) === 'string' || typeof(resp) === 'number'){
          console.log("nombre nuevo: " + resp);
          chrome.storage.sync.get(null, function(items) {
            var allKeys = Object.keys(items);
            for (i = 0; i < allKeys.length; i++) {
                if(resp == allKeys[i]){
                  existe = true;
                }
            }
            if(existe == false){
              var productosLista = [];
              var listaNueva = {};

              chrome.storage.sync.get(itemLista, function (lista) { //Obtiene la lista
                  
                $.map(lista, function(productosEnLista, itemLista) { //Obtiene los productos en la lista
                  
                  listaNueva[resp] = productosLista;        
                  chrome.storage.sync.remove(itemLista);
                  chrome.storage.sync.set(listaNueva);
                  
                  $.map(productosEnLista, function(producto, llaveProducto) {  //Separa a los productos
                    
                    
                    $.map(producto, function(datosProducto, categoryID) { //Separa a los datos del producto
                        productosLista.push(producto);
                    });
                  });
                  
                });
                
                listaNueva[resp] = productosLista;        
                chrome.storage.sync.remove(itemLista);
                chrome.storage.sync.set(listaNueva);
                
                getearSessionId().then(id => {
                  var listaServidor = {
                    nombreViejo: itemLista,
                    nombreNuevo: resp,
                    sessionId: id
                  }
        
                  var request = $.ajax({
                    type: "POST",
                    url: "http://localhost:3000/modificarLista",
                    data: listaServidor,
                    error: function(xhr, status, error){
                      console.log("Error al contactar con el servidor, xhr: " + xhr.status);
                    }
                  });
                  request.done(function(response) {
                    console.log(response);
                    // obtenerSessionIdABM(response.sessionId);
                  });
                });
                
              });
              location.reload();
            }
            else if(existe == true){
              alert("Ya hay una lista con ese nombre!");
            }
          });
        }
        else{
          alert("Nombre de lista invalido");
          console.log("nombre deseado: " + resp);
        }
      }
      else{
        if(resp == ""){
          alert("Nombre de lista invalido");
        }
      }
     

  });
   } catch (err) {
    console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
   }
    
}

function EventoEliminarProducto(itemProducto){
  try {
    $("#eliminar").unbind().click(function(e){
        var productosLista = [];
        var listaNueva = {};
        var existe = false;
        var id;
  
        chrome.storage.sync.get(listaSeleccionada, function (lista) { //Obtiene la lista
            
          $.map(lista, function(productosEnLista, listaSeleccionada) { //Obtiene los productos en la lista
            
            
            $.map(productosEnLista, function(producto, llaveProducto) {  //Separa a los productos
              
              
              $.map(producto, function(datosProducto, categoryID) { //Separa a los datos del producto
                if(datosProducto[0] !== itemProducto){
                  productosLista.push(producto);
                }
                else if(datosProducto[0] == itemProducto){
                  existe = true;
                  id = categoryID;
                }
              });
            });
          });

          if(existe == true){
            getearSessionId().then(idsession => {
              var productoServidor = {            
                id: id,
                sessionId: idsession
              }
  
              var request = $.ajax({
                type: "POST",
                url: "http://localhost:3000/bajaProducto",
                data: productoServidor
              });
              request.done(function(response) {
                console.log(response);
                // obtenerSessionIdABM(response.sessionId);
              });
            });
  
            listaNueva[listaSeleccionada] = productosLista;        
            chrome.storage.sync.remove(listaSeleccionada);
            chrome.storage.sync.set(listaNueva);
            console.log("elimino producto");
          }

        });
        
        
        setTimeout(function (){
          $('#productosUl').empty();
          DesplegarProductos(listaSeleccionada);
          console.log("desplego productos");
        }, 200);
  
      lista = false;
      producto = false;
    });
  } catch (err) {
    console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
  }
}

function EventoEliminarLista(itemLista){
  try {
    $("#eliminar").click(function(e){
        getearSessionId().then(id => {
          var listaServidor = {            
            nombre: itemLista,
            sessionId: id
          }
  
          var request = $.ajax({
            type: "POST",
            url: "http://localhost:3000/bajaLista",
            data: listaServidor
          });
          request.done(function(response) {
            console.log(response);
            // obtenerSessionIdABM(response.sessionId);
          });
        });
        chrome.storage.sync.remove(itemLista);
        setTimeout(function (){
          $('#listasUl').empty();
          DesplegarListas();
        }, 200);
      });
  } catch (err) {
    console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
  }
}

function EventoContextMenu(){
  try {
    $("#eliminar").mouseover(function(){
      $("#eliminar").css("background-color", "#ffffff0a");
      $("#cambiarNombreLista").css("background-color", "#3f3f3f");
    });
    $("#cambiarNombreLista").mouseover(function(){
      $("#eliminar").css("background-color", "#3f3f3f");
      $("#cambiarNombreLista").css("background-color", "#ffffff0a");
    });
    $(".contextMenu").mouseleave(function(){
      $("#eliminar").css("background-color", "#3f3f3f");
      $("#cambiarNombreLista").css("background-color", "#3f3f3f");
    });
  } catch (err) {
    console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
  }
}

function EventoIluminar(idElemento){
    try {
      $(idElemento).mouseover(function(){
        if(elementoAnterior != idElemento){
        $(idElemento).css("background", "#b1b1b12c");
        }
      });
      $(idElemento).mouseleave(function(){
        if(elementoAnterior != idElemento){
        $(idElemento).css("background", "#ffffff0a");
        }
      
      });
      $(idElemento).click(function(){
        $(idElemento).css("background", "#b1b1b156");     
        if(elementoAnterior != idElemento){
          $(elementoAnterior).css("background", "#ffffff0a");
          elementoAnterior = idElemento;
        }
        
      });
    } catch (err) {
      console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
    }
}

function EventoIluminarProductos(idElemento){
  try {
    $(idElemento).mouseover(function(){
      if(productoAnterior != idElemento){
      $(idElemento).css("background", "#b1b1b12c");
      }
    });
    $(idElemento).mouseleave(function(){
      if(productoAnterior != idElemento){
      $(idElemento).css("background", "#ffffff0a");
      }
    
    });
    $(idElemento).click(function(){
      $(idElemento).css("background", "#b1b1b156");     
      if(productoAnterior != idElemento){
        $(productoAnterior).css("background", "#ffffff0a");
        productoAnterior = idElemento;
      }
      
    });
  } catch (err) {
    console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
  }
}

function Animacion(idElemento){
  try {
    $('.productos').hide();
    $('.informacion').hide();
    $(idElemento).click(function() {
      if (!animacion1Ejecutada) {    
        $('.productos').show();
  
        $(".listas").addClass('animacion');
        $(".productos").addClass('animacion');
  
        setTimeout(function() {
          $(".listas").removeClass('animacion');
        }, 500);
      
        setTimeout(function() {
          $(".productos").removeClass('animacion');
        }, 500);
      }
      animacion1Ejecutada = true;
    });
  } catch (err) {
    console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
  }
}

function Animacion2(idElemento){
  try {
    $(idElemento).click(function() {
      if (!animacion2Ejecutada) {
        
        $('.informacion').show();
        $(".listas").addClass('animacion2');
        $(".productos").addClass('animacion2');
        $(".informacion").addClass('animacion2');
        ConfiguracionInformacionProducto();
        setTimeout(function() {
          $(".listas").removeClass('animacion2');
          $(".informacion").removeClass('animacion2');
          $(".productos").removeClass('animacion2');
        }, 500);
      
        setTimeout(function() {
          $(".productos").removeClass('animacion2');
        }, 500);
  
        setTimeout(function() {
          $(".informacion").removeClass('animacion2');
        }, 500);
      }
      animacion2Ejecutada = true;
    });
  } catch (err) {
    console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
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
        var elementoInformacion = '#inp' + i;
        console.log(elementoInformacion);
        $(elementoInformacion).hide();
      }
    }
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
          console.log("ID GETSUSCRIP: "+id)
          getSuscripcion(id);
        }
      });
    }
  });
}