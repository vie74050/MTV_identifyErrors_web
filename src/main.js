import $ from "jquery";
import './scss/styles.scss'; 
require('../node_modules/jquery-ui-dist/jquery-ui.js');
require('../node_modules/jquery-ui-dist/jquery-ui.css');

/** Unity Loading */
$(function(){
	
	LoadUnity();
	$( document ).tooltip();
	function LoadUnity() {
		const location = window.location.pathname;
		const path = location.substring(0, location.lastIndexOf("/"));
		const folderName = path.substring(path.lastIndexOf("/")+1);
		const canvas = document.getElementById("unity-canvas");	  
		const buildUrl = "Build";
		const loaderUrl = buildUrl + "/" + folderName + ".loader.js";
		const config = {
		  dataUrl: buildUrl + "/" + folderName + ".data.gz",
		  frameworkUrl: buildUrl + "/" + folderName + ".framework.js.gz",
		  codeUrl: buildUrl + "/" + folderName + ".wasm.gz",
		  streamingAssetsUrl: "StreamingAssets",
		  companyName: "BCIT SOH",
		  productName: "MTV_identfyErrors",
		  productVersion: "0.1",
		};
	  
		const loadingCover = document.querySelector("#loading-cover");
		const progressBarEmpty = document.querySelector("#unity-progress-bar-empty");
		const progressBarFull = document.querySelector("#unity-progress-bar-full");
		const spinner = document.querySelector(".spinner");
	  
		const script = document.createElement("script");
		script.src = loaderUrl;
	  
		script.onload = () => {
		  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
			// Mobile device style: fill the whole browser client area with the game canvas:
			var meta = document.createElement("meta");
			meta.name = "viewport";
			meta.content =
			  "width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes";
			document.getElementsByTagName("head")[0].appendChild(meta);
		  }
	  
		  createUnityInstance(canvas, config, (progress) => {
			spinner.style.display = "none";
			progressBarEmpty.style.display = "";
			progressBarFull.style.width = `${100 * progress}%`;
		  })
			.then((unityInstance) => {
			  loadingCover.style.display = "none";
			})
			.catch((message) => {
			  alert(message);
			});
		};
		document.body.appendChild(script);
	}  

});

// Handles communication coming from Unity Object to page

/** Unity SelectableObject broadcasts string `transform_name` on Select */ 
window.FromUnity_Select = function(transform_name) {
	//console.log(transform_name + " selected");
	/*
	var $dialog = $("#hs_popup");
	
	$dialog.dialog("close");
	
	var key = transform_name.trim();
	if (key in data){
		$dialog.html(data[key])
			.dialog( "option", {
				"title": transform_name
			} )
			.dialog( "open" );
	}
	*/
	
}

/** Method called from Unity on Start */
window.FromUnity_ApplicationStarted = function() {
	$(".progress").hide();
	$(".loading").removeClass("loading");
       
	// let web app know that Unity object is ready 
	$(document).trigger("ApplicationStarted");
	
}

/** Called by Unity on Start to set list of names for g.o of interest in scene 
 *  string delimited by \
 *  NB: Error objects names suffixed by "- ERROR"
*/
window.FromUnity_SetListItems = function(str) {
	let itemsInScene = str.split("\\");

	QuizSetUp(itemsInScene);
	console.log("reset new list");
}
  
/** The GUI setup for the check list items */
function QuizSetUp(listAr) {
	// initialize UI dialog elems
	const $dialog = $( "#dialog-quiz" );
	const $btn = $( "#dialog-quiz-btn" );
	const $canvas = $("#unity-canvas");
	
	const pos = { my: "right bottom", at: "right bottom", of: window };
	$dialog.dialog({
		//draggable: false,
		autoOpen: false,
		resizable: false,
		position: pos,
		minWidth: 200, maxWidth: 400,
		height: $canvas.height(), 
		create: function( event, ui) {
			$btn.on("mousedown", function() {
				
				if ($dialog.dialog("isOpen")) {
					$dialog.dialog("close");
					$btn.removeClass("btn-open");  
				}else {
					$dialog.dialog("open");
					$btn.addClass("btn-open"); 
				}
						
			});
		},
		open: function( event, ui ) {
			let h = $canvas.height();
			$(this).dialog( "option", "height", h );
			$(this).dialog( "option", "position", pos );
		},
		close: function( event, ui ) {
			$btn.removeClass("btn-open");
			$(".fb-btn").hide();
		},
		buttons: [
			{
				text: "Check Answers",
				click: function() {
					$(".fb-btn").show();
				}
			}
		]
	});
	
	// reset UI
	if ($dialog.dialog( "isOpen" )) {	
		$dialog.dialog( "close" );
		$btn.removeClass("btn-open");
	}

	// set up list content
	const $container = $("#list-items-container");
	const tableDataAr = GetTableData();

	$container.empty();
	listAr.forEach((v, i) => {
		const txt = v;
		const $line = $('<p/>');
		const $input = $('<input type="checkbox">');
		const $label = $('<label>' + txt.replace('- ERROR','') + '</label>');
		const $fbBtn = $('<button type="button" class="fb-btn" id="btn-' + i + '">?</button>');

		$line.append($input, $label); 
		if ( v.indexOf('ERROR') > 0 ) {
			let descRomTable = tableDataAr.find( row => row[0].trim() == txt.trim());
			let desc = descRomTable? descRomTable[1] : txt;
			$fbBtn.attr('title', desc);
			$line.append($fbBtn);
			$fbBtn.hide();			
		}
		$container.append($line);
	});
	
}

/**Returns table data as array of rows
 * Column 1 = key Item name from Unity game object
 * Column 2 = html content (description)
 * @returns {object}
 */
function GetTableData() {	
	let tb = [];
	// grab content from table in html and save in reference data object
	$("table tbody tr ").each(function(i,ui){
		let key = $(this).find("td:first-child").text().trim();
		let html = $(this).find("td:eq(1)").text().trim();
		
		tb.push([key, html]);
	});
	$("table").remove();
	return tb;
}
