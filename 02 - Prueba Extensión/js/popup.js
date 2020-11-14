
//Llenar select
$(document).ready(function(){
  DesplegarListas();
  EventoAgregarProductoLista();
  EventoPanelNuevaLista();
  EventoAdministrarLista();
  eventoSelect();
  // conexionSocket();
  // obtenerSessionId();
});

function eventoSelect(){
  $('#selectLista').on('change', function() {
    $('#productosListaUL').empty()
    DesplegarProductos($(this).val());
});

}
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

function DesplegarListas(){
  
    chrome.storage.sync.get(null, function(items) {
        var allKeys = Object.keys(items);
        $('#selectLista').empty();
        for (i = 0; i < allKeys.length; i++) {
          $("#selectLista").append(new Option(allKeys[i], allKeys[i]));
        }
    });
  
}

function CapturaCategoryID(url){
    
    var category_id = url.toString();
    var indiceM = 37; //indice donde se encuentra la M de los categoryID
    var indiceFinal = 0; //indice donde termina el categoryID; 

    if(Number.isInteger(parseInt(category_id.charAt(indiceM + 3), 10)) == false){ //verifico si el categoryID tiene '-' entre las letras y los numeros
        
      for(var i=indiceM + 4; i<indiceM + 20; i++){
        if(Number.isInteger(parseInt(category_id.charAt(i), 10)) == false){ //compruebo donde termina el categoryID (hasta encontrar un caracter que no sea un numero)
          indiceFinal = i;
          i = indiceM + 20; //para salir del for
        }
      }  
        
      category_id = category_id.substr(indiceM,3) + category_id.substr(indiceM + 4, indiceFinal - (indiceM + 4)); //obtengo el categoryID mediante substr() y los indices
        
      }
    else{ //si no tiene '-' en el categoryID
        
      for(var i=indiceM + 3; i<indiceM + 20; i++){
        verificaciones = category_id.charAt(i);
        if(Number.isInteger(parseInt(verificaciones, 10)) == false){
          indiceFinal = i;
          i = indiceM + 20;
          
        }
      }  
        
      category_id = category_id.substr(indiceM, indiceFinal-indiceM);
    }
    
    return category_id;
}

function AgregarProducto(category_id){
  var linkAPI = "https://api.mercadolibre.com/items/" + category_id + "?include_attributes=all";
              
  fetch(linkAPI).then(data => data.text()).then(data =>{
    var i = JSON.parse(data);
    
    var valorLista = $( "#selectLista" ).val(); //Lista seleccionada
    //Se agrega a una lista
    if(valorLista !== null){
    
      // ide.innerHTML = i.id;
      // nombre.innerHTML = i.title;
      // estado.innerHTML = i.status;      
      // precio.innerHTML = i.price;

      diccionariofoto = i.pictures;
      arregloFoto = diccionariofoto[Object.keys(diccionariofoto)[0]];
      foto = arregloFoto[Object.keys(arregloFoto)[2]];
      console.log(foto);

      //Se crea el producto
      var producto = [i.title, i.price, i.status, i.permalink, foto, i.id];

      getearSessionId().then(id => {
        var productoServidor = {
          title: i.title,
          price: i.price,
          status: i.status,
          permalink: i.permalink,
          id: i.id,
          nombrelista: valorLista,
          sessionId: id
        }
        var request = $.ajax({
          type: "POST",
          url: "http://localhost:3000/altaProducto",
          data: productoServidor,
          error: function(xhr, status, error){
            console.log("Error al contactar con el servidor, xhr: " + xhr.status);
          }
        });
        request.done(function(response) {
          console.log(response);
          obtenerSessionIdABM(response.sessionId);
        });
      });
      

      var diccionarioProducto = {};       
      var key = i.id;  
      diccionarioProducto[key]= producto;   

      

      chrome.storage.sync.get(function(cfg) {
        if(typeof(cfg[valorLista]) !== 'undefined' && cfg[valorLista] instanceof Array) { 
          cfg[valorLista].push(diccionarioProducto);
        } 
        chrome.storage.sync.set(cfg); 
      });

      DesplegarProductos();

    } else{
      alert('No hay listas!');
    }

  });

}

async function VerificacionExistenciaProducto(){
  
  var p2 = new Promise(function(resolve, reject){
    chrome.tabs.getSelected(null,function(tab) {
      resolve(CapturaCategoryID(tab.url));
    });
  });
  const category_id = await p2;
  
  var p = new Promise(function(resolve, reject){  
      var existe = false;
      chrome.storage.sync.get(null, function(items){
        var allkeys = Object.keys(items);
        for(var i=0; i<allkeys.length; i++){

          var p3 = new Promise(function(resolve, reject){
            chrome.storage.sync.get(allkeys[i], function (lista) { //Obtiene la lista
              $.map(lista, function(productosEnLista, nombreLista) { //Obtiene los productos en la lista
                $.map(productosEnLista, function(producto, llaveProducto) {  //Separa a los productos
                  $.map(producto, function(datosProducto, categoryID) {
                    if(categoryID === category_id){                     
                      existe = true;
                    }
                  });
                });
              });
              resolve(existe);
            });           
          });
          async function traerExiste(p3){
            return await p3;
          };  
          var existe2 = traerExiste(p3); 
          console.log("existe2: " + existe2);     
        }
        
       resolve(existe2);
        
      });
      
  });
  
  const productoYaCargado = await p;

  //setTimeout(function(){
    console.log("verificacion: " + productoYaCargado);

    if(productoYaCargado == false){
      AgregarProducto(category_id);
    }
    else if(productoYaCargado == true){
      alert("El producto ya se encuentra en una lista!");
    }                     
  //}, 500);
  
  
}



function EventoAgregarProductoLista(){
  $("#btnAgregarLista").click(function(){
    VerificacionExistenciaProducto();
  });
  
}


function EventoPanelNuevaLista(){
  $("#nuevaLista").click(function(){
    $("#contenedor").hide();
    $("#contenedorNuevaLista").show();
    EventoBotonRetroceso();
    EventoCrearLista();
  });
}

function EventoBotonRetroceso(){
  $("#retroceso").click(function(){
    $("#contenedorNuevaLista").hide();
    $("#contenedor").show();
  })
}

function EventoCrearLista(){
  $("#btnCrearLista").unbind().click(function() {
      var existe = false;
      var Lista = {};       
      var nombre = document.getElementById('nombreLista').value;  
      chrome.storage.sync.get(null, function(items) {
        var allKeys = Object.keys(items);
        for (i = 0; i < allKeys.length; i++) {
            if(nombre == allKeys[i]){
              existe = true;
            }
        }
        if(existe == false){
          Lista[nombre]= [];
          chrome.storage.sync.set(Lista);
          DesplegarListas(); 

          getearSessionId().then(id => {
            var listaServidor = {
              nombre: nombre,
              sessionId: id
            }

            var request = $.ajax({
              type: "POST",
              url: "http://localhost:3000/altaLista",
              data: listaServidor,
              error: function(xhr, status, error){
                console.log("Error al contactar con el servidor, xhr: " + xhr.status);
            }
            });
            request.done(function(response) {
              console.log(response);
              obtenerSessionIdABM(response.sessionId);
            });
          });
          $("#contenedorNuevaLista").hide();
          $("#contenedor").show();        
         
        }
        else if(existe == true){
          alert("Ya hay una lista con ese nombre!");
        }
      });
  });
}

function EventoAdministrarLista(){
  $(document).on('click','#btnAdministrarLista', function() {
  });
}


function EventoListas(){
  
  try {
    chrome.storage.sync.get(null, function(items) {
    document.querySelectorAll('.elementoLista').forEach(item => {

      $(item).on('click', function() {      
        
        $('#productosListaUL').empty()
        var nombreLista = $(this).text(); //Obtiene el nombre de li
        console.log(nombreLista);
        DesplegarProductos(nombreLista);
      });  
    });
    });
  } catch (err) {
    console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
  }


}



function DesplegarProductos(nombreLista){
  try {
    $('#productosListaUL').empty()
    chrome.storage.sync.get(nombreLista, function (lista) { //Obtiene la lista
      var total = 0;
      $.map(lista, function(productosEnLista, nombreProducto) { //Obtiene los productos en la lista
    
          $.map(productosEnLista, function(producto, llaveProducto) {  //Separa los productos

            $.map(producto, function(datosProducto, categoryID) { //Separa los datos del producto
  
              $("#productosListaUL").append('<li class="productoEnLista" id="'+datosProducto[5]+'">'+datosProducto[0]+'</li>'); //De aca se pueden sacar los datos del producto usando el indice
              
              total = total + parseInt(datosProducto[1]);
         

         
          });

        });
        precio.innerHTML = "$ "+total;
      });
      
    });
  } catch (err) {
    console.log("Fallo en "+ arguments.callee.name +", error: " + err.message);
  }
}