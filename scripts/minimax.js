/**
 * ============================================================================
 * DATA STRUCTURES AND ALIGORITHMS (2205 ST) — COURSEWORK PROJECT
 * File: scripts/minimax.js
 * Description: Decision Tree Traversal and Minimax Algorithm for Game AI.
 * Authors: Precious, Gideon, Peter
 * ============================================================================
 */

/**
 * All 8 winning combinations across rows, columns, and diagonals.
 */
export const WINNING_COMBINATIONS = [
    [0, 1, 2], // Row 1
    [3, 4, 5], // Row 2
    [6, 7, 8], // Row 3
    [0, 3, 6], // Column 1
    [1, 4, 7], // Column 2
    [2, 5, 8], // Column 3
    [0, 4, 8], // Main Diagonal
    [2, 4, 6]  // Anti Diagonal
];

/**
 * Human-readable coordinate labels for the 3x3 matrix.
 */
export const CELL_COORDINATES = [
    'Top-Left',
    'Top-Center',
    'Top-Right',
    'Middle-Left',
    'Center',
    'Middle-Right',
    'Bottom-Left',
    'Bottom-Center',
    'Bottom-Right'
];

/**
 * Scans board state for a terminal victory condition.
 * @param {Array} board - 9-element array representing the board.
 * @returns {{ winner: string, combination: number[] } | null}
 */
export function evaluateWinner(board) {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
        const [a, b, c] = WINNING_COMBINATIONS[i];
        if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], combination: [a, b, c] };
        }
    }
    return null;
}

/**
 * Checks if board has reached a terminal draw state.
 * @param {Array} board - 9-element array representing the board.
 * @returns {boolean}
 */
export function evaluateDraw(board) {
    return board.every(cell => cell !== null) && evaluateWinner(board) === null;
}

/**
 * Recursive Minimax Evaluation Function (Tree Search)
 * ---------------------------------------------------
 * Explores possible game tree branches recursively.
 * Base cases return static evaluation scores adjusted by depth to favor faster victories:
 *   - AI Win: +10 - depth
 *   - Opponent Win: -10 + depth
 *   - Draw: 0
 * 
 * @param {Array} board - Current node board state.
 * @param {number} depth - Current tree depth (recursion level).
 * @param {boolean} isMaximizing - True if current node is Maximizing player (AI).
 * @param {string} aiSymbol - AI player mark ('X' or 'O').
 * @param {string} opponentSymbol - Human/Opponent mark.
 * @param {Object} metrics - Reference object collecting telemetry (total calls, max depth).
 * @returns {number} The minimax evaluation score of the node.
 */
function minimax(board, depth, isMaximizing, aiSymbol, opponentSymbol, metrics) {
    metrics.nodesExplored++;
    if (depth > metrics.maxDepth) {
        metrics.maxDepth = depth;
    }

    // --- Base Case: Check for terminal game states ---
    const victory = evaluateWinner(board);
    if (victory) {
        return victory.winner === aiSymbol ? (10 - depth) : (-10 + depth);
    }
    if (evaluateDraw(board)) {
        return 0;
    }

    // --- Recursive Tree Branching ---
    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = aiSymbol; // Simulate move
                const evaluation = minimax(board, depth + 1, false, aiSymbol, opponentSymbol, metrics);
                board[i] = null;     // Backtrack
                maxEval = Math.max(maxEval, evaluation);
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = opponentSymbol; // Simulate move
                const evaluation = minimax(board, depth + 1, true, aiSymbol, opponentSymbol, metrics);
                board[i] = null;           // Backtrack
                minEval = Math.min(minEval, evaluation);
            }
        }
        return minEval;
    }
}

/**
 * Generates the Root AI Decision and builds visual Tree Branch data.
 * 
 * @param {Array} board - Active board matrix.
 * @param {string} aiSymbol - AI marker ('X' or 'O').
 * @param {string} opponentSymbol - Opponent marker.
 * @returns {{
 *   bestMoveIndex: number,
 *   bestScore: number,
 *   candidateBranches: Array,
 *   metrics: { nodesExplored: number, maxDepth: number }
 * }}
 */
export function findBestMove(board, aiSymbol, opponentSymbol) {
    const metrics = {
        nodesExplored: 0,
        maxDepth: 0
    };

    const candidateBranches = [];
    let bestScore = -Infinity;
    let bestMoveIndex = null;

    // Collect all open board cells
    const openCells = [];
    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            openCells.push(i);
        }
    }

    // Evaluate each child branch at depth = 1
    for (const cellIndex of openCells) {
        board[cellIndex] = aiSymbol; // Traverse into branch
        const branchScore = minimax(board, 1, false, aiSymbol, opponentSymbol, metrics);
        board[cellIndex] = null;     // Backtrack

        candidateBranches.push({
            cellIndex,
            cellName: CELL_COORDINATES[cellIndex],
            score: branchScore,
            isOptimal: false
        });

        if (branchScore > bestScore) {
            bestScore = branchScore;
            bestMoveIndex = cellIndex;
        }
    }

    // Mark the optimal candidate for visualization
    for (const branch of candidateBranches) {
        if (branch.cellIndex === bestMoveIndex) {
            branch.isOptimal = true;
        }
    }

    return {
        bestMoveIndex,
        bestScore,
        candidateBranches,
        metrics
    };
}
