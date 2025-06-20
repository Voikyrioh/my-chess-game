import {ChessPiece, type PieceMovements} from "./chess-piece.ts";
import { Position } from "../game/position.ts";
import  {type Board} from "../game/board.ts";

export class Knight extends ChessPiece {

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
