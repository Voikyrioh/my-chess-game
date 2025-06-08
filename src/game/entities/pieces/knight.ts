import {ChessPiece, type PieceMovements} from "./chess-piece.ts";
import { Position } from "../game/position.ts";
import  {type Board} from "../game/board.ts";

export class Knight extends ChessPiece {
    static DefaultPositions = {
        'black': [ new Position('b', 8), new Position('g', 8) ],
        'white': [ new Position('b', 1), new Position('g', 1) ],
    }

    constructor(color: "white" | "black", position: Position) {
        super(position, color, 'knight');
    }

    getPieceBasicMovements(board: Board): PieceMovements {
        return [
            this.position.add(1 , 2),
            this.position.add(2, 1),
            this.position.add(-1 , -2),
            this.position.add(-2, -1),
            this.position.add(-1, 2),
            this.position.add(1, -2),
            this.position.add(-2, 1),
            this.position.add(2, -1),
        ]
            .map((position) => position && this.$createMovement(board, position))
            .filter(p => p !== null);
    }
}
