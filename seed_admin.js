const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyB_qdWDQNqOwDroHVXXnsPyCWrt7T9H8x8",
  appId: "1:903829052403:web:922a43da877caf77821086",
  messagingSenderId: "903829052403",
  projectId: "orufms",
  authDomain: "orufms.firebaseapp.com",
  storageBucket: "orufms.firebasestorage.app",
  measurementId: "G-4VC16SK9G9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function seed() {
  const email = "faheem@easyio.tech";
  const password = "FMSAdmin123#";
  let userCredential;

  try {
    console.log("Attempting to login...");
    userCredential = await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
      console.log("User not found or invalid credential. Attempting to create user...");
      try {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User created successfully!");
      } catch (createErr) {
        console.error("Failed to create user:", createErr);
        process.exit(1);
      }
    } else {
      console.error("Login failed:", err);
      process.exit(1);
    }
  }

  try {
    const uid = userCredential.user.uid;
    console.log("Got UID:", uid);

    await setDoc(doc(db, "platform_admins", uid), {
      email: email,
      role: "super_admin",
      createdAt: new Date().toISOString()
    });

    console.log("Successfully seeded platform_admins collection!");
    process.exit(0);
  } catch (err) {
    console.error("Failed to write to Firestore:", err);
    process.exit(1);
  }
}

seed();
