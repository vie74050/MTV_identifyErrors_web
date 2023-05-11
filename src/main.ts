import { UpdateQuizList } from './UI/QuizSetUp';
import { SetupUI } from './UI/Setup';
import './scss/styles.scss'; 
import $ from "jquery";
require('../node_modules/jquery-ui-dist/jquery-ui.min.js');
require('../node_modules/jquery-ui-dist/jquery-ui.min.css');

declare global {
    interface Window { 
		FromUnity_Select: Function, 
		FromUnity_ApplicationStarted: Function, 
		FromUnity_SetListItems: Function,
		createUnityInstance: Function
	}
}

/** Create UI */
$(function(){
	SetupUI();
});

// Handles communication coming from Unity Object to page

/** Unity SelectableObject broadcasts string `transform_name` on Select */ 
window.FromUnity_Select = function(transform_name) {
	
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
	
	UpdateQuizList(itemsInScene);
	//console.log("reset new list");
}