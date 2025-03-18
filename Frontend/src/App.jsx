import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chatbot from '../src/components/Chatbot';
import PdfViewer from '../src/components/PdfViewer';
import 'D:/internship/RAG/frontend/src/css/App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isPdfVisible, setIsPdfVisible] = useState(false);
  const [pdfChunk, setPdfChunk] = useState(null);
  const [chunkText, setChunkText] = useState('');

  // Define the Flask backend URL
  const backendUrl = 'http://localhost:5000';

  // Display welcome message when the app is first loaded
  useEffect(() => {
    setMessages([{ user: false, text: 'Welcome! How can I assist you today?' }]);
  }, []);

  // Handle sending user messages to the backend
  const handleSend = async () => {
    if (inputValue.trim()) {
      setMessages((prevMessages) => [...prevMessages, { user: true, text: inputValue }]);
      setInputValue('');

      try {
        const response = await axios.post(`${backendUrl}/query`, { query: inputValue });
        const responseText = response.data.response;
        const sources = response.data.sources.map((source, index) => (
          <a href="#" key={index} onClick={() => handleSourceClick(source)}>{source}</a>
        ));

        setMessages((prevMessages) => [
          ...prevMessages,
          { user: false, text: responseText },
          { user: false, text: `Sources: `, sources: sources }
        ]);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${backendUrl}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const filePath = response.data.file_path;
      setUploadedFile(`${backendUrl}/pdf/${file.name}`);
      setMessages((prevMessages) => [...prevMessages, { user: true, text: 'PDF uploaded successfully' }]);
      setIsPdfVisible(true);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Handle source link click
//   const handleSourceClick = async (source) => {
//     const [filePath, pageNumber, chunkIndex] = source.split(':'); 
//     const payload = {
//         id: `<span class="math-inline">\{filePath\}\:</span>{pageNumber}:${chunkIndex}` 
//     };

//     try {
//         const response = await axios.post(`${backendUrl}/chunk`, payload);
//         setChunkText(response.data.chunk_text);
//     } catch (error) {
//         console.error('Error fetching chunk text:', error);
//     }
// };
  const handleSourceClick = async (source) => {
    const [filePath, pageNumber, chunkIndex] = source.split(':');
    setUploadedFile(`${backendUrl}/pdf/${filePath}`);
    setPdfChunk({ pageNumber: parseInt(pageNumber), chunkIndex: parseInt(chunkIndex) });
    setIsPdfVisible(true);

    try {
      const response = await axios.post(`${backendUrl}/chunk`, {
        source: filePath,
        page_number: parseInt(pageNumber),
        chunk_index: parseInt(chunkIndex),
      });
      setChunkText(response.data.chunk_text);
    } catch (error) {
      console.error('Error fetching chunk text:', error);
    }
  };

  // Toggle PDF visibility
  const togglePdfViewer = () => {
    setIsPdfVisible(!isPdfVisible);
  };

  // Handle pressing Enter key to send message
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="app">
      <Chatbot
        messages={messages}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSend={handleSend}
        handleFileUpload={handleFileUpload}
        handleKeyPress={handleKeyPress}
      />
      <PdfViewer
        uploadedFile={uploadedFile}
        togglePdfViewer={togglePdfViewer}
        isPdfVisible={isPdfVisible}
        pdfChunk={pdfChunk}
        chunkText={chunkText}
      />
    </div>
  );
};

export default App;





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Chatbot from '../src/components/Chatbot';
// import PdfViewer from '../src/components/PdfViewer';
// import 'D:/internship/RAG/frontend/src/css/App.css';

// const App = () => {
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState('');
//   const [uploadedFiles, setUploadedFiles] = useState({});
//   const [isPdfVisible, setIsPdfVisible] = useState(false);
//   const [selectedPdf, setSelectedPdf] = useState(null);

//   // Define the Flask backend URL
//   const backendUrl = 'http://localhost:5000';

//   // Display welcome message when the app is first loaded
//   useEffect(() => {
//     setMessages([{ user: false, text: 'Welcome! How can I assist you today?' }]);
//   }, []);

//   // Handle sending user messages to the backend
//   const handleSend = async () => {
//     if (inputValue.trim()) {
//       setMessages((prevMessages) => [...prevMessages, { user: true, text: inputValue }]);
//       setInputValue('');

//       try {
//         const response = await axios.post(`${backendUrl}/query`, { query: inputValue });
//         const responseText = response.data.response;
//         const sources = response.data.sources.map((source, index) => ({
//           text: source,
//           index: index + 1
//         }));

//         setMessages((prevMessages) => [
//           ...prevMessages,
//           { user: false, text: responseText },
//           { user: false, text: `Sources: ${sources.map((source) => `<a href="#" data-source-index="${source.index}">${source.text}</a>`).join(', ')}` }
//         ]);
//       } catch (error) {
//         console.error('Error sending message:', error);
//       }
//     }
//   };

//   // Handle file upload
//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post(`${backendUrl}/upload`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       const fileUrl = URL.createObjectURL(file);
//       const fileName = file.name;
//       setUploadedFiles((prevFiles) => ({ ...prevFiles, [fileName]: fileUrl }));
//       setMessages((prevMessages) => [...prevMessages, { user: true, text: 'PDF uploaded successfully' }]);
//       setIsPdfVisible(true);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };

//   // Toggle PDF visibility
//   const togglePdfViewer = () => {
//     setIsPdfVisible(!isPdfVisible);
//   };

//   // Handle pressing Enter key to send message
//   const handleKeyPress = (event) => {
//     if (event.key === 'Enter') {
//       handleSend();
//     }
//   };

//   // Handle clicking on source link
//   const handleSourceClick = (event) => {
//     if (event.target.tagName === 'A' && event.target.dataset.sourceIndex) {
//       const fileName = event.target.textContent;
//       setSelectedPdf(uploadedFiles[fileName]);
//       setIsPdfVisible(true);
//     }
//   };

//   return (
//     <div className="app" onClick={handleSourceClick}>
//       <Chatbot
//         messages={messages}
//         inputValue={inputValue}
//         setInputValue={setInputValue}
//         handleSend={handleSend}
//         handleFileUpload={handleFileUpload}
//         handleKeyPress={handleKeyPress}
//       />
//       <PdfViewer
//         selectedPdf={selectedPdf}
//         togglePdfViewer={togglePdfViewer}
//         isPdfVisible={isPdfVisible}
//       />
//     </div>
//   );
// };

// export default App;










// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Chatbot from '../src/components/Chatbot';
// import PdfViewer from '../src/components/PdfViewer';
// import 'D:/internship/RAG/frontend/src/css/App.css';

// const App = () => {
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState('');
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [isPdfVisible, setIsPdfVisible] = useState(false);

//   // Define the Flask backend URL
//   const backendUrl = 'http://localhost:5000';

//   // Display welcome message when the app is first loaded
//   useEffect(() => {
//     setMessages([{ user: false, text: 'Welcome! How can I assist you today?' }]);
//   }, []);

//   // Handle sending user messages to the backend
//   const handleSend = async () => {
//     if (inputValue.trim()) {
//       setMessages((prevMessages) => [...prevMessages, { user: true, text: inputValue }]);
//       setInputValue('');

//       try {
//         const response = await axios.post(`${backendUrl}/query`, { query: inputValue });
//         const responseText = response.data.response;
//         const sources = response.data.sources.join(', ');

//         setMessages((prevMessages) => [
//           ...prevMessages,
//           { user: false, text: responseText },
//           { user: false, text: `Sources: ${sources}` },
//         ]);
//       } catch (error) {
//         console.error('Error sending message:', error);
//       }
//     }
//   };

//   // Handle file upload
//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post(`${backendUrl}/upload`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       const fileUrl = URL.createObjectURL(file);
//       setUploadedFile(fileUrl);
//       setMessages((prevMessages) => [...prevMessages, { user: true, text: 'PDF uploaded successfully' }]);
//       setIsPdfVisible(true);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };

//   // Toggle PDF visibility
//   const togglePdfViewer = () => {
//     setIsPdfVisible(!isPdfVisible);
//   };

//   // Handle pressing Enter key to send message
//   const handleKeyPress = (event) => {
//     if (event.key === 'Enter') {
//       handleSend();
//     }
//   };

//   return (
//     <div className="app">
//       <Chatbot
//         messages={messages}
//         inputValue={inputValue}
//         setInputValue={setInputValue}
//         handleSend={handleSend}
//         handleFileUpload={handleFileUpload}
//         handleKeyPress={handleKeyPress}
//       />
//       <PdfViewer
//         uploadedFile={uploadedFile}
//         togglePdfViewer={togglePdfViewer}
//         isPdfVisible={isPdfVisible}
//       />
//     </div>
//   );
// };

// export default App;



