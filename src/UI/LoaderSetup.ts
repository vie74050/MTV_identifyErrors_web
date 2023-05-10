import $ from "jquery";

const canvasid = "unity-canvas";

export function LoadUnity() {
    const loader = `<div id="loading-cover">
                      <div id="logo"></div> 
                      <div id="unity-loading-bar">        
                      <div id="unity-progress-bar-empty" ></div>
                          <div id="unity-progress-bar-full"></div>
                      </div>
                      <div class="spinner"></div>
                    </div> </div>`;
    $("body").prepend($(loader));

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