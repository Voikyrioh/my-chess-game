import {ChessPiece, type PieceMovements} from "./chess-piece.ts";
import {Position} from "../game/position.ts";
import {type Board} from "../game/board.ts";
import {Move} from "../game/move.ts";

export class Pawn extends ChessPiece {
    $canEatOnMove = false
    canBeEnPassant = false;

    constructor(color: "white" | "black", position: Position) {
        super(position, color, 'pawn');
        this.isActivated = true;
        if (color === 'white' && position.row === 7) {
            this.isActivated = false;
        } else if (color === 'black' && position.row === 2) {
            this.isActivated = false;
        }
    }

    getPieceBasicMovements(board: Board): PieceMovements {
        const possibleMoves = this.color === 'white' ?
            [this.position.add(-1,0)?.row !== 8 ? this.position.add(-1,0) : null, this.isActivated ? null : this.position.add(-2,0)] :
            [this.position.add(1,0)?.row !== 1 ? this.position.add(1,0) : null, this.isActivated ? null : this.position.add(2,0)];

        return possibleMoves.map((position) => position && this.$createMovement(board, position)).filter(p => p !== null);
    }

    getTakeMovements(board: Board): PieceMovements {
        const eatingMoves = this.color === 'white' ?
            [this.position.add(-1,1), this.position.add(-1,-1)] :
            [this.position.add(1,1) , this.position.add(1,-1)];

        return eatingMoves.filter(epos => epos !== null)
            .filter(epos => board.getFromPosition(epos) !== null && board.getFromPosition(epos)!.color !== this.color)
            .map((epos) => new Move(this.position, epos as Position, this, "TAKE", board.getFromPosition(epos!)!));
    }

    getPossibleMoves(board: Board): PieceMovements {
        return [
            ...this.getPieceBasicMovements(board),
            ...this.getTakeMovements(board)
        ]
    }
}
