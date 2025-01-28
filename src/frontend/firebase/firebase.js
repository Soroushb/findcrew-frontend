import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDggTbal1jxN9hwwKS3Ogg1FxvDZeyLh04",
  authDomain: "crewfind-64348.firebaseapp.com",
  projectId: "crewfind-64348",
  storageBucket: "crewfind-64348.firebasestorage.app", // Fixed bucket name
  messagingSenderId: "219711766919",
  appId: "1:219711766919:web:6351c0bb746ba79ae11322",
  measurementId: "G-G4W31T1ZFN",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Function to upload profile picture and store its URL in Firestore
const uploadProfilePicture = async (uid, file) => {
  try {
    if (!uid || !file) {
      throw new Error("User ID and file are required.");
    }

    // Create a reference for the file in Firebase Storage
    const fileRef = ref(storage, `profilePictures/${uid}/${file.name}`);

    // Upload the file to Firebase Storage
    const snapshot = await uploadBytes(fileRef, file);
    console.log("File uploaded successfully: ", snapshot);

    // Get the file's download URL
    const downloadURL = await getDownloadURL(fileRef);
    console.log("File available at:", downloadURL);

    // Save the URL to Firestore (User's profile)
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { profilePicture: downloadURL }, { merge: true });
    console.log("Profile picture URL saved to Firestore.");

    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

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

const getUsers = async (role) => {
  try {
    const usersRef = collection(db, "users");

    const lowercasedRole = role.toLowerCase();

    const q = query(usersRef, where("role", "==", role));

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

    const dataToUpdate = {
      ...updatedData,
      location: updatedData?.location.toLowerCase() || "",
      bio: updatedData?.bio || "",
    };

    await setDoc(userRef, dataToUpdate, { merge: true });
    console.log("User information updated successfully.");
  } catch (error) {
    console.error("Error updating user info:", error);
  }
};

const updateUserBio = async (uid, updatedData) => {
  try {
    const userRef = doc(db, "users", uid);

    await setDoc(userRef, { updatedData: { bio: updatedData.bio } }, { merge: true });
    console.log("Bio updated successfully.");
  } catch (error) {
    console.error("Error updating bio:", error);
  }
};

// Function to update specific user fields
const updateUserField = async (uid, field, value) => {
  try {
    if (!uid) {
      throw new Error("User is not authenticated");
    }

    const userRef = doc(db, "users", uid);

    const updateData = {
      [field]: value,
    };

    await setDoc(userRef, updateData, { merge: true });
    console.log(`${field} updated successfully.`);
  } catch (error) {
    console.error(`Error updating ${field}:`, error);
  }
};

// Function to update display name
const updateDisplayName = async () => {
  const user = auth.currentUser;

  if (user) {
    try {
      const userRef = doc(db, "users", user.uid);

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

        const senderEmail = requestData.senderUid
          ? (await getUserInfo(requestData.senderUid)).email
          : "Unknown User";

        return {
          ...requestData,
          senderEmail,
        };
      })
    );

    return requests;
  } catch (err) {
    console.error("Error fetching connection requests:", err);
    throw err;
  }
};

// Export functions
export {
  auth,
  db,
  storage,
  uploadProfilePicture,
  getUserInfo,
  updateUserBio,
  updateDisplayName,
  updateUserInfo,
  updateUserField,
  getUsers,
  sendConnectionRequest,
  fetchConnectionRequests,
};
