import {ChessPiece, type PieceMovements} from "./chess-piece.ts";
import { Position } from "../position.ts";

export class Knight extends ChessPiece {
    static DefaultPositions = {
        'black': [ new Position('b', 8), new Position('g', 8) ],
        'white': [ new Position('b', 1), new Position('g', 1) ],
    }

    constructor(color: "white" | "black", position: Position) {
        super(position, color, 'knight');
    }

    getPossibleMoves(): PieceMovements {
        return {
            possibleMoves: [
                this.position.add(1 , 2),
                this.position.add(2, 1),
                this.position.add(-1 , -2),
                this.position.add(-2, -1),
                this.position.add(-1, 2),
                this.position.add(1, -2),
                this.position.add(-2, 1),
                this.position.add(2, -1),
            ].filter(p => p !== null),
            specialMoves: []
        }
    }
}
