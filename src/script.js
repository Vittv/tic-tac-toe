const GameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const updateCell = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const reset = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, updateCell, reset };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (() => {
    let gameOver = false;
    let currentPlayer;
    let player1, player2;
    const matchResult = document.querySelector(".match-result");

    const startGame = () => {
        player1 = Player("Player 1", "X");
        player2 = Player("Player 2", "O");
        currentPlayer = player1;
        gameOver = false;
    };

    const switchTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const handleCellClick = (index) => {
        if (gameOver) return;

        const marker = currentPlayer.marker;
        if (GameBoard.updateCell(index, marker)) {
            updateUI();

            const matchResult = document.querySelector(".match-result");

            if (checkWinner()) {
                matchResult.textContent = `${currentPlayer.name} wins!`;
                gameOver = true;
                return;
            }

            if (checkTie()) {
                matchResult.textContent = `It's a tie!`;
                gameOver = true;
                return;
            }

            switchTurn(); // Only switch if not game over
        }
    };

    const updateUI = () => {
        const board = GameBoard.getBoard();
        board.forEach((cell, index) => {
            const cellElement = document.getElementById(`cell-${index}`);
            cellElement.textContent = cell; // Set cell's text to "X" or "O"
        });
    };

    const checkTie = () => {
        return GameBoard.getBoard().every(cell => cell !== "");
    };

    const checkWinner = () => {
        const board = GameBoard.getBoard();
        const winPatterns = [
            [0, 1, 2], // Row 1
            [3, 4, 5], // Row 2
            [6, 7, 8], // Row 3
            [0, 3, 6], // Column 1
            [1, 4, 7], // Column 2
            [2, 5, 8], // Column 3
            [0, 4, 8], // Diagonal 1
            [2, 4, 6]  // Diagonal 2
        ];

        return winPatterns.some(pattern =>
            pattern.every(index => board[index] === currentPlayer.marker)
        );
    }

    const resetGame = () => {
        GameBoard.reset();
        startGame();
        updateUI();
        matchResult.textContent = "tic tac toe";
    };

    const getPlayerNames = () => ({
        player1Name: player1.name,
        player2Name: player2.name
    });

    const setPlayerNames = (newPlayer1Name, newPlayer2Name) => {
        player1.name = newPlayer1Name;
        player2.name = newPlayer2Name;
        updateUI();
    };

    return { startGame, handleCellClick, resetGame, getPlayerNames, setPlayerNames };
})();

(function() {
    document.addEventListener("DOMContentLoaded", () => {
        GameController.startGame();

        const cells = document.querySelectorAll(".cell");
        const matchResult = document.querySelector(".match-result");
        const restartButton = document.querySelector(".restart-btn");
        const editNamesButton = document.querySelector(".edit-names");

        const modal = document.getElementById("name-modal");
        const closeBtn = document.querySelector(".close-btn");
        const nameForm = document.getElementById("name-form");
        const player1Input = document.getElementById("player1-name");
        const player2Input = document.getElementById("player2-name");

        editNamesButton.addEventListener("click", () => {
            const { player1Name, player2Name } = GameController.getPlayerNames();

            player1Input.value = player1Name;
            player2Input.value = player2Name;
            modal.style.display = "block";
            player1Input.focus();
            player1Input.select();
        });

        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });

        window.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });

        nameForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevent form from refreshing the page
            const newPlayer1Name = player1Input.value.trim();
            const newPlayer2Name = player2Input.value.trim();

            GameController.setPlayerNames(newPlayer1Name, newPlayer2Name);
            modal.style.display = "none"; // Close the modal
        });

        // Set up the game and the reset/restart functionality
        restartButton.addEventListener("click", () => {
            GameController.resetGame();

            restartButton.classList.remove("spin");
            void restartButton.offsetWidth; // magic trick to reset animation
            restartButton.classList.add("spin");
        });

        cells.forEach((cell, index) => {
            cell.addEventListener("click", () => {
                GameController.handleCellClick(index);
            });
        });

        window.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                modal.style.display = "none";
            }
        });

        player2Input.addEventListener("focus", () => {
            player2Input.select();
        });
    });
})();