/**
 * ============================================================================
 * DATA STRUCTURES AND ALIGORITHMS (2205 ST) — COURSEWORK PROJECT
 * File: scripts/panels.js
 * Description: Real-time visual renderers for Stack and Game Tree data structures.
 * Authors: Precious, Gideon, Peter
 * ============================================================================
 */

import { DOM } from './ui.js';

/**
 * Renders the Stack (Move History) panel.
 * Reflects array representation: items[0] at bottom, items[TOP] at top.
 * 
 * @param {import('./stack.js').Stack} stack - Active stack instance.
 */
export function renderStackPanel(stack) {
    if (!DOM.stackViewport) return;

    const items = stack.toArray();
    DOM.stackViewport.innerHTML = '';

    if (items.length === 0) {
        DOM.stackViewport.innerHTML = `
            <div class="empty-state-notice">
                <span>Stack Underflow (TOP = -1)</span>
                <p style="font-size: 0.68rem; margin-top: 0.25rem;">No moves recorded yet.</p>
            </div>
        `;
    } else {
        items.forEach((item, index) => {
            const frame = document.createElement('div');
            frame.className = 'stack-frame anim-stack-push';
            
            const isTop = (index === stack.TOP);
            if (isTop) {
                frame.classList.add('is-top');
            }

            frame.innerHTML = `
                <div class="stack-frame-left">
                    <span class="stack-index">[${index}]</span>
                    <span class="stack-badge ${item.player.toLowerCase()}">${item.player}</span>
                    <span class="stack-cell-name">${item.cellName}</span>
                </div>
                ${isTop ? '<span class="top-pointer-tag">TOP</span>' : ''}
            `;

            DOM.stackViewport.appendChild(frame);
        });
    }

    // Update Stack Telemetry Counters
    if (DOM.statStackTop) {
        DOM.statStackTop.textContent = stack.TOP === -1 ? '-1 (null)' : stack.TOP;
    }
    if (DOM.statStackSize) {
        DOM.statStackSize.textContent = `${stack.size()} / ${stack.MAX}`;
    }

    // Update Undo button state
    if (DOM.btnUndo) {
        DOM.btnUndo.disabled = stack.isEmpty();
    }
}

/**
 * Renders the Minimax Decision Tree panel.
 * Shows the root evaluation state and candidate child branches.
 * 
 * @param {{
 *   candidateBranches: Array,
 *   bestScore: number,
 *   metrics: { nodesExplored: number, maxDepth: number }
 * } | null} treeData
 */
export function renderTreePanel(treeData) {
    if (!DOM.treeViewport) return;

    if (!treeData || !treeData.candidateBranches || treeData.candidateBranches.length === 0) {
        DOM.treeViewport.innerHTML = `
            <div class="empty-state-notice">
                <span>Decision Tree Inactive</span>
                <p style="font-size: 0.68rem; margin-top: 0.25rem;">Minimax activates on AI turns.</p>
            </div>
        `;
        if (DOM.statTreeNodes) DOM.statTreeNodes.textContent = '0';
        if (DOM.statTreeScore) DOM.statTreeScore.textContent = '—';
        return;
    }

    const { candidateBranches, bestScore, metrics } = treeData;

    let scoreClass = 'neutral';
    if (bestScore > 0) scoreClass = 'positive';
    else if (bestScore < 0) scoreClass = 'negative';

    const formattedBestScore = bestScore > 0 ? `+${bestScore}` : `${bestScore}`;

    DOM.treeViewport.innerHTML = `
        <div class="tree-root-card">
            <span>Root Node &bull; Evaluation Depth = 0</span>
        </div>

        <div class="tree-branches-label">
            <span>Evaluated Branches (${candidateBranches.length})</span>
        </div>

        <div class="tree-candidates-grid">
            ${candidateBranches.map(branch => {
                let branchScoreClass = 'neutral';
                if (branch.score > 0) branchScoreClass = 'positive';
                else if (branch.score < 0) branchScoreClass = 'negative';

                const formattedScore = branch.score > 0 ? `+${branch.score}` : `${branch.score}`;

                return `
                    <div class="tree-candidate-card ${branch.isOptimal ? 'is-chosen' : ''}">
                        <span class="candidate-pos">${branch.cellName}</span>
                        <span class="candidate-score ${branchScoreClass}">${formattedScore}</span>
                        ${branch.isOptimal ? '<span class="candidate-tag">Chosen</span>' : ''}
                    </div>
                `;
            }).join('')}
        </div>
    `;

    // Update Telemetry Counters
    if (DOM.statTreeNodes) {
        DOM.statTreeNodes.textContent = metrics.nodesExplored.toLocaleString();
    }
    if (DOM.statTreeScore) {
        DOM.statTreeScore.textContent = formattedBestScore;
    }
}
