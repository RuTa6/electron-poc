"use strict";
const chokidar = require("chokidar");
const fs = require("fs");
let watcher = null;
let showInLogFlag = false;

function StartWatcher(path) {
  document.getElementById("start").disabled = true;
  document.getElementById("messageLogger").innerHTML =
    "Scanning the path, please wait ...";

  watcher = chokidar.watch(path, {
    ignored: /[\/\\]\./,
    persistent: true,
  });

  function onWatcherReady() {
    console.info(
      "From here can you check for real changes, the initial scan has been completed."
    );
    showInLogFlag = true;
    document.getElementById("stop").style.display = "block";
    document.getElementById("messageLogger").innerHTML =
      "The path is now being watched";
  }

  watcher
    .on("add", function (path) {
      console.log("File", path, "has been added");

      if (showInLogFlag) {
        addLog("File added : " + path, "new");
      }
    })
    .on("addDir", function (path) {
      console.log("Directory", path, "has been added");

      if (showInLogFlag) {
        addLog("Folder added : " + path, "new");
      }
    })
    .on("change", function (path) {
      console.log("File", path, "has been changed");

      if (showInLogFlag) {
        addLog("A change ocurred : " + path, "change");
      }
    })
    .on("unlink", function (path) {
      console.log("File", path, "has been removed");

      if (showInLogFlag) {
        addLog("A file was deleted : " + path, "delete");
      }
    })
    .on("unlinkDir", function (path) {
      console.log("Directory", path, "has been removed");

      if (showInLogFlag) {
        addLog("A folder was deleted : " + path, "delete");
      }
    })
    .on("error", function (error) {
      console.log("Error happened", error);

      if (showInLogFlag) {
        addLog("An error ocurred: ", "delete");
        console.log(error);
      }
    })
    .on("ready", onWatcherReady)
    .on("raw", function (event, path, details) {
      // This event should be triggered everytime something happens.
      console.log("Raw event info:", event, path, details);
    });
}

document.getElementById("start").addEventListener("click", async function (e) {
  console.log("clicked start");
  const remote = require("@electron/remote");
  const { dialog } = remote;
  const openDialog = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  console.log("open dialog", openDialog.filePaths[0]);
  if (openDialog?.filePaths[0]) {
    StartWatcher(openDialog?.filePaths[0]);
  } else {
    alert("no path selected");
    console.log("No path selected");
  }
});

document.getElementById("stop").addEventListener(
  "click",
  function (e) {
    if (!watcher) {
      console.log("You need to start first the watcher");
    } else {
      watcher.close();
      document.getElementById("start").disabled = false;
      showInLogFlag = false;
      document.getElementById("messageLogger").innerHTML =
        "Nothing is being watched";
    }
  },
  false
);

function resetLog() {
  return (document.getElementById("log-container").innerHTML = "");
}

function addLog(message, type) {
  var el = document.getElementById("log-container");
  var newItem = document.createElement("LI"); // Create a <li> node
  var textnode = document.createTextNode(message); // Create a text node
  if (type == "delete") {
    newItem.style.color = "red";
  } else if (type == "change") {
    newItem.style.color = "blue";
  } else {
    newItem.style.color = "green";
  }

  newItem.appendChild(textnode); // Append the text to <li>
  el.appendChild(newItem);
}
