import {ChessPiece, type PieceMovements} from "./chess-piece.ts";
import {Position} from "../position.ts";
import type {Board} from "../board.ts";

export class Queen extends ChessPiece {
    static DefaultPositions = {
        'black': [new Position('d', 8)],
        'white': [new Position('d', 1)]
    }

    constructor(color: "white" | "black", position: Position) {
        super(position, color, 'queen');
    }

    getPossibleMoves(board: Board): PieceMovements {
        return {
            possibleMoves: [
                ...this.$getDirectionalMoves(1, 1, board),
                ...this.$getDirectionalMoves(-1, 1, board),
                ...this.$getDirectionalMoves(1, -1, board),
                ...this.$getDirectionalMoves(-1, -1, board),
                ...this.$getDirectionalMoves(1, 0, board),
                ...this.$getDirectionalMoves(-1, 0, board),
                ...this.$getDirectionalMoves(0, 1, board),
                ...this.$getDirectionalMoves(0, -1, board)
            ],
            specialMoves: []
        };

    }
}
