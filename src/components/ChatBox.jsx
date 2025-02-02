import React, { useState, useEffect, useContext, useCallback } from 'react';
import { UserContext } from '../UserContext';
import { sendMessage, listenForMessages } from '../frontend/firebase/firebase';

const ChatBox = ({ receiver }) => {
  const { user } = useContext(UserContext); // Get logged-in user
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

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

  // Send message
  const handleSend = async () => {
    if (newMessage.trim() === '') return;
    await sendMessage(chatId, user.uid, newMessage); // Use chatId for sending message
    setNewMessage('');
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 w-full max-w-lg">
      <div className="h-64 overflow-y-auto mb-4 p-2 border-b">
        {messages.map((msg) => {

          console.log(msg?.sender + user?.uid)
          

          return (
          <div key={msg.id} className={`p-2 my-1 rounded ${msg.sender === user.uid ? 'bg-blue-200 text-right' : 'bg-gray-200'}`}>
            {msg.messageText}
          </div>
        )})}
      </div>

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
