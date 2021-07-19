const Accuracy = require("tns-core-modules/ui/enums");
const dialogs = require("tns-core-modules/ui/dialogs");
const fs = require("tns-core-modules/file-system");
const geolocation = require("@nativescript/geolocation");
const { path } = require("@nativescript/core");
const Toast = require('nativescript-toast');

const exd = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOCUMENTS).toString();
const bcm = path.join(exd, "bcm");
const geoLocFile = path.join(bcm, "geoloc.json");
const trackerFile = path.join(bcm, "tracker.json");
var file;
var tracksArray = [];

var currentLat;
var currentLon;
var journeySpeed;

function getGeoLocation() {
 if (!geolocation.isEnabled()) { // GPS is not enabled
  geolocation.enableLocationRequest(true, true).then(() => {
   geolocation.getCurrentLocation({
    desiredAccuracy: Accuracy.high,
    updateDistance: 5,
    updateTime: 60000,
    minimumUpdateTime: 5000,
    maximumAge: 60000,
    timeout: 300000
   }).then((location) => {
    if (!location) {
     dialogs.alert('Failed to get location. Please restart the app.');
    } else {
     currentLat = location.latitude;
     currentLon = location.longitude;
     journeySpeed = location.speed.toFixed(2);
     Toast.makeText(`${currentLat}, ${currentLon}, ${journeySpeed}`, "long").show();
     console.log(`from geolocation 1 => ${currentLat}, ${currentLon}, ${journeySpeed}`);
     recordLocation(location);
    }
   });
  }, (e) => {
   console.log("error: " + (e.message || e));
   Toast.makeText("error: " + (e.message || e), "long").show();
  }).catch((ex) => {
   console.log("Unable to Enable Location" + ex);
   Toast.makeText("Unable to Enable Location" + ex, "long").show();
  });
 } else { // GPS is enabled
  geolocation.getCurrentLocation({
   desiredAccuracy: Accuracy.high,
   updateDistance: 5,
   updateTime: 60000,
   minimumUpdateTime: 5000,
   maximumAge: 60000,
   timeout: 300000
  }).then((location) => {
   if (location) {
    currentLat = location.latitude;
    currentLon = location.longitude;
    journeySpeed = location.speed.toFixed(2);
    Toast.makeText(`${currentLat}, ${currentLon}, ${journeySpeed}`, "long").show();
    console.log(`from geolocation 2 => ${currentLat}, ${currentLon}, ${journeySpeed}`);
    recordLocation(location);
   } else {
    return 'No location located';
   }
  }).catch((err) => {
   console.log(`function(loc) => ${err}`);
   Toast.makeText(`function(loc) => ${err}`, "long").show();
  });
  geolocation.watchLocation((location) => {
   if (location) {
    currentLat = location.latitude;
    currentLon = location.longitude;
    journeySpeed = location.speed.toFixed(2);
    Toast.makeText(`${currentLat}, ${currentLon}, ${journeySpeed}`, "long").show();
    console.log(`from geolocation 2 => ${currentLat}, ${currentLon}, ${journeySpeed}`);
    recordLocation(location);
   }
  }, (e) => {
   console.log("Error: " + e.message);
   Toast.makeText("Error: " + e.message, "long").show();
  }, {
   desiredAccuracy: Accuracy.high,
   updateDistance: 5,
   updateTime: 60000,
   minimumUpdateTime: 5000,
   maximumAge: 60000,
   timeout: 300000
  });
 }

}

function recordLocation(loc) {

 let returnString = {
  "latitude": loc.latitude,
  "longitude": loc.longitude,
  "speed": loc.speed
 };

 file = fs.File.fromPath(geoLocFile);
 file.writeText(JSON.stringify(returnString)).then(() => { }, (error) => {
  console.log(`Could not write to geoloc.json because ${error}`);
  Toast.makeText(`Could not write to geoloc.json because ${error}`, "long").show();
 });

 file = fs.File.fromPath(trackerFile);
 tracksArray.push(returnString);
 file.writeText(JSON.stringify(tracksArray)).then(() => { }, (error) => {
  console.log(`Could not write to tracker.json because ${error}`);
  Toast.makeText(`Could not write to tracker.json because ${error}`, "long").show();
 });

}

exports.getGeoLocation = getGeoLocation;
