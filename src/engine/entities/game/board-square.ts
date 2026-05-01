import type {Position} from "./position.ts";
import type {ChessPiece} from "../pieces/chess-piece.ts";

export class BoardSquare {
    readonly position: Position;
    occupiedBy: ChessPiece | null = null;
    menacedBy: ChessPiece[] = [];
    canBeEnPassant = false;

    constructor(position: Position) {
        this.position = position;
    }
}
