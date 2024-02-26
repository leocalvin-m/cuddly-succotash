const server = require("http").createServer();
const express = require("express");
const WSServer = require("ws").Server;
const app = express();

app.get("/",(req, res) => {
	res.sendFile('index.html',{root:__dirname});
})
server.on("request",app);

server.listen(3000,() => console.log("Listeing on port 3000"))

const wss = new WSServer({server:server});

wss.on('connection',(ws)=>{

	const numofClinets = wss.clients.size;
	console.log("clients Connected: "+numofClinets);
	wss.broadcast("current visitors: "+ numofClinets);
	if(wss.readyState === ws.OPEN){
		wss.send("welcome to MOBSTORE");
	}

	wss.on('close',()=>{
		console.log("A Client has Disconnected");
	})
})

wss.broadcast = (data) => {
	wss.clients.forEach((client) =>{
		client.send(data);
	})
}