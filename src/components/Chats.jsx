import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { db } from "../frontend/firebase/firebase"; // Import Firebase instance
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";

const Chats = () => {
  const { user } = useContext(UserContext);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!user) return;

    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("participants", "array-contains", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatData);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Chats</h1>
      {chats.length === 0 ? (
        <p>No chats yet.</p>
      ) : (
        <ul className="space-y-4">
          {chats.map(chat => (
            <li key={chat.id} className="border p-4 rounded-lg shadow-md">
              <Link to={`/chat/${chat.id}`} className="text-blue-600 hover:underline">
                Chat with {chat.participants.filter(uid => uid !== user.uid).join(", ")}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Chats;
