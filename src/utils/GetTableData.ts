import $ from "jquery";

/** Requires a <table> element in HTML body.  Reads the table and converts to array of rows to return.
 * Column 1 = key Item name from Unity game object
 * Column 2 = html content (description)
 * @returns {string[][]} Returns table data as array of rows [td1, td2] 
 */

export function GetTableData() {
	let tb = [];
	// grab content from table in html and save in reference data object
	$("table tbody tr ").each(function (i, ui) {
		let key = $(this).find("td:first-child").text().trim();
		let html = $(this).find("td:eq(1)").text().trim();

		tb.push([key, html]);
	});
	$("table").remove();
	return tb;
}
