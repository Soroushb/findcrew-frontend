import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyDggTbal1jxN9hwwKS3Ogg1FxvDZeyLh04",
  authDomain: "crewfind-64348.firebaseapp.com",
  projectId: "crewfind-64348",
  storageBucket: "crewfind-64348.appspot.com", // Fixed bucket name
  messagingSenderId: "219711766919",
  appId: "1:219711766919:web:6351c0bb746ba79ae11322",
  measurementId: "G-G4W31T1ZFN",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);

// Function to fetch user info (including email)
const getUserInfo = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);  
    const userSnapshot = await getDoc(userRef);  
    
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const email = userData.email || "Email not available"; // Include email
      return { ...userData, email }; 
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
};

// Function to get all users in a specific location
const getUsers = async (role) => {
  try {
    const usersRef = collection(db, "users");

    const lowercasedRole = role.toLowerCase();

    const q = query(usersRef, where("updatedData.role", "==", lowercasedRole));

    const querySnapshot = await getDocs(q);

    const users = querySnapshot.docs.map((doc) => ({
      uid: doc.id, 
      ...doc.data(), 
      ...doc.data().updatedData, 
    }));

    return users;
  } catch (err) {
    console.error("Error getting users:", err.message);
    throw err;
  }
};

// Function to update user information
const updateUserInfo = async (uid, updatedData) => {
  try {
    if (!uid) {
      throw new Error("User is not authenticated");
    }

    const userRef = doc(db, "users", uid);

    // Convert the location to lowercase before saving
    const dataToUpdate = {
      ...updatedData,
      location: updatedData.location.toLowerCase(),
      bio: updatedData.bio || ""
    };

    await setDoc(userRef, { updatedData: dataToUpdate }, { merge: true });
    console.log("User information updated successfully.");
  } catch (error) {
    console.error("Error updating user info:", error);
  }
};

const updateUserBio = async (uid, updatedData) => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, updatedData, { merge: true }); // Save the entire object
    console.log("Bio updated successfully.");
  } catch (error) {
    console.error("Error updating bio:", error);
  }
};


// Function to update display name
const updateDisplayName = async () => {
  const user = auth.currentUser;

  if (user) {
    try {
      const userRef = doc(db, "users", user.uid); // Reference to user document

      await setDoc(userRef, {
        displayName: user.displayName || "Anonymous", 
      }, { merge: true }); 

      console.log("User display name updated successfully.");
    } catch (error) {
      console.error("Error updating display name:", error);
    }
  } else {
    console.log("No authenticated user found.");
  }
};

// Function to send a connection request
const sendConnectionRequest = async (senderUid, recipientUid) => {
  try {
    if (!senderUid || !recipientUid) {
      throw new Error("Both sender and recipient UIDs are required");
    }

    const recipientRef = doc(db, "users", recipientUid);
    const connectionRequestsRef = collection(recipientRef, "connectionRequests");

    const requestData = {
      senderUid,
      timestamp: Date.now(), 
    };

    await setDoc(doc(connectionRequestsRef, senderUid), requestData);

    console.log("Connection request sent successfully.");
  } catch (error) {
    console.error("Error sending connection request:", error);
  }
};

// Function to fetch connection requests
const fetchConnectionRequests = async (receiverUid) => {
  try {
    const connectionRequestsRef = collection(db, "users", receiverUid, "connectionRequests");
    const querySnapshot = await getDocs(connectionRequestsRef);

    const requests = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const requestData = doc.data();

        // Instead of fetching the display name, directly use the user's email
        const senderEmail = requestData.senderUid
          ? (await getUserInfo(requestData.senderUid)).email
          : "Unknown User";

        return {
          ...requestData,
          senderEmail, // Include sender's email
        };
      })
    );

    return requests;
  } catch (err) {
    console.error("Error fetching connection requests:", err);
    throw err;
  }
};

// Export the functions
export { auth, getUserInfo, updateUserBio ,updateDisplayName, updateUserInfo, getUsers, sendConnectionRequest, fetchConnectionRequests };
