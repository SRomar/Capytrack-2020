const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');
const cron = require('node-cron');
const fetch = require('node-fetch');
const socketServer = require('http').createServer(app);
const io = require('socket.io')(socketServer);

socketServer.listen(3002, function(){
  console.log('Socket server listening on: 3002');
});

io.on('connection', function(socket){
  console.log('Socket connection established');
  var clienteId = socket.id;
  console.log("clienteId: " + clienteId);

  conexion.query('INSERT INTO clientes (conexion_socket) VALUES (?)', [clienteId], (err,result)=>{
    if(err) throw err;
  });

});
 
var http = require('http');
var request = require('request');


const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'Velnias',
  password: '/Velnias7',
  database: 'capytrack'
});

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.json());   
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/altaProducto', function(req, res){

    console.log(req.body);
    
    var id = req.body.id;
    var nombre = req.body.title;
    var url = req.body.permalink;
    var activo = Boolean(req.body.status);
    var nombrelista = req.body.nombrelista;
    var precio = req.body.price;

    conexion.query('INSERT INTO productos (id, nombre, url, activo, nombre_lista, precio) VALUES (?, ?, ?, ?, ?, ?);', [id, nombre, url, activo, nombrelista, precio], (err,result)=>{
      if(err) throw err;
    });
    
    res.json({
      status: 'success',
      productos: req.body
    });
});


app.post('/altaLista', function(req, res){
    console.log(req.body);
    
    var nombrelista = req.body.nombre;
    
    conexion.query('INSERT INTO listas (nombre) VALUES (?);', nombrelista, (err,result)=>{
      if(err) throw err;
    });
    
    res.json({
      status: 'success',
      productos: req.body
    });
    
});


app.post('/bajaProducto', function(req, res){
    console.log(req.body);

    var categoryID = req.body.id;

    conexion.query('DELETE FROM productos WHERE id = ?;', categoryID, (err,result)=>{
      if(err) throw err;
    });
    
    res.json({
      status: 'success',
      productos: req.body
    });

});


app.post('/bajaLista', function(req, res){
    console.log(req.body);

    var nombrelista = req.body.nombre;

    conexion.query('DELETE FROM productos WHERE nombre_lista = ?;', nombrelista, (err,result)=>{
      if(err) throw err;
    });

    conexion.query('DELETE FROM listas WHERE nombre = ?;', nombrelista, (err,result)=>{
      if(err) throw err;
    });
    
    res.json({
      status: 'success',
      productos: req.body
    });
});
  

app.post('/modificarLista', function(req, res){
    console.log(req.body);

    var nombreViejo = req.body.nombreViejo;
    var nombreNuevo = req.body.nombreNuevo;

    conexion.query('SET foreign_key_checks = 0;', (err,result)=>{
      if(err) throw err;
    });

    conexion.query('UPDATE listas INNER JOIN productos ON productos.nombre_lista = listas.nombre SET listas.nombre = ?, productos.nombre_lista = ? WHERE listas.nombre = ?;', [nombreNuevo, nombreNuevo, nombreViejo], (err,result)=>{
      if(err) throw err;
    });
      
    conexion.query('SET foreign_key_checks = 1;', (err,result)=>{
      if(err) throw err;
    });

    res.json({
      status: 'success',
      productos: req.body
    });
});

/*
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

app.post('/altaUsuario', function(req, res){
    console.log(req.body);

    var usuario = req.body.usuario;
    var contrasena = req.body.contrasena;

    conexion.query('INSERT INTO usuarios (usuario, contrasena) VALUES (?, ?)', [usuario, contrasena], (err,result)=>{
      if(err) throw err;
    });

    /*conexion.query('SELECT usuario FROM usuarios WHERE usuario = ?', [usuario], (err,result)=>{
      if(err) throw err;
      else{
        if(result == null){
          conexion.query('INSERT INTO usuarios (usuario, contrasena) VALUES (?, ?)', [usuario, contrasena], (err,result)=>{
            if(err) throw err;
          });
        }
        else{
          //responder que el usuario ya esta en uso
          console.log("usuario ya ingresado");
        }
      }
    });*/

    

    res.json({
      status: 'success',
      productos: req.body
    });
});

app.listen(3000, () => {
    console.log('Server listening on localhost:3000');
});


//Envio de mail
var nodemailer = require('nodemailer');
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
});

