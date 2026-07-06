import View from 'ol/View';

const extentHistory: any[] = [];
let currentIndex = -1;

const view = new View({
  center: [0, 0],
  zoom: 2
});

view.on('change:center', () => {
  saveExtent();
});

view.on('change:resolution', () => {
  saveExtent();
});


function saveExtent() {
  const extent = view.calculateExtent();
  // don't save duplicates
  const last = extentHistory[extentHistory.length - 1];
  if (
    !last ||
    JSON.stringify(last) !== JSON.stringify(extent)
  ) {
    extentHistory.push(extent);
    currentIndex++;
  }
}


export function previousExtent() {
  if (currentIndex > 0) {
    currentIndex--;
    view.fit(extentHistory[currentIndex]);
  }
}


export function nextExtent() {
  if (currentIndex < extentHistory.length - 1) {
    currentIndex++;
    view.fit(extentHistory[currentIndex]);
  }
}