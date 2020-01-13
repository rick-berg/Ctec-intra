
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
        case 'barDrill':
        //loadBarChart(response);
        loadBarChartDrilled(response);
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
  txt = txt + '<div id="PCBPartNumber">part no here</div>';
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
  txt = txt + '<div id="PCBPartNumber">part no here</div>';
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
				document.getElementById("PCBPartNumber").innerHTML= id;
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
  txt = txt + '<div id="FinishedPartNumber">part no here</div>';
	txt = txt + '<input type="text" id="finishedPartLocatorInput" onkeyup="finishedPartlocationSearch()" placeholder="search box" title="Type in a part number">';

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
																				document.getElementById("FinishedPartNumber").innerHTML= id;
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
  txt = txt + '<div id="componentPartNumber"></div>';
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
	// add checks here to see if initial data is valid

//check we have data ok
if(document.getElementById("operatorName").value == ''){
  alert ('operator name is empty')
  return;
}
if(document.getElementById("workOrder").value == ''){
  alert ('please enter work order number')
  return;
}
if(document.getElementById("quantity").value == ''){
  alert ('no quanitiy has been entered')
  return;
}
if(document.getElementById("FinishedPartNumber").innerHTML == 'part no here'){
  alert ('no finished part has been selected please click selection from the box')
  return;
}
if(document.getElementById("PCBPartNumber").innerHTML == 'part no here'){
  alert ('no PCB part has been selected please click selection from the box')
  return;
}
  faultData.operatorName = document.getElementById("operatorName").value;
  faultData.workOrder = document.getElementById("workOrder").value;
	faultData.quantity = document.getElementById("quantity").value;
	faultData.finishedPartNumber = document.getElementById("FinishedPartNumber").innerHTML;
	faultData.pcbNumber = document.getElementById("PCBPartNumber").innerHTML;
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
  if (newData == '' || newData == null){
    alert("nope that didn't work... please try again")
    return;
  }
	// if length is not 8 .. ok to scan again
	document.getElementById(source).innerHTML=''+newData;
	//document.getElementById("tempStorage").innerHTML= VER.newSerialNo + ' ' + source ;
	}


initFaultFields();
