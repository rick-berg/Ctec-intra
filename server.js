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

const express = require('express');
var http	= require('http');
var mysql	= require('mysql');
const bodyParser = require('body-parser')

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

router.get("/fault",function(req,res){
	res.sendFile(path+"fault.html");
});

router.route('/location').post(function (req, res) {
	var thingy = req.body;
//	var myObject = JSON.parse(req.query.q)
//	console.log(thingy);
	for (i in thingy){
		console.log(thingy[i]);
	}
	
	
	res.setHeader('Content-Type','application/json');
	res.send(thingy);	
});

router.route('/enterFault').post(function (req, res) {
	var thingy = req.body;
	console.log(thingy);
	sqlstring = 'INSERT INTO '
	+thingy.table+
	' (timestamp, operator_initials, work_order, work_order_quantity, finished_part_number, pcb_part_number, reported_fault, investigation_findings, additional_comments, repaired_scrapped, fail_catagory, faulty_part_number, faulty_location_reference, completed)'+
	' VALUES (CURRENT_TIMESTAMP(), "'+thingy.operatorName+'", "'+thingy.workOrder+'",'+thingy.quantity+',"'+thingy.finishedPartNumber+'","'+thingy.pcbNumber+'","'+thingy.faultDesc+'","'+thingy.investigation_findings+'","'+thingy.additional_comments+'","'+thingy.repaired_scrapped+'","'+thingy.fail_catagory+'","'+thingy.faulty_part_number+'","'+thingy.faulty_location_reference+'",CURRENT_TIMESTAMP())';
	

	faultPool.getConnection(function (err, connection) {
		if (err){
			console.log('server connect fail : '+err);
			//res.status(400).send(err);
			}
		connection.query(sqlstring, (err, result, fields) =>{
			console.log('sql command done');
			if(err){
				console.log('sql command error');
				console.log(err);
			//	res.status(400).send(err);
			}
			connection.release();
			console.log('sql connection released');
			var json = result;
			switch(thingy.responseAs) {
				case 'JSON':
					console.log('returning JSON');
					res.set('Content-Type', 'application/JSON')
					//res.send(JSON.stringify({ worked: true }))
					res.status(200);
					res.send(json);
					//res.send('it worked');
					break;
				case 'CSV':
				//	res.status(200).send(returnAsCsv(json));
					break;
			}
			
		});
		console.log('done');
	});
	
	
	
	for (i in thingy){
		console.log(thingy[i]);
	}
	
	
//	res.setHeader('Content-Type','application/json');
//	res.send(thingy);	
});



router.route('/completeExistingFault').post(function (req, res) {
	var thingy = req.body;
	console.log(thingy);
	sqlstring = 'UPDATE '
	+thingy.table+
	' SET '+
	'investigation_findings = "'+thingy.investigation_findings+
	'", additional_comments = "'+thingy.additional_comments+
	'", repaired_scrapped = "'+thingy.repaired_scrapped+
	'", fail_catagory = "'+thingy.fail_catagory+
	'", faulty_part_number = "'+thingy.faulty_part_number+
	'", faulty_location_reference = "'+thingy.faulty_location_reference+
//	'", completed = "completed"'+
	'", completed = CURRENT_TIMESTAMP()'+
	' WHERE'+
	' idfault = '+thingy.idfault+';'
	

	faultPool.getConnection(function (err, connection) {
		if (err){
			console.log('server connect fail : '+err);
			//res.status(400).send(err);
			}
		connection.query(sqlstring, (err, result, fields) =>{
			console.log('sql command done');
			if(err){
				console.log('sql command error');
				console.log(err);
			//	res.status(400).send(err);
			}
			connection.release();
			console.log('sql connection released');
			var json = result;
			switch(thingy.responseAs) {
				case 'JSON':
					console.log('returning JSON');
					res.set('Content-Type', 'application/JSON')
					//res.send(JSON.stringify({ worked: true }))
					res.status(200);
					res.send(json);
					//res.send('it worked');
					break;
				case 'CSV':
				//	res.status(200).send(returnAsCsv(json));
					break;
			}
			
		});
		console.log('done');
	});
	
	
	
	for (i in thingy){
		console.log(thingy[i]);
	}
	
	
//	res.setHeader('Content-Type','application/json');
//	res.send(thingy);	
});


router.route('/enterFaultIncomplete').post(function (req, res) {
	var thingy = req.body;
//	var myObject = JSON.parse(req.query.q)
	console.log(thingy);
//	sqlstring = sqlStringBuilder(thingy);
	sqlstring = 'INSERT INTO '+thingy.table+' (timestamp, operator_initials, work_order, work_order_quantity, finished_part_number, pcb_part_number, reported_fault) VALUES (CURRENT_TIMESTAMP(), "'+thingy.operatorName+'", "'+thingy.workOrder+'",'+thingy.quantity+',"'+thingy.finishedPartNumber+'","'+thingy.pcbNumber+'","'+thingy.faultDesc+'")'
	

	faultPool.getConnection(function (err, connection) {
		if (err){
			console.log('server connect fail : '+err);
			//res.status(400).send(err);
			}
		connection.query(sqlstring, (err, result, fields) =>{
			console.log('sql command done');
			if(err){
				console.log('sql command error');
				console.log(err);
			//	res.status(400).send(err);
			}
			connection.release();
			console.log('sql connection released');
			var json = result;
			switch(thingy.responseAs) {
				case 'JSON':
					console.log('returning JSON');
					res.set('Content-Type', 'application/JSON')
					//res.send(JSON.stringify({ worked: true }))
					res.status(200);
					res.send(json);
					//res.send('it worked');
					break;
				case 'CSV':
				//	res.status(200).send(returnAsCsv(json));
					break;
			}
			
		});
		console.log('done');
	});
	
	
	
	for (i in thingy){
		console.log(thingy[i]);
	}
	
	
//	res.setHeader('Content-Type','application/json');
//	res.send(thingy);	
});

/*
var con = mysql.createConnection({
	host:		'localhost',
	user: 		'smtuser',
	port: 		'3306',
	password:	'ctec69sql',
	database:	'smtreelprocess'
});
*/

var pool        = mysql.createPool({
    connectionLimit : 10, // default = 10
    host            : 'localhost',
    user            : 'smtuser',  // use root on live
    password        : 'ctec69sql',
    database        : 'smtreelprocess'
});

var faultPool        = mysql.createPool({
    connectionLimit : 10, // default = 10
    host            : 'localhost',
    user            : 'smtuser',  // use root on live
    password        : 'ctec69sql',
    database        : 'simplefaultdb'
});

app.get('/faultQuery', function(req, res){
	
	var myObject = JSON.parse(req.query.q)
	//myTable = myObject.table;
	//myField = myObject.field;
	//console.log('sqlFunction = '+myObject.sqlFunction+'');
	var sqlstring = '';
	sqlstring = sqlStringBuilder(myObject);
	faultPool.getConnection(function (err, connection) {
		if (err){
			console.log('server connect fail : '+err);
			res.status(400).send(err);
			}
		connection.query(sqlstring, (err, result, fields) =>{
			console.log('sql command done');
			if(err){
				console.log('sql command error');
				console.log(err);
				res.status(400).send(err);
			}
			connection.release();
			console.log('sql connection released');
			var json = result;
			switch(myObject.responseAs) {
				case 'JSON':
					console.log('returning JSON');
					res.status(200).send(json);
					break;
				case 'CSV':
					res.status(200).send(returnAsCsv(json));
					break;
			}
			
		});
		console.log('done');
	});
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
	myStartDate = myObject.startDate;
	myEndDate = myObject.endDate;
	myFormat = 'yyyy-mm-dd';
	console.log('query the database between these dates '+myStartDate+' and '+myEndDate+'');
//	res.setHeader('Content-Type','application/json');
//	res.send(myObject);	
	
	//con.connect(function(err){
	pool.getConnection(function (err, connection) {
		if (err){
			console.log('server connect fail : '+err);
			res.status(400).send(err);
		}
		//con.query("SELECT * FROM reellog WHERE processtimestamp >= TO_TIMESTAMP(myObject.startDate, 'yyyy-mm-dd' ) AND < TO_TIMESTAMP(myObject.endDate, 'yyyy-mm-dd')",(err, result, fields) =>{
		//con.query('SELECT * FROM reellog WHERE processtimestamp >= TIMESTAMP  ( "'+myStartDate+'" , "'+myFormat+'") AND processtimestamp <= TIMESTAMP( "'+myEndDate+'" , "'+myFormat+'") ', (err, result, fields) =>{
		connection.query('SELECT * FROM reellog WHERE processtimestamp BETWEEN "'+myStartDate+'" AND "'+myEndDate+'"', (err, result, fields) =>{
//		pool.query('SELECT NOW()', (err, result) =>{
			console.log('sql command done');
			connection.release();
			if(err){
				console.log('sql command error');
				console.log(err);
				res.status(400).send(err);
			}
			var json = result
			var fields = Object.keys(json[0])
			var replacer = function(key, value) { return value === null ? '' : value}
			var csv = json.map(function(row){
				return fields.map(function(fieldName){ return JSON.stringify(row[fieldName], replacer)
				}).join(',')
			})
			csv.unshift(fields.join(","))
			res.status(200).send(csv.join("<br>"))

		});
		console.log('done');
	});
});

app.get('/mysqlQuery', function(req, res){
	
	var myObject = JSON.parse(req.query.q)
	//myTable = myObject.table;
	//myField = myObject.field;
	//console.log('sqlFunction = '+myObject.sqlFunction+'');
	var sqlstring = '';
	sqlstring = sqlStringBuilder(myObject);
	pool.getConnection(function (err, connection) {
		if (err){
			console.log('server connect fail : '+err);
			res.status(400).send(err);
			}
		connection.query(sqlstring, (err, result, fields) =>{
			console.log('sql command done');
			if(err){
				console.log('sql command error');
				console.log(err);
				res.status(400).send(err);
			}
			connection.release();
			console.log('sql connection released');
			console.log('test :'+result[0].workorder);
			var json = result;
			switch(myObject.responseAs) {
				case 'JSON':
					console.log('returning JSON');
					res.status(200).send(json);
					break;
				case 'CSV':
					res.status(200).send(returnAsCsv(json));
					break;
			}
			
		});
		console.log('done');
	});
});

sqlStringBuilder = function(data){
	var sqlString = ''
	switch(data.sqlFunction) {
		case 'getUniqueList':
			sqlString ='SELECT DISTINCT '+data.field+' FROM '+data.table
			console.log('sql string is '+sqlString)
			return sqlString;
			break;
		case 'genSelTFV':
			sqlString = 'SELECT * FROM '+data.table+' WHERE '+data.field+' = "'+data.value+'"'
			console.log('sql string is '+sqlString)
			return sqlString;
			break;
		case 'betweenTimes':
			sqlString = 'SELECT * FROM '+data.table+' WHERE '+data.field+' BETWEEN "'+data.startDate+'" AND "'+data.endDate+'"';
			console.log('sql string is '+sqlString)
			return sqlString;
			break;
		case 'getAll':
			sqlString = 'SELECT * FROM '+data.table+'';
			console.log('sql string is '+sqlString)
			return sqlString;
			break;
		case 'getField':
			sqlString = 'SELECT '+data.field+' FROM '+data.table+'';
			console.log('sql string is '+sqlString)
			return sqlString;
			break;
		case 'getNotNull':
			sqlString = 'SELECT '+data.field+' FROM '+data.table+' WHERE '+data.value+' IS NULL'
			console.log('sql string is '+sqlString)
			return sqlString;
			break;
		
	}
}


returnAsCsv = function(data){
	var fields = Object.keys(data[0])
	var replacer = function(key, value) {
		return value === null ? '' : value
		}
	var csv = data.map(function(row){
		return fields.map(function(fieldName){
			return JSON.stringify(row[fieldName], replacer)
			}).join(',')
		});
	csv.unshift(fields.join(","));
	return csv.join("<br>");
}

// Example GET request handler for webroot/test
app.get('/test', function(req, res){
	console.log('Really Simple GET Request Handler that returns a JSON object');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'key': 'value' }));
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Instantiate the HTTP server
var server 	= http.createServer(app);
// Tell express to serve up /public as standard when accessing webroot
app.use(express.static(__dirname + "/public"));
app.use("/",router);
// Tell express to listen for connections 
app.listen(SERVER_PORT);
console.log('Server listening on ' + SERVER_PORT + ', serving files from ./public ');