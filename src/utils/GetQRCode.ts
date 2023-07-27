import { v4 as uuidv4 } from 'uuid';

/** data for QR code */
export var uuid = uuidv4();
export const date  = new Date();

interface IQRData {
	[key: string]: number | string;
}
export function GetQRCode(quizinfo: IQRData) {	
	let qrImg = document.createElement('img');
	const data = GetSessionDataPkg(quizinfo);
	const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
	qrImg.src = url;
	
	downloadImage(url, "QRsessionCode");
}
/** @returns {string} Session data for QR code */
function GetSessionDataPkg(quizinfo: IQRData) {
	const datenow = "Date: " 
			+ date.getFullYear() + "/" 
			+ date.getMonth() + "/" 
			+ date.getDate() + " "
			+ date.getHours() +":"
			+ date.getMinutes() + ":"
			+ date.getSeconds() + ":" 
			+ date.getMilliseconds();
	const location = window.location.pathname;
	const path = location.substring(0, location.lastIndexOf("/"));
	const folderName = path.substring(path.lastIndexOf("/")+1);
	const sessUUID = "UUID: " + uuid;
	
	let infotext =  datenow + "%0A " 
					+ folderName + "%0A ";

	for (const[k,v] of Object.entries(quizinfo)) {
		infotext+= k + ": " + v + "%0A "; 	
	}
	infotext += sessUUID;

	//console.log(infotext);
	//@TODO -- what data should be pkged? num errors, num attempts, date /uuid? 
	return infotext;
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

GetSessionDataPkg({"Errors": 0});