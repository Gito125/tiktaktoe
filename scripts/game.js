/**
 * ============================================================================
 * DATA STRUCTURES AND ALIGORITHMS (2205 ST) — COURSEWORK PROJECT
 * File: scripts/game.js
 * Description: Core game controller integrating Stack, Queue, and Minimax AI.
 * Authors: Precious, Gideon, Peter
 * ============================================================================
 */

import { Stack } from './stack.js';
import { Queue } from './queue.js';
import { evaluateWinner, evaluateDraw, findBestMove, CELL_COORDINATES } from './minimax.js';
import { renderCellMark, clearCellMark, highlightWinningLine, setBoardInteractive, updateStatusBar, DOM } from './ui.js';
import { renderStackPanel, renderTreePanel } from './panels.js';

export class GameEngine {
    constructor() {
        this.board = new Array(9).fill(null);
        this.moveStack = new Stack(9);
        this.turnQueue = new Queue();

        this.mode = 'pvp';          // 'pvp' | 'pvai' | 'aivai'
        this.humanSymbol = 'X';     // In PvAI mode
        this.aiSymbol = 'O';        // In PvAI mode

        this.isGameOver = false;
        this.aiTurnTimeout = null;
    }

    /**
     * Configures game mode and symbol assignments.
     * @param {'pvp'|'pvai'|'aivai'} mode 
     * @param {'X'|'O'} humanSymbol 
     */
    configure(mode, humanSymbol = 'X') {
        this.mode = mode;
        this.humanSymbol = humanSymbol;
        this.aiSymbol = humanSymbol === 'X' ? 'O' : 'X';
        this.reset();
    }

    /**
     * Resets the entire match state and initializes the Turn Queue.
     */
    reset() {
        // Cancel active AI scheduling timer
        if (this.aiTurnTimeout) {
            clearTimeout(this.aiTurnTimeout);
            this.aiTurnTimeout = null;
        }

        // Reset state arrays
        this.board.fill(null);
        this.moveStack.clear();
        this.turnQueue.clear();
        this.isGameOver = false;

        // Initialize FIFO Turn Queue based on game mode
        if (this.mode === 'pvp') {
            this.turnQueue.enqueue({ symbol: 'X', name: 'Player X', isAI: false });
            this.turnQueue.enqueue({ symbol: 'O', name: 'Player O', isAI: false });
        } else if (this.mode === 'pvai') {
            // First turn is always 'X'
            this.turnQueue.enqueue({
                symbol: 'X',
                name: this.humanSymbol === 'X' ? 'Player (X)' : 'AI Engine (X)',
                isAI: this.humanSymbol !== 'X'
            });
            this.turnQueue.enqueue({
                symbol: 'O',
                name: this.humanSymbol === 'O' ? 'Player (O)' : 'AI Engine (O)',
                isAI: this.humanSymbol !== 'O'
            });
        } else if (this.mode === 'aivai') {
            this.turnQueue.enqueue({ symbol: 'X', name: 'Minimax AI 1 (X)', isAI: true });
            this.turnQueue.enqueue({ symbol: 'O', name: 'Minimax AI 2 (O)', isAI: true });
        }

        // Reset visual board cells
        for (let i = 0; i < 9; i++) {
            clearCellMark(i);
        }

        // Update DSA Visual Panels
        renderStackPanel(this.moveStack);
        renderTreePanel(null);

        // Update Status & Board Interactivity
        setBoardInteractive(true);
        this.updateTurnStatus();

        // If first player is an AI, schedule move
        const currentTurn = this.turnQueue.front();
        if (currentTurn && currentTurn.isAI) {
            this.scheduleAIMove();
        }
    }

    /**
     * Handles human cell click.
     * @param {number} cellIndex 
     */
    handleCellClick(cellIndex) {
        if (this.isGameOver) return;
        if (this.board[cellIndex] !== null) return;

        const currentTurn = this.turnQueue.front();
        if (!currentTurn || currentTurn.isAI) return;

        this.executeMove(cellIndex, currentTurn);
    }

    /**
     * Executes a board move, pushes to Stack, rotates Queue, and evaluates game state.
     * @param {number} cellIndex 
     * @param {Object} player 
     */
    executeMove(cellIndex, player) {
        // 1. Mutate board array
        this.board[cellIndex] = player.symbol;

        // 2. Render Mark on UI
        renderCellMark(cellIndex, player.symbol);

        // 3. PUSH onto Move Stack (LIFO)
        const moveRecord = {
            player: player.symbol,
            cellIndex,
            cellName: CELL_COORDINATES[cellIndex],
            moveNumber: this.moveStack.size() + 1
        };
        this.moveStack.push(moveRecord);
        renderStackPanel(this.moveStack);

        // 4. Evaluate Victory Condition
        const victory = evaluateWinner(this.board);
        if (victory) {
            this.isGameOver = true;
            highlightWinningLine(victory.combination);
            setBoardInteractive(false);
            if (DOM.btnUndo) DOM.btnUndo.disabled = true;

            updateStatusBar(
                `${player.name} Victory!`,
                `Winning combination verified on line: ${victory.combination.join(', ')}`,
                'win'
            );
            return;
        }

        // 5. Evaluate Draw Condition
        if (evaluateDraw(this.board)) {
            this.isGameOver = true;
            setBoardInteractive(false);
            if (DOM.btnUndo) DOM.btnUndo.disabled = true;

            updateStatusBar(
                `Match Drawn`,
                `All 9 grid cells occupied without terminal alignment.`,
                'draw'
            );
            return;
        }

        // 6. Rotate FIFO Turn Queue
        this.turnQueue.rotate();
        this.updateTurnStatus();

        // 7. Trigger next player if AI
        const nextPlayer = this.turnQueue.front();
        if (nextPlayer && nextPlayer.isAI) {
            this.scheduleAIMove();
        }
    }

    /**
     * Schedules AI decision-making with deliberate pacing for observability.
     */
    scheduleAIMove() {
        setBoardInteractive(false);
        const aiPlayer = this.turnQueue.front();

        updateStatusBar(
            `${aiPlayer.name} Calculating...`,
            `Executing recursive Minimax tree search across open branches...`,
            aiPlayer.symbol === 'X' ? 'x-turn' : 'o-turn'
        );

        this.aiTurnTimeout = setTimeout(() => {
            if (this.isGameOver) return;

            const opponentSymbol = aiPlayer.symbol === 'X' ? 'O' : 'X';
            const decision = findBestMove(
                [...this.board],
                aiPlayer.symbol,
                opponentSymbol
            );

            // Render Decision Tree Panel
            renderTreePanel(decision);

            setBoardInteractive(true);
            this.executeMove(decision.bestMoveIndex, aiPlayer);
        }, 550);
    }

    /**
     * Reverts the most recent move using Stack POP operation.
     * In PvAI mode, automatically rolls back both the AI's move and the player's move.
     */
    undo() {
        if (this.moveStack.isEmpty() || this.isGameOver) return;

        if (this.aiTurnTimeout) {
            clearTimeout(this.aiTurnTimeout);
            this.aiTurnTimeout = null;
        }

        const rollbackSingleMove = () => {
            const popped = this.moveStack.pop();
            if (!popped) return null;

            this.board[popped.cellIndex] = null;
            clearCellMark(popped.cellIndex);
            this.turnQueue.rotateBack();
            return popped;
        };

        if (this.mode === 'pvai') {
            const topMove = this.moveStack.peek();
            // If the latest move was made by AI, roll back AI move then Human move
            if (topMove && topMove.player === this.aiSymbol) {
                rollbackSingleMove();
            }
            if (!this.moveStack.isEmpty()) {
                rollbackSingleMove();
            }
        } else {
            rollbackSingleMove();
        }

        renderStackPanel(this.moveStack);
        renderTreePanel(null);
        setBoardInteractive(true);
        this.updateTurnStatus();
    }

    /**
     * Synchronizes the status banner with the active player in Queue.
     */
    updateTurnStatus() {
        const current = this.turnQueue.front();
        if (!current) return;

        const isX = current.symbol === 'X';
        updateStatusBar(
            `${current.name}'s Turn`,
            `Waiting for marker placement on open coordinate...`,
            isX ? 'x-turn' : 'o-turn'
        );
    }
}
