//Llenar select
$(document).ready(function(){
  if($( "#selectLista" ).val() === null){
    chrome.storage.sync.get(null, function(items) {
        var allKeys = Object.keys(items);
        for (i = 0; i < allKeys.length; i++) {
            $("#selectLista").append(new Option(allKeys[i], allKeys[i]));
        }
    });
  }
});




$(document).ready(function(){
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
              
              ide.innerHTML = i.id;
              nombre.innerHTML = i.title;
              estado.innerHTML = i.status;      
              precio.innerHTML = i.price;
        
              
              
              var valorLista = $( "#selectLista" ).val(); //Lista seleccionada
              //Se agrega a una lista
              if(valorLista !== null){
              
                //Se crea el producto
                var producto = [i.title, i.price, i.status];
          
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
});


$(document).ready(function(){
  $("#nuevaLista").click(function(){
    $("#contenedor").hide();
    $("#contenedorNuevaLista").show();
  });
});

$(document).ready(function(){
  $("#retroceso").click(function(){
    $("#contenedorNuevaLista").hide();
    $("#contenedor").show();
  })
});

$(document).on('click','#btnCrearLista', function() {
    var Lista = {};       
    var nombre = document.getElementById('nombreLista').value;  
    console.log(nombre);
    Lista[nombre]= [];
    chrome.storage.sync.set(Lista);
    $("#selectLista").append(new Option(nombre, nombre));
    $("#contenedorNuevaLista").hide();
    $("#contenedor").show();
});
  