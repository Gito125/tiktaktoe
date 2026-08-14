/**
 * ============================================================================
 * DATA STRUCTURES AND ALIGORITHMS (2205 ST) — COURSEWORK PROJECT
 * File: scripts/ui.js
 * Description: DOM abstraction, board creation, cell rendering, and UI states.
 * Authors: Precious, Gideon, Peter
 * ============================================================================
 */

/**
 * DOM Element Registry Object
 */
export const DOM = {
    modeButtons: null,
    symbolConfigGroup: null,
    symbolPillButtons: null,
    btnUndo: null,
    btnReset: null,
    boardContainer: null,
    statusDot: null,
    statusHeadline: null,
    statusSubtext: null,
    stackViewport: null,
    statStackTop: null,
    statStackSize: null,
    treePanelContainer: null,
    treeViewport: null,
    statTreeNodes: null,
    statTreeScore: null
};

/**
 * Caches all active DOM elements once the document is ready.
 */
export function initDOM() {
    DOM.modeButtons = document.querySelectorAll('.mode-tab-btn');
    DOM.symbolConfigGroup = document.getElementById('symbol-config-group');
    DOM.symbolPillButtons = document.querySelectorAll('.symbol-pill-btn');
    DOM.btnUndo = document.getElementById('btn-undo');
    DOM.btnReset = document.getElementById('btn-reset');
    DOM.boardContainer = document.getElementById('board-container');
    DOM.statusDot = document.getElementById('status-indicator-dot');
    DOM.statusHeadline = document.getElementById('status-headline');
    DOM.statusSubtext = document.getElementById('status-subtext');
    DOM.stackViewport = document.getElementById('stack-viewport');
    DOM.statStackTop = document.getElementById('stat-stack-top');
    DOM.statStackSize = document.getElementById('stat-stack-size');
    DOM.treePanelContainer = document.getElementById('tree-panel-container');
    DOM.treeViewport = document.getElementById('tree-viewport');
    DOM.statTreeNodes = document.getElementById('stat-tree-nodes');
    DOM.statTreeScore = document.getElementById('stat-tree-score');
    return DOM;
}

/**
 * Creates the 3x3 interactive grid inside the board container.
 * @param {Function} onCellClick - Callback invoked with clicked cell index.
 */
export function buildGrid(onCellClick) {
    if (!DOM.boardContainer) initDOM();
    DOM.boardContainer.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.className = 'grid-cell';
        cell.id = `cell-${i}`;
        cell.dataset.index = i;
        cell.setAttribute('aria-label', `Cell ${i + 1}`);

        const markContent = document.createElement('span');
        markContent.className = 'mark-content';
        cell.appendChild(markContent);

        cell.addEventListener('click', () => onCellClick(i));
        DOM.boardContainer.appendChild(cell);
    }
}

/**
 * Renders a player's mark into a specific cell.
 * @param {number} index - Cell index (0-8).
 * @param {string} symbol - Player marker ('X' or 'O').
 */
export function renderCellMark(index, symbol) {
    const cell = document.getElementById(`cell-${index}`);
    if (!cell) return;

    const span = cell.querySelector('.mark-content');
    if (span) {
        span.textContent = symbol;
    }

    cell.classList.add('occupied', symbol === 'X' ? 'mark-x' : 'mark-o');
    
    // Trigger pop-in micro-animation
    if (span) {
        span.classList.remove('anim-pop');
        void span.offsetWidth; // Force CSS reflow
        span.classList.add('anim-pop');
    }
}

/**
 * Clears mark from a cell (Used during Undo operation).
 * @param {number} index - Cell index (0-8).
 */
export function clearCellMark(index) {
    const cell = document.getElementById(`cell-${index}`);
    if (!cell) return;

    const span = cell.querySelector('.mark-content');
    if (span) {
        span.textContent = '';
        span.classList.remove('anim-pop');
    }

    cell.className = 'grid-cell';
}

/**
 * Highlights cells belonging to the winning trio.
 * @param {number[]} combination - Indices of 3 winning cells.
 */
export function highlightWinningLine(combination) {
    for (const index of combination) {
        const cell = document.getElementById(`cell-${index}`);
        if (cell) {
            cell.classList.add('winner-cell', 'anim-win-pulse');
        }
    }
}

/**
 * Enables or disables user interaction with the board.
 * @param {boolean} enabled
 */
export function setBoardInteractive(enabled) {
    if (!DOM.boardContainer) return;
    const cells = DOM.boardContainer.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        if (enabled) {
            cell.classList.remove('disabled');
        } else {
            cell.classList.add('disabled');
        }
    });
}

/**
 * Updates the primary game status header.
 * @param {string} headline - Main status message.
 * @param {string} subtext - Auxiliary context (turn info / game end state).
 * @param {'x-turn' | 'o-turn' | 'win' | 'draw' | 'neutral'} stateClass
 */
export function updateStatusBar(headline, subtext, stateClass = 'neutral') {
    if (DOM.statusHeadline) DOM.statusHeadline.textContent = headline;
    if (DOM.statusSubtext) DOM.statusSubtext.textContent = subtext;
    if (DOM.statusDot) DOM.statusDot.className = `status-indicator-dot ${stateClass}`;
}

/**
 * Toggles the visibility of the Minimax Decision Tree panel.
 * @param {boolean} visible
 */
export function setTreePanelVisible(visible) {
    if (DOM.treePanelContainer) {
        if (visible) {
            DOM.treePanelContainer.classList.remove('hidden');
        } else {
            DOM.treePanelContainer.classList.add('hidden');
        }
    }
}
