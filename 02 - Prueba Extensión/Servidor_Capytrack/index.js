const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');
const cron = require('node-cron');
const fetch = require('node-fetch');
var http = require('http');
var request = require('request');
const session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');
var nodemailer = require('nodemailer');
const { access } = require('fs');
const { Console } = require('console');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'capytrack@gmail.com',
    pass: '/Capytrack20'
  }
});

var options = {
  hots: 'localhost',
  port: 3306,
  user: 'Velnias',
  password: '/Velnias7',
  database: 'capytrack'
};

var sessionStore = new MySQLStore(options);

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'Velnias',
  password: '/Velnias7',
  database: 'capytrack'
});

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

  next();
});

app.use(express.json());
app.use(bodyParser.json());   
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'e',
  resave: true,
  saveUninitialized: true,
  //store: sessionStore
}));


app.post('/session', (req, res) => {
  
  var id = req.sessionID;
  var sessionId = req.body.sessionId;

  guardarSession(sessionId, id);
  
  res.json({
    status: 'success',
    sessionID: id
  });

});


async function guardarSession(sessionId, id){
  
  if(sessionId == 0){   
    conexion.query('INSERT INTO clientes (session_id) VALUES (?);', id, (err,result)=>{
      if(err) throw err;
    });
  }
  else{
    
    var p1 = new Promise(function(resolve, reject){
      var contador;
      console.log("entro a p1");
      conexion.query('SELECT COUNT(*) AS count FROM clientes WHERE session_id = ?;', sessionId, (err,result)=>{
        if(err) throw err;
        else{
          contador = result[0].count;
          
        }
        resolve(contador);
      });
    });
    const cont = await(p1);
    console.log("cont: " + cont);
    if(cont == 0){           
      conexion.query('INSERT INTO clientes (session_id) VALUES (?);', sessionId, (err,result)=>{
        if(err) throw err;
      });
    }
      
    
    
  }
}


// app.post('/updateSessionId', (req, res) => {
//   var idAnterior = req.body.idAnterior;
//   var idNuevo = req.body.idNuevo;

//   console.log("idsession_viejo: " + idAnterior);
//   console.log("idsession_nuevo: " + idNuevo);
  
//   updateSessionId(idNuevo, idAnterior);

// });

// async function updateSessionId(idNuevo, idAnterior){
//   var masDeUnRegistro = false;
//   var p1 = new Promise(function(resolve, reject){
//     conexion.query('SELECT COUNT(*) AS count FROM sessions;', (err,result)=>{
//       if(err) throw err;
//       else if(result[0].count > 1){
//         masDeUnRegistro = true;
//       }
//       resolve(masDeUnRegistro);
//     });
//   });

//   const hacerDelete = await(p1);
  
//   if(hacerDelete == true){
//     conexion.query('DELETE FROM sessions WHERE session_id = ?;', idNuevo, (err,result)=>{
//       if(err) throw err;
//     });
//   }
  
//   conexion.query('UPDATE sessions SET session_id = ? WHERE session_id = ?;', [idNuevo, idAnterior], (err,result)=>{
//     if(err) throw err;
//   });

//   var sinRegistros = false;
//   var p2 = new Promise(function(resolve, reject){
//     conexion.query('SELECT COUNT(*) AS count FROM clientes;', (err,result)=>{
//       if(err) throw err;
//       else if(result[0].count == 0){
//         sinRegistros = true;
//       }
//       resolve(sinRegistros);
//     });
//   });

//   const guardarSession = await(p2);
//   // console.log("guardarSession: " + guardarSession);
//   if(guardarSession == true){
//     conexion.query('INSERT INTO clientes (session_id) VALUES (?);', idNuevo, (err,result)=>{
//       if(err) throw err;
//     });
//   }
//   else{
//     conexion.query('UPDATE clientes SET session_id = ? WHERE session_id = ?;', [idNuevo, idAnterior], (err,result)=>{
//       if(err) throw err;
//     });
//   }

// }

app.post('/getSuscripcion', (req, res) =>{
    var sessionId = req.body.sessionId;

  conexion.query('SELECT idCliente FROM clientes WHERE session_id = ?;', sessionId, (err,result)=>{
    if(err) throw err;
    conexion.query('SELECT suscripcion from usuarios WHERE idCliente = ?;', [result[0].idCliente], (err,result)=>{
      if(err) throw err;
      else{
        res.json({
          suscripcion: result[0].suscripcion
        });
      }  
    });
  }); 
});

app.post('/setSuscripcion', (req, res) =>{
  var sessionId = req.body.sessionId;
  var sucripcion = req.body.tipoSuscripcion;
  conexion.query('SELECT idCliente FROM clientes WHERE session_id = ?;', sessionId, (err,result)=>{
    if(err) throw err;
    conexion.query('UPDATE usuarios SET suscripcion = ? WHERE idCliente = ?;', [sucripcion, result[0].idCliente], (err,result)=>{
      if(err) throw err;
      else{
        console.log("\n\n Suscripcion actualizada \n\n");
      }  
    });
  }); 
});







app.post('/getNotificarPrecio', (req, res) =>{
  var sessionId = req.body.sessionId;

conexion.query('SELECT idCliente FROM clientes WHERE session_id = ?;', sessionId, (err,result)=>{
  if(err) throw err;
  conexion.query('SELECT notificarPrecio from usuarios WHERE idCliente = ?;', [result[0].idCliente], (err,result)=>{
    if(err) throw err;
    else{
      res.json({
        notificar: result[0].notificarPrecio
      });
    }  
  });
}); 
});

app.post('/getNotificarEstado', (req, res) =>{
  var sessionId = req.body.sessionId;

conexion.query('SELECT idCliente FROM clientes WHERE session_id = ?;', sessionId, (err,result)=>{
  if(err) throw err;
  conexion.query('SELECT notificarEstado from usuarios WHERE idCliente = ?;', [result[0].idCliente], (err,result)=>{
    if(err) throw err;
    else{
      res.json({
        notificar: result[0].notificarEstado
      });
    }  
  });
}); 
});




app.post('/productosCliente', (req, res)=>{
  
  var idSession = req.body.idSession;

  console.log("\n Entro a productosCliente en busca del cliente con id: "+ idSession);
  devolverProductosCliente(idSession).then(productos => {
    res.json({
      status: 'success',
      prods: productos,
      sessionId: req.sessionID
    });
  });

});
async function devolverProductosCliente(idSession){
  
  var p1 = new Promise(function(resolve, reject){
    
    conexion.query('SELECT idCliente FROM clientes WHERE session_id = ?;', idSession , (err,result)=>{
      var idCliente;
      if(err) throw err;
      else{
        idCliente = result[0].idCliente;       
      }
      resolve(idCliente);
    });
  });
  
  const idCliente = await (p1);

  var p2 = new Promise(function(resolve, reject){
    console.log("idCliente: " + idCliente);
    conexion.query('SELECT * FROM productos WHERE idCliente = ?;', idCliente , (err,result)=>{
      var prods = [];
      if(err) throw err;
      else{       
        prods = result;      
      }
      resolve (prods);
    });
  });

  const productos = await (p2);

  console.log("productos: " + Object.values(productos));
  return productos;
  
}



// app.post('/productosCliente', (req, res)=>{
  
//   var idSession = req.body.idSession;

//   console.log("\n Entro a productos Cliente en busca del cliente con id: "+ idSession);
//   devolverProductosCliente(idSession).then(productos => {
//     res.json({
//       status: 'success',
//       prods: productos,
//       sessionId: req.sessionID
//     });
//   });

// });
// async function devolverProductosCliente(idSession){
  
//   var p1 = new Promise(function(resolve, reject){
    
//     conexion.query('SELECT idCliente FROM clientes WHERE session_id = ?;', idSession , (err,result)=>{
//       var idCliente;
//       if(err) throw err;
//       else{
//         idCliente = result[0].idCliente;       
//       }
//       resolve(idCliente);
//     });
//   });
  
//   const idCliente = await (p1);

//   var p2 = new Promise(function(resolve, reject){
//     console.log("idCliente: " + idCliente);
//     conexion.query('SELECT * FROM productos WHERE idCliente = ?;', idCliente , (err,result)=>{
//       var prods = [];
//       if(err) throw err;
//       else{       
//         prods = result;      
//       }
//       resolve (prods);
//     });
//   });

//   const productos = await (p2);

//   console.log("productos: " + Object.values(productos));
//   return productos;
  
// }


app.post('/setNotificarPrecio', (req, res) =>{
  var sessionId = req.body.sessionId;
  var notificar = req.body.notificar;
  conexion.query('SELECT idCliente FROM clientes WHERE session_id = ?;', sessionId, (err,result)=>{
    if(err) throw err;
    conexion.query('UPDATE usuarios SET notificarPrecio = ? WHERE idCliente = ?;', [notificar, result[0].idCliente], (err,result)=>{
      if(err) throw err;
      else{
        console.log("\n\n Notificacion Precio actualizada \n\n");
      }  
    });
  }); 
});

app.post('/setNotificarEstado', (req, res) =>{
  var sessionId = req.body.sessionId;
  var notificar = req.body.notificar;
  conexion.query('SELECT idCliente FROM clientes WHERE session_id = ?;', sessionId, (err,result)=>{
    if(err) throw err;
    conexion.query('UPDATE usuarios SET notificarEstado = ? WHERE idCliente = ?;', [notificar, result[0].idCliente], (err,result)=>{
      if(err) throw err;
      else{
        console.log("\n\n Notificacion Estado actualizada \n\n");
      }  
    });
  }); 
});


app.post('/usuarioRegistrado', function(req, res){
    console.log(req.body);

    var sessionId = req.body.sessionId;

    conexion.query('SELECT COUNT(*) AS countClientes FROM clientes;', (err,result)=>{
      if(err) throw err;
      else{
        var countClientes = result[0].countClientes;
        if(countClientes != 0){
          conexion.query('SELECT idCliente FROM clientes WHERE session_id = ?;', sessionId, (err,result)=>{
            if(err) throw err;
            else{
              var idCliente = result[0].idCliente;
              conexion.query('SELECT COUNT(*) AS count FROM usuarios WHERE idCliente = ?;', idCliente, (err,result)=>{
                var contrasena = result[0].contrasena;
                // console.log(result[0] +" A "+contrasena);

                if(err) throw err;
                else{
                  if(result[0].count == 0){
                    res.json({
                      status: 'success',
                      usuario: false,
                      sessionId: req.sessionID
                    });
                  }
                  else{
                    conexion.query('SELECT usuario FROM usuarios WHERE idCliente = ?;', idCliente, (err,result)=>{
                      if(err) throw err;
                      else{
                        console.log("USUARIO REGISTRADO");
                        res.json({
                          status: 'success',
                          usuario: true,
                          mail: result[0].usuario,
                          sessionId: req.sessionID
                        });
                      }
                    });
                    
                  }
                }
              });
            }
          });
        }
        else{
          res.json({
            status: 'success',
            usuario: false,
            sessionId: req.sessionID
          });
        }
      }
    });
      
});


app.post('/altaProducto', function(req, res){

    console.log(req.body);
    
    var id = req.body.id;
    var nombre = req.body.title;
    var url = req.body.permalink;
    var img = req.body.img;
    var activo = Boolean(req.body.status);
    var nombrelista = req.body.nombrelista;
    var precio = req.body.price;
    var sessionId = req.body.sessionId;
    var localidad = req.body.localidad;
    var envioGratis = Boolean(req.body.envioGratis);
    var cantidadDisponible = req.body.cantidadDisponible;
    var garantia = req.body.garantia;

    conexion.query('SELECT idCliente FROM clientes WHERE session_id = ?;', sessionId, (err,result)=>{
      if(err) throw err;
      else{
        var idCliente = result[0].idCliente;
        // console.log("idCliente: " + idCliente);
        conexion.query('INSERT INTO productos (id, nombre, url, activo, nombre_lista, precio, idCliente, localidad, envio_gratis, cantidad_disponible, garantia, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [id, nombre, url, activo, nombrelista, precio, idCliente, localidad, envioGratis, cantidadDisponible, garantia, img], (err,result)=>{
          if(err) throw err;
        });
      }
    });

    res.json({
      status: 'success',
      sessionId: req.sessionID
    });
});



app.post('/altaLista', function(req, res){
    console.log(req.body);

    var nombrelista = req.body.nombre;
    var sessionId = req.body.sessionId;

    conexion.query('SELECT idCliente FROM clientes WHERE session_id = ?;', sessionId, (err,result)=>{
      if(err) throw err;
      else{
        var idCliente = result[0].idCliente;
        conexion.query('INSERT INTO listas (nombre, idCliente) VALUES (?, ?);', [nombrelista, idCliente], (err,result)=>{
          if(err) throw err;
        });
      }
    });

    res.json({
      status: 'success',
      sessionId: req.sessionID
    });
    
});


app.post('/bajaProducto', function(req, res){
    // console.log(req.body);

    var categoryID = req.body.id;
    var sessionId = req.body.sessionId;

    conexion.query('SELECT idCliente FROM clientes WHERE session_id = ?;', sessionId, (err,result)=>{
      if(err) throw err;
      else{
        var idCliente = result[0].idCliente;
        conexion.query('DELETE FROM productos WHERE id = ? AND idCliente = ?;', [categoryID, idCliente], (err,result)=>{
          if(err) throw err;
        });
      }
    });

    
    
    res.json({
      status: 'success',
      sessionId: req.sessionID
    });

});


app.post('/bajaLista', function(req, res){
    // console.log(req.body);

    var nombrelista = req.body.nombre;
    var sessionId = req.body.sessionId;

    conexion.query('SELECT idCliente FROM clientes WHERE session_id = ?;', sessionId, (err,result)=>{
      if(err) throw err;
      else{
        var idCliente = result[0].idCliente;
        conexion.query('DELETE FROM productos WHERE nombre_lista = ? AND idCliente = ?;', [nombrelista, idCliente], (err,result)=>{
          if(err) throw err;
        }); 
        conexion.query('DELETE FROM listas WHERE nombre = ? AND idCliente = ?;', [nombrelista, idCliente], (err,result)=>{
          if(err) throw err;
        });
      }
    });
    
    
    res.json({
      status: 'success',
      sessionId: req.sessionID
    });
});
  

app.post('/modificarLista', function(req, res){
    // console.log(req.body);

    var nombreViejo = req.body.nombreViejo;
    var nombreNuevo = req.body.nombreNuevo;
    var sessionId = req.body.sessionId;


    conexion.query('SELECT idCliente FROM clientes WHERE session_id = ?;', sessionId, (err,result)=>{
      if(err) throw err;
      else{
        var idCliente = result[0].idCliente;
        conexion.query('SET foreign_key_checks = 0;', (err,result)=>{
          if(err) throw err;
        });
        
        conexion.query('UPDATE listas SET nombre = ? WHERE nombre = ? AND idCliente = ?;', [nombreNuevo, nombreViejo, idCliente], (err,result)=>{
          if(err) throw err;
        });

        conexion.query('UPDATE productos SET nombre_lista = ? WHERE nombre_lista = ? AND idCliente = ?;', [nombreNuevo, nombreViejo, idCliente], (err,result)=>{
          if(err) throw err;
        });
          
        conexion.query('SET foreign_key_checks = 1;', (err,result)=>{
          if(err) throw err;
        });
      }
    });

    

    res.json({
      status: 'success',
      sessionId: req.sessionID
    });
});


//cuando se habilite, poner "/" antes del 1
cron.schedule("*/1 * * * *", function(){
  console.log("schedule running...");
  
  verificarPrecios();
  
});


async function verificarPrecios(){
  var prods;

  var p1 = new Promise(function(resolve, reject){
    conexion.query('SELECT id, nombre, activo, precio, nombre_lista, idCliente FROM productos;', (err,result)=>{
      if(err) throw err;
      else{
        if(result != null){
          prods = result;
        }     
      }
      resolve(prods);
    });
  });

  const productos = await p1;
  
  if(productos != null){
    for(var i=0; i<productos.length; i++){
        var linkAPI = "https://api.mercadolibre.com/items/" + productos[i].id + "?include_attributes=all";
             
        var p2 = new Promise(function(resolve, reject){
          fetch(linkAPI).then(data => data.text()).then(data =>{
            var j = JSON.parse(data);
            var estado;
            if(j.status == "active"){
              estado = true;
            }
            else{
              estado = false;
            }

            var atributosProducto = {
              price: j.price,
              status: estado
            };
          
            resolve(atributosProducto);   
          });
        });
        
        const atributos = await p2;

        if(atributos.price == productos[i].precio){
          console.log("el precio de " + productos[i].id + " sigue igual perri y es: " + atributos.price);
        }
        else if(atributos.price != productos[i].precio){
          console.log("el precio de " + productos[i].id + " cambio y es este: " + atributos.price); 

          conexion.query('UPDATE productos SET precio = ? WHERE id = ?;', [atributos.price, productos[i].id], (err,result)=>{
            if(err) throw err;
          });

          var mail;
         
          
          var usuarioRegistrado;
          var p3 = new Promise(function(resolve, reject){
            conexion.query('SELECT COUNT(*) AS count FROM usuarios WHERE idCliente = ?;', productos[i].idCliente , (err,result)=>{
              if(err) throw err;
              else{
                if(result[0].count == 1){
                  usuarioRegistrado = true;
                }
                else{
                  usuarioRegistrado = false;
                }     
              }
              resolve(usuarioRegistrado);
            });
          });
          const uRegistrado = await(p3);

          if(uRegistrado == true){
            var p4 = new Promise(function(resolve, reject){
              conexion.query('SELECT usuario FROM usuarios WHERE idCliente = ?;', productos[i].idCliente , (err,result)=>{
                if(err) throw err;
                else{
                    mail = result[0].usuario;  
                }
                resolve(mail);
              });
            });     
            const mailUsuario = await(p4);

            var textoMail = "El precio del producto " + productos[i].id + " - " + productos[i].nombre + " perteneciente a la lista " + productos[i].nombre_lista + " cambio de precio. Su precio actual es de: " + atributos.price + "$";
            
            var mailOptions = {
              from: 'capytrack@gmail.com',
              to: mailUsuario,
              subject: 'CAPYTRACK',
              text: textoMail
            };
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            }); 
          }
        }
        if(atributos.status == productos[i].activo){
          var estadoActual;
          if(atributos.status == true){
            estadoActual = "active";
          }
          else{
            estadoActual = "paused";
          }

          console.log("El producto " + productos[i].id + " no cambio de estado, sigue: " + estadoActual);
        }
        else if(atributos.status != productos[i].activo){
          var estadoActual;
          if(atributos.status == true){
            estadoActual = "active";
          }
          else{
            estadoActual = "paused";
          }

          console.log("El producto " + productos[i].id + " cambio de estado a " + estadoActual);


          conexion.query('UPDATE productos SET activo = ? WHERE id = ?;', [atributos.status, productos[i].id], (err,result)=>{
            if(err) throw err;
          });

          var mail;
         
          
          var usuarioRegistrado;
          var p3 = new Promise(function(resolve, reject){
            conexion.query('SELECT COUNT(*) AS count FROM usuarios WHERE idCliente = ?;', productos[i].idCliente, (err,result)=>{
              if(err) throw err;
              else{
                if(result[0].count == 1){
                  usuarioRegistrado = true;
                }
                else{
                  usuarioRegistrado = false;
                }     
              }
              resolve(usuarioRegistrado);
            });
          });
          const uRegistrado = await(p3);

          if(uRegistrado == true){
            var p4 = new Promise(function(resolve, reject){
              conexion.query('SELECT usuario FROM usuarios WHERE idCliente = ? AND suscripcion IN (?, ?);', [productos[i].idCliente, 2, 3] , (err,result)=>{
                var mail = null; 
                if(err) throw err;
                else if(result.length > 0){
                    console.log("usuarios encontrados")
                    var promesa = new Promise(function(resolve, reject){
                    var mail2;
                    conexion.query('SELECT notificarPrecio FROM usuarios WHERE idCliente = ?', productos[i].idCliente, (err,res)=>{
                      if(err) throw err;
                      else if(res[0].notificarPrecio == 1){
                        mail2 = result[0].usuario;  
                      }else{
                        mail2 = null;
                      }
                      resolve(mail2);
                    });
                  });
                  async function obtenerMail2(promesa){
                    return await(promesa);
                  }
                  mail = obtenerMail2(promesa);

                }
                else{
                  mail = null;
                }
                resolve(mail);
              });
            });     
            const mailUsuario = await(p4);

            if(mailUsuario != null){
            var textoMail = "El precio del producto " + productos[i].id + " - " + productos[i].nombre + " perteneciente a la lista " + productos[i].nombre_lista + " cambio de precio. Su precio actual es de: " + precioActual + "$";
            
            var mailOptions = {
              from: 'capytrack@gmail.com',
              to: mailUsuario,
              subject: 'CAPYTRACK',
              text: textoMail
            };
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            }); 
          }
          }
        }
    }
  }
  
}


app.post('/productosCliente', (req, res)=>{
  
  var idSession = req.body.idSession;

  devolverProductosCliente(idSession).then(productos => {
    res.json({
      status: 'success',
      prods: productos,
      sessionId: req.sessionID
    });
  });

});
async function devolverProductosCliente(idSession){

  var p1 = new Promise(function(resolve, reject){
    
    conexion.query('SELECT idCliente FROM clientes WHERE session_id = ?;', idSession , (err,result)=>{
      var idCliente;
      if(err) throw err;
      else{
        idCliente = result[0].idCliente;       
      }
      resolve(idCliente);
    });
  });
  
  const idCliente = await (p1);

  var p2 = new Promise(function(resolve, reject){
    console.log("idCliente: " + idCliente);
    conexion.query('SELECT * FROM productos WHERE idCliente = ?;', idCliente , (err,result)=>{
      var prods = [];
      if(err) throw err;
      else{
        prods = result;      
      }
      resolve (prods);
    });
  });

  const productos = await (p2);

  return productos;
  
}

/*
app.get('/productosCliente', (req, res)=>{
  conexion.query('SELECT id, activo, precio, nombre_lista FROM productos;', (err,result)=>{
    if(err) throw err;
    else{
      res.send(result); 
    }
  });
});
*/
/*
app.post('/productosCliente', (req, res)=>{
  console.log(req.body);
  
  var idSession = req.body.idSession;

  
  devolverProductosCliente(idSession).then(productos => {
    //console.log("productos: " + productos);
    res.json({
      status: 'success',
      prods: productos,
      sessionId: req.sessionID
    });
  });
});
*/
/*
async function devolverProductosCliente(idSession){
  var sessionId = idSession;
  var p1 = new Promise(function(resolve, reject){
    
    conexion.query('SELECT idCliente FROM clientes WHERE session_id = ?;', sessionId , (err,result)=>{
      var idCliente;
      if(err) throw err;
      else{
        console.log("idCliente productosCliente: " + result.length);
        idCliente = result[0].idCliente;
            
      }
      resolve(idCliente);
    });
  });
  
  const idCliente = await (p1);

  var p2 = new Promise(function(resolve, reject){
    console.log("idCliente" + idCliente);
    conexion.query('SELECT * FROM productos WHERE idCliente = ?;', idCliente , (err,result)=>{
      var prods = [];
      if(err) throw err;
      else{       
        prods = result;      
      }
      resolve (prods);
    });
  });

  const productos = await (p2);

  console.log("productos: " + productos[0]);
  return productos;
  
}
*/



app.get('/', (req, res)=>{
  console.log(req.body);
  console.log(req.sessionID);
});


async function validacionUsuario(usuario, contrasena, sessionId){
  var existeUsuario = false;
  var usuarioRegistrado = false;
  var inicioSesion = false;
  
  var p1 = new Promise(function(resolve, reject){
    //'SELECT COUNT(*) AS count FROM usuarios WHERE usuario = "" OR 1 = 1 --; DROP TABLE usuarios;'
    conexion.query('SELECT COUNT(*) AS count FROM usuarios WHERE usuario = ?;', [usuario], (err,result)=>{
      if(err) throw err;
      else{
        // console.log(result[0].count);
        if(result[0].count == 0){
          existeUsuario = false;
        }
        else if(result[0].count != 0){
          existeUsuario = true;
        }
        resolve(existeUsuario);
      }
    });
  });

  const existeU = await(p1);

  if(existeU == false){
    var p3 = new Promise(function(resolve, reject){
      conexion.query('SELECT idCliente FROM clientes WHERE session_id = ?;', sessionId, (err,result)=>{
        if(err) throw err;
        else{
          var idCliente = result[0].idCliente;
          // console.log(idCliente);
          var p2 = new Promise(function(resolve, reject){
            conexion.query('INSERT INTO usuarios (usuario, contrasena, idCliente, suscripcion, notificarPrecio, notificarEstado) VALUES (?, ?, ?, ?, ?, ?);', [usuario, contrasena, idCliente, 0, true, true], (err,result)=>{
              if(err) throw err;
              else{
                var US = true;
                resolve(US);
              }
            });
          });
          async function traerUS(p2){
            return await p2;
          }; 
          var US = traerUS(p2); 
          resolve(US);    
        }
      });
    });
    usuarioRegistrado = await(p3);
  }
  else{
    var p4 = new Promise(function(resolve, reject){
      conexion.query('SELECT contrasena FROM usuarios WHERE usuario = ?;', usuario, (err,result)=>{
        if(err) throw err;
        else{
          var is = false;
          if(result[0].contrasena == contrasena){
            is = true;
          }
        }
        resolve(is);
      });
    });
    inicioSesion = await(p4);
    usuarioRegistrado = false;
  }

  if(usuarioRegistrado = true){
    return "usuario_registrado";
  }
  else if(usuarioRegistrado == false && inicioSesion == false){
    return "usuario_no_registrado";
  }
  else if(usuarioRegistrado == false && inicioSesion == true){
    return "usuario_inicio_sesion"
  }
  
}

app.post('/altaUsuario', function(req, res){
  // console.log(req.body);

  var usuario = req.body.usuario;
  var contrasena = req.body.contrasena;
  var sessionId = req.body.sessionId;
  var usuarioRegistrado;

  validacionUsuario(usuario, contrasena, sessionId).then(registrado => {
    // console.log(registrado);
    usuarioRegistrado = registrado;
    res.json({
      status: 'success',
      usuarioRegistrado: usuarioRegistrado,
      sessionId: req.sessionID
    });
  });
});

app.listen(3000, () => {
  console.log('Server listening on localhost:3000');
});


//Envio de mail

/*
// app.post('/enviarMail', function(req, res){
//   
//   res.json({
//     status: 'success'
//   });
// });

app.post('/reciboMail', function(req, res){
  transporter.sendMail(req.body, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.json({
    status: 'success'
  });
});
*/