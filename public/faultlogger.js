
investigationFindings = {};
faultCatagories = {};
finishedPartNumbers = {};
PCBPartNumbers = {};
componentPartNumbers = {};
incomingData = {};
weeklyChartData = {};
smtChartData = {};
convChartData = {};
progTestChartData = {};
FTPData = {};
yearWeekData = {};

//componentPartNumbers =
getData('componentpartnumbers','getAll','*','', 'component');
//getData('fault','getUniqueList','year(timestamp) as years , week(timestamp, 1) as weeks','','console')
//getData('fault','getUniqueList','year(timestamp) as years','','yearData')

faultData = {};



 initFaultFields = function(){

	//getDataPCBPartNumbers();
	getData('pcbpartnumbers','getAll','*','', 'PCBPartNumbers');
	//getDataFinishedPartNumbers();
	getData('finishedpartnumbers','getAll','*','', 'finishedPartNumbers');
	//getDataInvestigationFindings();
	getData('findings','getAll','*','', 'investigationFindings');
	//getDataFaultCats();
	getData('failcatagory','getAll','*','', 'faultCatagories');
};




/******************************************************************************************************************************
 *
 *  Data exchange
 *
 ******************************************************************************************************************************
 */

function getData(table, sqlFunction, field, value, swFunc){
	faultData = {};
	faultData.table = table;
	faultData.sqlFunction = sqlFunction;
	faultData.field = field;
	faultData.value = value;
	faultData.responseAs = 'JSON';
	var req = JSON.stringify(faultData);
	var xmlhttp = null;

	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			//alert('we got here');
			response = JSON.parse(xmlhttp.responseText);
			//console.log(response);
			switch(swFunc) {
				case 'faultCatagories':
					faultCatagories = response;
					break;
				case 'investigationFindings':
					investigationFindings = response;
					break
				case 'finishedPartNumbers':
					finishedPartNumbers = response;
					break;
				case 'PCBPartNumbers':
					PCBPartNumbers = response;
					break;
				case 'component':
					componentPartNumbers = response;
					break;
				case 'console':
					console.log(response);
					break;
				case 'idsearch':
					idSearchRec(response);
					break;
				case 'incomplete':
					recieveIncomplete(response);
					break;
				case 'chartDataBar':
					loadBarChart(response)
					break;
				case 'chartDataLine':
					loadLineChart(response)
					break;
				case 'weeklyChartData':
					weeklyChartData = response;
					break;
				case 'smtChartData':
					smtChartData = response;
					break;
				case 'convChartData':
					convChartData = response;
					break;
				case 'progTestChartData':
					progTestChartData = response;
					break;
				case 'FTPChartData':
					FTPData = response;
					break;
				case 'yearData':
					var txt = '';
					txt = txt + '<select id="years" onchange="getData(\'\',\'weekList\',\'\',getElementById(\'years\').value,\'weekData\')">';
					txt = txt + '<option disabled selected value> -- Select a Year -- </option>';
					for (i in response){
						txt = txt + '<option value="'+response[i].years+'">'+response[i].years+'</option>';
					}
					txt = txt + '</select>';
					txt = txt + '<div id = "chartOptionsWeek" style="float: left;"></div>'
					document.getElementById('chartOptionsYear').innerHTML = txt;
	//				yearWeekData = response;
					break;

				case 'weekData':
					var txt = '';

					txt = txt + '<select id="weekStart" >';
					txt = txt + '<option disabled selected value> -- Select a Week -- </option>';
					for (i in response){
						txt = txt + '<option value="'+response[i].weeks+'">'+response[i].weeks+'</option>';
					}
					txt = txt + '</select>';

					txt = txt + '<select id="weekEnd" >';
					txt = txt + '<option disabled selected value> -- Select a Week -- </option>';
					for (i in response){
						txt = txt + '<option value="'+response[i].weeks+'">'+response[i].weeks+'</option>';
					}
					txt = txt + '</select>';
					document.getElementById('chartOptionsWeek').innerHTML = txt;
	//				yearWeekData = response;
					break;
			}

		}
	};
	var str = "/faultQuery?q="+req;
	xmlhttp.open("GET",str,true);
	xmlhttp.send();
};

function getDataPCBPartNumbers(){
	faultData = {};
	faultData.table = 'pcbpartnumbers';
	faultData.sqlFunction = "getAll";
	//faultData.reciever = '';
	faultData.responseAs = 'JSON';
	//var recieveFunc = faultData.reciever;
	var req = JSON.stringify(faultData);
	var xmlhttp = null;

	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			recieveDataPCBPartNumbers(xmlhttp.responseText);
		}
	};
	var str = "/faultQuery?q="+req;
	xmlhttp.open("GET",str,true);
	xmlhttp.send();
};


recieveDataPCBPartNumbers = function(r){
	var result = JSON.parse(r);
	var fields = Object.keys(result[0]);
	console.log(result);
	var txt = '';
	txt = txt + '';
	txt = txt + 'PCB part number:';
	txt = txt + '<input type="text" id="PCBPartLocatorInput" onkeyup="PCBPartlocationSearch()" placeholder="enter PCB part" title="Type in a part number">';
	txt = txt + '<div class=scrollybox>';
	txt = txt + '<table id="PCBPartLocationsTable">';
	txt = txt + '<tr class="header">';
	for (var i in fields) {
		if (i == 0){}else{
		txt = txt + '<th style="width:25%;">' + fields[i] + '</th>';
		}
	}
	txt = txt + '</tr>';
	for (var key in result) {
		txt = txt + '<tr>';
		if (r.hasOwnProperty(key)) {
			txt = txt + '<td>'+ result[key].part_number + '</td>';
			txt = txt + '<td>'+ result[key].part_description + '</td>';
		}
		txt = txt + '</tr>';
	}
	txt = txt + '</table>';
	txt = txt + '</div>';

	document.getElementById("PCBNumberDiv").innerHTML= txt;

	var table = document.getElementById("PCBPartLocationsTable");
  var rows = table.getElementsByTagName("tr");
  for (i = 0; i < rows.length; i++) {
		var currentRow = table.rows[i];
		var createClickHandler = function(row){
			return function() {
				var cell = row.getElementsByTagName("td")[0];
        var id = cell.innerHTML;
				document.getElementById("PCBPartLocatorInput").value= id;
        //alert("id:" + id);
      };
    };
		currentRow.onclick = createClickHandler(currentRow);
  }
};

tablePCBPartNumbers = function(){

	var fields = Object.keys(PCBPartNumbers[0]);
	var txt = '';
	txt = txt + '';
	txt = txt + 'PCB part number:';
	txt = txt + '<input type="text" id="PCBPartLocatorInput" onkeyup="PCBPartlocationSearch()" placeholder="enter PCB part" title="Type in a part number">';
	txt = txt + '<div class=scrollybox>';
	txt = txt + '<table id="PCBPartLocationsTable">';
	txt = txt + '<tr class="header">';
	for (var i in fields) {
		if (i == 0){}else{
		txt = txt + '<th style="width:25%;">' + fields[i] + '</th>';
		}
	}
	txt = txt + '</tr>';
	for (var key in PCBPartNumbers) {
		txt = txt + '<tr>';
		if (PCBPartNumbers.hasOwnProperty(key)) {
			txt = txt + '<td>'+ PCBPartNumbers[key].part_number + '</td>';
			txt = txt + '<td>'+ PCBPartNumbers[key].part_description + '</td>';
		}
		txt = txt + '</tr>';
	}
	txt = txt + '</table>';
	txt = txt + '</div>';

	document.getElementById("PCBNumberDiv").innerHTML= txt;

	var table = document.getElementById("PCBPartLocationsTable");
  var rows = table.getElementsByTagName("tr");
  for (i = 0; i < rows.length; i++) {
		var currentRow = table.rows[i];
		var createClickHandler = function(row){
			return function() {
				var cell = row.getElementsByTagName("td")[0];
        var id = cell.innerHTML;
				document.getElementById("PCBPartLocatorInput").value= id;
        //alert("id:" + id);
      };
    };
		currentRow.onclick = createClickHandler(currentRow);
  }
};






function PCBPartlocationSearch() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("PCBPartLocatorInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("PCBPartLocationsTable");
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




function getDataFinishedPartNumbers(){
		faultData = {};
	faultData.table = 'finishedpartnumbers';
	faultData.sqlFunction = "getAll";
	//faultData.reciever = '';
	faultData.responseAs = 'JSON';
	//var recieveFunc = faultData.reciever;
	var req = JSON.stringify(faultData);
	var xmlhttp = null;

	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			recieveDatafinishedPartNumbers(xmlhttp.responseText);
		}
	};
	var str = "/faultQuery?q="+req;
	xmlhttp.open("GET",str,true);
	xmlhttp.send();
};
recieveDatafinishedPartNumbers = function(r){
	var result = JSON.parse(r);
	var fields = Object.keys(result[0]);
	console.log(result);
	var txt = '';
	txt = txt + '';
	txt = txt + 'Finished part number:';
	txt = txt + '<input type="text" id="finishedPartLocatorInput" onkeyup="finishedPartlocationSearch()" placeholder="enter finished part" title="Type in a part number">';
	txt = txt + '<div class=scrollybox>';
	txt = txt + '<table id="finishedPartLocationsTable">';
	txt = txt + '<tr class="header">';
	for (var i in fields) {
		if (i == 0){}else{
		txt = txt + '<th style="width:25%;">' + fields[i] + '</th>';
		}
	}
	txt = txt + '</tr>';
	for (var key in result) {
		txt = txt + '<tr>';
		if (r.hasOwnProperty(key)) {
			txt = txt + '<td>'+ result[key].part_number + '</td>';
			txt = txt + '<td>'+ result[key].part_description + '</td>';
		}
		txt = txt + '</tr>';
	}
	txt = txt + '</table>';
	txt = txt + '</div>';

	document.getElementById("finishedPartNumberDiv").innerHTML= txt;


	var table = document.getElementById("finishedPartLocationsTable");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var createClickHandler =
            function(row)
            {
                return function() {
                                        var cell = row.getElementsByTagName("td")[0];
                                        var id = cell.innerHTML;
																				document.getElementById("finishedPartLocatorInput").value= id;
                                        //alert("id:" + id);
                                 };
            };

        currentRow.onclick = createClickHandler(currentRow);
    }


};


tablefinishedPartNumbers = function(){
	var fields = Object.keys(finishedPartNumbers[0]);
	var txt = '';
	txt = txt + '';
	txt = txt + 'Finished part number:';
	txt = txt + '<input type="text" id="finishedPartLocatorInput" onkeyup="finishedPartlocationSearch()" placeholder="enter finished part" title="Type in a part number">';
	txt = txt + '<div class=scrollybox>';
	txt = txt + '<table id="finishedPartLocationsTable">';
	txt = txt + '<tr class="header">';
	for (var i in fields) {
		if (i == 0){}else{
		txt = txt + '<th style="width:25%;">' + fields[i] + '</th>';
		}
	}
	txt = txt + '</tr>';
	for (var key in finishedPartNumbers) {
		txt = txt + '<tr>';
		if (finishedPartNumbers.hasOwnProperty(key)) {
			txt = txt + '<td>'+ finishedPartNumbers[key].part_number + '</td>';
			txt = txt + '<td>'+ finishedPartNumbers[key].part_description + '</td>';
		}
		txt = txt + '</tr>';
	}
	txt = txt + '</table>';
	txt = txt + '</div>';

	document.getElementById("finishedPartNumberDiv").innerHTML= txt;


	var table = document.getElementById("finishedPartLocationsTable");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var createClickHandler =
            function(row)
            {
                return function() {
                                        var cell = row.getElementsByTagName("td")[0];
                                        var id = cell.innerHTML;
																				document.getElementById("finishedPartLocatorInput").value= id;
                                        //alert("id:" + id);
                                 };
            };

        currentRow.onclick = createClickHandler(currentRow);
    }


};




function finishedPartlocationSearch() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("finishedPartLocatorInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("finishedPartLocationsTable");
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



getDataInvestigationFindings = function(){
	faultData = {};
	faultData.table = 'findings';
	faultData.sqlFunction = "getAll";
	//faultData.reciever = '';
	faultData.responseAs = 'JSON';
	//var recieveFunc = faultData.reciever;
	var req = JSON.stringify(faultData);
	var xmlhttp = null;

	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			recieveDataInvestigationFindings(xmlhttp.responseText);
		}
	};
	var str = "/faultQuery?q="+req;
	xmlhttp.open("GET",str,true);
	xmlhttp.send();
};
recieveDataInvestigationFindings = function(r){
	investigationFindings = JSON.parse(r);
	//console.log(investigationFindings[1].investigation_findings);

};


getDataFaultCats = function(){
	faultData = {};
	faultData.table = 'failcatagory';
	faultData.sqlFunction = "getAll";
	//faultData.reciever = '';
	faultData.responseAs = 'JSON';
	//var recieveFunc = faultData.reciever;
	var req = JSON.stringify(faultData);
	var xmlhttp = null;

	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			recieveDataFaultCats(xmlhttp.responseText);
		}
	};
	var str = "/faultQuery?q="+req;
	xmlhttp.open("GET",str,true);
	xmlhttp.send();
};
recieveDataFaultCats = function(r){
	faultCatagories = JSON.parse(r);
	console.log(faultCatagories);

};



/******************************************************************************************************************************
 *
 *  Data collection
 *
 ******************************************************************************************************************************
 */



furtherReport = function(){

	faultData.faultDesc = document.getElementById("faultDesc").value;
	var txt = 'Fault Description: '+faultData.faultDesc+'';
	document.getElementById("fault_description").innerHTML=txt;
	/*
	alert('add more input stuff ere');
	packet = {};
	packet.table = "failcatagory";
	packet.sqlFunction = "getAll";
	packet.reciever = 'partLocations';
	packet.responseAs = 'JSON';
	*/

	txt = '';
	txt = txt + '';
	txt = txt + '<b>investigation findings:</b>';
	//txt = txt + '<br>';
	txt = txt + '<select id="investigation_findings" >';
	txt = txt + '<option disabled selected value> -- select investigation findings -- </option>';
	for (i in investigationFindings){
		txt = txt + '<option value="'+investigationFindings[i].investigation_findings+'">'+investigationFindings[i].investigation_findings+'</option>';
	}
	txt = txt + '</select>';
	txt = txt + '<br>';
	txt = txt + '<b>additional comments:</b>';
	//txt = txt + '<br>';
	txt = txt + '<textarea id="additional_comments" cols="40" rows="2"></textarea>';
	txt = txt + '<br>';
	txt = txt + '<b>Fault Catagory: </b>';
	//txt = txt + '<br>';
	txt = txt + '<select id="fault_catagory" >';
	txt = txt + '<option disabled selected value> -- select a fault catagory -- </option>';
	for (i in faultCatagories){
		txt = txt + '<option value="'+faultCatagories[i].catagory+'">'+faultCatagories[i].catagory+'</option>';
	}
	txt = txt + '</select>';
	/*
	for (i in faultCatagories){
		txt = txt + '<input type="radio" name="failType" value="'+faultCatagories[i].catagory+'">'+faultCatagories[i].catagory+'<br>';
	}
	*/
	txt = txt + '<br>';
	var fields = Object.keys(componentPartNumbers[0]);
	console.log(componentPartNumbers);
	txt = txt + '<b>Faulty component:</b>';
	txt = txt + '<input type="text" id="componentPartLocatorInput" onkeyup="componentPartlocationSearch()" placeholder="search component part" title="Type in a part number">';
	txt = txt + '<b>Part location reference:</b>';
	txt = txt + '<input type=text id="locationRef">';
	txt = txt + '<br>';
	txt = txt + '<div class=scrollybox style="height:250px">';
	txt = txt + '<table id="componentPartLocationsTable">';
	txt = txt + '<tr class="header">';
	for (var i in fields) {
		if (i == 0){}else{
		txt = txt + '<th style="width:25%;">' + fields[i] + '</th>';
		}
	}
	txt = txt + '</tr>';
	for (var key in componentPartNumbers) {
		txt = txt + '<tr>';
		if (componentPartNumbers.hasOwnProperty(key)) {
			txt = txt + '<td>'+ componentPartNumbers[key].part_number + '</td>';
			txt = txt + '<td>'+ componentPartNumbers[key].part_description + '</td>';
		}
		txt = txt + '</tr>';
	}
	txt = txt + '</table>';
	txt = txt + '</div>';

	txt = txt + '';
	txt = txt + '<input type="radio" name="repscrap" value="repaired by cell">repaired by cell';
	txt = txt + '<input type="radio" name="repscrap" value="repaired by FA">repaired by FA';
	txt = txt + '<input type="radio" name="repscrap" value="scrapped">scrapped<br>';
	txt = txt + '';
	txt = txt + '<input type="button" value="Submit" onclick="submitFault()">';

	txt = txt + '';

	txt = txt + '';
	txt = txt + '';
	document.getElementById("sub_content").innerHTML=txt;

	var table = document.getElementById("componentPartLocationsTable");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var createClickHandler =
            function(row)
            {
                return function() {
                                        var cell = row.getElementsByTagName("td")[0];
                                        var id = cell.innerHTML;
																				document.getElementById("componentPartLocatorInput").value= id;
                                        //alert("id:" + id);
                                 };
            };

        currentRow.onclick = createClickHandler(currentRow);
    }
}


function componentPartlocationSearch() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("componentPartLocatorInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("componentPartLocationsTable");
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
 function displayRadioValue() {
            var ele = document.getElementsByName('repscrap');

            for(i = 0; i < ele.length; i++) {
                if(ele[i].checked)
                document.getElementById("result").innerHTML
                        = "Gender: "+ele[i].value;
            }
        }



*/






submitFault = function(){
	faultData.table = "fault";
	faultData.investigation_findings = document.getElementById('investigation_findings').value;
	faultData.additional_comments = document.getElementById('additional_comments').value;
	faultData.fail_catagory = document.getElementById('fault_catagory').value;
	faultData.faulty_part_number = document.getElementById('componentPartLocatorInput').value;
	faultData.faulty_location_reference = document.getElementById('locationRef').value;
	var ele = document.getElementsByName('repscrap');
     for(i = 0; i < ele.length; i++) {
			if(ele[i].checked)
			faultData.repaired_scrapped = ele[i].value;
            }
	//alert('workorder: '+ workOrder + ' pbc: '+pcbNumber+' finshed: '+finishedPartNumber+' fault description: '+faultDesc);
	var req = JSON.stringify(faultData);
	var xhr = null;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange=function(){
		//alert('state change');
		if (xhr.readyState==4 && xhr.status==200){
			//document.getElementById("content").innerHTML=xmlhttp.responseText;
			//CTC.locationdata.receive(xhr.responseText);
			jResponse = JSON.parse(xhr.responseText);
			//alert(xhr.responseText);
			submittedFault(jResponse.insertId);
		}
	}
	//alert(str);
	xhr.open("POST", "/enterFault", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	//console.log(CTC.locationdata.data);
	//var xhrdata = JSON.stringify(faultData)
	//console.log(xhrdata);
	xhr.send(req);
}

submittedFault = function(faultId){
	var txt = '';
	txt = txt + 'your fault id is :';
	txt = txt + faultId;
	txt = txt + '<br>';
	txt = txt + '<input type="button" value="Add another fault" onclick="addNewFault()">';
	txt = txt + '<input type="button" value="Repeat same fault" onclick="addRepeatFault()">';
	txt = txt + '<input type="button" value="No more faults" onclick="enterFaultDetails()">';

	document.getElementById("sub_content").innerHTML= txt;
}

addRepeatFault = function(){
	var req = JSON.stringify(faultData);
	var xhr = null;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange=function(){
		//alert('state change');
		if (xhr.readyState==4 && xhr.status==200){
			//document.getElementById("content").innerHTML=xmlhttp.responseText;
			//CTC.locationdata.receive(xhr.responseText);
			jResponse = JSON.parse(xhr.responseText);
			//alert(xhr.responseText);
			submittedFault(jResponse.insertId);
		}
	}
	//alert(str);
	xhr.open("POST", "/enterFault", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	//console.log(CTC.locationdata.data);
	//var xhrdata = JSON.stringify(faultData)
	//console.log(xhrdata);
	xhr.send(req);
}
/*


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

*/
/*
submitToFA = function(){
	faultData.table = "fault";
	faultData.faultDesc = document.getElementById("faultDesc").value;
	//alert('workorder: '+ workOrder + ' pbc: '+pcbNumber+' finshed: '+finishedPartNumber+' fault description: '+faultDesc);
	var req = JSON.stringify(faultData);
	var xhr = null;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange=function(){
		if (xhr.readyState==4 && xhr.status==200){
			//document.getElementById("content").innerHTML=xmlhttp.responseText;
			//CTC.locationdata.receive(xhr.responseText);
			alert(xhr.responseText);		}
	}
	//alert(str);
	xhr.open("POST", "/enterFaultIncomplete", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	//console.log(CTC.locationdata.data);
	var xhrdata = JSON.stringify(faultData)
	//console.log(xhrdata);
	xhr.send(xhrdata);
}
*/

submitToFA = function(){
	faultData.table = "fault";
	faultData.faultDesc = document.getElementById("faultDesc").value;
	//alert('workorder: '+ workOrder + ' pbc: '+pcbNumber+' finshed: '+finishedPartNumber+' fault description: '+faultDesc);
	var req = JSON.stringify(faultData);
	var xhr = null;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange=function(){
		//alert('state change');
		if (xhr.readyState==4 && xhr.status==200){
			//document.getElementById("content").innerHTML=xmlhttp.responseText;
			//CTC.locationdata.receive(xhr.responseText);
			jResponse = JSON.parse(xhr.responseText);
			//alert(xhr.responseText);
			submittedtoFA(jResponse.insertId);
		}
	}
	//alert(str);
	xhr.open("POST", "/enterFaultIncomplete", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	//console.log(CTC.locationdata.data);
	//var xhrdata = JSON.stringify(faultData)
	//console.log(xhrdata);
	xhr.send(req);
}

submittedtoFA = function(faultId){
	hexVal = faultId.toString(16)
	var txt = '';
	txt = txt + 'your fault id is : ';
	txt = txt + hexVal;
	txt = txt + '<br>';
	txt = txt + '<input type="button" value="Add another fault" onclick="addNewFault()">';
	txt = txt + '<input type="button" value="No more faults" onclick="enterFaultDetails()">';

	document.getElementById("sub_content").innerHTML= txt;
}

jobDetailsEntered = function(){
	//get wo pcbno finished part no
	faultData.operatorName = document.getElementById("operatorName").value;
	faultData.workOrder = document.getElementById("workOrder").value;
	faultData.quantity = document.getElementById("quantity").value;
	faultData.finishedPartNumber = document.getElementById("finishedPartLocatorInput").value;
	faultData.pcbNumber = document.getElementById("PCBPartLocatorInput").value;
	addNewFault();
}

addNewFault = function(){
	// create html string to display above data and collect further input
	var txt = '';
	txt = txt + '<div id="fault_header">';
	txt = txt + '<table style= "width:50%">';
	txt = txt + '<tr>';
	txt = txt + '<th>Operator Name</th>';
	txt = txt + '<th>Work Order</th>';
	txt = txt + '<th>Quantity</th>';
	txt = txt + '<th>PCB part number</th>';
	txt = txt + '<th>Finished part number</th>';
	txt = txt + '</tr>';
	txt = txt + '<tr>';
	txt = txt + '<td><div id = "operatorName" onclick="reenterData(\'operatorName\')" >'+faultData.operatorName+'</div></td>';
	txt = txt + '<td><div id = "workorder"  onclick="reenterData(\'workorder\')" >'+faultData.workOrder+'</div></td>';
	txt = txt + '<td><div id = "quantity" onclick="reenterData(\'quantity\')">'+faultData.quantity+'</div></td>';
	txt = txt + '<td><div id = "finishedPartNumber" onclick="reenterData(\'finishedPartNumber\')">'+faultData.finishedPartNumber+'</div></td>';
	txt = txt + '<td><div id = "pcbNumber" onclick="reenterData(\'pcbNumber\')">'+faultData.pcbNumber+'</div></td>';
	txt = txt + '</tr>';
	txt = txt + '</table>';
	txt = txt + '</div>';
	txt = txt + '<div id="fault_description">';
	txt = txt + 'details of fault';
	txt = txt + '<br>';
	txt = txt + '<textarea id="faultDesc" cols="40" rows="2"></textarea>';
	txt = txt + '</div>';
	txt = txt + '<div  id="sub_content">';

	txt = txt + '<div id="buttons_tofa_fr">';
	txt = txt + '<input type="button" value="Submit to Fail Analysis" onclick="submitToFA()">';
	txt = txt + '<input type="button" value="Continue fault report" onclick="furtherReport()">';
	txt = txt + '</div>';
	txt = txt + '</div>';
	txt = txt + '<br>';
	document.getElementById("content").innerHTML=txt;

	faultDesc = document.getElementById("faultDesc");
	faultDesc.focus();

	faultDesc.addEventListener("keyup", function(event){
		if (event.key === "Enter") {
        //pcbNumber.focus();
			//	alert(faultDesc.value);
    }
	});
}

enterFaultDetails = function(){

	var txt = '';
	txt = txt + '<h2>Enter details to log fault</h2>';
	txt = txt + '<br>';

	txt = txt + 'Operator Initials:';
	txt = txt + '<input type=text id="operatorName">';
	txt = txt + '<br>';
	txt = txt + 'Work Order:';
	txt = txt + '<input type=text id="workOrder">';
	txt = txt + '<br>';
	txt = txt + 'Quantity:';
	txt = txt + '<input type=text id="quantity">';
	txt = txt + '<br>';
//	txt = txt + 'Finished part number:';
//	txt = txt + '<input type=text id="finishedPartNumber">';
	txt = txt + '<br><div style = "display: flex">';
	txt = txt + '<div style="flex: 0 0 50%" id="finishedPartNumberDiv"></div>';
/*
	txt = txt + '<br>';
	txt = txt + 'PCB Number:          ';
	txt = txt + '<input type=text id="pcbNumber">';
	txt = txt + '<br>';
*/
	txt = txt + '<div style="flex: 1" id="PCBNumberDiv"></div>';
	txt = txt + '</div><br>';
	txt = txt + '<input type="button" value="Enter" onclick="jobDetailsEntered()">';
	txt = txt + '<div></div>';
	txt = txt + '<br>';
	txt = txt + '';
	document.getElementById("content").innerHTML=txt;
	/*
	 *
	 *			put fin and pcb part recievers here
	 *
	 */
	tablefinishedPartNumbers();
	tablePCBPartNumbers();

	operatorName = document.getElementById("operatorName");
	workOrder = document.getElementById("workOrder");
	quantity = document.getElementById("quantity");
//	finishedPartNumber = document.getElementById("finishedPartNumber");
//	pcbNumber = document.getElementById("pcbNumber");
	operatorName.focus();

	operatorName.addEventListener("keyup", function(event){
		if (event.key === "Enter") {
		    workOrder.focus();
		}
	});
	workOrder.addEventListener("keyup", function(event){
		if (event.key === "Enter") {
		    quantity.focus();
		}
	});
	quantity.addEventListener("keyup", function(event){
		if (event.key === "Enter") {
//		    finishedPartNumber.focus();
		}
	});
//	finishedPartNumber.addEventListener("keyup", function(event){
//		if (event.key === "Enter") {
//			pcbNumber.focus();
//		}
//	});
//	pcbNumber.addEventListener("keyup", function(event){
//		if (event.key === "Enter") {
//
//			jobDetailsEntered();
//		}
//	});

}

loadIncomplete = function (){
	getData('fault', 'getNotNull', 'idfault, finished_part_number', 'completed','incomplete')
}
recieveIncomplete = function (r){
	var fields = Object.keys(r[0]);
	var txt = '';
	txt = txt + '<div class=scrollybox>';
	txt = txt + '<table id="incompleteFaultTable">';
	txt = txt + '<tr class="header">';
	for (var i in fields) {
		//if (i == 0){'<th></th>'}else{
		txt = txt + '<th style="width:25%;">' + fields[i] + '</th>';
		//}
	}
	txt = txt + '</tr>';
	for (var key in r) {
		txt = txt + '<tr>';
		if (r.hasOwnProperty(key)) {
			txt = txt + '<td>'+ r[key].idfault.toString(16) + '</td>';
			txt = txt + '<td>'+ r[key].finished_part_number + '</td>';
		}
		txt = txt + '</tr>';
	}
	txt = txt + '</table>';
	txt = txt + '</div>';
	document.getElementById("content").innerHTML=txt;

	var table = document.getElementById("incompleteFaultTable");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var createClickHandler =
            function(row)
            {
                return function() {
                                        var cell = row.getElementsByTagName("td")[0];
                                        var id =  parseInt(cell.innerHTML, 16);
																				//document.getElementById("finishedPartLocatorInput").value= id;
                                        idSearch(id);
                                 };
            };

        currentRow.onclick = createClickHandler(currentRow);
    }

}


loadIdSearch = function (){

	var txt = '';
	txt = txt + '';
	txt = txt + 'Enter Id:';
	txt = txt + '<input type=text id="faultId">';
	txt = txt + '<br>';
	txt = txt + '<input type="button" value="Enter" onclick="idSearch()">';

	document.getElementById("content").innerHTML=txt;

}


idSearch = function (id){
	//id = document.getElementById('faultId').value;
	getData('fault', 'genSelTFV', 'idfault', id,'idsearch');
}

idSearchRec = function (data){
	faultData = data[0];
	console.log(faultData);
	var txt = '';
	txt = txt + '<div id="fault_header">';
	txt = txt + '<table style= "width:50%">';
	txt = txt + '<tr>';
	txt = txt + '<th>Operator Name</th>';
	txt = txt + '<th>Work Order</th>';
	txt = txt + '<th>Quantity</th>';
	txt = txt + '<th>PCB part number</th>';
	txt = txt + '<th>Finished part number</th>';
	txt = txt + '</tr>';
	txt = txt + '<tr>';
	/*
	txt = txt + '<td><div id = "operatorName" onclick="reenterData(\'operatorName\')" >'+faultData.operatorName+'</div></td>';
	txt = txt + '<td><div id = "workorder"  onclick="reenterData(\'workorder\')" >'+faultData.workOrder+'</div></td>';
	txt = txt + '<td><div id = "quantity" onclick="reenterData(\'quantity\')">'+faultData.quantity+'</div></td>';
	txt = txt + '<td><div id = "finishedPartNumber" onclick="reenterData(\'finishedPartNumber\')">'+faultData.finishedPartNumber+'</div></td>';
	txt = txt + '<td><div id = "pcbNumber" onclick="reenterData(\'pcbNumber\')">'+faultData.pcbNumber+'</div></td>';
	*/
	txt = txt + '<td><div id = "operator_initials" onclick="reenterData(\'operator_initials\')">'+faultData.operator_initials+'</div></td>';
	txt = txt + '<td><div id = "work_order" onclick="reenterData(\'work_order\')">'+faultData.work_order+'</div></td>';
	txt = txt + '<td><div id = "work_order_quantity" onclick="reenterData(\'work_order_quantity\')">'+faultData.work_order_quantity+'</div></td>';
	txt = txt + '<td><div id = "finished_part_number" onclick="reenterData(\'finished_part_number\')">'+faultData.finished_part_number+'</div></td>';
	txt = txt + '<td><div id = "pcb_part_number" onclick="reenterData(\'pcb_part_number\')">'+faultData.pcb_part_number+'</div></td>';
	txt = txt + '</tr>';
	txt = txt + '</table>';
	txt = txt + '</div>';
	txt = txt + '<div id="reported_fault" onclick="reenterData(\'reported_fault\')">';
	txt = txt + 'details of fault';
	txt = txt + '<br>';
	txt = txt + ''+faultData.reported_fault+'';
	txt = txt + '</div>';
	txt = txt + '<div  id="sub_content">';
	txt = txt + '<input type="button" value="Cancel" onclick="loadIncomplete()">';
	txt = txt + '<input type="button" value="Complete this fault record" onclick="completeFault()">';
	txt = txt + '</div>';
	document.getElementById("content").innerHTML=txt;
}

completeFault = function (){
	var	txt = '';
	txt = txt + '';
	txt = txt + '<b>investigation findings:</b>';
	//txt = txt + '<br>';
	txt = txt + '<select id="investigation_findings" >';
	txt = txt + '<option disabled selected value> -- select investigation findings -- </option>';
	for (i in investigationFindings){
		txt = txt + '<option value="'+investigationFindings[i].investigation_findings+'">'+investigationFindings[i].investigation_findings+'</option>';
	}
	txt = txt + '</select>';
	txt = txt + '<br>';
	txt = txt + '<b>additional comments:</b>';
	//txt = txt + '<br>';
	txt = txt + '<textarea id="additional_comments" cols="40" rows="2"></textarea>';
	txt = txt + '<br>';
	txt = txt + '<b>Fault Catagory: </b>';
	//txt = txt + '<br>';
	txt = txt + '<select id="fault_catagory" >';
	txt = txt + '<option disabled selected value> -- select a fault catagory -- </option>';
	for (i in faultCatagories){
		txt = txt + '<option value="'+faultCatagories[i].catagory+'">'+faultCatagories[i].catagory+'</option>';
	}
	txt = txt + '</select>';
	/*
	for (i in faultCatagories){
		txt = txt + '<input type="radio" name="failType" value="'+faultCatagories[i].catagory+'">'+faultCatagories[i].catagory+'<br>';
	}
	*/
	txt = txt + '<br>';
	var fields = Object.keys(componentPartNumbers[0]);
	console.log(componentPartNumbers);
	txt = txt + '<b>Faulty component:</b>';
	txt = txt + '<input type="text" id="componentPartLocatorInput" onkeyup="componentPartlocationSearch()" placeholder="search component part" title="Type in a part number">';
	txt = txt + '<b>Part location reference:</b>';
	txt = txt + '<input type=text id="locationRef">';
	txt = txt + '<br>';
	txt = txt + '<div class=scrollybox style="height:250px">';
	txt = txt + '<table id="componentPartLocationsTable">';
	txt = txt + '<tr class="header">';
	for (var i in fields) {
		if (i == 0){}else{
		txt = txt + '<th style="width:25%;">' + fields[i] + '</th>';
		}
	}
	txt = txt + '</tr>';
	for (var key in componentPartNumbers) {
		txt = txt + '<tr>';
		if (componentPartNumbers.hasOwnProperty(key)) {
			txt = txt + '<td>'+ componentPartNumbers[key].part_number + '</td>';
			txt = txt + '<td>'+ componentPartNumbers[key].part_description + '</td>';
		}
		txt = txt + '</tr>';
	}
	txt = txt + '</table>';
	txt = txt + '</div>';

	txt = txt + '';
	txt = txt + '<input type="radio" name="repscrap" value="repaired by cell">repaired by cell';
	txt = txt + '<input type="radio" name="repscrap" value="repaired by FA">repaired by FA';
	txt = txt + '<input type="radio" name="repscrap" value="scrapped">scrapped<br>';
	txt = txt + '';
	txt = txt + '<input type="button" value="Submit" onclick="submitCompletedFault()">';

	txt = txt + '';

	txt = txt + '';
	txt = txt + '';
	document.getElementById("sub_content").innerHTML=txt;

	var table = document.getElementById("componentPartLocationsTable");
  var rows = table.getElementsByTagName("tr");
  for (i = 0; i < rows.length; i++) {
		var currentRow = table.rows[i];
		var createClickHandler =
		function(row) {
			return function() {
				var cell = row.getElementsByTagName("td")[0];
        var id = cell.innerHTML;
				document.getElementById("componentPartLocatorInput").value= id;
        //alert("id:" + id);
			};
		};
		currentRow.onclick = createClickHandler(currentRow);
  }
}


submitCompletedFault = function (){
	faultData.table = "fault";
	faultData.responseAs = 'JSON';
	faultData.investigation_findings = document.getElementById('investigation_findings').value;
	faultData.additional_comments = document.getElementById('additional_comments').value;
	faultData.fail_catagory = document.getElementById('fault_catagory').value;
	faultData.faulty_part_number = document.getElementById('componentPartLocatorInput').value;
	faultData.faulty_location_reference = document.getElementById('locationRef').value;
	var ele = document.getElementsByName('repscrap');
     for(i = 0; i < ele.length; i++) {
			if(ele[i].checked)
			faultData.repaired_scrapped = ele[i].value;
            }
	//alert('workorder: '+ workOrder + ' pbc: '+pcbNumber+' finshed: '+finishedPartNumber+' fault description: '+faultDesc);
	var req = JSON.stringify(faultData);
	var xhr = null;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange=function(){
		//alert('state change');
		if (xhr.readyState==4 && xhr.status==200){
			//document.getElementById("content").innerHTML=xmlhttp.responseText;
			//CTC.locationdata.receive(xhr.responseText);
			jResponse = JSON.parse(xhr.responseText);
			//alert(xhr.responseText);
			//submittedFault(jResponse.insertId);
			loadIncomplete();
		}
	}
	//alert(str);
	xhr.open("POST", "/completeExistingFault", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	//console.log(CTC.locationdata.data);
	//var xhrdata = JSON.stringify(faultData)
	//console.log(xhrdata);
	xhr.send(req);
}

reenterData = function(source)
{
	newData = prompt("Please re-enter " + source +" information")
	// if length is not 8 .. ok to scan again
	document.getElementById(source).innerHTML=''+newData;
	//document.getElementById("tempStorage").innerHTML= VER.newSerialNo + ' ' + source ;
	}

/******************************************************************************************************************************
 *
 *  Charts
 *
 ******************************************************************************************************************************
 */
	var faultBgColours = [
		'rgba(255, 99, 132, 0.5)',		//red
		'rgba(54, 162, 235, 0.5)',		//blue
		'rgba(255, 206, 86, 0.5)',		//yellow
		'rgba(75, 192, 192, 0.5)',		//lightblue
		'rgba(230, 122, 0, 0.5)',			//orange
		'rgba(127, 230, 0, 0.5)',			//brightgreen
		'rgba(108, 27, 179, 0.5)',		//purple
		'rgba(212, 19, 202, 0.5)',		//hotpink
		'rgba(255, 0, 0, 0.5)',				//redasfork
		'rgba(0, 0, 255, 0.5)',				//soblue
		'rgba(115, 86, 32, 0.5)',			//brahn
		'rgba(67, 97, 24, 0.5)',			//darkgreen
		'rgba(207, 205, 87, 0.5)'			//yellow
		];
	var faultBorderColours = [
		'rgba(255, 99, 132, 1)',		//red
		'rgba(54, 162, 235, 1)',		//blue
		'rgba(255, 206, 86, 1)',		//yellow
		'rgba(75, 192, 192, 1)',		//lightblue
		'rgba(230, 122, 0, 1)',			//orange
		'rgba(127, 230, 0, 1)',			//brightgreen
		'rgba(108, 27, 179, 1)',		//purple
		'rgba(212, 19, 202, 1)',		//hotpink
		'rgba(255, 0, 0, 1)',				//redasfook
		'rgba(0, 0, 255, 1)',				//soblue
		'rgba(115, 86, 32, 1)',			//brahn
		'rgba(67, 97, 24, 1)',			//darkgreen
		'rgba(207, 205, 87, 1)'			//yellow

		];
loadChartsPage = function(){

	var	txt = '';

	/*
	txt = txt + '<div id="sidenav" class="topnav">'
	txt = txt + '<div onclick="loadLineChart()">All Faults</div>'
	txt = txt + '<div onclick="loadBarChart(\'smt\')">SMT Faults</div>'
	txt = txt + '<div onclick="loadBarChart(\'conv\')">CONV Faults</div>'
	txt = txt + '<div onclick="loadBarChart(\'progTest\')">Prog/Test Faults</div>'

	//txt = txt + '<div onclick="loadChartsPage()">Charts</div>'
	txt = txt + '</div>'
	*/


	txt = txt + '<div id="chartOptions" >'
	txt = txt + '<div id="chartOptionsType"style="float: left">'
	txt = txt + '<select id="chartType" >';
	txt = txt + '<option disabled selected value> -- Select a chart type -- </option>';
	txt = txt + '<option value="all">All Faults</option>';
	txt = txt + '<option value="smt">SMT</option>';
	txt = txt + '<option value="conv">CONV</option>';
	txt = txt + '<option value="progTest">prog\/test</option>';
	txt = txt + '</select>';
	txt = txt + '</div>'
	txt = txt + '<div id="chartOptionsYear"style="float: left">'
	txt = txt + '</div>'
	txt = txt + '<button onclick="loadChart()">load data</button>'
//  txt = txt + '<button value="Submit to Fail Analysis" onclick="submitToFA()"></button>';
	txt = txt + '</div>'
	txt = txt + '<div id="chartcanvas">'
	//txt = txt + '<canvas id="myChart" width="80" height="30"></canvas>';
	txt = txt + '</div>'
	document.getElementById("content").innerHTML=txt;

	getData('fault','getUniqueList','year(timestamp) as years','','yearData')
	//loadChartData();
}

loadChart = function(){

	chartType = document.getElementById("chartType").value
	chartLoad = {}
	chartLoad.year = document.getElementById("years").value
	chartLoad.weekStart = document.getElementById("weekStart").value
	chartLoad.weekEnd = document.getElementById("weekEnd").value

	if (chartType == 'all'){
		getData('fault','faultsByWeek', chartLoad, chartType, 'chartDataLine');
	}else{
		getData('fault','faultsByWeek', chartLoad, chartType, 'chartDataBar');
	}

	}



loadChartData =function() {
	getData('fault','faultsByWeek','','all', 'weeklyChartData');
	getData('fault','faultsByWeek','','conv', 'convChartData');
	getData('fault','faultsByWeek','','smt', 'smtChartData');
	getData('fault','faultsByWeek','','progTest', 'progTestChartData');
//	getData('fault','faultsByWeek','','undefined', 'console');
	//getData('fault','faultsByWeek','','FTP', 'FTPChartData');

}


/*
loadBarChart = function(catagory){
	if (catagory == 'smt')
		var thisChartData = smtChartData;
	if (catagory == 'conv')
		var thisChartData = convChartData;
	if (catagory == 'progTest')
		var thisChartData = progTestChartData;
		*/
loadBarChart = function(thisChartData){


	var fields = Object.keys(thisChartData[0]);
	fields.shift(); // shifts week_number field from front of array
	console.log (fields);
	var setConfig = {};
	setConfig.type = 'bar';
	setConfig.data = {};
	setConfig.data.labels = [];
	setConfig.data.datasets = [];
	setConfig.options = {
		scales: {
			xAxes: [{
				stacked: true
			}],
      yAxes: [{
				stacked: true,
        ticks: {
					beginAtZero: true
        }
      }]
    }
  };
	for (var f in fields){
	 setConfig.data.datasets.push ({
			label: fields[f],
			borderColor: faultBorderColours[f],
			backgroundColor: faultBgColours[f],
			fill: false,
			data: [],
		});
	}
	for (var i in thisChartData){
		setConfig.data.labels.push ('Week'+ thisChartData[i].week_number);
		for (var j in fields){
			setConfig.data.datasets[j].data.push (thisChartData[i][fields[j]])
		}

	}
	//for (i = 0; i < tr.length; i++) {}

	document.getElementById("chartcanvas").innerHTML='<canvas id="myChart" width="80" height="30"></canvas>';
	var ctx = document.getElementById('myChart').getContext('2d');
	var myLineChart = new Chart(ctx, setConfig);

	/*
	document.getElementById("chartcanvas").innerHTML='<canvas id="myChart" width="80" height="30"></canvas>';
	var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Week'+'1', 'Week2', 'Week3', 'Week4', 'Week5', 'Week6'],
        datasets: [{
            label: 'Solder bridge',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor:     'rgba(255, 99, 132, 1)',
            borderWidth: 1
        },{label: 'PCB damage',
            data: [2, 9, 13, 15, 12, 13],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
						borderColor:     'rgba(54, 162, 235, 1)',
            borderWidth: 1
        },{label: 'Dry joint',
            data: [7, 4, 3, 4, 3, 2],
            backgroundColor: 'rgba(255, 206, 86, 0.5)',
            borderColor:     'rgba(255, 206, 86, 1)',
            borderWidth: 1
        },{label: 'Component failure',
            data: [7, 3, 10, 4, 11, 7],
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor:     'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
					           xAxes: [{
                stacked: true
            }],
            yAxes: [{
								stacked: true,
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
	*/

}

loadLineChart = function(thisChartData){
	var faultcats = ['SMT faults','CONV faults','PROG/TEST faults','Undefined faults']

	var fields = Object.keys(thisChartData[0]);
	var setConfig = {};
	setConfig.type = 'line';
	setConfig.data = {};
	setConfig.data.labels = [];
	setConfig.data.datasets = [];
	setConfig.options = {
					responsive: true,
					hoverMode: 'index',
					stacked: false,
					title: {
						display: true,
						text: 'Fault catagories per week'
					},
					scales: {
						yAxes: {
							type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
							display: true,
						},
					}
				}
	for (var j in faultcats){
		 setConfig.data.datasets.push ({
				label: faultcats[j],
				borderColor: faultBorderColours[j],
				backgroundColor: faultBgColours[j],
				fill: false,
				data: [],
			});
	}
	for (var i in thisChartData){
		setConfig.data.labels.push ('Week'+ thisChartData[i].week_number);
		setConfig.data.datasets[0].data.push (thisChartData[i].SMT_faults)
		setConfig.data.datasets[1].data.push (thisChartData[i].conventional_faults)
		setConfig.data.datasets[2].data.push (thisChartData[i].program_test_faults)
		setConfig.data.datasets[3].data.push (thisChartData[i].undefined_faults)
	}


	document.getElementById("chartcanvas").innerHTML='<canvas id="myChart" width="80" height="30"></canvas>';
	//var ctx = document.getElementById('myChart').getContext('2d');
	var ctx = document.getElementById('myChart');
	var myLineChart = new Chart(ctx, setConfig);

	ctx.onclick = function (evt) {


		var activePoints = myLineChart.getElementsAtEvent(evt);

    if (activePoints !== undefined) {
		//	for (i in activePoints)
		//	alert(myLineChart.data.datasets[i].data[activePoints[i]._datasetIndex]);

			/*
        var dataset = myLineChart.data.datasets[activePoint._datasetIndex];
        var title = myLineChart.data.labels[activePoint._index];
        var oldValue = dataset.data[activePoint._index];
        var newValue = oldValue + 10;
        dataset.data[activePoint._index] = newValue;
        */
    }

    // Calling update now animates element from oldValue to newValue.
    //myLineChart.update();

    //console.log("Dataset: '"+ dataset.label + "' Element '" + title + "' Value updated from: " + oldValue + " to: " + newValue);

  };

	/*
	var myLineChart = new Chart(ctx,{
    type: 'line',
    data: {
			labels: ['Week'+weeklyChartData[0].week_number, 'Week'+weeklyChartData[1].week_number, 'Week3', 'Week4', 'Week5', 'Week6', 'Week7'],
			datasets: [{
				label: 'SMT faults',
				borderColor: 'rgba(255, 99, 132, 1)',
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
				fill: false,
				data: [7, 3, 10, 4, 11, 7, 6],
				yAxisID: 'y-axis-1',
			}, {
				label: 'CONV faults',
				borderColor: 'rgba(54, 162, 235, 1)',
				backgroundColor: 'rgba(54, 162, 235, 0.5)',
				fill: false,
				data: [3, 5, 11, 9, 1, 5, 2],
				yAxisID: 'y-axis-1'
			}, {
				label: 'PROG/TEST faults',
				borderColor: 'rgba(255, 206, 86, 1)',
				backgroundColor: 'rgba(255, 206, 86, 0.5)',
				fill: false,
				data: [2, 6, 3, 8, 4, 2, 8],
				yAxisID: 'y-axis-1'
			}, {
				label: 'Undefined faults',
				borderColor: 'rgba(75, 192, 192, 1)',
				backgroundColor: 'rgba(75, 192, 192, 0.5)',
				fill: false,
				data: [6, 25, 15, 7, 2, 4, 12],
				yAxisID: 'y-axis-1'
			}
			],
		},
    options: {
					responsive: true,
					hoverMode: 'index',
					stacked: false,
					title: {
						display: true,
						text: 'Fault catagories per week'
					},
					scales: {
						yAxes: [{
							type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
							display: true,
							position: 'left',
							id: 'y-axis-1',
						}, {
							type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
							display: true,
							position: 'right',
							id: 'y-axis-2',

							// grid line settings
							gridLines: {
								drawOnChartArea: false, // only want the grid lines for one axis to show up
							},
						}],
					}
				}
	});
	*/
}







//enterFaultDetails();




/*
 *
const node = document.getElementsByClassName(".input")[0];
node.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        // Do work
    }
});
*/




initFaultFields();
