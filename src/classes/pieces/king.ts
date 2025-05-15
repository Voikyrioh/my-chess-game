import {ChessPiece, type PieceMovements} from "./chess-piece.ts";
import {Position} from "../position.ts";
import {Move} from "../Move.ts";
import type {Board} from "../board.ts";

export class King extends ChessPiece {
    static DefaultPositions = {
        'black': [new Position('e', 8)],
        'white': [new Position('e', 1)],
    }

    constructor(color: "white" | "black", position: Position) {
        super(position, color, 'king');
    }

    #checkSmallCastling(board: Board): Move | null {
        const piece = board.getFromPosition(this.position.add(0, 3)!);
        if (piece !== null && piece.color === this.color && piece.type === 'rook' && !piece.isActivated) return new Move( this.position, this.position.add(0, -2)!, this, "CASTLING" );
        return null;
    }

    #checkBigCastling(board: Board): Move | null {
        const piece = board.getFromPosition(this.position.add(0, -4)!);
        if (piece !== null && piece.color === this.color && piece.type === 'rook' && !piece.isActivated) return new Move( this.position, this.position.add(0, 2)!, this, "CASTLING" );
        return null;
    }

    getPossibleMoves(board: Board): PieceMovements {
        return {
            possibleMoves: [
                this.position.add(1, 0),
                this.position.add(-1, 0),
                this.position.add(-1, 1),
                this.position.add(-1, -1),
                this.position.add(1, -1),
                this.position.add(1, 1),
                this.position.add(0, -1),
                this.position.add(0, 1),
            ].filter(p => p !== null),
            specialMoves: this.isActivated ? [] :
                [
                    this.#checkBigCastling(board),
                    this.#checkSmallCastling(board),
                ].filter(value => value !== null)
        };
    }
}
