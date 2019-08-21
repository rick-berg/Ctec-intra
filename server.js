DEFAULT_PORT	= 8080;
SERVER_PORT 	= DEFAULT_PORT;
var parse_next = false;
process.argv.forEach(function (val, index, array) 
{
	if(parse_next == 'port')
	{
		if(val.match(/[^0-9]/g) != null)
			process.exit(console.log("Error : Port must be an int!"));
		else if(val <=0 || val > 65535)
			process.exit(console.log("Error : Port must be in the range 1-65535"));
		else
		{
			SERVER_PORT = val;
			console.log("Changed port from "+DEFAULT_PORT+" to "+SERVER_PORT);
		}
	}
	else
	{
		if(val == '-p')		parse_next = 'port'
	}
});

var express = require('express');
var http	= require('http');
var mysql	= require('mysql');

var app 	= express();
var router = express.Router();

var path = __dirname + '/public/';
router.use(function(req,res,next){
	console.log("/"+ req.method);
	next();
});
router.get("/",function(req,res){
	res.sendFile(path+"index.html");
});

router.get("/reelLogger",function(req,res){
	res.sendFile(path+"reelLogger.html");
});



var con = mysql.createConnection({
	host:		'localhost',
	user: 		'smtuser',
	password:	'ctec69sql',
	database:	'smtreelprocess'
});

app.get('/dbRead', function(req, res){
	con.connect(function(err){
	//pg.connect(pg_connectionString,function(err,client,done) {
		if (err){
			console.log('server connect fail : '+err);
			res.status(400).send(err);
		}
		con.query('SELECT * FROM reellog', (err, result, fields) =>{
//		pool.query('SELECT NOW()', (err, result) =>{
			//done();
			if(err){
				console.log(err);
				res.status(400).send(err);
			}
//			res.status(200).send(result.rows);
//			res.status(200).send(result);
			var json = result
			var fields = Object.keys(json[0]) 
			var replacer = function(key, value) { return value === null ? '' : value}
			var csv = json.map(function(row){
				return fields.map(function(fieldName){
					return JSON.stringify(row[fieldName], replacer)
					}).join(',')
				})
			csv.unshift(fields.join(","))
			res.status(200).send(csv.join("<br>"))
		});
	});
});


app.get('/mysqlReadBetweenDates', function(req, res){
	
	var myObject = JSON.parse(req.query.q)
	console.log('query the database between these dates '+req.query.q);
//	res.setHeader('Content-Type','application/json');
//	res.send(myObject);	
	
	con.connect(function(err){
	//pg.connect(pg_connectionString,function(err,client,done) {
		if (err){
			console.log('server connect fail : '+err);
			res.status(400).send(err);
		}
		con.query('SELECT * FROM reellog WHERE processtimestamp>='+myObject.startDate+' AND processtimestamp< '+myObject.endDate, (err, result, fields) =>{
		// between 
//		pool.query('SELECT NOW()', (err, result) =>{
			//done();
			if(err){
				console.log(err);
				res.status(400).send(err);
			}
//			res.status(200).send(result.rows);
	//			res.status(200).send(result);
			var json = result
			var fields = Object.keys(json[0]) 
			var replacer = function(key, value) { return value === null ? '' : value}
			var csv = json.map(function(row){
				return fields.map(function(fieldName){
					return JSON.stringify(row[fieldName], replacer)
					}).join(',')
				})
			csv.unshift(fields.join(","))
			res.status(200).send(csv.join("<br>"))
		});
	});
});

// Example GET request handler for webroot/test
app.get('/test', function(req, res){
	console.log('Really Simple GET Request Handler that returns a JSON object');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'variable': 'value' }));
});
app.get('/hey', function (req, res){    //http://localhost:8080/hey?var1=1
	var param = req.query.var1;  
	res.setHeader('Content-Type','text/html');
	res.send(param);
});
app.get('/ajax', function(req, res){
	//var thingy = req;
	var myObject = JSON.parse(req.query.q)
	console.log(myObject.var1);
	console.log('just query '+req.query.q);
	res.setHeader('Content-Type','application/json');
	res.send(myObject);	
});
// Instantiate the HTTP server
var server 	= http.createServer(app);
// Tell express to serve up /public as standard when accessing webroot
app.use(express.static(__dirname + "/public"));
app.use("/",router);
// Tell express to listen for connections 
app.listen(SERVER_PORT);
console.log('Server listening on ' + SERVER_PORT + ', serving files from ./public ');