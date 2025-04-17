// Import necessary Firebase services
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Initialize Firebase services (ensure firebase-config.js is imported)
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

// To keep track of the current user
let currentUser = null;

// Firebase auth state change listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        document.getElementById("login-section").style.display = "none";
        document.getElementById("post-section").style.display = "block";
        loadItems();
    } else {
        currentUser = null;
    }
});

// Function to handle Google login
function login() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
}

// Function to post an item
function postItem() {
    const name = document.getElementById('itemName').value;
    const desc = document.getElementById('description').value;
    const status = document.getElementById('status').value;
    const file = document.getElementById('imageInput').files[0];

    // If there's a file to upload
    if (file) {
        const storageRef = ref(storage, `items/${Date.now()}_${file.name}`);
        uploadBytes(storageRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                // Adding the item to Firestore with the image URL
                addDoc(collection(db, "items"), {
                    name,
                    desc,
                    status,
                    imageUrl: url,
                    contact: currentUser.email,
                    postedAt: new Date(),
                }).then(() => {
                    alert("Item posted successfully!");
                    loadItems();
                }).catch((error) => {
                    console.error("Error posting item: ", error);
                });
            }).catch((error) => {
                console.error("Error uploading image: ", error);
            });
        });
    } else {
        // If no image is uploaded, just post without an image
        addDoc(collection(db, "items"), {
            name,
            desc,
            status,
            contact: currentUser.email,
            postedAt: new Date(),
        }).then(() => {
            alert("Item posted successfully!");
            loadItems();
        }).catch((error) => {
            console.error("Error posting item: ", error);
        });
    }
}

// Function to load items from Firestore
function loadItems() {
    const q = query(collection(db, "items"), orderBy("postedAt", "desc"));
    onSnapshot(q, (snapshot) => {
        let html = "";
        snapshot.forEach((doc) => {
            const data = doc.data();
            html += `<div>
                        <h3>${data.name} (${data.status})</h3>
                        <img src="${data.imageUrl}" width="150" />
                        <p>${data.desc}</p>
                        <a href="mailto:${data.contact}">Contact Owner</a>
                    </div>`;
        });
        document.getElementById("itemList").innerHTML = html;
    });
}

// Function to search items
function searchItems() {
    const keyword = document.getElementById("searchBox").value.toLowerCase();
    getDocs(collection(db, "items")).then((snapshot) => {
        let html = "";
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.name.toLowerCase().includes(keyword)) {
                html += `<div>
                            <h3>${data.name} (${data.status})</h3>
                            <img src="${data.imageUrl}" width="150" />
                            <p>${data.desc}</p>
                            <a href="mailto:${data.contact}">Contact Owner</a>
                        </div>`;
            }
        });
        document.getElementById("itemList").innerHTML = html;
    });
}
