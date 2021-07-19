const fs = require("tns-core-modules/file-system");
const { path } = require("@nativescript/core");
const permissions = require("nativescript-permissions");
const Toast = require('nativescript-toast');

const exd = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOCUMENTS).toString();
const bcm = path.join(exd, "bcm");
const trackerFile = path.join(bcm, "tracker.json");
const trackerHistoryFile = path.join(bcm, "history.json");

var _trackerFile = fs.File.fromPath(trackerFile);
var _historyFile = fs.File.fromPath(trackerHistoryFile);
var isHistoryFile = fs.File.exists(trackerHistoryFile);
var isTrackerFile = fs.File.exists(trackerFile);

var history;


function pageLoaded(args) {

 getPermissions();

 if (!isHistoryFile) {
  let wt = "[]";
  _historyFile.writeText(wt).then(() => { });
 } else {
  _historyFile.readText().then((historyResult) => {
   console.log('.');
   console.log('.');
   console.log(`historyResult1 => ${historyResult}`);
   console.log('.');
   console.log('.');
   history = historyResult;
   if (isTrackerFile) {
    _trackerFile.readText().then((trackerResult) => {
     if (trackerResult.length > 10) {
      console.log(`trackerResult => ${trackerResult}`);
      history = history + trackerResult;
      console.log('.');
      console.log('.');
      console.log(`history => ${history}`);
      console.log('.');
      console.log('.');
      if (history.indexOf("[]") > -1) {
       history = history.replace("[]", "");
       console.log('.');
       console.log('.');
       console.log(`1 ${history}`);
       console.log('.');
       console.log('.');
      }
      if (history.indexOf("][") > -1) {
       history = history.replace("][", ",");
       console.log('.');
       console.log('.');
       console.log(`2 ${history}`);
       console.log('.');
       console.log('.');
      }
      if (history.indexOf("undefined") > -1) {
       history = history.replace("undefined", "");
       console.log('.');
       console.log('.');
       console.log(`3 ${history}`);
       console.log('.');
       console.log('.');
      }
      if (history.indexOf("}]{") > -1) {
       history = history.replace("}]{", "},{");
       console.log('.');
       console.log('.');
       console.log(`4 ${history}`);
       console.log('.');
       console.log('.');
      }
      _historyFile.writeText(history).then(() => { });
      _trackerFile.writeText('{}').then(() => {
       Toast.makeText('The tracker file has been cleaned.');

      }).catch((err) => {
       console.log(err.stack);
      });
     }
    });
   }
  });
 }

 homePage(args);

}

function getPermissions() {

 /** Permissions **/
 permissions.requestPermission(android.Manifest.permission.READ_EXTERNAL_STORAGE, "I need these permissions because I'm cool")
  .then(() => { })
  .catch(() => {
   Toast.makeText("No permission for READ_EXTERNAL_STORAGE!", "long").show();
  });
 permissions.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE, "I need these permissions because I'm cool")
  .then(() => { })
  .catch(() => {
   Toast.makeText("No permission for WRITE_EXTERNAL_STORAGE!", "long").show();
  });
 permissions.requestPermission(android.Manifest.permission.ACCESS_FINE_LOCATION, "I need these permissions because I'm cool")
  .then(() => { })
  .catch(() => {
   Toast.makeText("No permission for ACCESS_FINE_LOCATION!", "long").show();
  });
 permissions.requestPermission(android.Manifest.permission.ACCESS_NETWORK_STATE, "I need these permissions because I'm cool")
  .then(() => { })
  .catch(() => {
   Toast.makeText("No permission for ACCESS_NETWORK_STATE!", "long").show();
  });
 permissions.requestPermission(android.Manifest.permission.INTERNET, "I need these permissions because I'm cool")
  .then(() => { })
  .catch(() => {
   Toast.makeText("No permission for INTERNET!", "long").show();
  });
 /** /Permissions **/

}

function homePage(args) {
 const p = args.object;
 const page = p.page;
 page.frame.navigate('main-page');
}

exports.pageLoaded = pageLoaded;
exports.homePage = homePage;
