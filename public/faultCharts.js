
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
	txt = txt + '<option value="scrapped">Scrapped Boards</option>';
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
	}else if (chartType == 'scrapped'){
		getData('fault','faultsByWeek', chartLoad, chartType, 'chartDataScrapped');
	}
	else{
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

	document.getElementById("chartcanvas").innerHTML='<canvas id="myChart" backgroundColor = "#ffffff" width="80" height="30"></canvas>';
	var ctx = document.getElementById('myChart').getContext('2d');
	var myLineChart = new Chart(ctx, setConfig);


  document.getElementById("myChart").onclick = function(evt)
  {
      var activePoint = myLineChart.getElementAtEvent(evt);

      if(activePoint.length > 0)
      {
        //get the internal index of slice in pie chart
        var clickedElementindex = activePoint[0]["_index"];
        var clickedElementDSindex = activePoint[0]._datasetIndex;
        //get specific label by index
        var label = myLineChart.data.labels[clickedElementindex];

        //get value by index
        var value = myLineChart.data.datasets[clickedElementDSindex].data[clickedElementindex];
        var datalabel = myLineChart.data.datasets[clickedElementDSindex].label;

        var chartCatagory = document.getElementById('chartType').value
        var yearData = document.getElementById('years').value

        label = label.substring(4);
        console.log('weekno = '+label+'')
        console.log('dataset name = '+datalabel+'')
        console.log('chart type = '+chartCatagory+'')
				if (chartCatagory == 'All Faults') {chartCatagory = "";}
        if (chartCatagory == 'conv') {chartCatagory = "fail_catagory = 'CONV' AND ";}
        if (chartCatagory == 'smt') {chartCatagory = "fail_catagory = 'SMT' AND ";}
        if (chartCatagory == 'progTest') {chartCatagory = "fail_catagory = 'PROG/TEST' AND ";}
        if (datalabel == 'undetermined') datalabel = 'After visual inspection & Test, fault cannot be determined';
        if (datalabel == 'retest_good') datalabel = 'Tested in full and functions correctly';
        if (datalabel == 'reprogram_good') datalabel = 'Re-programmed and passed test';
        if (datalabel == 'flux_issue') datalabel = 'Flux Issue';
        if (datalabel == 'tester_issue') datalabel = 'Problem with tester';
        if (datalabel == 'plastics_issue') datalabel = 'Problem with plastics';
        if (datalabel == 'sealed_cannot_investigate') datalabel = 'Glued product. Cannot Investigate.';
        if (datalabel == 'pcb_damage') datalabel = 'PCB Damage';
        if (datalabel == 'track_damage') datalabel = 'Track damage';
        if (datalabel == 'pad_damage') datalabel = 'Pad damage';
        if (datalabel == 'dry_joint') datalabel = 'Dry joint';
        if (datalabel == 'component_placement_solder') datalabel = 'Incorrect component placed/soldered';
        if (datalabel == 'component_knocked_from_position') datalabel = 'Component knocked out of position';
        if (datalabel == 'component_failure') datalabel = 'Component failure';
        if (datalabel == 'component_missing') datalabel = 'Component missing';
        if (datalabel == 'component_misplaced') datalabel = 'Component misplaced';
        if (datalabel == 'component_not_soldered') datalabel = 'Component not soldered';
        if (datalabel == 'solder_bridge') datalabel = 'Solder bridge';
        if (datalabel == 'not_programmed') datalabel = 'No Program present';
        if (datalabel == 'N_A') datalabel = 'N/A';


        //console.log('value = '+value+'')
        //console.log('dataset index = '+clickedElementDSindex+'')
        //console.log(activePoint)
				var selector = 'table'
				if (selector == 'table'){
					fields = 'work_order, pcb_part_number, COUNT(*)'
        whereStuff = ""+chartCatagory+"week(timestamp, 1) = '"+label+"' AND year(timestamp) = '"+yearData+"' "+
                    "AND investigation_findings = '"+datalabel+"' group by work_order;"
        getData('fault', 'genSel', fields ,whereStuff,'barDrillTable');
				} else {
					fields = 'pcb_part_number, COUNT(*)'
        whereStuff = "fail_catagory = '"+chartCatagory+"' AND week(timestamp, 1) = '"+label+"' AND year(timestamp) = '"+yearData+"' "+
                    "AND investigation_findings = '"+datalabel+"' group by pcb_part_number;"
        getData('fault', 'genSel', fields ,whereStuff,'barDrill');
				}
				
				
     }
  };




loadBarChartDrilled = function (thisChartData){
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
		setConfig.data.labels.push (''+ thisChartData[i].pcb_part_number);
		for (var j in fields){
			setConfig.data.datasets[j].data.push (thisChartData[i][fields[j]])
		}

	}
	//for (i = 0; i < tr.length; i++) {}

	document.getElementById("chartcanvas").innerHTML='<canvas id="myChart" width="80" height="30"></canvas>';
	var ctx = document.getElementById('myChart').getContext('2d');
	var myChart = new Chart(ctx, setConfig);
};



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


	document.getElementById("chartcanvas").innerHTML='<canvas id="myChart" backgroundColor = "#ffffff" width="80" height="30"></canvas>';
	//var ctx = document.getElementById('myChart').getContext('2d');
	var ctx = document.getElementById('myChart').getContext("2d");
	var myLineChart = new Chart(ctx, setConfig);


  document.getElementById("myChart").onclick = function(evt)
  {
      var activePoint = myLineChart.getElementAtEvent(evt);

      if(activePoint.length > 0)
      {
        //get the internal index of slice in pie chart
        var clickedElementindex = activePoint[0]["_index"];
        var clickedElementDSindex = activePoint[0]._datasetIndex;
        //get specific label by index
        var label = myLineChart.data.labels[clickedElementindex];

        //get value by index
        var value = myLineChart.data.datasets[clickedElementDSindex].data[clickedElementindex];
        var datalabel = myLineChart.data.datasets[clickedElementDSindex].label;
				var yearData = document.getElementById('years').value
				label = label.slice(4);
        console.log('label = '+label+'')
				
        //console.log('value = '+value+'')
        //console.log('dataset index = '+clickedElementDSindex+'')
				datalabel = datalabel.substring(0, datalabel.length - 7);
        console.log('dataset name = '+datalabel+'')
				fields = 'work_order, pcb_part_number, COUNT(*)'
				whereStuff = "week(timestamp, 1) = '"+label+"' AND year(timestamp) = '"+yearData+"' "+
                    "AND fail_catagory = '"+datalabel+"' group by work_order;"
				getData('fault', 'genSel', fields ,whereStuff,'barDrillTable');
        //console.log(activePoint)
        /* other stuff that requires slice's label and value */
     }
  }

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

loadScrappedChart = function(thisChartData){
	var faultcats = ['Scrapped board count']

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
						text: 'Scrapped board count'
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
		setConfig.data.labels.push (thisChartData[i].month);
		setConfig.data.datasets[0].data.push (thisChartData[i].count)
	}


	document.getElementById("chartcanvas").innerHTML='<canvas id="myChart" backgroundColor = "#ffffff" width="80" height="30"></canvas>';
	//var ctx = document.getElementById('myChart').getContext('2d');
	var ctx = document.getElementById('myChart').getContext("2d");
	var myLineChart = new Chart(ctx, setConfig);


  document.getElementById("myChart").onclick = function(evt)
  {
      var activePoint = myLineChart.getElementAtEvent(evt);

      if(activePoint.length > 0)
      {
        //get the internal index of slice in pie chart
        var clickedElementindex = activePoint[0]["_index"];
        var clickedElementDSindex = activePoint[0]._datasetIndex;
        //get specific label by index
        var label = myLineChart.data.labels[clickedElementindex];

        //get value by index
        var value = myLineChart.data.datasets[clickedElementDSindex].data[clickedElementindex];
        var datalabel = myLineChart.data.datasets[clickedElementDSindex].label;
				var yearData = document.getElementById('years').value
				//label = label.slice(4);
        console.log('label = '+label+'')
				
        //console.log('value = '+value+'')
        //console.log('dataset index = '+clickedElementDSindex+'')
				//datalabel = datalabel.substring(0, datalabel.length - 7);
        console.log('dataset name = '+datalabel+'')
				fields = '*'
				whereStuff = " monthname(timestamp) = '"+label+"' AND year(timestamp) = '"+yearData+"' "+
                    "AND repaired_scrapped = 'scrapped' ;"
				getData('fault', 'genSel', fields ,whereStuff,'barDrillTable');
        //console.log(activePoint)
        /* other stuff that requires slice's label and value */
     }
  }

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

