
//Llenar select
$(document).ready(function(){
  obtenerSessionId();
  mostrarBotonRegistrarse();
  DesplegarListas();
  EventoAgregarProductoLista();
  EventoPanelNuevaLista();
  EventoAdministrarLista();
  eventoSelect();
  DesplegarProductos($( "#selectLista" ).val());
  traerProductosServidor();
  
});

function traerProductosServidor(){

  getearSessionId().then(id => {
    if(id != 0){
      console.log("entro a traerProductosSevidor,id igual a "+id);
      var clienteServidor = {
        idSession: id
      }
      var request = $.ajax({
        type: "POST",
        url: "http://localhost:3000/productosCliente",
        data: clienteServidor,
        error: function(xhr, status, error){
          console.log("Error al contactar con el servidor, xhr: " + xhr.status);
        }
      });
      request.done(function(response) {
        // for(i=0; i<response.prods.length; i++){
        //   console.log(response.prods[i].nombre) +"\n\n";
        // }
        // obtenerSessionIdABM(response.sessionId);
        compararProductos(response.prods);
      });
    }
 });
}


/*
function traerProductosServidor(){
  fetch('http://localhost:3000/productosCliente').then(data => data.text()).then(data =>{
      var i = data;
      console.log("productos servidor: " + i);
      if(i.length !== 0){
        compararProductos(i);
      }
  });
}*/


async function compararProductos(productosServidor){
console.log("entro a comparar productos");


  var p1 = new Promise(function(resolve, reject){     
    chrome.storage.sync.get(null, function(items){
      var allkeys = Object.keys(items);
      
      for(var i=0; i<allkeys.length; i++){

        var p2 = new Promise(function(resolve, reject){
          var prods = [];
          chrome.storage.sync.get(allkeys[i], function (lista) { //Obtiene la lista
            $.map(lista, function(productosEnLista, nombreLista) { //Obtiene los productos en la lista
              $.map(productosEnLista, function(producto, llaveProducto) {  //Separa a los productos
                $.map(producto, function(datosProducto, categoryID) {
                  prods.push(producto);
                });
              });
            });

            resolve(prods);
          });           
        });
        async function traerProds(p2){
          return await (p2);
        };  
        var prods2 = traerProds(p2);    
      }
        
      resolve(prods2);       
    });
  });

  const productosSync = await(p1);


  cont = 0;
  productosSyncNuevos = [];

  for(var i=0; i<productosSync.length; i++){
    for(var j=0; j<productosServidor.length; j++){

      var productoSync = Object.values(productosSync[i]);
      var atributosProductoSync = productoSync[i];

      if(atributosProductoSync[5] == productosServidor[j].id){
        if(atributosProductoSync[0] != productosServidor[j].nombre ||
          atributosProductoSync[1] != productosServidor[j].precio){
            console.log("\n Un producto cambio de valor: \n Producto sync:" + JSON.stringify(productosSync[i]) + "\n Producto servicdor:" + JSON.stringify(productosServidor[j]) +"\n");
            actualizarProducto(atributosProductoSync, productosServidor[j]);

          cont=0;
        }
        else{
          if((atributosProductoSync[2] == "active" && productosServidor[j].activo == 0) || (atributosProductoSync[2] == "paused" && productosServidor[j].activo == 1)){
            console.log("\n Un producto cambio de valor: \n Producto sync:" + JSON.stringify(productosSync[i]) + "\n Producto servicdor:" + JSON.stringify(productosServidor[j]) +"\n");
            actualizarProducto(atributosProductoSync, productosServidor[j]);
          }
          else{
            console.log("ids iguales pero no hubo cambios");
            cont=0;
          }          
        }
      }
      else{
        cont++;
      }
    }
    if(cont == productosServidor.length){
      console.log("cont: " + cont + "\n productosServidor.length: " + productosServidor.length);
      productosSyncNuevos.push(productosSync[i]);
    }
  }
  console.log("productosSyncNuevos: " + productosSyncNuevos);
  if(productosSyncNuevos.length !== 0){
    console.log("productosSyncNuevos: " + productosSyncNuevos.length);
    //agregarProductosFaltantes(productosSyncNuevos);
  }

}

async function actualizarProducto(productoSync, productoServidor){
  console.log("entro a actualizarProducto \n");
  var productosLista = [];
  var listaNueva = {};
  var listaSeleccionada = productoServidor.nombre_lista;
  
  chrome.storage.sync.get(listaSeleccionada, function (lista) { //Obtiene la lista
            
    $.map(lista, function(productosEnLista, listaSeleccionada) { //Obtiene los productos en la lista
            
            
      $.map(productosEnLista, function(producto, llaveProducto) {  //Separa a los productos
              
              
        $.map(producto, function(datosProducto, categoryID) { //Separa a los datos del producto
          if(productoSync[5] !== categoryID){
            productosLista.push(producto);
          }

        });
      });
    });

    listaNueva[listaSeleccionada] = productosLista;        
    chrome.storage.sync.remove(listaSeleccionada);
    chrome.storage.sync.set(listaNueva);
    
    var diccionarioProducto = {};       
    var key = productoSync[5];  

    var status;
    if(productoServidor.activo == 1){
      status = "active";
    }
    else{
      status = "paused";
    }

    var productoActualizado = [productoServidor.nombre, productoServidor.precio, status, productoServidor.url, productoSync[4], productoSync[5]];

    diccionarioProducto[key]= productoActualizado;   

      

    chrome.storage.sync.get(function(cfg) {
      if(typeof(cfg[listaSeleccionada]) !== 'undefined' && cfg[listaSeleccionada] instanceof Array) { 
        cfg[listaSeleccionada].push(diccionarioProducto);
      } 
     chrome.storage.sync.set(cfg); 
     console.log("se seteo la lista con el productos nuevo");
    });

  });

}

async function agregarProductosFaltantes(productosSyncNuevos){
  for(var k=0; k<productosSyncNuevos.length; k++){

    var p1 = new Promise(function(resolve, reject){  
      var listaProducto
      chrome.storage.sync.get(null, function(items){
        var allkeys = Object.keys(items);
        
        for(var i=0; i<allkeys.length; i++){
  
          var p2 = new Promise(function(resolve, reject){
            chrome.storage.sync.get(allkeys[i], function (lista) { //Obtiene la lista
              $.map(lista, function(productosEnLista, nombreLista) { //Obtiene los productos en la lista
                $.map(productosEnLista, function(producto, llaveProducto) {  //Separa a los productos
                  $.map(producto, function(datosProducto, categoryID) {
                    if(productosSyncNuevos[k].id == categoryID){
                      listaProducto = lista;
                    }
                  });
                });
              });
  
              resolve(listaProducto);
            });           
          });
          async function traerLista(p2){
            return await p2;
          };  
          var listaProducto2 = traerLista(p2);    
        }
          
        resolve(listaProducto2);       
      });
    });
    const lista = await (p1);

    AgregarProductoNuevo(productosSyncNuevos[k], lista);
  }
}

function AgregarProductoNuevo(productoNuevo, lista){

    getearSessionId().then(id => {
      var productoServidor = {
        title: productoNuevo.title,
        price: productoNuevo.price,
        status: productoNuevo.status,
        permalink: productoNuevo.permalink,
        id: productoNuevo.id,
        nombrelista: lista,
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
}

function mostrarBotonRegistrarse(){
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
          $('#btnRegistrarse').hide();       
        }
        else{
          $('#btnRegistrarse').show();
        }
      });
    }
    else{
      $('#btnRegistrarse').show();
    }
    
  });
}

function eventoSelect(){
  $('#selectLista').on('change', function() {
    $('#productosListaUL').empty()
    DesplegarProductos($(this).val());
});

}

function obtenerSessionId(){
  setTimeout(function(){
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
  }, 200);  
}

async function getearSessionId(){
  var p = new Promise(function(resolve, reject){
    chrome.storage.local.get(['sessionId_NUEVO'], function(result){
      var id = result.sessionId_NUEVO;
      resolve(id); 
    });
  });
  const id = await(p);
  //console.log("id: " + id);
  if(id == undefined){
    return 0;
  }
  else{
    return id;
  }
  
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
      //console.log(foto);

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
          //console.log("existe2: " + existe2);     
        }
        
       resolve(existe2);
        
      });
      
  });
  
  const productoYaCargado = await p;

  //setTimeout(function(){
    //console.log("verificacion: " + productoYaCargado);

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
      if(nombre != null && nombre != ""){
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
              });
            });
            $("#contenedorNuevaLista").hide();
            $("#contenedor").show();        
          
          }
          else if(existe == true){
            alert("Ya hay una lista con ese nombre!");
          }
        });
      }
      else{
        alert("Ingrese un nombre");
      }
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
        //console.log(nombreLista);
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