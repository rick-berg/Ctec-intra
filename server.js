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
router.get("/temp",function(req,res){
	res.sendFile(path+"temp.html");
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
	' (timestamp, '+
	'operator_initials, '+
	'work_order, '+
	'work_order_quantity, '+
	'finished_part_number, '+
	'pcb_part_number, '+
	'reported_fault, '+
	'investigation_findings, '+
	'additional_comments, '+
	'repaired_scrapped, '+
	'fail_catagory, '+
	'faulty_part_number, '+
	'faulty_location_reference, '+
	'completed)'+
	' VALUES ('+
	'CURRENT_TIMESTAMP(), '+
	'"'+thingy.operatorName+'", '+
	'"'+thingy.workOrder+'", '+
	''+thingy.quantity+', '+
	'"'+thingy.finishedPartNumber+'", '+
	'"'+thingy.pcbNumber+'", '+
	'"'+thingy.faultDesc+'", '+
	'"'+thingy.investigation_findings+'", '+
	'"'+thingy.additional_comments+'", '+
	'"'+thingy.repaired_scrapped+'", '+
	'"'+thingy.fail_catagory+'", '+
	'"'+thingy.faulty_part_number+'", '+
	'"'+thingy.faulty_location_reference+'", '+
	'CURRENT_TIMESTAMP())';


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




router.route('/enterFaultSame').post(function (req, res) {
	var thingy = req.body;
	console.log(thingy);
	sqlstring = 'INSERT INTO '
	+thingy.table+
	' (timestamp, '+
	'operator_initials, '+
	'work_order, '+
	'work_order_quantity, '+
	'finished_part_number, '+
	'pcb_part_number, '+
	'reported_fault, '+
	'investigation_findings, '+
	'additional_comments, '+
	'repaired_scrapped, '+
	'fail_catagory, '+
	'faulty_part_number, '+
	'faulty_location_reference, '+
	'completed, '+
	'serial_number)'+
	' VALUES ('+
	'CURRENT_TIMESTAMP(), '+
	'"'+thingy.operatorName+'", '+
	'"'+thingy.workOrder+'", '+
	''+thingy.quantity+', '+
	'"'+thingy.finishedPartNumber+'", '+
	'"'+thingy.pcbNumber+'", '+
	'"'+thingy.faultDesc+'", '+
	'"'+thingy.investigation_findings+'", '+
	'"'+thingy.additional_comments+'", '+
	'"'+thingy.repaired_scrapped+'", '+
	'"'+thingy.fail_catagory+'", '+
	'"'+thingy.faulty_part_number+'", '+
	'"'+thingy.faulty_location_reference+'", '+
	'CURRENT_TIMESTAMP(), '+
	''+thingy.faultid+')';


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
	'", fail_catagory = "'+thingy.fail_category+
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
					console.log('returning JSON: ');
					console.log(json);
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

router.route('/enterSameBoardFaultIncomplete').post(function (req, res) {
	var thingy = req.body;
//	var myObject = JSON.parse(req.query.q)
	console.log(thingy);
//	sqlstring = sqlStringBuilder(thingy);
	sqlstring = 'INSERT INTO '+thingy.table+
	' (timestamp, '+
	'operator_initials, '+
	'work_order, '+
	'work_order_quantity, '+
	'finished_part_number, '+
	'pcb_part_number, '+
	'reported_fault, '+
	'serial_number) '+
	'VALUES (CURRENT_TIMESTAMP(), "'
	+thingy.operatorName+'", "'+
	thingy.workOrder+'",'+
	thingy.quantity+',"'+
	thingy.finishedPartNumber+'","'+
	thingy.pcbNumber+'","'+
	thingy.faultDesc+'","'+
	thingy.faultid+'")'
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
});




router.route('/enterFaultIncomplete').post(function (req, res) {
	var thingy = req.body;
//	var myObject = JSON.parse(req.query.q)
	console.log(thingy);
//	sqlstring = sqlStringBuilder(thingy);
	sqlstring = 'INSERT INTO '+thingy.table+
	' (timestamp, '+
	'operator_initials, '+
	'work_order, '+
	'work_order_quantity, '+
	'finished_part_number, '+
	'pcb_part_number, '+
	'reported_fault) '+
	'VALUES (CURRENT_TIMESTAMP(), "'
	+thingy.operatorName+'", "'+
	thingy.workOrder+'",'+
	thingy.quantity+',"'+
	thingy.finishedPartNumber+'","'+
	thingy.pcbNumber+'","'+
	thingy.faultDesc+'")'


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

router.route('/addNewPart').post(function (req, res) {
	var thingy = req.body;
//	var myObject = JSON.parse(req.query.q)
	console.log(thingy);
//	sqlstring = sqlStringBuilder(thingy);
	sqlstring = 'INSERT INTO '+thingy.table+
	' (part_number, '+
	'part_description) '+
	'VALUES ("'
	+thingy.part_number+'", "'+
	thingy.part_description+'")'


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





app.delete('/faultDelete/:id', function (req, res) {

    let task_id = req.params.id;
console.log('deleting record: '+task_id);
    if (!task_id) {
        return res.status(400).send({ error: true, message: 'Please provide text_id' });
    }
		faultPool.getConnection(function (err, connection) {
			if (err){
				console.log('server connect fail : '+err);
				res.status(400).send(err);
				}
			connection.query('DELETE FROM fault WHERE idfault = "'+task_id+'"', (err, result, fields) =>{
				console.log('sql command done');
				if(err){
					console.log('sql command error');
					console.log(err);
				}
				connection.release();
				console.log('sql connection released');
				return res.send({ error: false, data: '', message: 'text has been Deleted successfully.' });

			});
			console.log('done');
		});
});
/*

connection.query('DELETE FROM fault WHERE id = ?', task_id, function (error, results, fields) {
		if (error) throw error;
		return res.send({ error: false, data: results, message: 'text has been Deleted successfully.' });
});


faultPool.getConnection(function (err, connection) {
	if (err){
		console.log('server connect fail : '+err);
		res.status(400).send(err);
		}
	connection.query('DELETE FROM fault WHERE id = ?', (err, result, fields) =>{
		console.log('sql command done');
		if(err){
			console.log('sql command error');
			console.log(err);
		}
		connection.release();
		console.log('sql connection released');
		return res.send({ error: false, data: results, message: 'text has been Deleted successfully.' });

	});
	console.log('done');
});





router.route('/faultDelete').delete(function (req, res) {
//app.delete('/faultDelete', function (req, res) {
console.log(req.body)
    var id = req.params.id;

    if (!id) {
        return res.status(400).send({ error: true, message: 'No ID selected' });
    }
    connection.query('DELETE FROM fault WHERE idfault = ?', id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'text has been Deleted successfully.' });
    });
});
*/
/*
app.delete('/faultDelete', function (req, res) {

    var id = req.params.id;
console.log('delete accessed')
    //DELETE RECORD

    return res.status(200);
});
*/






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
		case 'genSel':
			sqlString = 'SELECT '+data.field+' FROM '+data.table+' WHERE '+data.value;
			console.log('sql string is '+sqlString)
			return sqlString;
		break;
		case 'betweenTimes':
			sqlString = 'SELECT * FROM '+data.table+' WHERE '+data.field+' BETWEEN "'+data.startDate+'" AND "'+data.endDate+'"';
			console.log('sql string is '+sqlString)
			return sqlString;
		case 'betweenTimesWhere':
			sqlString = 'SELECT * FROM '+data.table+' WHERE pcb_part_number = "RPF0999110" AND '+data.field+' BETWEEN "'+data.startDate+'" AND "'+data.endDate+'" ';
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
		case 'getNull':
			sqlString = 'SELECT '+data.field+' FROM '+data.table+' WHERE '+data.value+' IS NULL'
			console.log('sql string is '+sqlString)
			return sqlString;
		break;
		case 'weekList':
			sqlString = 'SELECT DISTINCT week(timestamp, 1) as weeks FROM fault WHERE year(timestamp) = '+data.value
			console.log('sql string is '+sqlString)
			return sqlString;
		break;

		case 'faultsByWeek':
			switch(data.value) {
				case 'all':
					sqlString = 'select WEEK(timestamp,1) as week_number, '+
					'sum(case when fail_catagory = \'SMT\' then 1 else 0 end) as SMT_faults, '+
					'sum(case when fail_catagory = \'CONV\' then 1 else 0 end) as conventional_faults, '+
					'sum(case when fail_catagory = \'PROG/TEST\' then 1 else 0 end) as program_test_faults, '+
					'sum(case when fail_catagory = \'undefined\' then 1 else 0 end) as undefined_faults '+
					'from fault '+
					'where '+
					"year(timestamp) BETWEEN '"+data.field.year+"' AND '"+data.field.year+"' "+
					'and '+
					"week(timestamp, 1) BETWEEN '"+data.field.weekStart+"' AND '"+data.field.weekEnd+"'"+
					'group by WEEK(timestamp,1)';
					console.log('sql string is '+sqlString)
					return sqlString;
				break;
				case 'conv':
					sqlString =
					'select '+
					'WEEK(timestamp,1) as week_number, '+
					'sum(case when investigation_findings = \'Flux Issue\' then 1 else 0 end) as flux_issue, '+
					'sum(case when investigation_findings = \'PCB Damage\' then 1 else 0 end) as pcb_damage, '+
					'sum(case when investigation_findings = \'Track damage\' then 1 else 0 end) as track_damage, '+
					'sum(case when investigation_findings = \'Pad damage\' then 1 else 0 end) as pad_damage, '+
					'sum(case when investigation_findings = \'Dry joint\' then 1 else 0 end) as dry_joint, '+
					'sum(case when investigation_findings = \'Incorrect component placed/soldered\' then 1 else 0 end) as component_placement_solder, '+
					'sum(case when investigation_findings = \'Component knocked out of position\' then 1 else 0 end) as component_knocked_from_position,'+
					'sum(case when investigation_findings = \'Component failure\' then 1 else 0 end) as component_failure, '+
					'sum(case when investigation_findings = \'Component missing\' then 1 else 0 end) as component_missing, '+
					'sum(case when investigation_findings = \'Component misplaced\' then 1 else 0 end) as component_misplaced, '+
					'sum(case when investigation_findings = \'Component not soldered\' then 1 else 0 end) as component_not_soldered, '+
					'sum(case when investigation_findings = \'Solder bridge\' then 1 else 0 end) as solder_bridge '+
					'from fault '+
					'where '+
					"year(timestamp) BETWEEN '"+data.field.year+"' AND '"+data.field.year+"' "+
					'and '+
					"week(timestamp, 1) BETWEEN '"+data.field.weekStart+"' AND '"+data.field.weekEnd+"'"+
					'and '+
					'fail_catagory = \'CONV\' '+
					'group by  '+
					'WEEK(timestamp,1)';
					console.log('sql string is '+sqlString)
					return sqlString;
				break;
				case 'smt':
					sqlString =
					'select '+
					'WEEK(timestamp,1) as week_number, '+
					'sum(case when investigation_findings = \'PCB Damage\' then 1 else 0 end) as pcb_damage, '+
					'sum(case when investigation_findings = \'Track damage\' then 1 else 0 end) as track_damage, '+
					'sum(case when investigation_findings = \'Pad damage\' then 1 else 0 end) as pad_damage, '+
					'sum(case when investigation_findings = \'Dry joint\' then 1 else 0 end) as dry_joint, '+
					'sum(case when investigation_findings = \'Incorrect component placed/soldered\' then 1 else 0 end) as component_placement_solder, '+
					'sum(case when investigation_findings = \'Component knocked out of position\' then 1 else 0 end) as component_knocked_from_position,'+
					'sum(case when investigation_findings = \'Component failure\' then 1 else 0 end) as component_failure, '+
					'sum(case when investigation_findings = \'Component missing\' then 1 else 0 end) as component_missing, '+
					'sum(case when investigation_findings = \'Component misplaced\' then 1 else 0 end) as component_misplaced, '+
					'sum(case when investigation_findings = \'Component not soldered\' then 1 else 0 end) as component_not_soldered, '+
					'sum(case when investigation_findings = \'Solder bridge\' then 1 else 0 end) as solder_bridge '+
					'from fault '+
					'where '+
					"year(timestamp) BETWEEN '"+data.field.year+"' AND '"+data.field.year+"' "+
					'and '+
					"week(timestamp, 1) BETWEEN '"+data.field.weekStart+"' AND '"+data.field.weekEnd+"'"+
					'and '+
					'fail_catagory = \'SMT\' '+
					'group by  '+
					'WEEK(timestamp,1)';
					console.log('sql string is '+sqlString)
					return sqlString;
				break;
				case 'progTest':
					sqlString =
					'select '+
					'WEEK(timestamp,1) as week_number, '+
					'sum(case when investigation_findings = \'Tested in full and functions correctly\' then 1 else 0 end) as retest_good, '+
					'sum(case when investigation_findings = \'Re-programmed and passed test\' then 1 else 0 end) as reprogram_good, '+
					'sum(case when investigation_findings = \'Problem with tester\' then 1 else 0 end) as tester_issue, '+
					'sum(case when investigation_findings = \'No Program present\' then 1 else 0 end) as not_programmed '+
					'from fault '+
					'where '+
					"year(timestamp) BETWEEN '"+data.field.year+"' AND '"+data.field.year+"' "+
					'and '+
					"week(timestamp, 1) BETWEEN '"+data.field.weekStart+"' AND '"+data.field.weekEnd+"'"+
					'and '+
					'fail_catagory = \'PROG/TEST\' '+
					'group by  '+
					'WEEK(timestamp,1)';
					console.log('sql string is '+sqlString)
					return sqlString;
				break;
				case 'undefined':
					sqlString =
					'select '+
					'WEEK(timestamp,1) as week_number, '+
					'sum(case when investigation_findings = \'After visual inspection & Test, fault cannot be determined\' then 1 else 0 end) as undetermined, '+
					'sum(case when investigation_findings = \'Glued product. Cannot Investigate.\' then 1 else 0 end) as sealed_cannot_investigate '+
					'from fault '+
					'where '+
					"year(timestamp) BETWEEN '"+data.field.year+"' AND '"+data.field.year+"' "+
					'and '+
					"week(timestamp, 1) BETWEEN '"+data.field.weekStart+"' AND '"+data.field.weekEnd+"'"+
					'and '+
					'fail_catagory = \'Undefined\' '+
					'group by  '+
					'WEEK(timestamp,1)';
					console.log('sql string is '+sqlString)
					return sqlString;
				break
				case 'gen':
					sqlString =
					'select '+
					'WEEK(timestamp,1) as week_number, '+
					'sum(case when investigation_findings = \'After visual inspection & Test, fault cannot be determined\' then 1 else 0 end) as undetermined, '+
					'sum(case when investigation_findings = \'Glued product. Cannot Investigate.\' then 1 else 0 end) as sealed_cannot_investigate '+
					'from fault '+
					'where '+
					"year(timestamp) BETWEEN '"+data.field.year+"' AND '"+data.field.year+"' "+
					'and '+
					"week(timestamp, 1) BETWEEN '"+data.field.weekStart+"' AND '"+data.field.weekEnd+"'"+
					'group by  '+
					'WEEK(timestamp,1)';
					console.log('sql string is '+sqlString)
					return sqlString;
				break
			/*
			 *	needs database rework does not take into account no fails and there seems to be split works orders for testing
			 *
				case 'FTP':
					sqlString =
					'SELECT'+
					'WEEK(timestamp,1) as week_number, '+
					'work_order, '+
					'work_order_quantity, '+
					'count(work_order) AS count, '+
					"concat(round((count(work_order)/work_order_quantity * 100),2),'%') AS fail_percentage, "+
					"concat(round(100-(count(work_order)/work_order_quantity * 100),2),'%') AS FTP_percentage "+
					'FROM fault '+
					'WHERE work_order_quantity IS NOT NULL '+
					'GROUP by work_order'
					console.log('sql string is '+sqlString)
					return sqlString;
				break;
				*/


/*



  sum(case when investigation_findings = 'After visual inspection & Test, fault cannot be determined' then 1 else 0 end) as undetermined,
  sum(case when investigation_findings = 'Tested in full and functions correctly' then 1 else 0 end) as retest_good,
  sum(case when investigation_findings = 'Re-programmed and passed test' then 1 else 0 end) as reprogram_good,
  sum(case when investigation_findings = 'Flux Issue' then 1 else 0 end) as flux_issue,
  sum(case when investigation_findings = 'Problem with tester' then 1 else 0 end) as tester_issue,
  sum(case when investigation_findings = 'Problem with plastics' then 1 else 0 end) as plastics_issue,
  sum(case when investigation_findings = 'Glued product. Cannot Investigate.' then 1 else 0 end) as sealed_cannot_investigate,
  sum(case when investigation_findings = 'PCB Damage' then 1 else 0 end) as pcb_damage,
  sum(case when investigation_findings = 'Track damage' then 1 else 0 end) as track_damage,
  sum(case when investigation_findings = 'Pad damage' then 1 else 0 end) as pad_damage,
  sum(case when investigation_findings = 'Dry joint' then 1 else 0 end) as dry_joint,
  sum(case when investigation_findings = 'Incorrect component placed/soldered' then 1 else 0 end) as component_placement_solder,
  sum(case when investigation_findings = 'Component knocked out of position' then 1 else 0 end) as component_knocked_from_position,
  sum(case when investigation_findings = 'Component failure' then 1 else 0 end) as component_failure,
  sum(case when investigation_findings = 'Component missing' then 1 else 0 end) as component_missing,
  sum(case when investigation_findings = 'Component misplaced' then 1 else 0 end) as component_misplaced,
  sum(case when investigation_findings = 'Component not soldered' then 1 else 0 end) as component_not_soldered,
  sum(case when investigation_findings = 'Solder bridge' then 1 else 0 end) as solder_bridge,
  sum(case when investigation_findings = 'No Program present' then 1 else 0 end) as not_programmed,
  sum(case when investigation_findings = 'N/A' then 1 else 0 end) as N_A
from fault
where fail_catagory = 'CONV'
group by
WEEK(timestamp,1);

*/



					console.log('sql string is '+sqlString)
					return sqlString;
				break;
			}
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
