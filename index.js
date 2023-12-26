let yourValue = document.querySelector(".yourPoints");
let tableValue = document.querySelector(".tablePoints");
let yourCardsArr = [];
let tableCardsArr = [];
let tablePoints = 0;
let yourPoints = 0;
let currentDeckId = "";
let tableCards = document.querySelector(".tableCards");
let yourCards = document.querySelector(".yourCards");
let yourCardsDrawn = 0;
let tableCardsDrawn = 0;
let gameEnd = false;

let drawCards = () => {
  fetch(`https://deckofcardsapi.com/api/deck/${currentDeckId}/draw/?count=4`)
    .then((response) => response.json())
    .then((cards) => {
      console.log(cards);
      let dividedCards = [];
      for (let i = 0; i < cards.cards.length; i += 2) {
        dividedCards.push(cards.cards.slice(i, i + 2));
      }
      console.log(dividedCards);
      yourCardsArr = dividedCards[0];
      tableCardsArr = dividedCards[1];
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
        yourCardsDrawn++;
      }
      for (const card of tableCardsArr) {
        tableCards.innerHTML += `<div class="card col-2 d-none">
        <img src="${card.image}" alt="" />
      </div>
      <div class="card col-2 cardBack">
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
        tableCardsDrawn++;
      }
      if (yourCardsArr[0].value === "ACE" && yourCardsArr[1].value === "ACE") {
        yourPoints = 12;
      }
      if (
        tableCardsArr[0].value === "ACE" &&
        tableCardsArr[1].value === "ACE"
      ) {
        tablePoints = 12;
      }
      yourValue.innerText = yourPoints;
      let controlButtons = document.querySelectorAll(".btn.disabled");
      for (const btn of controlButtons) {
        btn.classList.remove("disabled");
      }
      let startButton = document.querySelector(".btnStart");
      startButton.classList.add("disabled");
    });
};

let fetchCards = () => {
  fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
    .then((response) => response.json())
    .then((deck) => {
      currentDeckId = deck.deck_id;
    });
};

window.onload = fetchCards;

let controlPoints = () => {
  if (
    yourPoints > 21 &&
    yourCardsArr[0].value === "ACE" &&
    yourCardsArr[1].value === "ACE"
  ) {
    for (let i = yourCardsDrawn; i < yourCardsArr.length; i++) {
      if (yourCardsArr[i].value === "ACE") {
        yourPoints -= 10;
        yourValue.innerText = yourPoints;
        yourCardsArr.splice(i, 1)
      } else {
        setTimeout(() => {alert("You lose")}, 500); //non va in timeout una sega
    }
    }
  } else if (
    yourPoints > 21 &&
    (yourCardsArr[0].value !== "ACE" || yourCardsArr[1].value !== "ACE")
  ) {
    for (let i = 0; i < yourCardsArr.length; i++) {
      if (yourCardsArr[i].value === "ACE") {
        yourPoints -= 10;
        yourValue.innerText = yourPoints;
        yourCardsArr.splice(i, 1)
        break;
      }
    }
    if (yourPoints > 21) {
        setTimeout(() => {alert("You lose")}, 500); //non va in timeout una sega
    }
  }
};

let callCard = () => {
  fetch(`https://deckofcardsapi.com/api/deck/${currentDeckId}/draw/?count=1`)
    .then((response) => response.json())
    .then((card) => {
      yourCardsArr.push(card.cards[0]);
      yourCards.innerHTML += `<div class="card col-2">
        <img src="${card.cards[0].image}" alt="" />
      </div>`;
      if (
        card.cards[0].value === "JACK" ||
        card.cards[0].value === "QUEEN" ||
        card.cards[0].value === "KING"
      ) {
        yourPoints += 10;
      } else if (card.cards[0].value === "ACE") {
        yourPoints += 11;
      } else {
        yourPoints += parseInt(card.cards[0].value);
      }
      yourValue.innerText = yourPoints;
      controlPoints();
    });
};

let controlTablePoints = () => {
  if (
    tablePoints > 21 &&
    tableCardsArr[0].value === "ACE" &&
    tableCardsArr[1].value === "ACE"
  ) {
    for (let i = tableCardsDrawn; i < tableCardsArr.length; i++) {
      if (tableCardsArr[i].value === "ACE") {
        tablePoints -= 10;
        tableValue.innerText = tablePoints;
        tableCardsArr.splice(i, 1)
      } else {
        gameEnd = true;
        setTimeout(() => {alert("You win")}, 500); //non va in timeout una sega
    }
    }
  } else if (
    tablePoints > 21 &&
    (tableCardsArr[0].value !== "ACE" || tableCardsArr[1].value !== "ACE")
  ) {
    for (let i = 0; i < tableCardsArr.length; i++) {
      if (tableCardsArr[i].value === "ACE") {
        tablePoints -= 10;
        tableValue.innerText = tablePoints;
        tableCardsArr.splice(i, 1)
        break;
      }
    }
  }
  if (tablePoints > 21) {
    gameEnd = true;
    setTimeout(() => {alert("You win")}, 500); //non va in timeout una sega
  } else if (
    tablePoints > yourPoints &&
    tablePoints <= 21 &&
    tablePoints >= 17
  ) {
    setTimeout(() => {alert("You lose")}, 500);
    gameEnd = true;
  } else if (
    tablePoints === yourPoints &&
    tablePoints <= 21 &&
    tablePoints >= 17
  ) {
    setTimeout(() => {alert("Draw(Pareggio)")}, 500);
    gameEnd = true;
  } else if (tablePoints < yourPoints && tablePoints >= 17) {
    setTimeout(() => {alert("You win")}, 500);
    gameEnd = true;
  } else {
    tableDraw();
  }
};

let tableDraw = () => {
  fetch(`https://deckofcardsapi.com/api/deck/${currentDeckId}/draw/?count=1`)
    .then((response) => response.json())
    .then((tableCard) => {
      tableCardsArr.push(tableCard.cards[0]);
      tableCards.innerHTML += `<div class="card col-2">
        <img src="${tableCard.cards[0].image}" alt="" />
      </div>`;
      if (
        tableCard.cards[0].value === "JACK" ||
        tableCard.cards[0].value === "QUEEN" ||
        tableCard.cards[0].value === "KING"
      ) {
        tablePoints += 10;
      } else if (tableCard.cards[0].value === "ACE") {
        tablePoints += 11;
      } else {
        tablePoints += parseInt(tableCard.cards[0].value);
      }
      tableValue.innerText = tablePoints;
      controlTablePoints();
    });
};

let checkWinner = () => {
  let cardsToShow = document.querySelectorAll(".tableCards .d-none");
  let cardBack = document.querySelectorAll(".cardBack");
  for (const el of cardBack) {
    el.classList.add("d-none");
  }
  for (const element of cardsToShow) {
    element.classList.remove("d-none");
  }
  tableValue.innerText = tablePoints;
  if (tablePoints > yourPoints && tablePoints <= 21 && tablePoints >= 17) {
    setTimeout(() => {alert("You lose")}, 500);
    gameEnd = true;
  } else if (
    tablePoints === yourPoints &&
    tablePoints <= 21 &&
    tablePoints >= 17
  ) {
    setTimeout(() => {alert("Draw(Pareggio)")}, 500);
    gameEnd = true;
  } else if (tablePoints < yourPoints && tablePoints >= 17) {
    setTimeout(() => {alert("You win")}, 500);
    gameEnd = true;
  } else {
    tableDraw();
  }
};
