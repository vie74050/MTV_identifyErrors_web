import { QuizSetUp } from './UI/QuizSetUp';
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

const canvasid = "unity-canvas";

/** Unity Loading */
$(function(){
	
	LoadUnity();
	$( document ).tooltip();
	function LoadUnity() {
		const location = window.location.pathname;
		const path = location.substring(0, location.lastIndexOf("/"));
		const folderName = path.substring(path.lastIndexOf("/")+1);
		const canvas = document.createElement("canvas") as HTMLCanvasElement;	  
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
	  
		const loadingCover = document.querySelector("#loading-cover") as HTMLDivElement;
		const progressBarEmpty = document.querySelector("#unity-progress-bar-empty") as HTMLDivElement;
		const progressBarFull = document.querySelector("#unity-progress-bar-full") as HTMLDivElement;
		const spinner = document.querySelector(".spinner") as HTMLDivElement;
	  
		const script = document.createElement("script");

		canvas.setAttribute("id", canvasid);
		document.body.appendChild(canvas);
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
	  
		  window.createUnityInstance(canvas, config, (progress) => {
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
	//console.log("reset new list");
}