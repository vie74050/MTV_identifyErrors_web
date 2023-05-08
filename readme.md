# Unity Model Task Viewer - Identify Errors #

2023 May 4  
Author: Vienna Ly

Version of Unity Task Viewer web handler for builds published by **MTV_identifyErrors** Unity project (Engine v 2022.1.7f1).

## DEVELOPMENT ##

Using npm and webpack. Use `npm install` to get started.

- For dev, use `npm run start` for watch mode.
- For prod, build `npm run build`.  

### Pipeline ###

1. Build to `uploads` folder using webpack.  
2. Upload `uploads` folder contents to host / cdn.
3. (if changed) Update the script src `.../bundle.css` and `.../bundle.js` in the Unity project's `Assets\WebGLTemplates\webD2LTable\index.html` to point to host location.

#### Host options ####

##### BCIT #####

Upload to LMS shared files `scripts/interactive/UnityModelTaskViewer_IdentifyErrors`.

##### GITHUB as CDN #####

Default, host `uploads` folder as CDN using [gaac](https://gaac.vercel.app/), a GitHub Integration activated for this repo

### Unity model handlers ###

See `main.js`.  

#### Loading WebGL ####

The `LoadUnity` code in `main.js` is for Unity WebGL builds from engine version 2022.x.  
Refer to the latest Unity engine documentation if another version of Unity editor was used for the build.

#### FromUnity handlers ####

Calls from Unity scene to web are handled by methods prefixed `FromUnity_` and must be in global scope:

- `window.FromUnity_ApplicationStarted`
- `window.FromUnity_Select`
- `window.FromUnity_SetListItems`

Which must correspond to the functions called in the Unity project `Assets\Plugins\JSLibs`.

## Unity Model ##

**Unity Project** Repo: [gihub MTV_identifyErrors](https://github.com/vie74050/MTV_identifyErrors)

See `AesculapPan` build folder, included as a sample.  The actual resources within are all built from the Unity Project, and not part of the scope of this repo.

The build folder for the Unity model should have the structure:

```text
[project name]
    |_ Build
    |_ index.html
```

Where the `[project name]` should be descriptive of the scene.

**NB**:

- You only need to create the main project folder `[project name]` and build to that folder from Unity.  It will create the `Build` folder automatically and it's build artefacts will be named according to `[project name]`
- Server hosting the model files need to be set up to serve gz compression.  See `.htaccess` file (add this to host folder).

### index.html ###

This file is built by the Unity Project. Template for the `index.html` page is in the Unity project: `Assets\WebGLTemplates\webD2LTable` folder.

#### Editable portion ####

The `table` within the body can be edited after build to include optional custom description overrides for items in the scene.
Meant to be edited within LMS WYSIWYG editor.