# Unity Model Task Viewer - Identify Errors #

(c) 2023 May 4 Vienna Ly  
[![Creative Commons License](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-nc-sa/4.0/)

## App description ##

Variant of BCIT Unity Task Viewer web handler for builds published by **MTV_identifyErrors Unity project** Engine v 2022.1.7f1.  The model viewer task is to identify errors in the scene:

- Objects in scene that are errors will be named with suffix `- ERROR`.

This web handler will:

- Set up all the required UI elements
- Handle Unity scene loading and comms
- Read HTML table for optional description overrides for items specified in table
- Set up the Checklist self-quiz component:
  - Creates list from scene items
  - Shows answers and corresponding descriptions with associated scene items

## DEVELOPMENT ##

Using npm and webpack. Use `npm install` to get started.

- For dev, use `npm run start` for watch mode.
- To update the `Builds`, use `npm run update3d`.  This copies `./Builds` to `./uploads`.
- For prod, build `npm run build` will bundle the scripts.  

### Unity model handlers ###

See `main.js`.  

#### Loading WebGL ####

The `LoadUnity` code in `LoaderSetup.ts` is for Unity WebGL builds from engine version 2022.x.  
Refer to the latest Unity engine documentation if another version of Unity editor was used for the build.

#### FromUnity handlers ####

Calls from Unity scene to web are handled by methods prefixed `FromUnity_` and must be in global scope:

- `window.FromUnity_ApplicationStarted`
- `window.FromUnity_Select`
- `window.FromUnity_SetListItems`

Which must correspond to the functions called in the **Unity Project** `Assets\Plugins\JSLibs`.

## USAGE ##

### Unity model set up ###

**Unity Project** Repo: [gihub MTV_identifyErrors_Unity](https://github.com/vie74050/MTV_identifyErrors_Unity)

See `Builds` folder.  The actual resources within are all built from the **Unity Project**, and not part of the scope of this repo.

The build folder for the Unity model should be put in `./Builds` and have the structure:

```text
[project name]
    |_ Build
    |_ index.html
```

Where the `[project name]` should be descriptive of the scene.

**NB**:

- You only need to create the main project folder `[project name]` and then build to that folder from Unity.  It will create the `Build` folder automatically and it's build artefacts will be named according to `[project name]`
- `index.html` is build from the WebGL template from the Unity project.  It may be over-written by Unity build!!
- Server hosting the model files need to be set up to serve gz compression.  See `.htaccess` file (add this to host).

#### Template index.html ####

Template for the `index.html` page is in the **Unity project**: `Assets\WebGLTemplates\webD2LTable` folder.  

Make sure template has the proper bundle src url:

```html
    <link rel="stylesheet" href="https://vie74050.github.io/MTV_identifyErrors_web/src/bundle.css" />

    <script 
      src="https://vie74050.github.io/MTV_identifyErrors_web/src/bundle.js"
      type="text/javascript"></script> 
```

This is where `src` path for `bundle` resources need to be made to point to uploads' host.

##### Editable portion - html `<table>` #####

The `table` within the body intended to be be edited after build to include optional custom description overrides for items in the scene. Meant to be editable within LMS WYSIWYG editor so markup should be kept **barebones** table markup.

The first column is expected to be key string which references:

- game object name (as set up in Unity scene) or
- scene name (as set up in Unity) or
- prompt identifiers: `Info prompt`, `Show answers prompt`

The second column are the corresponding description texts.

### HTML Table Features ###

e.g.

| Name from Unity /keyword         | Description                                                                            |
|----------------------------------|----------------------------------------------------------------------------------------|
| Info prompt *                    | The prompt that appears with the inspection quiz before submit                         |
| Show answers prompt *            | The prompt that appears after user submits answer                                      |
| Scene 1                          | Scene start message for wrapped camera scene 1                                         |
| Game Object Name                 | Optional feedback description associated with normal tape, if user marked as unsterile |
| Game Object Name - ERROR         | Feedback description associated with unsterile tape                                    |

```html
  <table>
      <thead>
        <tr>
          <th>Name from Unity /keyword</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>Info prompt</td>
          <td>
            <p>Select all unsterile items, if any.</p>
          </td>
        </tr>
        <tr>
          <td>Show answers prompt</td>
          <td>
            <p>
              Hover over the icons to see the rationale of why the item is
              unsterile
            </p>
          </td>
        </tr>
        <tr>
          <td>Scene 1</td>
          <td>
            <p>Scene start message for wrapped camera scene 1</p>
          </td>
        </tr>
        <tr>
          <td>Game Object Name</td>
          <td>
            <p>Optional feedback description associated with normal tape, if user marked as unsterile</p>
          </td>
        </tr>
        <tr>
          <td>Game Object Name - ERROR</td>
          <td>
            <p>Feedback description associated with unsterile tape</p>
          </td>
        </tr>
      </tbody>
    </table>
```

> \* Info promp and Show answers prompt: These are special optional keywords to use to over-ride default prompt texts.

## DEPLOYMENT ##

### Code ###

Deploy bundle to `uploads` folder, use `npm run deploy`.  
Webpack will package the bundles and copy the `Builds` folder contents to `uploads`, and deploy to GitHub Pages:

Source code hosted on GitHub pages:

<https://vie74050.github.io/MTV_identifyErrors_web/src/bundle.css>
<https://vie74050.github.io/MTV_identifyErrors_web/src/bundle.js>

### BCIT LMS (Private - requires access) ###

Manually upload the builds to LMS shared files `scripts/interactive/UnityModelTaskViewer_IdentifyErrors`.
