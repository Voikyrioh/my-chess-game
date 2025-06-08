import {ChessPiece, type PieceMovements} from "./chess-piece.ts";
import {Position} from "../game/position.ts";
import {Move} from "../game/move.ts";
import type {Board} from "../game/board.ts";

export class King extends ChessPiece {
    static DefaultPositions = {
        'black': [new Position('e', 8)],
        'white': [new Position('e', 1)],
    }

    constructor(color: "white" | "black", position: Position) {
        super(position, color, 'king');
    }

    #checkSmallCastling(board: Board): Move | null {
        if (this.isActivated) return null;
        const piece = board.getFromPosition(this.position.add(0, 3)!);

        if (piece?.type === 'rook' && piece.color === this.color &&  !piece.isActivated) {
            const canMove = [1,2].map(place =>
                !board.getSquare(this.position.add(0,place)!)?.occupiedBy &&
                board.getSquare(this.position.add(0,place)!)?.menacedBy.filter(p => p.color !== this.color).length === 0
            ).every(value => value === true);
            if (!canMove) return null;
            return new Move(this.position, this.position.add(0, 2)!, this, "CASTLING", piece);
        }
        return null;
    }

    #checkBigCastling(board: Board): Move | null {
        if (this.isActivated) return null;
        const piece = board.getFromPosition(this.position.add(0, -4)!);
        if (!this.isActivated && piece?.type === 'rook' && piece.color === this.color &&  !piece.isActivated) {
            const canMove = [-1,-2,-3].map(place =>
                this.position.add(0,place) &&
                !board.getSquare(this.position.add(0,place)!)?.occupiedBy &&
                board.getSquare(this.position.add(0,place)!)?.menacedBy.filter(p => p.color !== this.color).length === 0
            ).every(value => value === true);
            if (!canMove) return null;
            return new Move(this.position, this.position.add(0, -2)!, this, "CASTLING", piece);
        }
        return null;
    }

    getPieceBasicMovements(board: Board): PieceMovements {
        return [
            this.position.add(1, 0),
            this.position.add(-1, 0),
            this.position.add(-1, 1),
            this.position.add(-1, -1),
            this.position.add(1, -1),
            this.position.add(1, 1),
            this.position.add(0, -1),
            this.position.add(0, 1),
        ]
            .map((position) => position && this.$createMovement(board, position))
            .filter(p => p !== null);
    }

    getPossibleMoves(board: Board): PieceMovements {
        return [
            ...this.getPieceBasicMovements(board),
            this.#checkBigCastling(board),
            this.#checkSmallCastling(board),
        ].filter(value => value !== null);
    }
}
