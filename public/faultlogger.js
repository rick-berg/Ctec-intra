
investigationFindings = {};
faultcategories = {};
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

getData('componentpartnumbers','getField','part_number,part_description','', 'component');

faultData = {};

initFaultFields = function(){
	getData('pcbpartnumbers','getField','part_number,part_description','', 'PCBPartNumbers');
	getData('finishedpartnumbers','getField','part_number,part_description','', 'finishedPartNumbers');
	getData('findings','getAll','*','', 'investigationFindings');
	getData('failcatagory','getAll','*','', 'faultcategories');
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
				if (fields[k] == 'idfault'){
					txt = txt + '<td>'+ tableData[key][fields[k]].toString(16) + '</td>';
				}else{
					txt = txt + '<td>'+ tableData[key][fields[k]] + '</td>';
				}

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
				case 'faultcategories':
					faultcategories = response;
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


loadPartEntry = function (){
	var txt = '';
	txt = txt + '';
	txt = txt + '<div class = "large">Enter part details to add to part lists</div>';
	txt = txt + '<select id="part_type_selector" >';
	txt = txt + '<option value= "" disabled selected > -- Select Part type to add -- </option>';
	txt = txt + '<option value="componentpartnumbers">Component part</option>';
	txt = txt + '<option value="finishedpartnumbers">PCB part</option>';
	txt = txt + '<option value="pcbpartnumbers">Finished part</option>';
	txt = txt + '</select>';
	txt = txt + '<br>';
  txt = txt + 'Part number:';
 	txt = txt + '<input type=text autocomplete="off" id="partNumber">';
 	txt = txt + '<br>';
  txt = txt + 'Part description:';
 	txt = txt + '<input type=text autocomplete="off" id="partDescription">';
 	txt = txt + '<br>';
	txt = txt + '<input type="button" value="AddPart" onclick="addNewPart()">';

 	document.getElementById("content").innerHTML=txt;

	var addedPartNo = document.getElementById("partNumber")
	var addedPartDesc = document.getElementById("partDescription")
	var addedPartTyp = document.getElementById("part_type_selector")

	setInputFilter(addedPartNo, function(value) {
    return /^([A-z]{0,3}[0-9]{0,7})$/i.test(value);
  });

}

addNewPart = function (){

	// get data & do some sanitizing checks
	newPartData = {}
	newPartData.part_number = document.getElementById("partNumber").value
	if(newPartData.part_number == ''){
    alert ('part number is blank')
    return;
  } else if (newPartData.part_number.length != 10){
		alert ('part number is not the correct length')
		return;
	}
	newPartData.part_description = document.getElementById("partDescription").value
	if(newPartData.part_description == ''){
		alert ('part description is blank')
		return;
	}
	newPartData.table = document.getElementById("part_type_selector").value
	if(newPartData.table == ''){
		alert ('Select a part type')
		return;
	}
console.log(newPartData);
	// send data
	var req = JSON.stringify(newPartData);
	var xhr = null;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange=function(){
    if (xhr.readyState==4 && xhr.status==200){
      jResponse = JSON.parse(xhr.responseText);
			submittedFault(jResponse.insertId);
		}
	}

		xhr.open("POST", "/addNewPart", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(req);

	// get response reporting ok


}




deleteRecord = function(){
  //id = '{"id":'+document.getElementById("mysearchClicked").innerHTML+'}'
  id = document.getElementById("mysearchClicked").innerHTML

  var req = JSON.stringify(parseInt(id, 16));
  alert('attempting to delete record '+id);
  var xmlhttp = null;

  if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  } else {// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200){
      alert('record id '+id+' deleted successfully');
      response = JSON.parse(xmlhttp.responseText);
    };
  }
    var str = "/faultDelete/"+req;
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
 *  Program Flow
 *
 ******************************************************************************************************************************
 */

 // this is the first function called to start recording a fault
 // called from the menu
 // and when there are no more faults to record (the button pressed at end of recording a fault)
enterFaultDetails = function(){

  // build HTML string
  // input fields for
  // Operator Initials
  // work order number
  // work order quantity
  // finished part number
  // Pcb part number
  var txt = '';
 	txt = txt + '<div class = "large">Enter details to log fault</div>';
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

// use table maker function to create tables for selecting PCB and finished parts
  tableMaker(PCBPartNumbers,'PCBNumberDiv', 'PCBtable', 'PCBSearch', 'PCBresult',0 );
  tableMaker(finishedPartNumbers,'finishedPartNumberDiv', 'finishedtable', 'finishedSearch', 'finishedresult',0 )

// get references to DOM elements
 	operatorName = document.getElementById("operatorName");
 	workOrder = document.getElementById("workOrder");
 	quantity = document.getElementById("quantity");
// start cursor in opearator name textbox
 	operatorName.focus();

// even listner and input filter setup for operator name
 	operatorName.addEventListener("keyup", function(event){
 		if (event.key === "Enter") {
      workOrder.focus();
    }
 	});
  setInputFilter(operatorName, function(value) {
    return /^[a-z]{0,5}$/i.test(value);
  });

// even listner and input filter setup for work order
  workOrder.addEventListener("keyup", function(event){
    if (event.key === "Enter") {
 		   quantity.focus();
 		}
 	});
  setInputFilter(workOrder, function(value) {
    return /^\d{0,6}$/i.test(value);
  });

// even listner and input filter setup for operator name
  quantity.addEventListener("keyup", function(event){
    if (event.key === "Enter") {
 //		    finishedPartNumber.focus();
 		}
  });
  setInputFilter(quantity, function(value) {
    return /^\d{0,8}$/i.test(value);
  });
}

jobDetailsEntered = function(){
 //check we have data that is good
 // no blank operator names
  if(document.getElementById("operatorName").value == ''){
    alert ('operator name is empty')
    return;
  }
 // work order is 6 digits and not blank
  if(document.getElementById("workOrder").value == '' || document.getElementById("workOrder").value.length != 6 ){
    alert ('please enter work order number 6 digits long')
    return;
  }
 // work order quanintiy is not blank
  if(document.getElementById("quantity").value == ''){
    alert ('no quanitiy has been entered')
    return;
  }
 // check to see a finished part number has been selected
  if(document.getElementById("finishedresult").innerHTML == 'clicked data goes here'){
    alert ('no finished part has been selected please click selection from the box')
    return;
  }
// check to see if a PCB part number has been selected
  if(document.getElementById("PCBresult").innerHTML == 'clicked data goes here'){
    alert ('no PCB part has been selected please click selection from the box')
    return;
  }
  // set faultdata properties to values input
  faultData.operatorName = document.getElementById("operatorName").value;
  faultData.workOrder = document.getElementById("workOrder").value;
  faultData.quantity = document.getElementById("quantity").value;
  faultData.finishedPartNumber = document.getElementById("finishedresult").innerHTML;
  faultData.pcbNumber = document.getElementById("PCBresult").innerHTML;
  addNewFault();
}

addNewFault = function(){
	// create HTML string to display data collected from jobDetailsEntered function and collect further input(fault description)
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

// get reference to DOM element for fault description and focus
	faultDesc = document.getElementById("faultDesc");
	faultDesc.focus();

// event listner for enter pressed ... removed as no function at the mo
	faultDesc.addEventListener("keyup", function(event){
		if (event.key === "Enter") {
    }
	});
}


submitToFA = function(){
// clear out faultdata
  faultData = {};
	faultData.table = "fault";
//recollect of data incase of change from reenter function (pcb number and finpart number different id's from last)
  faultData.operatorName = document.getElementById("operatorName").innerHTML;
  faultData.workOrder = document.getElementById("workorder").innerHTML;
  faultData.quantity = document.getElementById("quantity").innerHTML;
  faultData.finishedPartNumber = document.getElementById("finishedPartNumber").innerHTML;
  faultData.pcbNumber = document.getElementById("pcbNumber").innerHTML;
// this is new ... added in addNewFault function
	faultData.faultDesc = document.getElementById("faultDesc").value;
	if (faultData.faultDesc == ''){
		alert ('Please give a fault description')
		return
	}
	faultData.responseAs = "JSON"; // needed for now
// prep faultData as JSON string ready to POST
	var req = JSON.stringify(faultData);
	var xhr = null;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange=function(){
		if (xhr.readyState==4 && xhr.status==200){
// parse response and send to reciever function submittedtoFA
			jResponse = JSON.parse(xhr.responseText);
			submittedtoFA(jResponse.insertId);
		}
	}
// post the faultData JSON string to enterFaultIncomplete route on backend
	xhr.open("POST", "/enterFaultIncomplete", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(req);
}

submittedtoFA = function(faultId){
// string conversion for fault ID
	hexVal = faultId.toString(16)
// build HTML to display the submitted faults Hex id
	var txt = '';
	txt = txt + 'your fault id is : ';
	txt = txt + hexVal;
	txt = txt + '<br>';
	txt = txt + '<input type="button" value="Add another fault" onclick="addNewFault()">';
	txt = txt + '<input type="button" value="No more faults" onclick="enterFaultDetails()">';

	document.getElementById("sub_content").innerHTML= txt;
}


furtherReport = function(){
// clear out faultdata
  faultData = {};
  faultData.table = "fault";
//recollect of data incase of change from reenter function (pcb number and finpart number different id's from last)
  faultData.operatorName = document.getElementById("operatorName").value;
  faultData.workOrder = document.getElementById("workorder").value;
  faultData.quantity = document.getElementById("quantity").value;
  faultData.finishedPartNumber = document.getElementById("finishedPartNumber").innerHTML;
  faultData.pcbNumber = document.getElementById("pcbNumber").innerHTML;
// this is new ... added in addNewFault function
  faultData.faultDesc = document.getElementById("faultDesc").value;
	if (faultData.faultDesc == ''){
		alert ('Please give a fault description')
		return
	}

// build HTML string to display fault description
  var txt = ''
  txt = txt + '<table class = "tableMaker">';
	txt = txt + '<tr>';
	txt = txt + '<th>Fault Description</th>';
	txt = txt + '</tr>';
	txt = txt + '<tr>';
	txt = txt + '<td><div id = "faultDesc" onclick="reenterData(\'faultDesc\')" >'+faultData.faultDesc+'</div></td>';
	txt = txt + '</tr>';
	txt = txt + '</table>';
  document.getElementById("fault_description").innerHTML=txt;

// build HTML string for rest of report


	txt = '';
  txt = txt + '<table class = "tableMaker">';

// selectable dropdown of investigation findings
  txt = txt + '<tr>';
  txt = txt + '<th>investigation findings</th>';
  txt = txt + '<td>'
  txt = txt + '<select id="investigation_findings" >';
  txt = txt + '<option value= "" disabled selected > -- select investigation findings -- </option>';
  for (i in investigationFindings){
    txt = txt + '<option value="'+investigationFindings[i].investigation_findings+'">'+investigationFindings[i].investigation_findings+'</option>';
  }
  txt = txt + '</select>';
  txt = txt + '</td>';
  txt = txt + '</tr>';
// text area for collecting additional comments
  txt = txt + '<tr>';
  txt = txt + '<th>Additional Comments</th>';
  txt = txt + '<td>'
  txt = txt + '<textarea id="additional_comments" cols="40" rows="2"></textarea>';
  txt = txt + '</td>';
  txt = txt + '</tr>';

// selectable dropdown of fault categories
  txt = txt + '<tr>';
  txt = txt + '<th>Fault category</th>';
  txt = txt + '<td>'
  txt = txt + '<select id="fault_category" >';
	txt = txt + '<option value="" disabled selected > -- select a fault category -- </option>';
	for (i in faultcategories){
		txt = txt + '<option value="'+faultcategories[i].catagory+'">'+faultcategories[i].catagory+'</option>';
	}
	txt = txt + '</select>';
  txt = txt + '</td>';
  txt = txt + '</tr>';

  txt = txt + '</table>';
  txt = txt + '<br>';

//table for selecting component parts and box for designators
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
// radio buttons for selecting outcome
	txt = txt + '<input type="radio" name="repscrap" value="repaired by cell">repaired by cell';
	txt = txt + '<input type="radio" name="repscrap" value="repaired by FA">repaired by FA';
	txt = txt + '<input type="radio" name="repscrap" value="scrapped">scrapped<br>';
// button to submit
	txt = txt + '<input type="button" value="Submit" onclick="submitFault()">';
	document.getElementById("sub_content").innerHTML=txt;
// make the part table clickable
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

// search function for the part number table
// change this out for a tablemaker function table you lazy fucker !!!
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

submitFault = function(){
// clear out faultdata
  faultData = {};
  faultData.table = "fault";
//recollect of data incase of change from reenter function (pcb number and finpart number different id's from last)
  faultData.operatorName = document.getElementById("operatorName").innerHTML;
  faultData.workOrder = document.getElementById("workorder").innerHTML;
  faultData.quantity = document.getElementById("quantity").innerHTML;
  faultData.finishedPartNumber = document.getElementById("finishedPartNumber").innerHTML;
  faultData.pcbNumber = document.getElementById("pcbNumber").innerHTML;
  faultData.faultDesc = document.getElementById("faultDesc").value;
	faultData.responseAs = "JSON";
//collect new data

	faultData.investigation_findings = document.getElementById('investigation_findings').value;
// checks if left default
  if (faultData.investigation_findings == ''){
		alert('No Investigation Findings categories have been selected')
		return;
	}


	faultData.additional_comments = document.getElementById('additional_comments').value;
//this is optional no checking

	faultData.fail_catagory = document.getElementById('fault_category').value;
// checks if left default
  if (faultData.fail_cataory == ''){
		alert('default fail category')
		return;
	}


  faultData.faulty_part_number = document.getElementById('componentPartLocatorInput').value;
// check previous ones .... this isnt setup the same but probably should be
// use tablemaker if possible !!

  faultData.faulty_location_reference = document.getElementById('locationRef').value;
//this is optional no checking

  var ele = document.getElementsByName('repscrap');
  if (ele[0].checked == false && ele[1].checked == false && ele[2].checked == false){
		alert('Please select an option for repair / scrap')
		return;
	}

    for(i = 0; i < ele.length; i++) {
			if(ele[i].checked){
        faultData.repaired_scrapped = ele[i].value;
      }
    }

// prep faultData as JSON string ready to POST
	var req = JSON.stringify(faultData);
	var xhr = null;
	var xhr = new XMLHttpRequest();
// parse response and send returned fault id to reciever
	xhr.onreadystatechange=function(){
    if (xhr.readyState==4 && xhr.status==200){
      jResponse = JSON.parse(xhr.responseText);
			submittedFault(jResponse.insertId);
		}
	}
// post the faultData JSON string to enterFaultIncomplete route on backend
	xhr.open("POST", "/enterFault", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(req);
}


submittedFault = function(faultId){
//build HTML string
//to display returned fault ID
//add buttons to continue
	var txt = '';
	txt = txt + 'your fault id is :';
	txt = txt + faultId.toString(16);
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
	txt = txt + '<select id="investigation_findings" >';
	txt = txt + '<option value= "" disabled selected > -- select investigation findings -- </option>';
	for (i in investigationFindings){
		txt = txt + '<option value="'+investigationFindings[i].investigation_findings+'">'+investigationFindings[i].investigation_findings+'</option>';
	}
	txt = txt + '</select>';
	txt = txt + '<br>';
	txt = txt + '<b>additional comments:</b>';
	txt = txt + '<textarea id="additional_comments" cols="40" rows="2"></textarea>';
	txt = txt + '<br>';
	txt = txt + '<b>Fault category: </b>';
	txt = txt + '<select id="fault_category" >';
	txt = txt + '<option disabled selected value> -- select a fault category -- </option>';
	for (i in faultcategories){
		txt = txt + '<option value="'+faultcategories[i].catagory+'">'+faultcategories[i].catagory+'</option>';
	}
	txt = txt + '</select>';

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
	faultData.fail_catagory = document.getElementById('fault_category').value;
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
