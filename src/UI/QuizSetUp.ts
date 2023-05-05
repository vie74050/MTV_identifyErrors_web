import $ from "jquery";
import { GetTableData } from "./GetTableData";

const dialogid = "#dialog-quiz";
const dialogBtnId = "#dialog-quiz-btn";
const listContainerId = "#list-items-container";

/** The GUI setup for the check list items */
export function QuizSetUp(listAr) {
	// initialize UI dialog elems
	const $dialog = $(dialogid);
	const $btn = $(dialogBtnId);
	
	const pos = { my: "right bottom", at: "right bottom", of: window };
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
			$(".fb-btn").hide();
		},
		buttons: [
			{
				text: "Check Answers",
				click: function () {
					$(".fb-btn").show();
				}
			}
		]
	});

	// reset UI
	if ($dialog.dialog("isOpen")) {
		$dialog.dialog("close");
		$btn.removeClass("btn-open");
	}

	// set up list content
	const $container = $(listContainerId);
	const tableDataAr = GetTableData();

	$container.empty();
	listAr.forEach((v, i) => {
		const txt = v;
		const $line = $('<p/>');
		const $input = $('<input type="checkbox">');
		const $label = $('<label>' + txt.replace('- ERROR', '') + '</label>');
		const $fbBtn = $('<button type="button" class="fb-btn" id="btn-' + i + '">?</button>');

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

}