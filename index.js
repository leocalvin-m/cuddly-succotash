const server = require("http").createServer();
const sqlite = require("sqlite3");
const express = require("express");

const WSServer = require("ws").Server;
const app = express();

app.get("/",(req, res) => {
	res.sendFile('index.html',{root:__dirname});
})
server.on("request",app);
server.listen(3000,() => console.log("Listeing on port 3000"))

const wss = new WSServer({server:server});

process.on("SIGINT", () => {
	wss.clients.forEach(client => client.close());
	server.close(() => {
		shutdownDB();
	})
})


wss.on('connection',(ws)=>{

	const numofClinets = wss.clients.size;
	console.log("clients Connected: "+numofClinets);
	wss.broadcast("current visitors: "+ numofClinets);
	if(wss.readyState === ws.OPEN){
		wss.send("welcome to MOBSTORE");
	}

	db.run(`INSERT INTO visitors (count, time)
	VALUES (${numofClinets}, datetime('now'))
	`);
	wss.on('close',()=>{
		console.log("A Client has Disconnected");
	})
})

wss.broadcast = (data) => {
	wss.clients.forEach((client) =>{
		client.send(data);
	})
}

const db = new sqlite.Database(":memory");

db.serialize(() => {
	db.run(
		`CREATE TABLE visitors(
			count INTEGER,
			time TEXT
		)`
	)
})

const getCounts = () => {
	db.each("SELECT * FROM visitors", (err, row) => {
		console.log(row);
	})
}

const shutdownDB = () => {
	getCounts();
	console.log("shutting down...");
	db.close();	
}
