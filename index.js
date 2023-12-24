let yourValue = document.querySelector(".yourPoints")
let yourCardsArr = []
let tableCardsArr = []
let tablePoints = 0;
let yourPoints = 0;
let currentDeckId = ""


let drawCards = (decks) => {
  fetch(`https://deckofcardsapi.com/api/deck/${currentDeckId}/draw/?count=4`)
    .then((response) => response.json())
    .then((cards) => {
      console.log(cards);
      let dividedCards = [];
      for (let i = 0; i < cards.cards.length; i += 2) {
        dividedCards.push(cards.cards.slice(i, i + 2));
      }
      console.log(dividedCards);
      let tableCards = document.querySelector(".tableCards");
      let yourCards = document.querySelector(".yourCards");
      yourCardsArr = dividedCards[0]
      tableCardsArr = dividedCards[1]
      for (const card of yourCardsArr) {
        yourCards.innerHTML += `<div class="card col-2">
        <img src="${card.image}" alt="" />
      </div>`;
        if (
          card.value === "JACK" ||
          card.value === "QUEEN" ||
          card.value === "KING"
        ) {
          yourPoints += 10;
        } else if (card.value === "ACE") {
          yourPoints += 11;
        } else {
          yourPoints += parseInt(card.value);
        }
      }
      for (const card of tableCardsArr) {
        tableCards.innerHTML += `<div class="card col-2 d-none">
        <img src="${card.image}" alt="" />
      </div>
      <div class="card col-2">
        <img src="https://deckofcardsapi.com/static/img/back.png" alt="" />
      </div>`;
        if (
          card.value === "JACK" ||
          card.value === "QUEEN" ||
          card.value === "KING"
        ) {
          tablePoints += 10;
        } else if (card.value === "ACE") {
          tablePoints += 11;
        } else {
          tablePoints += parseInt(card.value);
        }
      }
      if (yourCardsArr[0].value === "ACE" && yourCardsArr[1].value === "ACE") {
        yourPoints = 12
      }
      if (tableCardsArr[0].value === "ACE" && tableCardsArr[1].value === "ACE") {
        tablePoints = 12
      }
      yourValue.innerText = yourPoints
      let controlButtons = document.querySelectorAll(".btn.disabled")
      for (const btn of controlButtons) {
        btn.classList.remove("disabled")
      }
      let startButton = document.querySelector(".btnStart")
      startButton.classList.add("disabled")
    });
};

let fetchCards = () => {
  fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
    .then((response) => response.json())
    .then((deck) => {
      currentDeckId = deck.deck_id
    });
};

window.onload = fetchCards

let callCard = (decks) => {
    fetch(`https://deckofcardsapi.com/api/deck/${currentDeckId}/draw/?count=1`)
    .then(response => response.json())
    .then((card) => {
        console.log(card);
    })
}