const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const db = require('./db');

const path = require('path');
var port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const routes = require('./routes');

//set up CSS paths
app.use('/vendor', express.static(path.join((__dirname, 'node_modules'))));

//nunjucks configure
nunjucks.configure('views', {noCache: true});
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

//body parsing and method override
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('method-override')('_method'));


// redirect to routes
app.use('/', routes);





//listening to port
app.listen(port, function(){
  console.log(`server listening on port ${port}`);
  db.sync()
    .then(function(){
      console.log('Data is synced');
      return db.seed();
    })
    .catch(function(err){
      console.log(err);
    });
});
