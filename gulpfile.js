var gulp = require("gulp");

var winInstaller = require("electron-windows-installer");
gulp.task("create-windows-installer", async function (done) {
  winInstaller({
    appDirectory: "./out",

    outputDirectory: "./release",

    arch: "ia32",

    authors: "Syncfusion",

    version: "1.0.0",

    noMsi: true,
  })
    .then(console.log("done"))
    .catch((e) => {
      console.log(e, "error");
    });
});
