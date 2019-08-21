var CTC ={};
/* 
************************************************************************
DATA 
************************************************************************
*/
CTC.data = {};
CTC.data.packet = {};
CTC.data.packet.var1 = 'variable 1';
CTC.data.packet.var2 = 'variable 2';
CTC.data.send = function (request)
{
	//var req = encodeURIComponent(JSON.stringify(CTC.data));
	var req = JSON.stringify(CTC.data.packet);
	//var req = CTC.data;
	var xmlhttp = null;
	
	if (window.XMLHttpRequest)
		{// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		}
	else
		{// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
	xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
				{
					//document.getElementById("content").innerHTML=xmlhttp.responseText;
					CTC.data.receive(xmlhttp.responseText);
				}
		}
		
	//xmlhttp.open("GET","/ajax?q="+req,true);
	var str = "/ajax?q="+req;
	//alert(str);
	xmlhttp.open("GET",str,true);
	xmlhttp.send();	
}
CTC.data.receive = function(r){
	try{
		eval("var tempobj = "+r);
	}
	catch(err){
		alert(err);
	}
       alert(tempobj.var1);
}


/* 
************************************************************************
DATE PICKER (pikaday)  things for date range lookup imported and not checked yet
************************************************************************
*/
var SDV ={};
SDV.data = {};
SDV.data.packet = {};
SDV.data.packet.startDate = 'variable 1';
SDV.data.packet.endDate = 'variable 2';
SDV.data.send = function (request)
{

	SDV.data.packet.startDate = getDateString('start');
	SDV.data.packet.endDate = getDateString('end');

	if (SDV.data.packet.startDate == '' || SDV.data.packet.endDate == '')
	{
		alert('please select dates')	
	}else{
		
		//var req = encodeURIComponent(JSON.stringify(SDV.data));
		var req = JSON.stringify(SDV.data.packet);
		//var req = SDV.data;
		var xmlhttp = null;
	
		if (window.XMLHttpRequest)
			{// code for IE7+, Firefox, Chrome, Opera, Safari
				xmlhttp=new XMLHttpRequest();
			}
		else
			{// code for IE6, IE5
				xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
		xmlhttp.onreadystatechange=function()
			{
				if (xmlhttp.readyState==4 && xmlhttp.status==200)
					{
						//document.getElementById("content").innerHTML=xmlhttp.responseText;
						SDV.data.receive(xmlhttp.responseText);
					}
			}
		
		//xmlhttp.open("GET","/ajax?q="+req,true);
		var str = "/ajax?q="+req;
		alert(str);
		xmlhttp.open("GET",str,true);
		xmlhttp.send();	
	}
	
}
SDV.data.receive = function(r){
	try{
		eval("var tempobj = "+r);
	}
	catch(err){
		alert(err);
	}
       alert(tempobj.startDate);
}
SDV.initpika=function(){
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
function readLocations(that){
	if(that.files && that.files[0]){
		var reader = new FileReader();
		reader.onload = function (e) {  
			var output=e.target.result;
			output=output.split("\n");
			console.log(output);
			
			var txt = '<div style="height:220px;width:620px;border:1px solid #ccc;font:16px/26px Georgia, Garamond, Serif;overflow:auto;">';
			for(i in output){
				if(i==0){
					
				} else {
				txt = txt + '';
				txt = txt + '<div>'+output[i]+'</div>';
				}
			}
			txt = txt +'</div>';
			document.getElementById('content').innerHTML= txt;
		}
		reader.readAsText(that.files[0]);
	}
}


/* 
************************************************************************
PAGES
************************************************************************
*/

CTC.page = {};

CTC.page.Home = {}
CTC.page.Home.load = function(){
	var txt = '';
	txt = txt + '';
	txt = txt + 'Welcome to Reeltracker V2';
	txt = txt + '<br>';
	txt = txt + 'Currently has very limited functionality';
	txt = txt + '<br>';
	txt = txt + 'Awaiting aproval to proceede with full development';
	txt = txt + '<br>';
	txt = txt + '<br>';
	txt = txt + '<br>';
	txt = txt + 'Kitjob and reel change unavailable';
	txt = txt + '<br>';
	txt = txt + 'File input will accept jukifiles and location file but will only display local .. no DB connection';
	txt = txt + '<br>';
	txt = txt + 'dataviewer also has no DB connection';
	txt = txt + '';
	txt = txt + '';
	txt = txt + '';
	txt = txt + '';
	document.getElementById("content").innerHTML=txt
}

CTC.page.Kitjob = {}
CTC.page.Kitjob.load = function(){
	var txt = '';
	txt = txt + '';
	txt = txt + 'Kitjob not implemented';
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

CTC.page.Dataviewer = {}
CTC.page.Dataviewer.load = function(){
	
	var txt = '';
	txt = txt + '<h1>SMT Reel Data Viewer</h1>';
	txt = txt + '<p class="large">select a date range to view</p>';
	txt = txt + '<div style="display: inline-block">';
	txt = txt + '<label for="start">Start:</label>';
	txt = txt + '<br>';
	txt = txt + '<input type="text" id="start">';
	txt = txt + '</div>';
	txt = txt + ' <div style="display: inline-block">';
	txt = txt + '<label for="end">End:</label>';
	txt = txt + '<br>';
	txt = txt + '<input type="text" id="end">';
	txt = txt + '</div>';
	txt = txt + '<input type="button" value="Click me" onclick="SDV.data.send()">';
	txt = txt + '<div id=dataBox></div>';
	txt = txt + '';

	document.getElementById("content").innerHTML=txt
	SDV.initpika();

}

CTC.page.Home.load();

