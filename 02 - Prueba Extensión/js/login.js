$(document).ready(function(){
    ocultarLabelProblema();
    EventoRegistrarse();
    EventoRetroceder();
    
});

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
            var usuarioServidor = {
                usuario: usuario,
                contrasena: contrasena
              }
            
            $.ajax({
                type: "POST",
                url: "http://localhost:3000/altaUsuario",
                data: usuarioServidor,
                error: function(xhr, status, error){
                  console.log("Error al contactar con el servidor, xhr: " + xhr.status);
              }
            });

            //guardar usuario en storage (pero aclarar cada vez que se llama a storage que el usuario no es una lista)
            alert("Registrado con éxito!");
            window.close();
        }
        else if(usuario == null || contrasena == null || usuario == "" || contrasena == ""){
            $("#problema").show();
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


