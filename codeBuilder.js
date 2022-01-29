// This takes all the files in the src directory and builds them 
// into the index.js file in the dist directory.

const fs = require('fs');
const path = require('path');

function fileWalker(dir) {
  // Gets all the files in a directory recursively.
  let dirContents = fs.readdirSync(dir);
  let files = [];
  for (let item of dirContents) {
    let fullPath = path.resolve(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      // If a directory, execute a recursive call.
      files = files.concat(fileWalker(fullPath));
    }
    else {
      files.push(fullPath);
    }
  }
  return files;
}

function fetchjsFiles(dir) {
  // Fetches javaScript files and categorizes them.
  let res = {
    scenes: [],
    functions: [],
    components: [],
    actors: [],
    pickupables: [],
    props: [],
    main: []
  };
  let files = fileWalker(dir)
  for (let i of files) {
    if ((/\w+\.js$/).test(i)) {
      let curr = i.match(/(?<=root\\).+/)[0];
      if (curr == 'main.js') {
        res.main.push(curr);
      }
      else {
        let category = curr.match(/src\\(\w+).+/)[1];
        res[category].push(curr);
      }
    }
  }
  return res;
}

function runCodeBuilder(jsFiles, haveSeparators=true) {
  // Exactly what it says on the tin. Runs the code builder.
  let concatedScripts = [];
  let output = [];

  function concatScript(s) {
    // Prevents the same script from being concatenated twice.
    if (concatedScripts.includes(s) == false) {
      concatedScripts.push(s);
      let arg;
      if (haveSeparators) {
        let start = (`//- ${s} -`).padEnd(79, '/');
        let end = '/'.repeat(79);
        arg = `${start}\n\n${fs.readFileSync(s, 'utf8')}\n\n${end}`;
      }
      else {
        arg = fs.readFileSync(s, 'utf8');
      }
      output.push(arg);
    }
  }
  
  function concatScriptsInArray(arr) {
    // Concatenates the scripts in an array to the output file.
    if (Array.isArray(arr)) {
      for (let i of arr) {
        concatScript(i);
      }
    }
  }
  
  function concatAllScripts(files) {
    // Concatenates all of the game's the scripts to the output file.
    // The order before main (main always comes LAST!) (in this sequence):
    // scenes -> functions -> components -> actors -> -> pickupables -> props
    // For actors/pickupables/props, genericActor/Pickupable/Prop
    // should load first.
    concatScriptsInArray(files.scenes);
    concatScriptsInArray(files.functions);
    concatScriptsInArray(files.components);
    concatScript(String.raw`src\actors\genericActor.js`);
    concatScript(String.raw`src\actors\enemyActor.js`);
    concatScriptsInArray(files.actors);
    concatScript(String.raw`src\pickupables\genericPickupable.js`);
    concatScriptsInArray(files.pickupables);
    concatScriptsInArray(files.props);
    concatScriptsInArray(files.main);
  }

  concatAllScripts(jsFiles);
  
  let strict = '\'use strict\';\n\n';
  fs.writeFileSync("dist/index.js", strict + output.join('\n\n\n'));
  console.log('File saved successfully!\n');
  
}

runCodeBuilder(fetchjsFiles('./src'), haveSeparators=false);