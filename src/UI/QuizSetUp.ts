import $ from "jquery";
import { GetTableData } from "./GetTableData";
import { UnityResetAll } from "./LoaderSetup";

const dialogId : string = "dialog-quiz";
const listContainerId : string = "list-items-container";
const quizInfoId : string = "dialog-quiz-info";
const dialogBtnId : string = "dialog-quiz-btn";

var tableDataAr : string[][];

/** The GUI setup for the check list items 
 * @param string btnParentId The selector to parent trigger button
*/
export function QuizSetUp(btnParentId : string = "body") {
	const quizui = `<div id="`+dialogId+`" title="Select all problematic items">
					<div id="`+quizInfoId+`"></div>
					<div id="`+listContainerId+`"></div>
					</div>`;
	const triggerbtn = `<button title="Show/Hide Checklist" id="`+dialogBtnId+`">Checklist</button>`;
	
	tableDataAr = GetTableData();
	
	$("body").prepend($(quizui));
	$(btnParentId).append($(triggerbtn));

	let prompts = {
		info: '',
		showanswersprompt: 'Hover over the <button class="fb-icon">?</button> icons for details.'
	}
	// custom prompts
	if( tableDataAr.find(row => row[0].trim() == "Info prompt") ) {
		prompts.info = tableDataAr.find(row => row[0].trim())[1];
	}
	if ( tableDataAr.find(row => row[0].trim() == "Show answers prompt") ) {
		prompts.showanswersprompt = tableDataAr.find(row => row[0].trim() == "Show answers prompt")[1].replace('?','<button class="fb-icon">?</button>');
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

				const $fbs = $("button.fb-icon");
				const $info = $("#"+quizInfoId);
				
				$fbs.hide();
				$info.text(prompts.info);
			},
			close: function (event, ui) {
				$btn.removeClass("btn-open");
			},
			buttons: [
				{
					text: "Check Answers",
					id: "chkBtn",
					click: function () {
						const $fbs = $("button.fb-icon");
						const $info = $("#"+quizInfoId);
						
						$fbs.show();
						if ($fbs.length ==0) {
							$info.text("There were no problematic items.");
						}else {
							$info.html(prompts.showanswersprompt);
						}

						$("#chkBtn").hide();
						$("#newSceneBtn").show();
					}
				},
				{
					text: "New Scene",
					id: "newSceneBtn",
					click: function() {
						newSceneHandler();
					}
				}
			]
		});
	}
}

/** Update list items */
export function UpdateQuizList(listAr) {
	const $btn = $("#"+dialogBtnId);
	const $dialog = $("#"+dialogId);
	// set up list content
	const $container = $("#"+listContainerId);
	
	$container.empty();
	listAr.forEach((v, i) => {
		const txt = v;
		const $line = $('<p/>');
		const $input = $('<input type="checkbox">');
		const $label = $('<label>' + txt.replace(/- ERROR([ 0-9, \w+ \  ]*)/, '') + '</label>');
		const $fbBtn = $('<button type="button" class="fb-icon" id="btn-' + i + '">?</button>');

		$line.append($input, $label);
		if (v.indexOf('ERROR') > 0) {
			let descRomTable = tableDataAr.find(row => row[0].trim() == txt.trim());
			let desc = descRomTable ? descRomTable[1] : txt;
			$fbBtn.attr('title', desc);
			$line.append($fbBtn);
			$fbBtn.hide();
		}
		$container.append($line);
	});

	// reset UI
	if (!$dialog.dialog("isOpen")) {
		$dialog.dialog("open");
		$btn.addClass("btn-open");
		
		$("#chkBtn").show();
		$("#newSceneBtn").hide();
	}
}

function newSceneHandler() {
	
	UnityResetAll();

}