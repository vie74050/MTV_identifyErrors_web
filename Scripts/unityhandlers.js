//https://learn.bcit.ca/shared/scripts/interactive/UnityModelViewerTemplateData/FromToUnityHandlers.js

var data = {};

$(document).ready(function(){
	// add in containter divs for UI so HTML body just contains a simple table for D2L editing

	var $instructions = $(".mmd.instructions");
	
	if ($instructions.length==0){
		// default instructions for cam/keyboard controls if none
		$("table").before('<div class="mmd instructions">Left mouse button to select and pan. Right mouse button to rotate. Scrollwheel to zoom.</div>');
	}

	// add container
	$("table").before('<div class="template-wrap webgl-content"><div id="gameContainer" class="loading"></div></div>');
	
	$("#gameContainer").before($instructions);
	
	// Create jquery dialogue -- for Hotspot Content
	var $dialog = $('<div id="hs_popup">Loading...</div>');    
	
	$("body").append( $dialog );
	$dialog.dialog({
		autoOpen: false,
		draggable: true,
		position: { my: "right", at: "right-20", of: "#gameContainer" },
		open: function( event, ui ) {
			if ( $dialog.text().trim() == "" ){
				$dialog.css("display", "none");
			}else{
				$(this).dialog( "option", "width", "auto" );
				$(this).dialog( "option", "maxWidth", 600 );
			}
		},
		maxWidth: 600
	});
	
	// grab content from table and save in reference data object
	$("table tbody tr ").each(function(i,ui){
		let key = $(this).find("td:first-child").text().trim();
		let html = $(this).find("td:eq(1)").html();
		
		data[key] = html;
	});
	
	$("table").hide();
});

// Handles communication coming from Unity Object to page

// Unity SelectableObject broadcasts string transform_name on Select 
function FromUnity_Select(transform_name){
	console.log(transform_name + " selected");
	
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
	
}

function FromUnity_ApplicationStarted(){
	$(".progress").hide();
	$(".loading").removeClass("loading");
	console.log("app started");
        
        // let web app know that Unity object is ready 
        $(document).trigger("ApplicationStarted");
        
}

function SetWebFullscreen(){
	
}

