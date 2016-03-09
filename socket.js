var fs = require('fs');
var index = fs.readFileSync('index.html');
var app = require('http').createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});
var io = require('socket.io')(app);

var port = process.env.PORT || 5000;

app.listen(port);

console.log("Server starting on port "+port+".");


var players = [
    {   id: 1,
        name : "Player 1 ",
        score: 0
    },
    {
        id: 2,
        name : "Player 2 ",
        score: 0
    }


]




io.on('connection', function (socket) {
    console.log("Connection established");



    socket.on("getCurrentState",function(){
         console.log(players);
        socket.emit("currentState",players);
    });


    socket.on('score', function (data) {
       if(data.id === 1 || data.id === 2 ){
            players[data.id-1].score++;

            io.emit("currentState", players);
        }
    });

    socket.on('restart', function (data) {

            clearScore();
            console.log("restarting! " + players);
            io.emit("currentState", players);


    });


    function clearScore(){
      players[0].score = 0;
      players[1].score = 0;
    }

     socket.on('playerNameChanged', function (data) {
        console.log("Plauer name " + JSON.stringify(data));
        var name = data.name;
        var id = data.id;
        players[id].name = name;

        io.emit("currentState", players);

    });






});
