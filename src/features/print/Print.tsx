// import html2canvas from 'html2canvas';
// import {jsPDF} from 'jspdf';

// import {getPointResolution, get as getProjection} from 'ol/proj.js';



// const dims = {
//   a0: [1189, 841],
//   a1: [841, 594],
//   a2: [594, 420],
//   a3: [420, 297],
//   a4: [297, 210],
//   a5: [210, 148],
// };


// const exportOptions = {
//   useCORS: true,
//   ignoreElements: function (element) {
//     const className = element.className || '';
//     return (
//       className.includes('ol-control') &&
//       !className.includes('ol-scale') &&
//       (!className.includes('ol-attribution') ||
//         !className.includes('ol-uncollapsible'))
//     );
//   },
// };

// const exportButton = document.getElementById('export-pdf');

// exportButton.addEventListener(
//   'click',
//   function () {
//     exportButton.disabled = true;
//     document.body.style.cursor = 'progress';

//     const format = document.getElementById('format').value;
//     const resolution = document.getElementById('resolution').value;
//     const scale = document.getElementById('scale').value;
//     const dim = dims[format];
//     const width = Math.round((dim[0] * resolution) / 25.4);
//     const height = Math.round((dim[1] * resolution) / 25.4);
//     const viewResolution = map.getView().getResolution();
//     const scaleResolution =
//       scale /
//       getPointResolution(
//         map.getView().getProjection(),
//         resolution / 25.4,
//         map.getView().getCenter(),
//       );

//     map.once('rendercomplete', function () {
//       exportOptions.width = width;
//       exportOptions.height = height;
//       html2canvas(map.getViewport(), exportOptions).then(function (canvas) {
//         const pdf = new jsPDF('landscape', undefined, format);
//         pdf.addImage(
//           canvas.toDataURL('image/jpeg'),
//           'JPEG',
//           0,
//           0,
//           dim[0],
//           dim[1],
//         );
//         pdf.save('map.pdf');
//         // Reset original map size
//         scaleLine.setDpi(undefined);
//         map.getTargetElement().style.width = '';
//         map.getTargetElement().style.height = '';
//         map.updateSize();
//         map.getView().setResolution(viewResolution);
//         exportButton.disabled = false;
//         document.body.style.cursor = 'auto';
//       });
//     });

//     // Set print size
//     scaleLine.setDpi(resolution);
//     map.getTargetElement().style.width = width + 'px';
//     map.getTargetElement().style.height = height + 'px';
//     map.updateSize();
//     map.getView().setResolution(scaleResolution);
//   },
//   false,
// );