const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();


app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.json());   
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/api', function(req, res, next){
    console.log(req.body);
    res.json({
      status: 'success',
      productos: req.body
    });
  });

app.listen(3000, () => {
    console.log('Server listening on localhost:3000');
});