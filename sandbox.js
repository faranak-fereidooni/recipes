
 // Import the functions you need from the SDKs you need
 import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js'
 import { getFirestore,collection,query, doc ,getDocs ,setDoc, Timestamp ,deleteDoc,onSnapshot} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js'
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 const firebaseConfig = {
   apiKey: "AIzaSyD6Cip4pZTVMZATL6pWKA37iANnHp0cP-g",
   authDomain: "modern-javascript-52c4a.firebaseapp.com",
   projectId: "modern-javascript-52c4a",
   storageBucket: "modern-javascript-52c4a.appspot.com",
   messagingSenderId: "355748458379",
   appId: "1:355748458379:web:58a1719c14603fa723898e",
   measurementId: "G-4479SWRFJZ",
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const db =getFirestore(app);

// add recipe and show it on ul
const list = document.querySelector('ul');
const form = document.querySelector('form');
const button = document.querySelector('button');

// add recipe
const addRecipes = (recipe,id) =>{
  let time = recipe.created_at.toDate();
  let html = `
  <li data-id="${id}">
    <div>${recipe.title}</div>
    <div>${time}</div>
    <button class="btn btn-danger btn-sm my-2">delete</button>
  </li>
  `;
  list.innerHTML += html;
}

// delete recipe 
const deleteRecipe = (id) => {
  const recipes = document.querySelectorAll('li');
  recipes.forEach(recipe => {
    if(recipe.getAttribute('data-id') === id){
      recipe.remove();
    }
  });
}

// get documents from firebase
 const q = query(collection(db, "recipes"));
 const unsubscribe = onSnapshot(q, (snapshot) => {
   snapshot.docChanges().forEach((change) => {
    change.doc.data()
     if (change.type === "added") {
      addRecipes(change.doc.data(), change.doc.id);
     }
     if (change.type === "removed") {
       deleteRecipe(change.doc.id);
     }
   });
 });


//  add documents to firebase
form.addEventListener('submit', e =>{
  e.preventDefault();
  
const now = new Date();
const recipe = {
  title : form.recipe.value,
  created_at : Timestamp.fromDate(now)
};
  setDoc(doc(db, "recipes", form.recipe.value), recipe);
  console.log('recipe was added')
});

// deleting data from firebase
list.addEventListener('click', e => {
if(e.target.tagName === 'BUTTON'){
  const id = e.target.parentElement.getAttribute('data-id');
   deleteDoc(doc(db,"recipes",id));   
   console.log('recipe was deleted');
}
});

// unsub from database changes
button.addEventListener('click',()=>{
  unsubscribe();
  console.log('unsubscribe from collection changes');

});
