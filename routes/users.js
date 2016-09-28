module.exports = function(app) {

  var User = require('../models/user.js');
  var Transference = require('../models/transference.js');

  
  /*var whitelist = ['http://10.18.1.58:3000', 'http://10.18.1.64:$', 'http://10.18.1.96:$'];

  var corsOptions = {
  origin: function(origin, callback){
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(originIsWhitelisted ? null : 'Bad Request cors', originIsWhitelisted);
    }
  };
*/


  findAllUsers = function(req, res) {
    User.find(function(err, users) {
      if(!err) {
        console.log('GET /users')
        res.send(users);
      } else {
        console.log('ERROR: ' + err);
      }
    });
  }

  //POST - Insert a new User in the DB
  addUser = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var user = new User({
      username: req.body.username,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      cuentasDeb: ['B1', 'B2', 'B3'],
      cuentasCre: ['B2', 'B4', 'B6'],
      imgUrl: "http://10.18.1.96:4000/wallpaper.jpg",
      lastConnection:"Lunes 29 de Noviembre a las 13:24"
    });

    user.save(function(err) {
      if(!err) {
        console.log('Created');
      } else {
        console.log('Error' + err);
      }
    });
    res.send(user);
  }

  findUserById = function(req, res) {
    User.findById(req.params.id, function(err, user) {
      if (!err) {
        console.log('GET' + req.params.id);
        res.send(user);  
      } else {
        console.log('ERROR' + err);
      }    
    });
  }



  logginUsername = function(req, res) {
    console.log('POST loggin user');


    var query = User.findOne({ 'username': req.body.username });
    query.select('_id');
    console.log("body:", req.body);

    if (Object.keys(req.body).length == 0){
      var ErrorResponse = {"code": "xx", "severidad": "grave", "text": "No body .."}; 
      console.log("no body");
      res.send(ErrorResponse);
    }

    query.exec(function (err, imgURL) {
      if (!err){
        console.log('Correct');
        console.log(imgURL);
        if (!imgURL) {
          var ErrorResponse = {"code": "01", "severidad": "leve", "text": "No existe el usuario"}; 
          console.log("no usuario");
          res.send(ErrorResponse);
        } else {
          res.send(imgURL);
        }
      } else {
        console.log('ERROR' + err);
      }
    });
  }

  logginPassword = function(req, res) {
    console.log('POST loggin pass');

    if (req.body.password === "" ) {
      var ErrorResponse = {"cod3": "03", "severidad": "leve", "text": "Ingrese una contraseña"}; 
      res.send(ErrorResponse);
      /// Terminar transaccion
    }

    var query = User.findOne({ "username": req.body.username });
    console.log("body+++++++++:", req.body);
    query.select('password');

    query.exec(function (err, result) {
      if (!err) {
        console.log('Correct');
        console.log("pass: " + result.password);
        console.log("pass: " + req.body.password);
        if (req.body.password === result.password) {
        //if (result.password) {
          console.log("loggin aceptado");

          // Definir ruta a seguir
          nextRoute = "transaction1"
          var _200Response = {"cod2": "200", "url": nextRoute}; 
          //var _200Response = {"cod2": "200"}; 
          res.send(_200Response);
        } else {
          var ErrorResponse = {"cod2": "02", "severidad": "leve", "text": "Contraseña incorrecta"}; 
          console.log("incorrect password");
          res.send(ErrorResponse);
        }
      } else {
        console.log('ERROR' + err);
      }
    });
  }

  fetchAccountsInfo = function (req, res) {
    console.log('GET accounts info');
    var query = User.findOne({ 'username': req.query.username });
    query.select('cuentasCre cuentasDeb');
    query.exec(function (err, cuentas) {
      if(!err) {
        console.log(cuentas);
        res.send(cuentas);    
      }
    });
  }

  fetchCreditAccounts = function (req, res) {
    console.log('GET credit accounts ');
    var query = User.findOne({ 'username': req.query.username });
    query.select('cuentasCre');
    query.exec(function (err, cuentas) {
      if(!err) {
        console.log(cuentas);
        res.send(cuentas);    
      }
    });
  }

  fetchDebitAccounts = function (req, res) {
    console.log('GET debit accounts');
    var query = User.findOne({ 'username': req.query.username });
    query.select('cuentasDeb');
    query.exec(function (err, cuentas) {
      if(!err) {
        console.log(cuentas);
        res.send(cuentas);    
      }
    });
  }

  fetchMenuOptions = function (req, res) {
    console.log('GET menu info');
    var username = req.query.username;
    var Response = {"consultas": ["posicion", "estado de cuenta"], "transferencias": ["Entre Cuentas", "A terceros"]};
    res.send(Response);
  }

  fetchUserInfo = function (req, res) {
    console.log('GET user info');
    var query = User.findOne({ 'username': req.query.username });
    query.select('firstname lastname lastConnection');
    query.exec(function (err, userInfo) {
      if(!err) {
        console.log(userInfo);
        res.send(userInfo);
      }
    });
  }

  transferenceStep1 = function (req, res) {
    console.log("validate ..");
    res.send({"Status": "ok"});
  }

  transferenceStep2 = function (req, res) {
    console.log("POST Token");
    console.log("validate..");
    var token = req.body.token;
    if (token === "") {
      console.log("token vacio");
      var ErrorResponse = {"cod2": "11", "severidad": "leve", "text": "Ingrese su codigo token"};  
      res.send(ErrorResponse);
      ///Terminar         
    }

    //Consultar valor de token back
    CURRENT_TOKEN_VALUE = "741"
    if (token != CURRENT_TOKEN_VALUE) {
      console.log("token incorrecto");
      var ErrorResponse = {"cod2": "12", "severidad": "media", "text": `El codigo ${token} no corresponde a su token`};  
      res.send(ErrorResponse);
      ///Terminar
    }

    // Create transference
    var transference = new Transference({
      accountFrom: req.body.accountFrom,
      accountTo: req.body.accountTo,
      importe: req.body.importe,
      reference: req.body.reference,
      username: req.body.username,
    });
    transference.save(function(err) {
      if(!err) {
        console.log('transference sucessfully created');
        res.send(transference);
      } else {
        console.log('ERROR' + err);
      }
    });

  }

  //Link routes and functions
  app.get('/users', findAllUsers);
  app.get('/user/:id', findUserById)
  app.post('/users', addUser);
  app.post('/logginUsername', logginUsername);
  app.post('/logginPassword', logginPassword);
  app.get('/fetchAccountsInfo', fetchAccountsInfo);
  app.get('/fetchMenuOptions', fetchMenuOptions);
  app.get('/fetchUserInfo', fetchUserInfo);
  app.post('/transferenceStep1', transferenceStep1);
  app.post('/transferenceStep2', transferenceStep2);
  app.get('/fetchCreditAccounts', fetchCreditAccounts);
  app.get('/fetchDebitAccounts', fetchDebitAccounts);

}