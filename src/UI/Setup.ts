import $ from "jquery";

const dialogid = "dialog-quiz";
const dialogBtnId = "dialog-quiz-btn";
const listContainerId = "list-items-container";

export function SetupUI() {
    const header = `<div class="mmd instructions">
        <b>Select </b> <span class="icon mouse_lf"></span>
        <b>Pan </b>  <span class="icon mouse_lf"></span> or arrow keys 
        <b>Rotate </b> <span class="icon mouse_rt"></span> or A,D 
        <b>Zoom </b> <span class="icon mouse_wheel"></span> or W,S

        <button id="`+dialogBtnId+`">Checklist</button></div>`;

    const loader = `<div id="loading-cover">
        <div id="logo"></div>  

        <div id="unity-loading-bar">        
        <div id="unity-progress-bar-empty" ></div>
            <div id="unity-progress-bar-full"></div>
        </div>
        <div class="spinner"></div>
        </div> </div>`;
  
    const quizui = `<div id="`+dialogid+`" title="Select all problematic items">
                    <div id="`+listContainerId+`"></div></div>`;
    
    $("body").prepend($(header), $(loader), $(quizui));
    $( document ).tooltip();
   
}