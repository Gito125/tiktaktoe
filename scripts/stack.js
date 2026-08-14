/**
 * ============================================================================
 * DATA STRUCTURES AND ALIGORITHMS (2205 ST) — COURSEWORK PROJECT
 * File: scripts/stack.js
 * Description: Array-based Stack implementation (LIFO) based on lecture notes.
 * Reference: "stacks.pdf" (Ojiambo Samuel)
 * Authors: Precious, Gideon, Peter
 * ============================================================================
 */

/**
 * Stack Class (Array Representation)
 * ----------------------------------
 * As covered in the DSA lecture notes:
 * - "In the computer's memory, stacks can be represented as a linear array."
 * - "Every stack has a variable called TOP associated with it, which is used
 *    to store the address of the topmost element."
 * - "Underflow: TOP = -1 indicates that the stack is empty."
 * - "Overflow: TOP = MAX-1 indicates that the stack is full."
 */
export class Stack {
    /**
     * Constructs a fixed-capacity Stack.
     * @param {number} maxSize - Maximum capacity (MAX). Defaults to 9 for Tic-Tac-Toe.
     */
    constructor(maxSize = 9) {
        this.MAX = maxSize;
        this.items = new Array(maxSize).fill(null);
        this.TOP = -1; // Underflow sentinel per lecture specification
    }

    /**
     * PUSH Operation
     * Inserts an element on top of the stack after verifying overflow boundary.
     * Time Complexity: O(1)
     * 
     * @param {Object} element - Move record: { player, cellIndex, cellName, moveNumber }
     * @returns {boolean} True if pushed successfully, False if overflow occurred.
     */
    push(element) {
        // Overflow Check: if TOP === MAX - 1
        if (this.isFull()) {
            console.error('[Stack Overflow] Cannot push: Maximum capacity reached.');
            return false;
        }

        this.TOP++;
        this.items[this.TOP] = element;
        return true;
    }

    /**
     * POP Operation
     * Removes and returns the element at the TOP of the stack.
     * Time Complexity: O(1)
     * 
     * @returns {Object|null} The removed move record or null if underflow.
     */
    pop() {
        // Underflow Check: if TOP === -1
        if (this.isEmpty()) {
            console.warn('[Stack Underflow] Cannot pop: Stack is currently empty.');
            return null;
        }

        const poppedElement = this.items[this.TOP];
        this.items[this.TOP] = null; // Clean slot in array
        this.TOP--;
        return poppedElement;
    }

    /**
     * PEEK Operation
     * Inspects the element at the TOP of the stack without removing it.
     * Time Complexity: O(1)
     * 
     * @returns {Object|null} Element at items[TOP] or null if empty.
     */
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.TOP];
    }

    /**
     * Checks if stack is empty (Underflow state).
     * @returns {boolean}
     */
    isEmpty() {
        return this.TOP === -1;
    }

    /**
     * Checks if stack is full (Overflow state).
     * @returns {boolean}
     */
    isFull() {
        return this.TOP === this.MAX - 1;
    }

    /**
     * Returns current number of active elements in stack.
     * @returns {number}
     */
    size() {
        return this.TOP + 1;
    }

    /**
     * Returns an array slice containing active elements from bottom (index 0) to TOP.
     * Useful for visual rendering.
     * @returns {Array}
     */
    toArray() {
        return this.items.slice(0, this.TOP + 1);
    }

    /**
     * Resets the stack to initial empty state.
     */
    clear() {
        this.items.fill(null);
        this.TOP = -1;
    }
}
