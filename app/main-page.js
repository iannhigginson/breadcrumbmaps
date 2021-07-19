const fs = require("tns-core-modules/file-system");
const geolocationModule = require("./geolocation");
const mapsModule = require("nativescript-google-maps-sdk");
const { path } = require("@nativescript/core");
const Toast = require('nativescript-toast');

const exd = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOCUMENTS).toString();
const bcm = path.join(exd, "bcm");
const geoLocFile = path.join(bcm, "geoloc.json");

var file;

var currentLat;
var currentLon;
var marker;


function pageLoaded(args) {

}

function onMapReady(args) {

 var mapView = args.object;

 mapView.zoom = 16;
 mapView.settings.zoomGesturesEnabled = true;

 file = fs.File.fromPath(geoLocFile);
 geolocationModule.getGeoLocation();
 setInterval(() => {
  file.readText().then((result) => {
   let locObj = JSON.parse(result);
   currentLat = locObj.latitude;
   currentLon = locObj.longitude;
   mapView.latitude = currentLat;
   mapView.longitude = currentLon;
   marker = new mapsModule.Marker();
   marker.position = mapsModule.Position.positionFromLatLng(currentLat, currentLon);
   marker.title = "You are at";
   marker.snippet = currentLat + ", " + currentLon;
   marker.userData = { index: 1 };
   mapView.addMarker(marker);
  });
 }, 10000);

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

function historyPage(args) {
 const p = args.object;
 const page = p.page;
 page.frame.navigate('history-page');
}

exports.onMapReady = onMapReady;
exports.onMarkerSelect = onMarkerSelect;
exports.onCameraChanged = onCameraChanged;
exports.onCameraMove = onCameraMove;
exports.pageLoaded = pageLoaded;
exports.historyPage = historyPage;
