var socket = io.connect('http://localhost:8080');// On connecte le client au serveur

//Quand on detecte l'event du nom de "message" envoyé par le serveur
socket.on('message', function(message) {
    $('#messageBox').prepend(message);//On l'écrit dans notre div#messageBob
});

const pseudo = prompt("Entre un pseudo pour commencer à chatter !");
socket.emit('newClient', pseudo);//On emet un nouvel event "newClient" et on lui passe le pseudo

//Quand on detecte l'event du nom de "newClient" envoyé par le serveur
socket.on('newClient', function(message) {
    $('#messageBox').prepend('<p class="col-10 offset-1">'+message+'</p>');
})

//Quand on detecte l'event du nom de "newMessage" envoyé par le serveur
socket.on('newMessage', function(newMessage) {
    $('#messageBox').prepend(getParts(newMessage.pseudo, newMessage.message));
});

function send() {
    var message = $('#message').val();//On récupère la valeur de l'input#message
    $('#messageBox').prepend(getParts(pseudo, message));

    //On emet un nouvel event "newMessage" et on lui passe le message
    socket.emit('newMessage', message);
    $('#message').val("");//On vide l'input#message
}

function getParts(pseudonyme, message) {
    var offset = pseudo === pseudonyme ? "offset-6" : "offset-1";

    return '<div class="row col-6 pl-1 '+offset+'">'
                +'<p class="col-12 mb-0 pl-0"><strong>'+pseudonyme+'</strong></p>'
                +'<div class="col-8 p-4 border rounded">'+message+'</div>'
            +'</div>';
}