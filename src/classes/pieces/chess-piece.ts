import type {Position} from "../position.ts";
import type {Move} from "../Move.ts";
import type {Board} from "../board.ts";

export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
export interface PieceMovements {
    possibleMoves: Array<Position>;
    specialMoves: Array<Move>;
}

export abstract class ChessPiece {
    static DefaultPositions: Record<'white' | 'black', Array<Position>>;
    readonly type: PieceType;
    readonly color: 'white' | 'black';
    isActivated = false;
    position: Position;

    constructor(position: Position, color: 'white' | 'black', type: PieceType ) {
        this.type = type;
        this.color = color;
        this.position = position;
    }

    getPossibleMoves(_: Board): PieceMovements {
        return {
            possibleMoves: [],
            specialMoves: []
        };
    };

    moveTo(position: Position) {
        this.isActivated = true;
        this.position = position;
    }

    $getDirectionalMoves(xc: number, yc: number, board: Board): Array<Position> {
        const possibleMoves: Array<Position> = [];
        let x = 1 * xc;
        let y = 1 * yc;
        while(this.position.add(x, y) && board.getFromPosition(this.position.add(x,y)!) === null) {
            possibleMoves.push(this.position.add(x, y) as Position);
            x += xc;
            y += yc;
        }

        return possibleMoves;
    }
}
