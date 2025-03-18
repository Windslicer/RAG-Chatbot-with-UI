import React, { useEffect, useRef } from 'react';
import 'D:/internship/RAG/frontend/src/css/PdfViewer.css';

const PdfViewer = ({ uploadedFile, togglePdfViewer, isPdfVisible, pdfChunk }) => {
  const pdfRef = useRef(null);

  useEffect(() => {
    if (pdfRef.current && pdfChunk) {
      // Navigate to the specific page and highlight the chunk if needed
      const { pageNumber, chunkIndex } = pdfChunk;
      // Here you can add logic to highlight the specific chunk within the page
      // You might need to use a PDF library like pdf.js for advanced handling
    }
  }, [pdfChunk]);

  return (
    <>
      <button className="toggle-button" onClick={togglePdfViewer}>
        {isPdfVisible ? 'Hide PDF' : 'Show PDF'}
      </button>
      <div className={`chat-right ${isPdfVisible ? 'visible' : ''}`}>
        {isPdfVisible && uploadedFile && (
          <div>
            <iframe ref={pdfRef} src={uploadedFile} width="100%" height="100%" title="PDF Viewer" />
          </div>
        )}
      </div>
    </>
  );
};

export default PdfViewer;



// import React, { useEffect, useRef } from 'react';
// import 'D:/internship/RAG/frontend/src/css/PdfViewer.css';
// import * as pdfjsLib from 'D:/internship/RAG/frontend/node_modules/pdfjs-dist/build/pdf';
// import pdfjsWorker from 'D:/internship/RAG/frontend/node_modules/pdfjs-dist/build/pdf.worker.entry';
// // D:/internship/RAG/frontend/node_modules/pdfjs-dist

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// const PdfViewer = ({ pdfFile, togglePdfViewer, isPdfVisible, pdfChunk }) => {
//   const pdfRef = useRef(null);

//   useEffect(() => {
//     if (pdfFile) {
//       const loadingTask = pdfjsLib.getDocument(pdfFile);
//       loadingTask.promise.then(pdf => {
//         const pageNumber = pdfChunk.pageNumber < 0 ? pdf.numPages + pdfChunk.pageNumber + 1 : pdfChunk.pageNumber;
//         pdf.getPage(pageNumber).then(page => {
//           const viewport = page.getViewport({ scale: 1.5 });
//           const canvas = pdfRef.current;
//           const context = canvas.getContext('2d');
//           canvas.height = viewport.height;
//           canvas.width = viewport.width;

//           const renderContext = {
//             canvasContext: context,
//             viewport: viewport,
//           };
//           const renderTask = page.render(renderContext);
//           renderTask.promise.then(() => {
//             if (pdfChunk && pdfChunk.lineNumber) {
//               // Highlight the specified line
//               const textLayerDiv = document.createElement('div');
//               textLayerDiv.className = 'textLayer';
//               canvas.parentNode.insertBefore(textLayerDiv, canvas.nextSibling);

//               page.getTextContent().then(textContent => {
//                 pdfjsLib.renderTextLayer({
//                   textContent: textContent,
//                   container: textLayerDiv,
//                   viewport: viewport,
//                   textDivs: [],
//                 }).promise.then(() => {
//                   const textDivs = textLayerDiv.querySelectorAll('div');
//                   if (textDivs.length >= pdfChunk.lineNumber) {
//                     textDivs[pdfChunk.lineNumber - 1].style.backgroundColor = 'yellow';
//                   }
//                 });
//               });
//             }
//           });
//         });
//       });
//     }
//   }, [pdfFile, pdfChunk]);

//   return (
//     <>
//       <button className="toggle-button" onClick={togglePdfViewer}>
//         {isPdfVisible ? 'Hide PDF' : 'Show PDF'}
//       </button>
//       <div className={`chat-right ${isPdfVisible ? 'visible' : ''}`}>
//         {isPdfVisible && pdfFile && (
//           <div>
//             <canvas ref={pdfRef}></canvas>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default PdfViewer;




// import React from 'react';
// import 'D:/internship/RAG/frontend/src/css/PdfViewer.css';

// const PdfViewer = ({ selectedPdf, togglePdfViewer, isPdfVisible }) => {
//   return (
//     <>
//       <button className="toggle-button" onClick={togglePdfViewer}>
//         {isPdfVisible ? 'Hide PDF' : 'Show PDF'}
//       </button>
//       <div className={`chat-right ${isPdfVisible ? 'visible' : ''}`}>
//         {isPdfVisible && selectedPdf && (
//           <div>
//             <iframe src={selectedPdf} width="100%" height="100%" title="PDF Viewer" />
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default PdfViewer;










// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import 'D:/internship/RAG/frontend/src/css/PdfViewer.css';

// const PdfViewer = ({ uploadedFile, togglePdfViewer, isPdfVisible }) => {
//   return (
//     <>
//       <button className="toggle-button" onClick={togglePdfViewer}>
//         {isPdfVisible ? 'Hide PDF' : 'Show PDF'}
//       </button>
//       <div className={`chat-right ${isPdfVisible ? 'visible' : ''}`}>
//         {isPdfVisible && uploadedFile && (
//           <div>
//             <iframe src={uploadedFile} width="100%" height="100%" title="PDF Viewer" />
//             {imageUrl && <img src={imageUrl} alt="Fetched from backend" />}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };
// export default PdfViewer;