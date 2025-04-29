
const toyUrl = 'http://localhost:3000/toys';
let addToy = false;

function buildCard(entry) {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');
  const img = document.createElement('img');
  const btn = document.createElement('button');

  div.classList = 'card';

  div.innerHTML = `
    <img class='toy-avatar' src="${entry.image}">
    <h2>${entry.name}</h2>
    <p>${entry.likes} Likes!</p>
    <button class='like-btn' id=${entry.id}>Like ❤️</button>
  `

  document.querySelector('#toy-collection').appendChild(div)
}

function getToys() {
  fetch(toyUrl)
  .then((res) => res.json())
  .then((data) => {
    for (const entry of data) {
      buildCard(entry)
    }
    likeButton()
  })
}

function submitNewToy() {
 const form = document.querySelector('form');

 form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = e.target.name.value;
  const image = e.target.image.value;

  postToy(name, image)

  e.target.reset()
})
}

function postToy (name, img) {
  fetch(toyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({
      name: name,
      image: img,
      likes: 0
    })
  })
  .then((res) => res.json())
  .then((data) => buildCard(data))
}

function likeButton() {
  const likeBtns = document.querySelectorAll('.like-btn')

  likeBtns.forEach((btn) => {
    btn.addEventListener('click',(e) => {
      const toyId = e.target.id;
      const toyCard = e.target.parentElement;
      const likesP = toyCard.querySelector('p');
      const currentLikes = parseInt(likesP.textContent);
      const newLikes = currentLikes + 1;
      console.log('New likes!', newLikes)

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body:JSON.stringify({
          likes: newLikes
        })
      })
      .then((res) => res.json())
      .then(() => likesP.textContent = `${newLikes} Likes!`)

    });
  })
}

function initializer() {
  getToys()
  submitNewToy()
}

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  initializer()
});