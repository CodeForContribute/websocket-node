import WebSocket, { WebSocketServer } from "ws";
import http from 'http'
// https://datatracker.ietf.org/doc/html/rfc6455

// create a http server first for simple ping-pong
const server = http.createServer(function(req:any,res:any){
    console.log((new Date() + 'Received request for ' + req.url));
    res.end("hi there");
});

// count total users connected
let usersConnected = 0;
// create a websocket connection server
const wss = new WebSocketServer({server});
wss.on('connection',function connection(websocket){
    websocket.on('error',(err)=> console.error(err));
    websocket.on('message',function message(data,isBinary){
        wss.clients.forEach(function each(client){
            if(client.readyState == WebSocket.OPEN){
                client.send(data,{binary:isBinary});
            }
        });
    });
    ++usersConnected;
    console.log("user connected: " + usersConnected);
    websocket.send("Hello msg from server !!");
});
// http server is listening on port 8080
// an initial http server will automatically upgraded to websocket.
server.listen(8080, function(){
    console.log((new Date() + 'Server is listening on port 8080'));
});