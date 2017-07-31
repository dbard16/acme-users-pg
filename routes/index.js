'use strict'

var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/', function(req, res, next){
  res.render('index')
});

router.get('/users', function(req, res, next){
  db.getUsers(false)
    .then(function(users){
      res.render('users', {
        users: users
      });
    })

});

router.post('/users', function(req, res, next){

  var man = true;
  if(!req.body.manager){
    man = false;
  }
  db.createUser(req.body.user, man)
  if (!man){
    res.redirect('/users');
  }
  else{
    res.redirect('/users/managers');
  }

});

router.put('/users/:id', function(req, res, next){


  db.getUser(req.params.id)
    .then(function(user){
      var curMan = user.rows[0].manager;

      db.updateUser(req.params.id);
      if(curMan){
        res.redirect('/users');
      }
      if(!curMan){
        res.redirect('/users/managers');
      }
    });
  });

router.delete('/users/:id', function(req, res, next){
  db.deleteUser(req.params.id);
  res.redirect('/users');

});

router.get('/users/managers', function(req, res, next){
db.getUsers(true)
  .then(function(managers){

    res.render('managers', {
      managers: managers
    });
  })
});


module.exports = router;
