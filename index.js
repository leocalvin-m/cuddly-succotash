const http = require("http");

http.createServer((req, res)=>{
	res.write("HiHello again Nice Try");
	res.end();
}).listen(3000);

console.log("Hi Server running on port 3000.....");
