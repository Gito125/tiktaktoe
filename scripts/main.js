/**
 * ============================================================================
 * DATA STRUCTURES AND ALIGORITHMS (2205 ST) — COURSEWORK PROJECT
 * File: scripts/main.js
 * Description: Application bootstrap, event listener registration, and Lucide init.
 * Authors: Precious, Gideon, Peter
 * ============================================================================
 */

import { GameEngine } from './game.js';
import { DOM, initDOM, buildGrid } from './ui.js';

function initializeApplication() {
    // 1. Cache active DOM nodes
    initDOM();

    // 2. Instantiate central Game Engine
    const game = new GameEngine();

    // 3. Build Interactive 3x3 Grid
    buildGrid((index) => {
        game.handleCellClick(index);
    });

    // 4. Register Mode Selection Event Listeners
    if (DOM.modeButtons) {
        DOM.modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                DOM.modeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const selectedMode = btn.dataset.mode;

                // Show/hide symbol choice when PvAI mode is active
                if (selectedMode === 'pvai') {
                    if (DOM.symbolConfigGroup) DOM.symbolConfigGroup.classList.remove('hidden');
                } else {
                    if (DOM.symbolConfigGroup) DOM.symbolConfigGroup.classList.add('hidden');
                }

                // Determine active human symbol
                const activeSymbolBtn = document.querySelector('.symbol-pill-btn.active');
                const humanSymbol = activeSymbolBtn ? activeSymbolBtn.dataset.symbol : 'X';

                game.configure(selectedMode, humanSymbol);
                refreshIcons();
            });
        });
    }

    // 5. Register Symbol Choice Event Listeners (PvAI)
    if (DOM.symbolPillButtons) {
        DOM.symbolPillButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                DOM.symbolPillButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const activeModeBtn = document.querySelector('.mode-tab-btn.active');
                const selectedMode = activeModeBtn ? activeModeBtn.dataset.mode : 'pvp';
                const humanSymbol = btn.dataset.symbol;

                game.configure(selectedMode, humanSymbol);
            });
        });
    }

    // 6. Register Undo & Reset Action Listeners
    if (DOM.btnUndo) {
        DOM.btnUndo.addEventListener('click', () => {
            game.undo();
        });
    }

    if (DOM.btnReset) {
        DOM.btnReset.addEventListener('click', () => {
            game.reset();
        });
    }

    // 7. Helper to render/re-render Lucide SVG icons
    function refreshIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    // Initial icon creation and game start
    refreshIcons();
    game.configure('pvp', 'X');

    console.log(
        '%c[DSA Engine]%c Data Structures and Aligorithms (2205 ST) Coursework Initialized\n' +
        'Stack (LIFO Move History) & Minimax Decision Tree Ready.\n' +
        'Authors: Precious, Gideon, Peter',
        'color:#2563eb;font-weight:bold;',
        'color:#475569;'
    );
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
    initializeApplication();
}
