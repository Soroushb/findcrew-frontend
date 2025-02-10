import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { UserContext } from '../UserContext';
import { sendMessage, listenForMessages } from '../frontend/firebase/firebase';

const ChatBox = ({ receiver, openChat }) => {
  const { user } = useContext(UserContext); // Get logged-in user
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Create a unique chat ID based on both users' UID
  const chatId = [user.uid, receiver.uid].sort().join("_");

  // Memoize the callback to avoid unnecessary re-renders
  const handleNewMessages = useCallback((msgs) => {
    setMessages(msgs);
  }, []);

  // Load messages in real-time
  useEffect(() => {
    if (!user || !receiver) return;
    const unsubscribe = listenForMessages(chatId, handleNewMessages);
    return () => unsubscribe(); // Cleanup listener
  }, [user, receiver, chatId, handleNewMessages]);

  // Scroll to the latest message when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Send message
  const handleSend = async () => {
    if (newMessage.trim() === '') return;
    await sendMessage(chatId, user.uid, newMessage);
    setNewMessage('');
  };

  return (
    <div className="border relative border-gray-300 rounded-lg p-4 w-full max-w-lg">
      <div onClick={() => openChat(false)} className='absolute right-2 top-0 text-red-600 scale-125 hover:cursor-pointer'>x</div>

      {/* Scrollable message container */}
      <div className="overflow-y-auto flex flex-col items-center mb-4 p-2 border-b mt-4 h-64">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 my-1 rounded break-words ${
              msg?.senderUid === user?.uid 
                ? 'bg-blue-200 w-3/4 text-right' 
                : 'bg-gray-200 w-3/4 text-left'
            }`}
          >
            {msg.messageText}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Auto-scroll anchor */}
      </div>

      {/* Input field */}
      <div className="flex">
        <input
          type="text"
          className="flex-1 border rounded p-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend} className="ml-2 bg-blue-500 text-white p-2 rounded">Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
