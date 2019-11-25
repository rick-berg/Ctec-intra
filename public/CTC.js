var CTC ={};
/* 
************************************************************************
DATA 
************************************************************************
*/
CTC.data = {};
CTC.data.packet = {};
//CTC.data.buildRequest = '';
CTC.data.builder = function (swFunc){
	console.log('builder entered');
	CTC.data.packet={}; // clears the data packet CTC.data.builder('dateSearch searchByPoW searchByPoWVal');
	switch(swFunc) {
		case 'dateSearch':
			CTC.data.packet.table = "reellog";
			CTC.data.packet.field = "processtimestamp";
			CTC.data.packet.sqlFunction = "betweenTimes";
			CTC.data.packet.startDate = getDateString('start');
			CTC.data.packet.endDate = getDateString('end');
			CTC.data.packet.reciever = 'dataBox';
			CTC.data.packet.responseAs = 'JSON';
			break;
		case 'searchByPoW':
			console.log('searchbypow');
			CTC.data.packet.table = "reellog";
			CTC.data.packet.field = document.getElementById("mySelect").value;
			CTC.data.packet.sqlFunction = "getUniqueList";
			CTC.data.packet.reciever = 'PoWlist';
			CTC.data.packet.responseAs = 'JSON';
			console.log('post return')
			break;
		case 'searchByPoWVal':
			CTC.data.packet.table = "reellog";
			CTC.data.packet.field = document.getElementById("mySelect").value;
			CTC.data.packet.value = document.getElementById("subSelect").value;
			CTC.data.packet.sqlFunction = "genSelTFV";
			CTC.data.packet.reciever = 'dataBox';
			CTC.data.packet.responseAs = 'JSON';
			break;
		case 'partLocations':
			CTC.data.packet.table = "reellocation";
			CTC.data.packet.sqlFunction = "getAll";
			CTC.data.packet.reciever = 'partLocations';
			CTC.data.packet.responseAs = 'JSON';
			break;
	}
	console.log('send next')
	CTC.data.send();

};
CTC.data.send = function (request){
	var reciever = CTC.data.packet.reciever;
	var req = JSON.stringify(CTC.data.packet);
	var xmlhttp = null;
	
	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			CTC.data.receive(xmlhttp.responseText,reciever);
		}
	};
	var str = "/mysqlQuery?q="+req;
	xmlhttp.open("GET",str,true);
	xmlhttp.send();	
};
CTC.data.receive = function(r,swFunc){
	try{
		eval("var tempobj = "+r);
	}
	catch(err){
		//alert(err);
	}
	switch(swFunc) {
		case 'alert':
			alert(r);
			break;
		case 'console':
			console.log(r);
			break;
		case 'PoWlist':
			var result = JSON.parse(r);
			var txt = '';
			txt = txt + '<select id="subSelect" onchange="CTC.data.builder(';
			txt = txt + "'searchByPoWVal'";
			txt = txt + ')">'; 
			txt = txt + '<option value=""></option>';
			for (i in result){
				//txt = txt + '<option value="'+result[i].workorder+'">'+result[i].workorder+'</option>';
				txt = txt + '<option value="'+Object.values(result[i])+'">'+Object.values(result[i])+'</option>';
			}
			txt = txt + '</select>';
			document.getElementById("searchsub").innerHTML= txt;
			break;
		case 'dataBox':
			var result = JSON.parse(r);
			var fields = Object.keys(result[0]);
			var txt = '';
			txt = txt + '<table id="locationsTable">';
			txt = txt + '<tr class="header">';
			for (var i in fields) {
				txt = txt + '<th style="width:25%;">' + fields[i] + '</th>';
			}	
			txt = txt + '</tr>';
			for (var key in result) {
				txt = txt + '<tr>';
				if (result.hasOwnProperty(key)) {
//					for (var i in fields) {
//						txt = txt + '<td>'+ result[key].fields[i] + '</td>';
//					}	
					txt = txt + '<td>'+ result[key].workorder + '</td>';
					txt = txt + '<td>'+ result[key].assemblynumber + '</td>';
					txt = txt + '<td>'+ result[key].processtimestamp + '</td>';
					txt = txt + '<td>'+ result[key].users + '</td>';
					txt = txt + '<td>'+ result[key].bcpartnumber + '</td>';
					txt = txt + '<td>'+ result[key].bclotcode + '</td>';
					txt = txt + '<td>'+ result[key].bcid + '</td>';
					txt = txt + '<td>'+ result[key].details + '</td>';
				}
				txt = txt + '</tr>';
			}	
			txt = txt + '</table>';
			document.getElementById("dataBox").innerHTML= txt;
			break;
		case 'partLocations':
			locationtablebuilder(r);
			break;
	}
}


CTC.locationdata = {};
CTC.locationdata.send = function (request){
	var req = JSON.stringify(CTC.locationdata.data);
	var xhr = null;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange=function(){
		if (xhr.readyState==4 && xhr.status==200){
			//document.getElementById("content").innerHTML=xmlhttp.responseText;
			CTC.locationdata.receive(xhr.responseText);
		}
	}
	//alert(str);
	xhr.open("POST", "/location", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	//console.log(CTC.locationdata.data);
	var xhrdata = JSON.stringify(CTC.locationdata.data)
	//console.log(xhrdata);
	xhr.send(xhrdata);
}

CTC.locationdata.receive = function(r){
	try{
		eval("var tempobj = "+r);
	}
	catch(err){
		alert(err);
	}
	console.log(tempobj);
}

function copyToClipboard(containerid) {
if (document.selection) { 
    var range = document.body.createTextRange();
    range.moveToElementText(document.getElementById(containerid));
    range.select().createTextRange();
    document.execCommand("copy"); 

} else if (window.getSelection) {
    var range = document.createRange();
     //range.selectNode(document.getElementById(containerid));
		 range.selectNode(containerid);
		 window.getSelection().removeAllRanges(); 
     window.getSelection().addRange(range);
     document.execCommand("copy");
		 window.getSelection().removeAllRanges();
     alert("text copied") 
}}


copyDataBox = function(){
	var copyText = document.getElementById("dataBox");
  copyText.select();
  document.execCommand("copy");
  alert("Copied the text: " + copyText.value);
}


/* 
************************************************************************
Searchable table for part locator
************************************************************************
*/
function locationtablebuilder(data){
	var result = JSON.parse(data);
	var fields = Object.keys(result[0]);
	console.log(result);
	var txt = '';
	txt = txt + '<input type="text" id="partLocatorInput" onkeyup="locationSearch()" placeholder="Search for parts.." title="Type in a part number">';
	txt = txt + '<div class=scrollybox>';
	txt = txt + '<table id="locationsTable">';
	txt = txt + '<tr class="header">';
	for (var i in fields) {
		txt = txt + '<th style="width:25%;">' + fields[i] + '</th>';
	}
	txt = txt + '</tr>';
	for (var key in result) {
		txt = txt + '<tr>';
		if (data.hasOwnProperty(key)) {
			txt = txt + '<td>'+ result[key].partnumber + '</td>';
			txt = txt + '<td>'+ result[key].locationwarehouse + '</td>';
			txt = txt + '<td>'+ result[key].locationrack + '</td>';
		}
		txt = txt + '</tr>';
	}	
	txt = txt + '</table>';
	txt = txt + '</div>';

	document.getElementById("content").innerHTML= txt;
	
}

function locationSearch() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("partLocatorInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("locationsTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}




/* 
************************************************************************
DATE PICKER (pikaday)  things for date range lookup imported and not checked yet
************************************************************************
*/

CTC.initpika=function(){
    var startDate,
        endDate,
        updateStartDate = function() {
            startPicker.setStartRange(startDate);
            endPicker.setStartRange(startDate);
            endPicker.setMinDate(startDate);
        },
        updateEndDate = function() {
            startPicker.setEndRange(endDate);
            startPicker.setMaxDate(endDate);
            endPicker.setEndRange(endDate);
        },
        startPicker = new Pikaday({
            field: document.getElementById('start'),
            minDate: new Date(2018, 06, 01),
            maxDate: new Date(2050, 12, 31),
            onSelect: function() {
                startDate = this.getDate();
                updateStartDate();
            }
        }),
        endPicker = new Pikaday({
            field: document.getElementById('end'),
            minDate: new Date(2018, 06, 01),
            maxDate: new Date(2050, 12, 31),
            onSelect: function() {
                endDate = this.getDate();
                updateEndDate();
            }
        }),
        _startDate = startPicker.getDate(),
        _endDate = endPicker.getDate();
        if (_startDate) {
            startDate = _startDate;
            updateStartDate();
        }
        if (_endDate) {
            endDate = _endDate;
            updateEndDate();
        }
}

function getDateString(source){
	s = document.getElementById(source).value;
	
	y = s.substr(11, 4);
	m = s.substr(4, 3);
	// convert month fro xxx letters to xx number format
	//startDateM = Date.parse(startDateM);
	m = changeMonth(m);
	// this only returns single figure for first 9 months we want 01.. 02 03 etc
	
	d = s.substr(8, 2);
	return y+'-'+m+'-'+d;
}
function changeMonth(mon){

   var d = Date.parse(mon + "1, 2012");
   if(!isNaN(d)){
      e = new Date(d).getMonth() + 1;
	  return e  < 10 ? '0' + e : '' + e;
   }
   return -1;
 }



/* 
************************************************************************
JUKI FILE READER
************************************************************************
*/

function readJuki(that){
	var jukioutput = [];
	if(that.files && that.files[0]){
		var reader = new FileReader();
		reader.onload = function (e) {  
			var output=e.target.result;
			output=output.split("\n");
			for(i in output) {
			//	console.log(String(output[i]));
				if (String(output[i]).includes("< Component Data >")){
			//		console.log("got enough");
					break;
				}
				var result = getFromBetween.get(output[i],',"','",');
			//	console.log(result);
				if (String(result).length>1 && result.length>1){
					result.unshift(String(that.value.substr(12).slice(0, -4)));  //cuts the c:/fakepath and extesion
					jukioutput.push(result);										// creates the 3 fields ready for database

				}
			}
			var txt = '<div style="height:220px;width:620px;border:1px solid #ccc;font:16px/26px Georgia, Garamond, Serif;overflow:auto;">';
			for(i in jukioutput){
				txt = txt + '';
				txt = txt + '<div>'+jukioutput[i]+'</div>';

				if(jukioutput[i][2].length != 10)
					console.log("error part no length")			
			}
			txt = txt +'</div>';
			document.getElementById('content').innerHTML= txt;
		//	console.log(jukioutput);
		};//end onload()
		reader.readAsText(that.files[0]);
	}//end if html5 filelist support
} 



/*
First method: is to actually get a substring from between two strings (however it will find only one result).
Second method: will remove the (would-be) most recently found result with the substrings after and before it.
Third method: will do the above two methods recursively on a string.
Fourth method: will apply the third method and return the result.
*/
var getFromBetween = {
    results:[],
    string:"",
    getFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var SP = this.string.indexOf(sub1)+sub1.length;
        var string1 = this.string.substr(0,SP);
        var string2 = this.string.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        return this.string.substring(SP,TP);
    },
    removeFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var removal = sub1+this.getFromBetween(sub1,sub2)+sub2;
        this.string = this.string.replace(removal,"");
    },
    getAllResults:function (sub1,sub2) {
        // first check to see if we do have both substrings
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

        // find one result
        var result = this.getFromBetween(sub1,sub2);
        // push it to the results array
        this.results.push(result);
        // remove the most recently found one from the string
        this.removeFromBetween(sub1,sub2);

        // if there's more substrings
        if(this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
            this.getAllResults(sub1,sub2);
        }
        else return;
    },
    get:function (string,sub1,sub2) {
        this.results = [];
        this.string = string;
        this.getAllResults(sub1,sub2);
        return this.results;
    }
};
/* 
************************************************************************
LOCATIONS FILE READER
************************************************************************
*/
function readLocations(that){			//read locations file and convert to json object
	if(that.files && that.files[0]){
		var reader = new FileReader();
		reader.onload = function (e) {  
			var output=e.target.result; //makes output = text file contents
			output=output.split("\n"); // splits output into lines
			var result = [];			//creates result array
			var headers=output[0].split(",");	// uses the first line of csv file as headers ...objects mapped split by ,
			for(var i=1;i<output.length;i++){  // for each line ignoring line 0 headers
				var obj = {};					// makes a temp object
				var currentline=output[i].split(",");	// sets outputs current line vales as objects in currentline
				//console.log('current line');
				//console.log(currentline);
				for(var j=0;j<headers.length;j++){		// for each of the headers
					obj[headers[j]] = currentline[j];	// makes obj = key val  from headers : currentline
				}
				result.push(obj);						//push the object into the results array
			}
			//console.log(result);
			CTC.locationdata.data = result;
			var txt = '<div style="height:220px;width:80%;border:1px solid #ccc;font:16px/26px Georgia, Garamond, Serif;overflow:auto;">';
			for(i in output){
				txt = txt + '';
				txt = txt + '<div>'+output[i]+'</div>';
			}
			txt = txt +'</div>';
			txt = txt +'<button type="button" onclick=CTC.locationdata.send() >Submit</button>';
			document.getElementById('content').innerHTML= txt;
		}
		reader.readAsText(that.files[0]);
	}
}


/* 
************************************************************************
PAGES
	build html strings for menu items inject into content div
************************************************************************
*/

CTC.page = {};

CTC.page.Home = {}
CTC.page.Home.load = function(){
	var txt = '';
	txt = txt + '';
	txt = txt + 'Welcome to Reeltracker V2';
	txt = txt + '<br>';
	txt = txt + 'Currently has limited functionality';
	txt = txt + '<br>';
	txt = txt + '';
	txt = txt + '<br>';
	txt = txt + '<br>';
	txt = txt + '<br>';
	txt = txt + 'Kitjob and reel change unavailable';
	txt = txt + '<br>';
	txt = txt + 'File input will accept jukifiles and location file but will only display local .. no DB connection';
	txt = txt + '<br>';
	txt = txt + 'Part search working ... filterd part list with locations ';
	txt = txt + '<br>';
	txt = txt + 'dataviewer working to get data between dates and to search for all data by partnumber or by workorder ';
	txt = txt + '';
	txt = txt + '';
	txt = txt + '';
	txt = txt + '';
	document.getElementById("content").innerHTML=txt
}

CTC.page.CreateWo = {}
CTC.page.CreateWo.load = function(){
	var txt = '';
	txt = txt + '';
	txt = txt + 'Create Work order not implemented';
	document.getElementById("content").innerHTML=txt
}
CTC.page.KitWo = {}
CTC.page.KitWo.load = function(){
	var txt = '';
	txt = txt + '';
	txt = txt + 'Kit Work order not implemented';
	txt = txt + '';
	txt = txt + '';
	document.getElementById("content").innerHTML=txt
}

CTC.page.Changereel = {}
CTC.page.Changereel.load = function(){
	var txt = '';
	txt = txt + '';
	txt = txt + 'Reel change not implemented';
	document.getElementById("content").innerHTML=txt
}

CTC.page.Fileinput = {}
CTC.page.Fileinput.load = function(){
	var txt = '';
	txt = txt + '';
	txt = txt + 'load Juki file<input type="file" onchange="readJuki(this)" />';
	txt = txt + '<br>';
	txt = txt + '<br>';
	txt = txt + '<br>';
	txt = txt + 'load Locations<input type="file" onchange="readLocations(this)" />';	
	document.getElementById("content").innerHTML=txt
	
}

CTC.page.Partfinder = {}
CTC.page.Partfinder.load = function(){
	var txt = '';
	txt = txt + 'partfinder';
	txt = txt + '';
	txt = txt + '<br>';
	txt = txt + 'Fetching data';
	txt = txt + '<br>';
	txt = txt + '';
	txt = txt + '';
	txt = txt + '';
	txt = txt + '';
	txt = txt + '';	
	document.getElementById("content").innerHTML=txt
	CTC.data.builder('partLocations');
	
}

CTC.page.Dataviewer = {}
CTC.page.Dataviewer.load = function(){
	
	var txt = '';
	txt = txt + '';
	txt = txt + '<p class="large">select a date range to view</p>';
	txt = txt + '';
	txt = txt + '<div style="display: inline-block">';
	txt = txt + '<label for="start">Start:</label>';
	txt = txt + '<br>';
	txt = txt + '<input type="text" id="start">';
	txt = txt + '</div>';
	txt = txt + '';
	txt = txt + ' <div style="display: inline-block">';
	txt = txt + '<label for="end">End:</label>';
	txt = txt + '<br>';
	txt = txt + '<input type="text" id="end">';
	txt = txt + '</div>';
	txt = txt + '';
	txt = txt + '<input type="button" value="Click me" onclick="CTC.data.builder(';
	txt = txt + "'dateSearch'";
	txt = txt + ')">';
	txt = txt + '<br>';
	txt = txt + '';
	txt = txt + '<div>';
	txt = txt + '<p class="large">search by</p>';
	txt = txt + '<select id="mySelect" onchange="CTC.data.builder(';
	txt = txt + "'searchByPoW'";
	txt = txt + ')">';    //CTC.data.builder("searchByPoW")
	txt = txt + '<option value=""></option>';
	txt = txt + '<option value="workorder">Work Order</option>';
	txt = txt + '<option value="bcpartnumber">Part number</option>';
	txt = txt + '</select>';
	txt = txt + '</div>';
	txt = txt + '';
	txt = txt + '<div style="float: left" id="searchsub">';
	txt = txt + '</div>';
	txt = txt + '<br>';
	txt = txt + '<br>';
//	txt = txt + '<textarea id="dataBox" cols="100" rows="20"></textarea>';
	txt = txt + '<div class="scrollybox" id=dataBox></div>';
	txt = txt + '<button onclick="copyToClipboard(dataBox)">Copy text</button>';
	
	document.getElementById("content").innerHTML=txt
	CTC.initpika();

}

CTC.page.Home.load();

