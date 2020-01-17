loadDataViewer = function () {
  // Create divs page layout etc.
  var txt = ''
  txt = txt + 'search by:<div id="options"></div>'
  txt = txt + '<div id="search_options"></div>'
  txt = txt + '<div id="results">Data goes \'ere </div>'
  document.getElementById("content").innerHTML=txt;
  optionsSelect();
};

optionsSelect = function (){
  var txt = ''
  txt = txt + '<select id="search_option" onchange="searchOptions(this.value)" >';
  txt = txt + '<option disabled selected value> -- select a search option -- </option>';

  txt = txt + '<option value="work_order">Work order</option>';
  txt = txt + '<option value="pcb_part_number">PCB part number</option>';
  txt = txt + '<option value="finished_part_number">Finished part number</option>';
  txt = txt + '</select>';

  document.getElementById("options").innerHTML=txt;
};
searchOptions = function (optionSelected){
  var txt = ''
  switch (optionSelected){
    case 'work_order':
      txt = txt + '<input type="text" id="work_order_search" placeholder="Enter Works order number">';
      txt = txt + '<input type="button" value="Search All" onclick="alert(\'wo search\')">';
      break;
    case 'pcb_part_number':
      txt = txt + '<input type="text" id="PBC_part_search" placeholder="Enter PCB part number">';
      txt = txt + '<input type="button" value="Search All" onclick="alert(\'pcb search\')">';
      /*
      txt = txt + '<br>select a date range to view';
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
    	txt = txt + '<input type="button" value="Search Date" onclick="getData(\'fault\', \'betweenTimesWhere\', \'timestamp\', \'\', \'dataViewer\')">';
      */
      break;
    case 'finished_part_number':

      txt = txt + '<input type="text" id="finished_part_search" placeholder="Enter Finished number">';
      txt = txt + '<input type="button" value="Search All" onclick="alert(\'fin part search\')">';
      //txt = txt + '<input type="button" value="Search All" onclick="getData(\'fault\', \'genSelTFV\', \'finished_part_number\', '+document.getElementById("finished_part_search").value+', \'dataViewer\')">';
      /*
      txt = txt + '<br>select a date range to view';
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
    	txt = txt + '<input type="button" value="Search Date" onclick="alert(\'dateSearch\')">';
      */
      break;
  }
  document.getElementById("search_options").innerHTML=txt;
  initpika();
}
//getData('fault', 'betweenTimes', 'timestamp', '', 'dataViewer')



/*
************************************************************************
DATE PICKER (pikaday)  things for date range lookup imported and not checked yet
************************************************************************
*/

initpika=function(){
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






//getData('fault', 'getNotNull', 'idfault, finished_part_number', 'completed','console')
