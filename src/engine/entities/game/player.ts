import type {ChessPiece} from "../pieces/chess-piece.ts";
import type {Position} from "./position.ts";

export class Player {
    #pieces: Map<Position, ChessPiece> = new Map();
    took: Array<ChessPiece> = [];
    isChecked: boolean = false;
    public readonly type: 'white' | 'black'

    constructor(type: 'white' | 'black') {
        this.type = type;
    }

    set pieces(pieces: Map<Position, ChessPiece>) {
        this.#pieces = pieces;
    }

    get pieces(): Map<Position, ChessPiece> {
        return this.#pieces;
    }

    hasPiece(pos: Position): boolean {
        return [...this.#pieces].filter(([piecePos]) => piecePos.equals(pos))?.length === 1;
    }

    setPieces(pieces: Map<Position, ChessPiece>) {
        this.#pieces = pieces;
    }
}
