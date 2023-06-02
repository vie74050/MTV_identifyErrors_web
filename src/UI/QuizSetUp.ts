import $ from "jquery";
import { GetTableData } from "./GetTableData";
import { UnityLoadNextScene, UnityResetAll } from "./UnityLoaderSetup";

const dialogId : string = "dialog-quiz";
const listContainerId : string = "list-items-container";
const quizInfoId : string = "dialog-quiz-info";
const dialogBtnId : string = "dialog-quiz-btn";

var tableDataAr : string[][];
var prompts = {
	info: 'Select all problematic issues. Click Submit to proceed.',
	showanswersprompt: 'Hover over the icons for details.',
	noerrors: 'There are no errors in this scene.',
	itemok: 'This item is oK',
	endgame: 'Completed all all tasks!'
}

/** The GUI setup for the check list items 
 * @param string btnParentId The selector to parent trigger button
*/
export function QuizUISetUp(btnParentId : string = "body") {
	const quizui = `<div id="`+dialogId+`" title="Inspection Report">
					<div id="`+quizInfoId+`"></div>
					<div id="`+listContainerId+`"></div>
					</div>`;
	const triggerbtn = `<button title="Show/Hide Checklist" id="`+dialogBtnId+`">Inspection Report</button>`;
	
	tableDataAr = GetTableData();
	
	$("body").prepend($(quizui));
	$(btnParentId).append($(triggerbtn));

	// custom prompts
	const customInfoPrompt = tableDataAr.find(row => row[0].trim() == "Info prompt");
	const customAnsPrompt = tableDataAr.find(row => row[0].trim() == "Show answers prompt");
	if( customInfoPrompt ) {
		prompts.info = customInfoPrompt[1] + " Click Submit to proceed.";
	}
	if ( customAnsPrompt ) {
		prompts.showanswersprompt = customAnsPrompt[1].replace('?','<button class="fb-icon">?</button>');
	}

	const pos = { my: "right bottom", at: "right bottom", of: window };
	
	let $dialog = $("#"+dialogId);
	let $btn = $("#"+dialogBtnId);

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
				$btn.on("mousedown", function () {

					if ($dialog.dialog("isOpen")) {
						$dialog.dialog("close");
						$btn.removeClass("btn-open");
					} else {
						$dialog.dialog("open");
						$btn.addClass("btn-open");
					}

				});
			},
			open: function (event, ui) {
				h = $("canvas").height(); 
				$(this).dialog("option", "height", h);
				$(this).dialog("option", "maxHeight", h);
				$(this).dialog("option", "position", pos);
			},
			close: function (event, ui) {
				$btn.removeClass("btn-open");
			},
			buttons: [
				{
					text: "Submit",
					id: "chkBtn",
					click: function () {
						submitQuizHandler();
					}
				},
				{
					text: "New Scene",
					id: "newSceneBtn",
					click: function() {
						newQuizbtnHandler();
					}
				},
				{
					text: "Next",
					id: "nextBtn",
					click: function() {
						nextQuizbtnHandler();
					}
				}
			]
		});
	}
}

/** Handles FromUnity_SetListItems -> Update list items */
export function UpdateQuizList(listAr) {
	// set up list content
	const $container = $("#"+listContainerId);
	
	$container.empty();
	listAr.forEach((v, i) => {
		const $line = $('<p/>');
		const $input = $('<input class="_items" type="checkbox">');
		const $label = $('<label>' + v.replace(/- ERROR([ 0-9, \w+ \  ]*)/, '') + '</label>');
		
		$line.append($input, $label);
		if (v.indexOf('ERROR') > 0) {
			let descRomTable = tableDataAr.find(row => row[0].trim() == v.trim());
			let desc = descRomTable ? descRomTable[1] : v;
			$input.addClass("_e_").data("desc", desc);
		}
				
		$container.append($line);
	});

	resetSceneUI();
}

/** Handles Fromunity_EndGame if called */
export function EndGame() {
	console.log(prompts.endgame);
}

/** Resets the GUI elements and text to init state */
function resetSceneUI() {
	const $btn = $("#"+dialogBtnId);
	const $dialog = $("#"+dialogId);
	const $info = $("#"+quizInfoId);	
	// reset UI
	$dialog.dialog("open");
	$btn.addClass("btn-open");
	
	$("#chkBtn").show();
	$("#newSceneBtn").hide(); 
	$("#nextBtn").hide(); 
	
	$info.text(prompts.info); 
	
}

function submitQuizHandler() {
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
			fb_text = "Incorrect. " + prompts.noerrors;
		}

		$("#newSceneBtn").hide();
		$("#nextBtn").show();

	}else {
		fb_text = prompts.showanswersprompt;
		$("#newSceneBtn").show();
	}

	$info.html(fb_text);

	$("#chkBtn").hide();
	

}

function newQuizbtnHandler() {
	UnityResetAll();
}

function nextQuizbtnHandler() {
	UnityLoadNextScene();
}

function getFBIcon(desc) {
	
	const $fbBtn = $('<button type="button" class="fb-icon">&cross;</button>');
	$fbBtn.attr('title', desc);
	
	return $fbBtn;
}