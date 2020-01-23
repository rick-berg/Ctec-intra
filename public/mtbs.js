devmode = 0
keybinds = function ()
{
	Mousetrap.bind('r i c k b e r g i s t h e b e s t', function(){stopFade()});
	Mousetrap.bind('d e l e t e', function(){devViewerOptions()});
	Mousetrap.bind('d r i l l', function(){drilldown()});
	Mousetrap.bind('u n l o c k', function(){unlockFeatures()});
	Mousetrap.bind('r e w o r k', function(){unlockSMTFeatures()});
	// just for testing comment or remove later
	//Mousetrap.bind('p l a y', function(){VER.test.play()});
	// remove these in final build
	//Mousetrap.bind('l o w', function(){VER.test.lowpass()});
	//Mousetrap.bind('h i g h', function(){VER.test.highpass()});
}
keybinds();
var count = 1;
if (devmode == 1){
	var fadeID = setInterval (function(){
	count = count - 0.01
	document.getElementById("container").style.opacity = count
	},200)
}



stopFade = function ()
{
	alert('Yeah you are damn right he\'s the best');
	clearInterval(fadeID);
	document.getElementById("container").style.opacity = 1
}

devViewerOptions = function ()
{
 var txt = ''
	txt = txt + '<input type="button" value="delete" onclick="deleteRecord()">';
//DELETE FROM products WHERE product_id=1
	document.getElementById("dev_box").innerHTML = txt
}
unlockSMTFeatures = function (){
	var txt = ''
	txt = txt + '<div onclick="enterFaultDetails()">Enter fault</div>'
	txt = txt + '<div onclick="loadIncomplete()">Incomplete Records</div>'
	document.getElementById("topnav").innerHTML = txt
}
unlockFeatures = function (){
	var txt = ''
	txt = txt + '<div onclick="enterFaultDetails()">Enter fault</div>'
	txt = txt + '<div onclick="loadIncomplete()">Incomplete Records</div>'
	txt = txt + '<div onclick="loadChartsPage()">Charts</div>'
	txt = txt + '<div onclick="loadDataViewer()">DataViewer</div>'

	document.getElementById("topnav").innerHTML = txt
}
//setInterval (fadeOut, 600);
