import {ChessPiece, type PieceMovements} from "./chess-piece.ts";
import {Position} from "../position.ts";

export class Pawn extends ChessPiece {
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

    getPossibleMoves(): PieceMovements {
        const possibleMoves = this.color === 'white' ?
            [this.position.add(1,0) , this.isActivated ? null : this.position.add(2,0)] :
            [this.position.add(-1,0), this.isActivated ? null : this.position.add(-2,0)];

        return {
            possibleMoves: possibleMoves.filter(v => v !== null),
            specialMoves: []
        };
    }
}
