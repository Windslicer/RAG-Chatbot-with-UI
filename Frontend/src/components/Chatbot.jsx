import React from 'react';
import { FaPaperclip } from 'react-icons/fa';
import 'D:/internship/RAG/frontend/src/css/Chatbot.css';

const Chatbot = ({ messages, inputValue, setInputValue, handleSend, handleFileUpload, handleKeyPress }) => {
  return (
    <div className="chat-left">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.user ? 'user' : 'bot'}`}>
            {message.text}
            {message.sources && <div className="sources">{message.sources}</div>}
          </div>
        ))}
      </div>
      <div className="input-bar">
        <label className="file-upload-label" htmlFor="file-upload">
          <FaPaperclip size={24} />
        </label>
        <input
          id="file-upload"
          className="file-upload-input"
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;




// import React from 'react';
// import { FaPaperclip } from 'react-icons/fa';
// import 'D:/internship/RAG/frontend/src/css/Chatbot.css';

// const Chatbot = ({ messages, inputValue, setInputValue, handleSend, handleFileUpload, handleKeyPress }) => {
//   return (
//     <div className="chat-left">
//       <div className="messages">
//         {messages.map((message, index) => (
//           <div key={index} className={`message ${message.user ? 'user' : 'bot'}`}>
//             <div dangerouslySetInnerHTML={{ __html: message.text }} />
//           </div>
//         ))}
//       </div>
//       <div className="input-bar">
//         <label className="file-upload-label" htmlFor="file-upload">
//           <FaPaperclip size={24} />
//         </label>
//         <input
//           id="file-upload"
//           className="file-upload-input"
//           type="file"
//           accept=".pdf"
//           onChange={handleFileUpload}
//         />
//         <input
//           type="text"
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Type your message here..."
//         />
//         <button onClick={handleSend}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;










// import React from 'react';
// import { FaPaperclip } from 'react-icons/fa';
// import 'D:/internship/RAG/frontend/src/css/Chatbot.css';


// const Chatbot = ({ messages, inputValue, setInputValue, handleSend, handleFileUpload, handleKeyPress }) => {
//   return (
//     <div className="chat-left">
//       <div className="messages">
//         {messages.map((message, index) => (
//           <div key={index} className={`message ${message.user ? 'user' : 'bot'}`}>
//             {message.text}
//           </div>
//         ))}
//       </div>
//       <div className="input-bar">
//         <label className="file-upload-label" htmlFor="file-upload">
//           <FaPaperclip size={24} />
//         </label>
//         <input
//           id="file-upload"
//           className="file-upload-input"
//           type="file"
//           accept=".pdf"
//           onChange={handleFileUpload}
//         />
//         <input
//           type="text"
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Type your message here..."
//         />
//         <button onClick={handleSend}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;