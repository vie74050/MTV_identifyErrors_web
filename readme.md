# Unity Model Task Viewer - Identify Errors #

(c) 2023 May 4 Vienna Ly  
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a></a>

## App description ##
Variant of BCIT Unity Task Viewer web handler for builds published by **MTV_identifyErrors** Unity project Engine v 2022.1.7f1.  The model viewer task is to identify errors in the scene:

- Objects in scene that are errors will be named with suffix `- ERROR`.

Web handler will:

- Handle scene loading
- Read HTML table for optional description overrides for items specified in table
- Set up the Checklist self-quiz component:
  - Creates list from scene items
  - Shows answers and corresponding descriptions with associated scene items

## DEVELOPMENT ##

Using npm and webpack. Use `npm install` to get started.

- For dev, use `npm run start` for watch mode.
- For prod, build `npm run build`.  
- Deploy to github pages (optional): `npm run deploy`

### Pipeline ###

1. Build to `uploads` folder using webpack.  
2. Upload `uploads` folder contents to host / cdn.
3. (if changed) Update the script src `.../bundle.css` and `.../bundle.js` in the Unity project's `Assets\WebGLTemplates\webD2LTable\index.html` to point to host location.

#### Host options ####

##### LMS (Private) #####

BCIT: Manually upload to LMS shared files `scripts/interactive/UnityModelTaskViewer_IdentifyErrors`.

##### Github (Public) #####

Requires repo to be public with Pages enabled. The src path to `uploads` will be `http(s)://<username>.github.io/<repository>`.

> e.g. `https://vie74050.github.io/MTV_identifyErrors_web/bundle.js`

### Unity model handlers ###

See `main.js`.  

#### Loading WebGL ####

The `LoadUnity` code in `Loader.ts` is for Unity WebGL builds from engine version 2022.x.  
Refer to the latest Unity engine documentation if another version of Unity editor was used for the build.

#### FromUnity handlers ####

Calls from Unity scene to web are handled by methods prefixed `FromUnity_` and must be in global scope:

- `window.FromUnity_ApplicationStarted`
- `window.FromUnity_Select`
- `window.FromUnity_SetListItems`

Which must correspond to the functions called in the **Unity Project** `Assets\Plugins\JSLibs`.

## Usage ##

### Unity model set up ###

**Unity Project** Repo: [gihub MTV_identifyErrors](https://github.com/vie74050/MTV_identifyErrors)

See `AesculapPan` build folder, included as a sample.  The actual resources within are all built from the **Unity Project**, and not part of the scope of this repo.

The build folder for the Unity model should have the structure:

```text
[project name]
    |_ Build
    |_ index.html
```

Where the `[project name]` should be descriptive of the scene.

**NB**:

- You only need to create the main project folder `[project name]` and build to that folder from Unity.  It will create the `Build` folder automatically and it's build artefacts will be named according to `[project name]`
- Server hosting the model files need to be set up to serve gz compression.  See `.htaccess` file (add this to host).

#### Template index.html ####

This file is built by the Unity Project. Template for the `index.html` page is in the Unity project: `Assets\WebGLTemplates\webD2LTable` folder.  

##### host src #####

This is where `src` path for `bundle` resources need to be made to point to uploads' host.

##### Editable portion #####

The `table` within the body intended to be be edited after build to include optional custom description overrides for items in the scene. Meant to be edited within LMS WYSIWYG editor so markup should be kept barebones table markup.
