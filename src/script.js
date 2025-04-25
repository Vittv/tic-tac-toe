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
    let currentPlayer;
    let player1, player2;

    const startGame = () => {
        player1 = Player("Player 1", "X");
        player2 = Player("Player 2", "O");

        currentPlayer = player1;
    };

    const switchTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const handleCellClick = (index) => {
        const marker = currentPlayer.marker;
        if (GameBoard.updateCell(index, marker)) {
            updateUI();

            if (checkWinner()) {
                alert(`${currentPlayer.name} wins!`);
                return;
            }

            if (checkTie()) {
                alert("It's a tie!");
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
    };

    return { startGame, handleCellClick, resetGame };
})();