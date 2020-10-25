const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');
const cron = require('node-cron');
 

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
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
  var productos;

  conexion.query('SELECT id, precio FROM productos;', (err,result)=>{
    if(err) throw err;
    else{
      if(result != null){
        productos = result;
      }
      
    }
  });
  if(productos != null){
    for(i=0; i<productos.length; i++){
        var linkAPI = "https://api.mercadolibre.com/items/" + productos[i].id + "?include_attributes=all";
                      
        fetch(linkAPI).then(data => data.text()).then(data =>{
          var j = JSON.parse(data);
          if(j.price == productos[i].precio){
            console.log("el precio sigue igual perri");
          }
          else{
            console.log("el precio cambio y es este: " + j.price);
          }
        });
    }
  }
  
});*/


app.listen(3000, () => {
    console.log('Server listening on localhost:3000');
});