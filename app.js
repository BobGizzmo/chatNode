var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var session = require('express-session')({
    secret: "123456",
    resave: true,
    saveUninitialized: true
});
var ioSession = require('express-socket.io-session');

server.listen(8080);//On lance le serveur

app.use(express.static('public'))//On indique a express où se trouveront nos fichier static (css, js, etc..)
    .use(session)// active les session dans l'application
    .get('/', function (req, res) {
        //Va chercher le fichier 'index.ejs' dans un dossier views par defaut
        res.render('index.ejs');
    })

io.use(ioSession(session)); //On charge notre session dans le module session de socket.io

//Quand l'event connection est détecté
io.on('connection', function (socket) {
  //On crée et envois un event que l'on appelle "message" au client
  socket.emit('message','Connexion établie');

  //Quand l'event newClient est détecté
  socket.on('newClient', function(pseudo) {
      //On stocke le pseudo du client dans la session
      socket.handshake.session.pseudo = pseudo;
      //Puis on créé un event du nom de newClient que l'ont envoi à tous les participants excepté à l'émetteur du l'event
      socket.broadcast.emit('newClient', pseudo+' a rejoint le chat');
  });

  socket.on('newMessage', function(message) {
      ////On créé un event du nom de newMessage que l'ont envoi à tous les participants excepté à l'émetteur de l'event
      socket.broadcast.emit('newMessage', {pseudo: socket.handshake.session.pseudo, message: message});
  })

});