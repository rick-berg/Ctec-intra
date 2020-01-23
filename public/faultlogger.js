
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
getData('componentpartnumbers','getField','part_number,part_description','', 'component');
//getData('fault','getUniqueList','year(timestamp) as years , week(timestamp, 1) as weeks','','console')
//getData('fault','getUniqueList','year(timestamp) as years','','yearData')

faultData = {};



 initFaultFields = function(){

	//getDataPCBPartNumbers();
	getData('pcbpartnumbers','getField','part_number,part_description','', 'PCBPartNumbers');
	//getDataFinishedPartNumbers();
	getData('finishedpartnumbers','getField','part_number,part_description','', 'finishedPartNumbers');
	//getDataInvestigationFindings();
	getData('findings','getAll','*','', 'investigationFindings');
	//getDataFaultCats();
	getData('failcatagory','getAll','*','', 'faultCatagories');
};




// Restricts input for the given textbox to the given inputFilter.
function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  });
}



tableMaker2 = function(tableData, divLocation, tablename, searchname, clickedelementname){
  var fields = Object.keys(tableData[0]);
  var txt = '';
  txt = txt + '<input type="text" id="'+searchname+'" onkeyup="tableSearch(\''+tablename+'\', \''+searchname+'\')" placeholder="search box" title="Type in a part number">';
  txt = txt + '<div id='+clickedelementname+'>clicked data goes here</div>';
  txt = txt + '<div class=scrollybox>';
  txt = txt + '<table id='+tablename+'>';
  txt = txt + '<tr class="header">';
  for (var i in fields) {
    txt = txt + '<th style="width:50%;">' + fields[i] + '</th>';
  }
  txt = txt + '</tr>';
  for (var key in tableData) {
    txt = txt + '<tr>';
    if (tableData.hasOwnProperty(key)) {
      for (var k in fields){
        txt = txt + '<td>'+ tableData[key][fields[k]] + '</td>';
      }
    }
    txt = txt + '</tr>';
  }
  txt = txt + '</table>';
  txt = txt + '</div>';
  txt = txt + '<button onclick="copyToClipboard(\''+divLocation+'\')">Copy text</button>';
  document.getElementById(divLocation).innerHTML= txt;
  //copyToClipboard(containerid)
// this makes the rows clickable
  var table = document.getElementById(tablename);
  var rows = table.getElementsByTagName("tr");
  for (i = 0; i < rows.length; i++) {
    var currentRow = table.rows[i];
    var createClickHandler = function(row, tabl) {
      return function() {
        var tbl = document.getElementById("mysearchTable");
        var trs = tabl.getElementsByTagName("tr")
        for (j = 0; j < trs.length; j++){
          tbl.rows[j].style.background == "green"
        }
        var cell = row.getElementsByTagName("td")[0];
      //  if( row.style.background == "green" ){
      //    row.style.background = "";
      //  } else {
          row.style.background = "green";
      //  };

        var id = cell.innerHTML;
        document.getElementById(clickedelementname).innerHTML= id;
        //alert("id:" + id);
      };
    };
    currentRow.onclick = createClickHandler(currentRow, table);
  }
};










tableMaker = function(tableData, divLocation, tablename, searchname, clickedelementname, copyButton){
  var fields = Object.keys(tableData[0]);
  var txt = '';
  txt = txt + '<input type="text" id="'+searchname+'" onkeyup="tableSearch(\''+tablename+'\', \''+searchname+'\')" placeholder="search box" title="Type in a part number">';
  txt = txt + '<div id='+clickedelementname+'>clicked data goes here</div>';
  txt = txt + '<div class=scrollybox>';
  txt = txt + '<table class="tableMaker" id='+tablename+'>';
  txt = txt + '<tr class="header">';
  for (var i in fields) {
    txt = txt + '<th>' + fields[i] + '</th>';
  }
  txt = txt + '</tr>';
  for (var key in tableData) {
    txt = txt + '<tr>';
    if (tableData.hasOwnProperty(key)) {
      for (var k in fields){
        txt = txt + '<td style="width:100%;">'+ tableData[key][fields[k]] + '</td>';
      }
    }
    txt = txt + '</tr>';
  }
  txt = txt + '</table>';
  txt = txt + '</div>';
  if(copyButton){
    txt = txt + '<br><br>';
    txt = txt + '<button onclick="copyToClipboard(\''+tablename+'\')">Copy text</button>';
  }


  document.getElementById(divLocation).innerHTML= txt;
// this makes the rows clickable
  var table = document.getElementById(tablename);
  var rows = table.getElementsByTagName("tr");
  for (i = 0; i < rows.length; i++) {
    var currentRow = table.rows[i];
    var createClickHandler = function(row) {
      return function() {
        var cell = row.getElementsByTagName("td")[0];
        var id = cell.innerHTML;
        document.getElementById(clickedelementname).innerHTML= id;
        //alert("id:" + id);
      };
    };
    currentRow.onclick = createClickHandler(currentRow);
  }
};
function tableSearch(tableToBeSearched, searchboxname) {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById(searchboxname);
  filter = input.value.toUpperCase();
  table = document.getElementById(tableToBeSearched);
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
};

function copyToClipboard(containerid) {
	if (document.selection) {
    var range = document.body.createTextRange();
    range.moveToElementText(document.getElementById(containerid));
    range.select().createTextRange();
    document.execCommand("copy");
	} else if (window.getSelection) {
		var range = document.createRange();
		range.selectNode(document.getElementById(containerid));
		//range.selectNode(containerid);
		window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
		window.getSelection().removeAllRanges();
    alert("text copied")
	}
}

function drilldown(){
 var workOrderVal = document.getElementById('drillClick').innerHTML;
 getData('fault', 'genSelTFV', 'work_order', workOrderVal,'barDrillTable');
}
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
  if (sqlFunction == 'betweenTimesWhere'){
    faultData.startDate = getDateString('start');
    faultData.endDate = getDateString('end');
  }
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
          // stop if no data
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
        case 'dataViewer':
          tableMaker(response, 'results', 'mysearchTable', 'mysearchSearch', 'mysearchClicked',1);
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
         case 'barDrillTable':
        tableMaker (response, 'chartcanvas', 'drilledTable', 'drillSearch', 'drillClick',1);
          break;
			}

		}
	};
	var str = "/faultQuery?q="+req;
	xmlhttp.open("GET",str,true);
	xmlhttp.send();
};

deleteRecord = function(){
  //id = '{"id":'+document.getElementById("mysearchClicked").innerHTML+'}'
  id = document.getElementById("mysearchClicked").innerHTML

  var req = JSON.stringify(id);
  alert(req);
  var xmlhttp = null;

  if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  } else {// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200){
      alert('we got response');
      response = JSON.parse(xmlhttp.responseText);
    };
  }
    var str = "/faultDelete/"+id;
    xmlhttp.open("DELETE",str,true);
    xmlhttp.send();

};

/*
router.delete('/faultDelete/:id', function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
    if (err) return res.status(500).send("There was a problem deleting the user.");
    res.status(200).send("User: "+ user.name +" was deleted.");
  });
});

app.delete('/faultDelete/:id', function (req, res) {

    let task_id = req.params.id;

    if (!task_id) {
        return res.status(400).send({ error: true, message: 'Please provide text_id' });
    }
    mc.query('DELETE FROM tasks WHERE id = ?', task_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'text has been Deleted successfully.' });
    });
});



*/


/******************************************************************************************************************************
 *
 *  Data collection
 *
 ******************************************************************************************************************************
 */



furtherReport = function(){

  faultData.faultDesc = document.getElementById("faultDesc").value;

  var txt = ''
  txt = txt + '<table class = "tableMaker">';
	txt = txt + '<tr>';
	txt = txt + '<th>Fault Description</th>';
	txt = txt + '</tr>';
	txt = txt + '<tr>';
	txt = txt + '<td><div id = "operatorName" onclick="reenterData(\'operatorName\')" >'+faultData.faultDesc+'</div></td>';
	txt = txt + '</tr>';
	txt = txt + '</table>';
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

  txt = txt + '<table class = "tableMaker">';
  txt = txt + '<tr>';
  txt = txt + '<th>investigation findings</th>';
  txt = txt + '<td>'
  txt = txt + '<select id="investigation_findings" >';
  txt = txt + '<option disabled selected value> -- select investigation findings -- </option>';
  for (i in investigationFindings){
    txt = txt + '<option value="'+investigationFindings[i].investigation_findings+'">'+investigationFindings[i].investigation_findings+'</option>';
  }
  txt = txt + '</select>';
  txt = txt + '</td>';
  txt = txt + '</tr>';

  txt = txt + '<tr>';
  txt = txt + '<th>Additional Comments</th>';
  txt = txt + '<td>'
  txt = txt + '<textarea id="additional_comments" cols="40" rows="2"></textarea>';
  txt = txt + '</td>';
  txt = txt + '</tr>';

  txt = txt + '<tr>';
  txt = txt + '<th>Fault Catagory</th>';
  txt = txt + '<td>'
  txt = txt + '<select id="fault_catagory" >';
	txt = txt + '<option disabled selected value> -- select a fault catagory -- </option>';
	for (i in faultCatagories){
		txt = txt + '<option value="'+faultCatagories[i].catagory+'">'+faultCatagories[i].catagory+'</option>';
	}
	txt = txt + '</select>';
  txt = txt + '</td>';
  txt = txt + '</tr>';
  txt = txt + '</table>';
  txt = txt + '<br>';

  var fields = Object.keys(componentPartNumbers[0]);
  console.log(componentPartNumbers);

  txt = txt + '<table class = "tableMaker">';
  txt = txt + '<tr>';
  txt = txt + '<th>Faulty component</th>';
  txt = txt + '<th>Part location reference</th>';
  txt = txt + '</tr>';
  txt = txt + '<tr>';
  txt = txt + '<td>'
  txt = txt + '<input type="text" id="componentPartLocatorInput" onkeyup="componentPartlocationSearch()" placeholder="search component part" title="Type in a part number">';
  txt = txt + '</td>';
  txt = txt + '<td>'
  txt = txt + '<input type=text id="locationRef">';
  txt = txt + '</td>';
  txt = txt + '</tr>';
  txt = txt + '</table>';



/*
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
  */
	/*
	for (i in faultCatagories){
		txt = txt + '<input type="radio" name="failType" value="'+faultCatagories[i].catagory+'">'+faultCatagories[i].catagory+'<br>';
	}


	//txt = txt + '<br>';

	txt = txt + '<b>Faulty component:</b>';
	txt = txt + '<input type="text" id="componentPartLocatorInput" onkeyup="componentPartlocationSearch()" placeholder="search component part" title="Type in a part number">';
  txt = txt + '<div id="componentPartNumber"></div>';
	txt = txt + '<b>Part location reference:</b>';
	txt = txt + '<input type=text id="locationRef">';
	txt = txt + '<br>';
  */
	txt = txt + '<div class=scrollybox style="height:250px">';
	txt = txt + '<table class = "tableMaker" id="componentPartLocationsTable">';
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
if(document.getElementById("workOrder").value == '' || document.getElementById("workOrder").value.length != 6 ){
  alert ('please enter work order number 6 digits long')
  return;
}
if(document.getElementById("quantity").value == ''){
  alert ('no quanitiy has been entered')
  return;
}
if(document.getElementById("finishedresult").innerHTML == 'clicked data goes here'){
  alert ('no finished part has been selected please click selection from the box')
  return;
}
if(document.getElementById("PCBresult").innerHTML == 'clicked data goes here'){
  alert ('no PCB part has been selected please click selection from the box')
  return;
}
  faultData.operatorName = document.getElementById("operatorName").value;
  faultData.workOrder = document.getElementById("workOrder").value;
	faultData.quantity = document.getElementById("quantity").value;
	faultData.finishedPartNumber = document.getElementById("finishedresult").innerHTML;
	faultData.pcbNumber = document.getElementById("PCBresult").innerHTML;
	addNewFault();
}

addNewFault = function(){
	// create html string to display above data and collect further input
	var txt = '';
	txt = txt + '<div id="fault_header">';
	txt = txt + '<table class = "tableMaker">';
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
	txt = txt + '<input type=text autocomplete="off" id="operatorName">';
	txt = txt + '<br>';
	txt = txt + 'Work Order:';
	txt = txt + '<input type=text autocomplete="off" id="workOrder">';
	txt = txt + '<br>';
	txt = txt + 'Quantity:';
	txt = txt + '<input type=text autocomplete="off" id="quantity">';
	txt = txt + '<br>';
//	txt = txt + 'Finished part number:';
//	txt = txt + '<input type=text id="finishedPartNumber">';
  txt = txt + '<br><div style = "display: flex">';
  txt = txt + '<div style="flex: 0 0 50%">finished part Number:</div>';
  txt = txt + '<div style="flex: 1">PCB Number:</div>';
  txt = txt + '</div>';

	txt = txt + '<div style = "display: flex">';
	txt = txt + '<div style="flex: 0 0 50%" id="finishedPartNumberDiv"></div>';
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
   tableMaker(PCBPartNumbers,'PCBNumberDiv', 'PCBtable', 'PCBSearch', 'PCBresult',0 );
    tableMaker(finishedPartNumbers,'finishedPartNumberDiv', 'finishedtable', 'finishedSearch', 'finishedresult',0 )
//  tablefinishedPartNumbers();
//	tablePCBPartNumbers();

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
  setInputFilter(operatorName, function(value) {
    return /^[a-z]{0,5}$/i.test(value); });

	workOrder.addEventListener("keyup", function(event){
		if (event.key === "Enter") {
		    quantity.focus();
		}
	});
  setInputFilter(workOrder, function(value) {
    return /^\d{0,6}$/i.test(value); });

	quantity.addEventListener("keyup", function(event){
		if (event.key === "Enter") {
//		    finishedPartNumber.focus();
		}
  });
  setInputFilter(quantity, function(value) {
    return /^\d{0,8}$/i.test(value); });

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

setInputFilter(operatorName, function(value) {
  return /^[a-z]{0,5}$/i.test(value); });
setInputFilter(workOrder, function(value) {
  return /^\d{0,6}$/i.test(value); });
setInputFilter(quantity, function(value) {
  return /^\d{0,8}$/i.test(value); });



}

loadIncomplete = function (){

	getData('fault', 'getNull', 'idfault, finished_part_number, work_order, reported_fault', 'completed','incomplete')
}
recieveIncomplete = function (r){
  try{
    //eval("var tempobj = "+r);
  }
  catch(err){
    alert(err);
  }
var txt = ''
txt = txt + '<div id = "tablebox"></div>'
txt = txt + '<div></div>'
txt = txt + '<input type="button" value="Submit" onclick="loadIdSearch()">';
document.getElementById('content').innerHTML = txt
/*

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
   txt = txt + '<td>'+ r[key].work_order + '</td>';
   txt = txt + '<td>'+ r[key].reported_fault + '</td>';
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
*/

tableMaker(r, 'tablebox', 'incompleteTable', 'iSearch', 'iClicked', 0)



}


loadIdSearch = function (){

	var id = document.getElementById('iClicked').innerHTML;
  idSearch(id);

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
	txt = txt + '<table class= "tableMaker">';
	txt = txt + '<tr>';
	txt = txt + '<th>Operator Name</th>';
	txt = txt + '<th>Work Order</th>';
	txt = txt + '<th>Quantity</th>';
	txt = txt + '<th>PCB part number</th>';
	txt = txt + '<th>Finished part number</th>';
  txt = txt + '<th>Reported fault</th>';
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
  txt = txt + '<td><div id = "reported_fault" onclick="reenterData(\'reported_fault\')">'+faultData.reported_fault+'</div></td>';
	txt = txt + '</tr>';
	txt = txt + '</table>';

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

  function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
      textbox.addEventListener(event, function() {
        if (inputFilter(this.value)) {
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        } else {
          this.value = "";
        }
      });
    });
  }


initFaultFields();
