document.addEventListener("DOMContentLoaded", function () {
  const rows = 6;
  const cols = 7;
  let board = [];
  let currentPlayer = 1;
  const gameBoard = document.getElementById("gameBoard");

  function initBoard() {
    gameBoard.innerHTML = "";
    board = [];

    for (let row = 0; row < rows; row++) {
      board[row] = [];
      for (let col = 0; col < cols; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.column = col;
        gameBoard.appendChild(cell);
        board[row][col] = 0;
      }
    }
  }

  function makePiecesDraggable() {
    const playerOnePot = document.querySelector(
      "#player-one-pieces .player-piece"
    );
    const playerTwoPot = document.querySelector(
      "#player-two-pieces .player-piece"
    );

    playerOnePot.addEventListener("dragstart", handleDragStart);
    playerTwoPot.addEventListener("dragstart", handleDragStart);

    const columns = document.querySelectorAll("#gameBoard > div");
    columns.forEach((column) => {
      column.addEventListener("dragover", handleDragOver);
      column.addEventListener("drop", handleDrop);
    });
  }

  function handleDragStart(event) {
    console.log("Drag start event");
    event.dataTransfer.setData("pieceId", event.target.id);
    console.log("ID in handleDragStart:", event.target.id);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    console.log("Drop event");
    event.preventDefault();
    const pieceId = event.dataTransfer.getData("pieceId");
    console.log("pieceId:", pieceId);
    const draggedPiece = document.getElementById(pieceId);
    console.log("draggedPiece:", draggedPiece);
    const col = parseInt(event.target.dataset.column);

    for (let row = rows - 1; row >= 0; row--) {
      if (board[row][col] === 0) {
        board[row][col] = currentPlayer;

        updateBoard();
        dropAnimation(row, col, currentPlayer, () => {
          if (checkWin(currentPlayer)) {
            alert(`Player ${currentPlayer} wins!`);
            updateWinCounter(currentPlayer);
            resetGame();
          } else {
            currentPlayer = currentPlayer === 1 ? 2 : 1;

            const playerPiecesContainer = draggedPiece.classList.contains(
              "player1"
            )
              ? document.getElementById("player-one-pieces")
              : document.getElementById("player-two-pieces");
            playerPiecesContainer.appendChild(draggedPiece);
          }
        });
        break;
      }
    }
  }

  function updateBoard() {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = document.querySelector(
          `.cell:nth-child(${row * cols + col + 1})`
        );
        cell.className = "cell";
        if (board[row][col] === 1) {
          cell.classList.add("player1");
        } else if (board[row][col] === 2) {
          cell.classList.add("player2");
        }
      }
    }
  }

  function checkWin(player) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols - 3; col++) {
        if (
          board[row][col] === player &&
          board[row][col + 1] === player &&
          board[row][col + 2] === player &&
          board[row][col + 3] === player
        ) {
          return true;
        }
      }
    }

    for (let row = 0; row < rows - 3; row++) {
      for (let col = 0; col < cols; col++) {
        if (
          board[row][col] === player &&
          board[row + 1][col] === player &&
          board[row + 2][col] === player &&
          board[row + 3][col] === player
        ) {
          return true;
        }
      }
    }

    for (let row = 0; row < rows - 3; row++) {
      for (let col = 0; col < cols - 3; col++) {
        if (
          board[row][col] === player &&
          board[row + 1][col + 1] === player &&
          board[row + 2][col + 2] === player &&
          board[row + 3][col + 3] === player
        ) {
          return true;
        }
      }
    }

    for (let row = 3; row < rows; row++) {
      for (let col = 0; col < cols - 3; col++) {
        if (
          board[row][col] === player &&
          board[row - 1][col + 1] === player &&
          board[row - 2][col + 2] === player &&
          board[row - 3][col + 3] === player
        ) {
          return true;
        }
      }
    }

    return false;
  }

  function updateWinCounter(player) {
    let winCountElement =
      player === 1
        ? document.getElementById("player1Score")
        : document.getElementById("player2Score");
    let winCount = parseInt(winCountElement.textContent) || 0;

    winCount++;

    winCountElement.textContent = `${winCount} wins`;
  }

  function resetGame() {
    currentPlayer = 1;
    initBoard();
    makePiecesDraggable();
  }

  function dropAnimation(row, col, player, callback) {
    updateBoard();
    setTimeout(callback, 200);
  }

  const resetButton = document.getElementById("resetButton");
  resetButton.addEventListener("click", resetGame);

  initBoard();
  makePiecesDraggable();
});
