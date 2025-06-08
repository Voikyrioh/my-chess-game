import {ChessPiece, type PieceMovements} from "./chess-piece.ts";
import {Position} from "../game/position.ts";
import {type Board} from "../game/board.ts";
import {Move} from "../game/move.ts";

export class Pawn extends ChessPiece {
    $canEatOnMove = false
    static DefaultPositions = {
        'black': [
            new Position('a', 7),
            new Position('b', 7),
            new Position('c', 7),
            new Position('d', 7),
            new Position('e', 7),
            new Position('f', 7),
            new Position('g', 7),
            new Position('h', 7)
        ],
        'white': [
            new Position('a', 2),
            new Position('b', 2),
            new Position('c', 2),
            new Position('d', 2),
            new Position('e', 2),
            new Position('f', 2),
            new Position('g', 2),
            new Position('h', 2)
        ],
    };

    constructor(color: "white" | "black", position: Position) {
        super(position, color, 'pawn');
    }

    getPieceBasicMovements(board: Board): PieceMovements {
        const possibleMoves = this.color === 'white' ?
            [this.position.add(1,0)?.row !== 8 ? this.position.add(1,0) : null, this.isActivated ? null : this.position.add(2,0)] :
            [this.position.add(-1,0)?.row !== 1 ? this.position.add(-1,0) : null, this.isActivated ? null : this.position.add(-2,0)];

        return possibleMoves.map((position) => position && this.$createMovement(board, position)).filter(p => p !== null);
    }

    getTakeMovements(board: Board): PieceMovements {
        const eatingMoves = this.color === 'white' ?
            [this.position.add(1,1), this.position.add(1,-1)] :
            [this.position.add(-1,-1) , this.position.add(-1,-1)];

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
