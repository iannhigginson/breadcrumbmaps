const fs = require("tns-core-modules/file-system");
const mapsModule = require("nativescript-google-maps-sdk");
const { path } = require("@nativescript/core");
const Toast = require('nativescript-toast');

const exd = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOCUMENTS).toString();
const bcm = path.join(exd, "bcm");
const trackerFile = path.join(bcm, "tracker.json");
const trackerHistoryFile = path.join(bcm, "history.json");

var _trackerFile = fs.File.fromPath(trackerFile);
var _historyFile = fs.File.fromPath(trackerHistoryFile);

var currentLat;
var currentLon;
var history;
var marker;


function historyPageLoaded(args) { }

function onMapReady1(args) {

 var mapView = args.object;
 var obj;

 console.log('onMapReady1');

 mapView.zoom = 16;
 mapView.settings.zoomGesturesEnabled = true;

 _historyFile.readText().then((historyResult) => {
  console.log('.');
  console.log('.');
  console.log(`historyResult1 => ${historyResult}`);
  console.log('.');
  console.log('.');
  history = historyResult;
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
    _historyFile.writeText(history).then(() => {
     _historyFile.readText().then((historyResult) => {
      let locObj = JSON.parse(historyResult);
      for (let i = 0; i < locObj.length; i++) {
       obj = locObj[i];
       currentLat = obj.latitude;
       currentLon = obj.longitude;
       if (currentLat !== "undefined" && currentLon !== "undefined") {
        mapView.latitude = currentLat;
        mapView.longitude = currentLon;
        marker = new mapsModule.Marker();
        marker.position = mapsModule.Position.positionFromLatLng(currentLat, currentLon);
        marker.title = "Marker " + i.toString();
        marker.snippet = currentLat + ", " + currentLon;
        marker.userData = { index: i };
        mapView.addMarker(marker);
       }
      }
     });
    });
   }
  });
 });

}

function onMarkerSelect(args) {
 console.log("Clicked on " + args.marker.title);
 Toast.makeText("Clicked on " + args.marker.title, "long").show();
}

function onCameraChanged(args) {
 console.log("Camera changed: " + JSON.stringify(args.camera));
 Toast.makeText("Camera changed: " + JSON.stringify(args.camera), "long").show();
}

function onCameraMove(args) {
 console.log("Camera moving: " + JSON.stringify(args.camera));
 Toast.makeText("Camera moving: " + JSON.stringify(args.camera), "long").show();
}

function homePage(args) {
 const p = args.object;
 const page = p.page;
 page.frame.navigate('main-page');
}

exports.onMapReady1 = onMapReady1;
exports.onMarkerSelect = onMarkerSelect;
exports.onCameraChanged = onCameraChanged;
exports.onCameraMove = onCameraMove;
exports.historyPageLoaded = historyPageLoaded;
exports.homePage = homePage;
