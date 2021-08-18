export const locService = {
  saveLocation,
  getLocsForDisplay,
  deleteLoc
};

import { storageService } from './storage.service.js';

// window.gSavedLocs=storageService.loadFromStorage('locDB') || []
window.gSavedLocs = []



// const locs = [
//   { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
//   { name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
// ];

// function getLocs() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(locs);
//     }, 2000);
//   });
// }

function saveLocation(location) {
  location[0].id = Math.random()
  gSavedLocs.push(location)
  storageService.saveToStorage('locDB', gSavedLocs)
}

function getLocsForDisplay() {

  let locs = storageService.loadFromStorage('locDB')

  if (!locs || locs.length === 0) {
    locs = []
  }
  gSavedLocs = locs
  storageService.saveToStorage('locDB', gSavedLocs)

  return gSavedLocs
}

function deleteLoc(id) {

  const idx = gSavedLocs.findIndex(loc => {
    return loc[0].id === id
  })

  gSavedLocs.splice(idx, 1)
  storageService.saveToStorage('locDB', gSavedLocs)

}