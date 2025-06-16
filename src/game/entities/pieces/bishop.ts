import {ChessPiece, type PieceMovements} from "./chess-piece.ts";
import {Position} from "../game/position.ts";
import  {type Board} from "../game/board.ts";

export class Bishop extends ChessPiece {

    constructor(color: "white" | "black", position: Position) {
        super(position, color, 'bishop');
    }

    getPieceBasicMovements(board: Board): PieceMovements {
        return [
            ...this.$getDirectionalMoves(1, 1, board),
            ...this.$getDirectionalMoves(-1, 1, board),
            ...this.$getDirectionalMoves(1, -1, board),
            ...this.$getDirectionalMoves(-1, -1, board)
        ]
            .map((position) => position && this.$createMovement(board, position))
            .filter(p => p !== null);
    }
}
