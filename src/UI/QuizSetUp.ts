import $ from "jquery";
import { GetTableData } from "./GetTableData";
import { UnityLoadNextScene, UnityResetScene, UnityLoadScene } from "./UnityLoaderSetup";

const sceneInfoId: string = "scene-info";
const dialogId : string = "dialog-quiz";
const listContainerId : string = "list-items-container";
const quizInfoId : string = "dialog-quiz-info";
const dialogBtnId : string = "dialog-quiz-btn";
const allOKBtnId : string = "allOKbtn";
const dialogEndGameId : string = "dialogEndGameId";

var tableDataAr : string[][];
var prompts = {
	startscene: 'Inspect the scene for issues, and choose one of the options above.',
	quizinfo: 'Select all problematic issues. Click Submit to proceed.',
	showanswersprompt: 'Hover over the icons for details.',
	noerrors: 'There are no issues in this scene.',
	itemok: 'This item is oK',
	endgame: 'Completed all tasks'
}
/** Tracks total number of misidentified items */
var numErrors = 0;

/** The GUI setup for the inspection check list items.
 * Creates the HTML elements:
 * - dialog component, id = dialogId & instantiates as jquery dialog component; 
 * - quiz info text, id=quizInfo; 
 * - list container, id=listContainerId
 * @param string btnParentId The selector to parent trigger button
*/
export function QuizUISetUp(btnParentId : string = "body") {
		
	if ($("#"+dialogId).length === 0) {
		const quizui = `<div id="`+ sceneInfoId +`">Loading...</div>
					<div id="`+dialogId+`" title="Inspection Report">
					<div id="`+quizInfoId+`"></div>
					<div id="`+listContainerId+`"></div>
					</div>`;
		
		// create elems if not in html
		$("body").prepend($(quizui));
		console.log("created dom elems", $("#"+dialogId));
	}else{
		console.log("found dom elems", $("#"+dialogId));
	}

	tableDataAr = GetTableData();

	// custom prompts
	const customInfoPrompt = tableDataAr.find(row => row[0].trim() == "Info prompt");
	if( customInfoPrompt ) {
		prompts.quizinfo = customInfoPrompt[1] + " Click Submit to proceed.";
	}

	const customAnsPrompt = tableDataAr.find(row => row[0].trim() == "Show answers prompt");
	if ( customAnsPrompt ) {
		prompts.showanswersprompt = customAnsPrompt[1].replace('?','<button class="fb-icon">?</button>');
	}

	const $allOKbtn = $(`<button class="quiz-btn right" id="` + allOKBtnId + `">No issues in scene</button>`);
	const $dialogBtn = $(`<button class="quiz-btn" id="`+dialogBtnId+`">Report Issue(s)</button>`);
	const $dialog = $("#"+dialogId);
	const pos = { my: "right bottom", at: "right bottom", of: window };

	$(btnParentId).append($allOKbtn, $dialogBtn); 

	if ($dialog.length !== 0) {
		
		// initialize UI dialog
		var h = $("canvas").height(); 
		$dialog.dialog({
			//draggable: false,
			autoOpen: false,
			resizable: false,
			position: pos,
			minWidth: 200, maxWidth: 400,
			height: h,
			create: function (event, ui) {
				$dialogBtn.on("mousedown", function () {

					if ($dialog.dialog("isOpen")) {
						$dialog.dialog("close");
						$dialogBtn.removeClass("btn-open");
					} else {
						$dialog.dialog("open");
						$dialogBtn.addClass("btn-open");
					}

				});

				$allOKbtn.on("mousedown", function(){
					$(this).prop("disabled", true);
					submitBtnQuizHandler();
					$dialog.dialog("open");
					$dialogBtn.addClass("btn-open");
				});
			},
			open: function (event, ui) {
				h = $("canvas").height(); 
				$(this).dialog("option", "height", h);
				$(this).dialog("option", "maxHeight", h);
				$(this).dialog("option", "position", pos);
			},
			close: function (event, ui) {
				$dialogBtn.removeClass("btn-open");
			},
			buttons: [
				{
					text: "Submit",
					id: "chkBtn",
					click: function () {
						submitBtnQuizHandler();
					}
				},
				{
					text: "New Scene",
					id: "newSceneBtn",
					click: function() {
						newQuizBtnHandler();
					}
				},
				{
					text: "Next",
					id: "nextBtn",
					click: function() {
						nextQuizBtnHandler();
					}
				}
			]
		});
	}
}
/** Handles FromUnity_ApplicationStarted */
export function SceneStart( sceneName: string ) {
	const $sceneInfo = $("#"+ sceneInfoId);
	const descData = tableDataAr.find(row => 
		row[0].trim().toLowerCase() == sceneName.trim().toLocaleLowerCase()
	);
	let desc = prompts.startscene;

	if (descData) {
		desc = descData[1];
	}else {
		console.log("Scene name: " + sceneName + " not found in table" );
	}

	if ( $sceneInfo.length>0 ) {
		$sceneInfo.html(desc);
	}

}
/** Handles FromUnity_SetListItems -> Update list items 
 * @param {Array.<string>} listAr List of items' game object name
*/
export function UpdateQuizList(listAr) {
	// set up list content
	const $container = $("#"+listContainerId);
	
	$container.empty();
	listAr.forEach((v, i) => {
		const $line = $('<p/>');
		const $input = $('<input class="_items" type="checkbox">');
		const $label = $('<label>' + v.replace(/- ERROR([ 0-9, \w+ \  ]*)/, '') + '</label>');
		
		$line.append($input, $label);
		let descFromTable = tableDataAr.find(row => row[0].trim() == v.trim());
		let desc = descFromTable ? descFromTable[1] : prompts.itemok;
		$input.data("desc", desc);
		if (v.indexOf('ERROR') > 0) {
			$input.addClass("_e_")
		}
						
		$container.append($line);
	});

	resetSceneUI();
}

/** Handles Fromunity_EndGame if called */
export function EndGame() {
	const pos = { my: "center", of: window };
	let $dialog_endgame = $("#"+dialogEndGameId);
	let prompt = "Excellent work! " + prompts.endgame + "\n\nPlay again?";

	if (numErrors > 0) {
		prompt = prompts.endgame + "\n\nTotal misidentified: " + numErrors + ".  \n\nAim for 0 mistakes. Play again?  ";
	}

	// create UI elem & instantiate as $dialog component
	if ($dialog_endgame.length == 0) {
		
		$dialog_endgame = $(`<div id="`+dialogEndGameId+`">`+prompt+`</div>`);
		$("body").append($dialog_endgame);
		$dialog_endgame.dialog({
			draggable: true,
			autoOpen: false,
			resizable: false,
			position: pos,
			minWidth: 200, maxWidth: 400,
			open: function (event, ui) {
				$(".ui-dialog-titlebar-close").hide();
				
			},
			buttons: [
				{
					text: "Play Again!",
					id: "restartGameBtn",
					click: function () {
						UnityLoadScene(0);
						numErrors = 0;
						$dialog_endgame.dialog('close');
					}
				},
				{
					text: "Save Session QR",
					id: "saveQRBtn",
					click: function() {
						
						let qrImg = document.createElement('img');
						const data = getSessionDataPkg();
						const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
						qrImg.src = url;
						
						downloadImage(url, "QRsessionCode");
					}
				}
			]
		});

	}
	
	$dialog_endgame.html(prompt);
	$dialog_endgame.dialog('open');
}

/** Resets the GUI elements and text to init state */
function resetSceneUI() {
	const $dialogBtn = $("#"+dialogBtnId);
	const $allOKBtnId = $("#"+allOKBtnId);
	const $dialog = $("#"+dialogId);
	const $info = $("#"+quizInfoId);	

	allOKBtnId
	// reset UI
	//$dialog.dialog("open");
	//$btn.addClass("btn-open");
	
	$("#chkBtn").show();
	$("#newSceneBtn").hide(); 
	$("#nextBtn").hide(); 
	
	$dialog.dialog("close");
	$dialogBtn.removeClass("btn-open");
	$info.text(prompts.quizinfo); 
	$allOKBtnId.prop("disabled", false);
	
}

function submitBtnQuizHandler() {
	const $info = $("#"+quizInfoId);
	const $inputs_e_s = $("input._items._e_"); // error items
	const $inputs_not_e_checked = $("input._items:not(._e_):checked"); 

	// all error items and non error but checked items get fb icon
	const $inputs_toFB = $("input._items:not(._e_):checked, input._items._e_"); 

	let fb_text = "";

	$("input").prop("disabled", true);
	// Add UI fb on all error items 
	$inputs_toFB.each( (i,input) => {
		const $input = $(input);
		const inputelem = <HTMLInputElement> input;
		const desc = $input.data("desc") || prompts.itemok;
		const $fbBtn = getFBIcon(desc); 

		if ($input.hasClass("_e_") && inputelem.checked) {
			$fbBtn.addClass("correct");
			$fbBtn.html("&#10004;");
		}

		$input.parent().append($fbBtn);
	});
			
	// feedback info text
	if ($inputs_e_s.length == 0) {
		fb_text = prompts.noerrors;

		if ($inputs_not_e_checked.length != 0) {
			fb_text = "Incorrect! " + prompts.noerrors;
		}else {
			fb_text = "Correct! " + prompts.noerrors;
		}

		$("#newSceneBtn").hide();
		$("#nextBtn").show();

	}else {
		fb_text = prompts.showanswersprompt;
		$("#newSceneBtn").show();
	}

	numErrors += $(".fb-icon:not(.correct)").length;
	$info.html(fb_text);

	$("#chkBtn").hide();
}

function newQuizBtnHandler() {
	UnityResetScene();
}

function nextQuizBtnHandler() {
	UnityLoadNextScene();
}

function getFBIcon(desc) {
	
	const $fbBtn = $('<button type="button" class="fb-icon">&cross;</button>');
	$fbBtn.attr('title', desc);
	
	return $fbBtn;
}

/** @returns {string} Session data for QR code */
function getSessionDataPkg() {
	//@TODO -- what data should be pkged? num errors, num attempts, date /uuid? 
	return "Errors: " + numErrors; 
}
async function downloadImage(imageSrc: string, saveAsFileName: string) {
	const image = await fetch(imageSrc);
	const imageBlog = await image.blob();
	const imageURL = URL.createObjectURL(imageBlog);
  
	const link = document.createElement('a');
	link.href = imageURL;
	link.download = saveAsFileName;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	window.alert("Check your Downloads folder for " + saveAsFileName);
  }