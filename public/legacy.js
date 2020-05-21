initMe = function (){
	// getData(table, sqlFunction, field, value, swFunc)
	
	//getData('ptmfile','genSel','','', 'finishedPartNumbers');
};

loadPUHPage = function(){
	
	getData('ptmfile','getField','ptmptno AS Part_Number,ptmdesc AS Description, ptmp1us AS Period_1, ptmp2us AS Period_2, ptmp3us AS Period_3','', 'partList');
	
};
loadPurchHPage = function (){
	var txt = '';
	txt = txt + '';
    txt = txt + 'Get out of here you Jive Turkey. This isnt finished yet';
	document.getElementById('content').innerHTML= txt;
};
loadWOHPage = function (){
	var txt = '';
	txt = txt + '';
    txt = txt + 'You smell like a week old fish. Go away till i have finished this ';
	document.getElementById('content').innerHTML= txt;
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


function getData(table, sqlFunction, field, value, swFunc){
	legacyData = {};
	legacyData.table = table;
	legacyData.sqlFunction = sqlFunction;
	legacyData.field = field;
	legacyData.value = value;
	legacyData.responseAs = 'JSON';

	var req = JSON.stringify(legacyData);
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
				case 'partList':
					console.log (response);
					for (i in response){
						response[i].Period_Total = response[i].Period_1 + response[i].Period_2 + response[i].Period_3
					}
					tableMaker(response, 'content', 'mysearchTable', 'mysearchSearch', 'mysearchClicked',1);
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
	var str = "/legacyQuery?q="+req;
	xmlhttp.open("GET",str,true);
	xmlhttp.send();
};


initMe();
