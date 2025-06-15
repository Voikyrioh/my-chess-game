import {ChessPiece, type PieceMovements} from "./chess-piece.ts";
import {Position} from "../game/position.ts";
import  {type Board} from "../game/board.ts";

export class Rook extends ChessPiece {
    constructor(color: "white" | "black", position: Position) {
        super(position, color, 'rook');
    }

    getPieceBasicMovements(board: Board): PieceMovements {
        return [
            ...this.$getDirectionalMoves(1, 0, board),
            ...this.$getDirectionalMoves(-1, 0, board),
            ...this.$getDirectionalMoves(0, 1, board),
            ...this.$getDirectionalMoves(0, -1, board)
        ]
            .map((position) => {
                //console.log(`rook checking ${position.toString()} : `, board.getFromPosition(position));
                return position && this.$createMovement(board, position);
            })
            .filter(p => p !== null)
    }
}
