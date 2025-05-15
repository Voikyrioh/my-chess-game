import type {ChessPiece} from "./pieces/chess-piece.ts";
import type {Position} from "./position.ts";
import {Pawn} from "./pieces/pawn.ts";
import {Rook} from "./pieces/rook.ts";
import {Knight} from "./pieces/knight.ts";
import {Bishop} from "./pieces/bishop.ts";
import {Queen} from "./pieces/queen.ts";
import {King} from "./pieces/king.ts";

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

    setDefaultPieces() {
        this.#pieces = new Map([
            ...Pawn.DefaultPositions[this.type].map(pos => [pos, new Pawn(this.type, pos)] as [Position, ChessPiece]),
            ...Rook.DefaultPositions[this.type].map(pos => [pos, new Rook(this.type, pos)] as [Position, ChessPiece]),
            ...Knight.DefaultPositions[this.type].map(pos => [pos, new Knight(this.type, pos)] as [Position, ChessPiece]),
            ...Bishop.DefaultPositions[this.type].map(pos => [pos, new Bishop(this.type, pos)] as [Position, ChessPiece]),
            ...Queen.DefaultPositions[this.type].map(pos => [pos, new Queen(this.type, pos)] as [Position, ChessPiece]),
            ...King.DefaultPositions[this.type].map(pos => [pos, new King(this.type, pos)] as [Position, ChessPiece]),
        ]);
    }
}
