import type {Move} from "./move.ts";

export class History {
    #moves: Map<Date, Move> = new Map();

    constructor() {}

    addMove(move: Move ) {
        this.#moves.set(new Date(), move);
    }

    getLastMove(): Move | null {
        return [...this.#moves.values()].reverse()[0];
    }
}
