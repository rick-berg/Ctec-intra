loadDataViewer = function () {
  // Create divs page layout etc.
  var txt = ''
  txt = txt + '<div id="options">ere is options div</div>'
  txt = txt + '<div id="data">ere is data div</div>'
  document.getElementById("content").innerHTML=txt;
  optionsLoaderDV();
};

optionsLoaderDV = function (){
  var txt = ''
  txt = txt + '<select id="fault_catagory" >';
  txt = txt + '<option disabled selected value> -- select a fault catagory -- </option>';
  for (i in faultCatagories){
    txt = txt + '<option value="'+faultCatagories[i].catagory+'">'+faultCatagories[i].catagory+'</option>';
  }
  txt = txt + '</select>';
  document.getElementById("options").innerHTML=txt;
};


getData('fault', 'getNotNull', 'idfault, finished_part_number', 'completed','console')
