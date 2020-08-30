
$(document).ready(function(){
    if($( "#listaDeListas" ).val() !== null){
      chrome.storage.sync.get(null, function(items) {
          var allKeys = Object.keys(items);
          for (i = 0; i < allKeys.length; i++) {
              $("#listaDeListas").append('<li><a class="elementoLista" href="#">'+allKeys[i]+'</a></li>');
          }
      });
    }
  });


