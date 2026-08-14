/**
 * ============================================================================
 * DATA STRUCTURES AND ALIGORITHMS (2205 ST) — COURSEWORK PROJECT
 * File: scripts/queue.js
 * Description: Queue data structure (FIFO) for deterministic turn scheduling.
 * Authors: Precious, Gideon, Peter
 * ============================================================================
 */

/**
 * Queue Class (First-In, First-Out)
 * ----------------------------------
 * Manages player turns in a fair, cyclical queue.
 * - `enqueue()`: Appends player to the rear.
 * - `dequeue()`: Removes player from the front.
 * - `rotate()`: Cycles front player to rear, yielding next turn in O(1).
 */
export class Queue {
    constructor() {
        this.items = [];
    }

    /**
     * Enqueues an item at the rear of the queue.
     * @param {Object} item - Player record { symbol, name, isAI }
     */
    enqueue(item) {
        this.items.push(item);
    }

    /**
     * Dequeues and returns the item at the front of the queue.
     * @returns {Object|null}
     */
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift();
    }

    /**
     * Inspects the front element (current active player).
     * @returns {Object|null}
     */
    front() {
        return this.isEmpty() ? null : this.items[0];
    }

    /**
     * Inspects the rear element.
     * @returns {Object|null}
     */
    rear() {
        return this.isEmpty() ? null : this.items[this.items.length - 1];
    }

    /**
     * Cycles the front player to the rear to advance the turn.
     * FIFO transition: [P1, P2] -> dequeue(P1) -> enqueue(P1) -> [P2, P1]
     */
    rotate() {
        if (this.items.length > 1) {
            const current = this.dequeue();
            this.enqueue(current);
        }
    }

    /**
     * Reverses a cycle for Undo operations.
     */
    rotateBack() {
        if (this.items.length > 1) {
            const last = this.items.pop();
            this.items.unshift(last);
        }
    }

    /**
     * Checks if queue is empty.
     * @returns {boolean}
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * Returns total elements in queue.
     * @returns {number}
     */
    size() {
        return this.items.length;
    }

    /**
     * Returns elements as array.
     * @returns {Array}
     */
    toArray() {
        return [...this.items];
    }

    /**
     * Empties the queue.
     */
    clear() {
        this.items = [];
    }
}
