import type {Position} from "../game/position.ts";
import {Move} from "../game/move.ts";
import type {Board} from "../game/board.ts";

export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
export type PieceMovements = Array<Move>;

export abstract class ChessPiece {
    static DefaultPositions: Record<'white' | 'black', Array<Position>>;
    readonly type: PieceType;
    readonly color: 'white' | 'black';
    isActivated = false;
    $canEatOnMove = true;
    position: Position;

    constructor(position: Position, color: 'white' | 'black', type: PieceType ) {
        this.type = type;
        this.color = color;
        this.position = position;
    }

    getPossibleMoves(_: Board): PieceMovements {
        return [...this.getPieceBasicMovements(_)];
    };

    moveTo(position: Position) {
        this.isActivated = true;
        this.position = position;
    }

    $createMovement(board: Board, position: Position): Move | null {
        if (board.getFromPosition(position) === null) {
           return new Move(this.position, position, this, 'MOVE');
        } else {
            if (this.$canEatOnMove && board.getFromPosition(position)!.color !== this.color) {
                return new Move(this.position, position, this, 'TAKE', board.getFromPosition(position)!)
            }
            return null;
        }
    }

    getPieceBasicMovements(_: Board): PieceMovements {
        return [];
    }

    $getDirectionalMoves(xc: number, yc: number, board: Board): Array<Position> {
        const possibleMoves: Array<Position> = [];
        let x = xc;
        let y = yc;
        while(this.position.add(x, y) && (!possibleMoves.length || board.getFromPosition(possibleMoves[possibleMoves.length - 1]) === null)) {
            if (this.position.add(x, y) === null) break;
            possibleMoves.push(this.position.add(x, y) as Position);
            x += xc;
            y += yc;
        }

        return possibleMoves;
    }
}
