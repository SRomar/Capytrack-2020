//Llenar select
$(document).ready(function(){
  DesplegarListas();
  EventoAgregarProductoLista();
  EventoPanelNuevaLista();
});


function DesplegarListas(){
  
    chrome.storage.sync.get(null, function(items) {
        var allKeys = Object.keys(items);
        $('#selectLista').empty();
        for (i = 0; i < allKeys.length; i++) {
            console.log(allKeys[i]);
            $("#selectLista").append(new Option(allKeys[i], allKeys[i]));
        }
    });
  
}

function EventoAgregarProductoLista(){
  $("#btnAgregarLista").click(function(){
      //Obtener enlace
      chrome.tabs.getSelected(null,function(tab) {
        var category_id = (tab.url).toString();
        var indiceM = 0;
        var verificaciones;
        var a;
        var bandera = false;
        while(bandera == false){
          for(var j = 0; j<category_id.length; j++){
            if((category_id.charAt(j) == "M") && (j !== indiceM)){
              indiceM = j;
              j = category_id.lenght;
            }
            
          }
          
          verificaciones = category_id.charAt(indiceM + 4);
          
          if(Number.isInteger(parseInt(verificaciones, 10))){           
            verificaciones = category_id.charAt(indiceM + 3);
            
            if(Number.isInteger(parseInt(verificaciones, 10)) == false){
              
              for(var i=indiceM + 4; i<indiceM + 20; i++){
                verificaciones = category_id.charAt(i);
                if(Number.isInteger(parseInt(verificaciones, 10)) == false){
                  a = i;
                  i = indiceM + 20;
                }
              }  
              
              category_id = category_id.substr(indiceM,3) + category_id.substr(indiceM + 4, a - (indiceM + 4));
              bandera = true;
              
            }
            else{
              
              for(var i=indiceM + 3; i<indiceM + 20; i++){
                verificaciones = category_id.charAt(i);
                if(Number.isInteger(parseInt(verificaciones, 10)) == false){
                  a = i;
                  i = indiceM + 20;
                
                }
              }  
              
              category_id = category_id.substr(indiceM, a-indiceM);
              bandera = true;
            }
          }
        }
        bandera = false;
        var valorLista = $( "#selectLista" ).val();
        chrome.storage.sync.get(valorLista, function (lista) { //Obtiene la lista
            
          $.map(lista, function(productosEnLista, valorLista) { //Obtiene los productos en la lista
              $.map(productosEnLista, function(producto, llaveProducto) {  //Separa a los productos
                $.map(producto, function(datosProducto, categoryID) { //Separa a los datos del producto
                  if(categoryID == category_id){
                    bandera = true;
                  }
                });
              });
          });
          if(bandera == false){
            var linkAPI = "https://api.mercadolibre.com/items/" + category_id + "?include_attributes=all";
        
            fetch(linkAPI).then(data => data.text()).then(data =>{
              var i = JSON.parse(data);
              
              console.log(i);

              
              var valorLista = $( "#selectLista" ).val(); //Lista seleccionada
              //Se agrega a una lista
              if(valorLista !== null){
              
                ide.innerHTML = i.id;
                nombre.innerHTML = i.title;
                estado.innerHTML = i.status;      
                precio.innerHTML = i.price;

                diccionariofoto = i.pictures;
                arregloFoto = diccionariofoto[Object.keys(diccionariofoto)[0]];
                foto = arregloFoto[Object.keys(arregloFoto)[2]];
                console.log(foto);

                //Se crea el producto
                var producto = [i.title, i.price, i.status, i.permalink, foto, i.id];
          
                var productoServidor = {
                  title: i.title,
                  price: i.price,
                  status: i.status,
                  permalink: i.permalink,
                  id: i.id,
                  nombrelista: valorLista
                }
    
                $.ajax({
                  type: "POST",
                  url: "http://localhost:3000/altaProducto",
                  data: productoServidor
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
  
              } else{
                alert('No hay listas!');
              }
          
            });
          }
          else if(bandera == true){
            alert("El producto ya se encuentra en la lista!");
          }
        });
      });
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
  $(document).on('click','#btnCrearLista', function() {
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
          var listaServidor = {
            nombre: nombre
          }

          $.ajax({
            type: "POST",
            url: "http://localhost:3000/altaLista",
            data: listaServidor
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