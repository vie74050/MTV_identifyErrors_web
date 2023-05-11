import $ from "jquery";
import { QuizSetUp } from "./QuizSetUp";
import { LoadUnity } from './LoaderSetup';

export function SetupUI() {
    const header = `<div id="header" class="mmd instructions">
        <b>Select </b> <span class="icon mouse_lf" title="Left mouse click on objects to select them. Click & drag to pick up/move draggable objects. Drag objects back to starting positions to set them down."></span>
        <b>Pan </b> <span class="icon mouse_lf" title="Left mouse click & drag outside of objects to pan camera."></span> or arrow keys 
        <b>Rotate </b> <span class="icon mouse_rt" title="Right mouse click & drag outside of objects to rotate scene. If started over draggable object, it will rotate the object."></span> or A,D 
        <b>Zoom </b> <span class="icon mouse_wheel" title="Use scroll wheel to zoom."></span> or W,S
        </div>`;
      
    $("body").prepend($(header));

    LoadUnity(); 

    QuizSetUp("#header");
    $( document ).tooltip();
   
}