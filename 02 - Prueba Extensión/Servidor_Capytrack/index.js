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

var options = {
  hots: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'capytrack'
};

var sessionStore = new MySQLStore(options);

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
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


app.get('/session', (req, res) => {
  var sessionId = req.sessionID;
  conexion.query('INSERT INTO sessions (session_id) VALUES (?);', sessionId, (err,result)=>{
    if(err) throw err;
  });
  res.send(sessionId);

});

app.post('/updateSessionId', (req, res) => {
  var idAnterior = req.body.idAnterior;
  var idNuevo = req.body.idNuevo;
  
  updateSessionId(idNuevo, idAnterior);

});

async function updateSessionId(idNuevo, idAnterior){
  var masDeUnRegistro = false;
  var p1 = new Promise(function(resolve, reject){
    conexion.query('SELECT COUNT(*) AS count FROM sessions;', (err,result)=>{
      if(err) throw err;
      else if(result[0].count > 1){
        masDeUnRegistro = true;
      }
      resolve(masDeUnRegistro);
    });
  });

  const hacerDelete = await(p1);
  
  if(hacerDelete == true){
    conexion.query('DELETE FROM sessions WHERE session_id = ?;', idNuevo, (err,result)=>{
      if(err) throw err;
    });
  }
  
  conexion.query('UPDATE sessions SET session_id = ? WHERE session_id = ?;', [idNuevo, idAnterior], (err,result)=>{
    if(err) throw err;
  });

  var sinRegistros = false;
  var p2 = new Promise(function(resolve, reject){
    conexion.query('SELECT COUNT(*) AS count FROM clientes;', (err,result)=>{
      if(err) throw err;
      else if(result[0].count == 0){
        sinRegistros = true;
      }
      resolve(sinRegistros);
    });
  });

  const guardarSession = await(p2);

  if(guardarSession == true){
    conexion.query('INSERT INTO clientes (session_id) VALUES (?);', idNuevo, (err,result)=>{
      if(err) throw err;
    });
  }
  else{
    conexion.query('UPDATE clientes SET session_id = ? WHERE session_id = ?;', [idNuevo, idAnterior], (err,result)=>{
      if(err) throw err;
    });
  }

}


app.post('/altaProducto', function(req, res){

    console.log(req.body);
    
    var id = req.body.id;
    var nombre = req.body.title;
    var url = req.body.permalink;
    var activo = Boolean(req.body.status);
    var nombrelista = req.body.nombrelista;
    var precio = req.body.price;
    var sessionId = req.body.sessionId;

    conexion.query('SELECT idCliente FROM clientes WHERE session_id = ?;', sessionId, (err,result)=>{
      if(err) throw err;
      else{
        var idCliente = result[0].idCliente;
        console.log("idCliente: " + idCliente);
        conexion.query('INSERT INTO productos (id, nombre, url, activo, nombre_lista, precio, idCliente) VALUES (?, ?, ?, ?, ?, ?, ?);', [id, nombre, url, activo, nombrelista, precio, idCliente], (err,result)=>{
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
    console.log(req.body);

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
    console.log(req.body);

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
    console.log(req.body);

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
        /*
        conexion.query('UPDATE listas INNER JOIN productos ON productos.nombre_lista = listas.nombre SET listas.nombre = ?, productos.nombre_lista = ? WHERE listas.nombre = ?;', [nombreNuevo, nombreNuevo, nombreViejo], (err,result)=>{
          if(err) throw err;
        });
        */
        
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

/* //cuando se habilite, poner "/" antes del 1
cron.schedule("*1 * * * *", function(){
  console.log("schedule running...");
  
  verificarPrecios();
  
});


async function verificarPrecios(){
  var prods;
  var p1 = new Promise(function(resolve, reject){
    conexion.query('SELECT id, precio FROM productos;', (err,result)=>{
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
            resolve(j.price);   
          });
        });
        
        const precioActual = await p2;

        if(precioActual == productos[i].precio){
          console.log("el precio de " + productos[i].id + " sigue igual perri y es: " + precioActual); 
        }
        else{
          console.log("el precio de " + productos[i].id + " cambio y es este: " + precioActual);  
        }
    }
  }

}

*/


app.get('/', (req, res)=>{
  console.log(req.body);
  console.log(req.sessionID);
});


async function validacionUsuario(usuario, contrasena, sessionId){
  var existeUsuario = false;
  var usuarioRegistrado = false;
  
  var p1 = new Promise(function(resolve, reject){
    conexion.query('SELECT COUNT(*) AS count FROM usuarios WHERE usuario = ?;', [usuario], (err,result)=>{
      if(err) throw err;
      else{
        console.log(result[0].count);
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
          var p2 = new Promise(function(resolve, reject){
            conexion.query('INSERT INTO usuarios (usuario, contrasena, idCliente) VALUES (?, ?, ?);', [usuario, contrasena, idCliente], (err,result)=>{
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
    usuarioRegistrado = false;
  }

  return usuarioRegistrado;
  
}

app.post('/altaUsuario', function(req, res){
    console.log(req.body);

    var usuario = req.body.usuario;
    var contrasena = req.body.contrasena;
    var sessionId = req.body.sessionId;
    var usuarioRegistrado;

    validacionUsuario(usuario, contrasena, sessionId).then(registrado => {
      console.log(registrado);
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

/*
//Envio de mail
var nodemailer = require('nodemailer');
const { access } = require('fs');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'capytrack@gmail.com',
    pass: '/Capytrack20'
  }
});

app.post('/enviarMail', function(req, res){
  var mailOptions = {
    from: 'capytrack@gmail.com',
    to: 'iaraazulfryc@gmail.com',
    subject: 'CAPYTRACK',
    text: 'jaja re caro el dólar'
  };
  transporter.sendMail(mailOptions, function(error, info){
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
});*/
