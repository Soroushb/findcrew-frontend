import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { db } from "../frontend/firebase/firebase";
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

const ChatBox = ({ chatId }) => {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!user || !chatId) return;

    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [user, chatId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messagesRef = collection(db, `chats/${chatId}/messages`);
    await addDoc(messagesRef, {
      text: newMessage,
      sender: user.uid,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <div className="border p-4 rounded-lg h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`p-2 my-1 rounded-md ${msg.sender === user.uid ? "bg-blue-300 text-right" : "bg-gray-200 text-left"}`}>
              <p>{msg.text}</p>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          className="border p-2 flex-grow rounded-l-md"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-r-md">Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
