import $ from "jquery";
import { QuizSetUp } from "./QuizSetUp";
import { LoadUnity } from './LoaderSetup';

export function SetupUI() {
    const header = `<div id="header" class="mmd instructions">
        <b>Select </b> <span class="icon mouse_lf"></span>
        <b>Pan </b> <span class="icon mouse_lf"></span> or arrow keys 
        <b>Rotate </b> <span class="icon mouse_rt"></span> or A,D 
        <b>Zoom </b> <span class="icon mouse_wheel"></span> or W,S
        </div>`;
      
    $("body").prepend($(header));

    LoadUnity(); 

    QuizSetUp("#header");
    $( document ).tooltip();
   
}