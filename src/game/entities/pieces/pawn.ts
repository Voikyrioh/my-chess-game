import {ChessPiece, type PieceMovements} from "./chess-piece.ts";
import {Position} from "../game/position.ts";
import {type Board} from "../game/board.ts";
import {Move} from "../game/move.ts";
import {Bishop} from "./bishop.ts";
import {Rook} from "./rook.ts";
import {Queen} from "./queen.ts";
import {Knight} from "./knight.ts";

export class Pawn extends ChessPiece {
    $canEatOnMove = false
    canBeEnPassant = false;

    constructor(color: "white" | "black", position: Position) {
        super(position, color, 'pawn');
        this.isActivated = true;
        if (color === 'white' && position.row === 7) {
            this.isActivated = false;
        } else if (color === 'black' && position.row === 2) {
            this.isActivated = false;
        }
    }

    promote(type: 'queen'|'knight'|'bishop'|'rook'): ChessPiece {
        switch (type) {
            case "bishop":
                return new Bishop(this.color, this.position);
            case "rook":
                return new Rook(this.color, this.position);
            case "queen":
                return new Queen(this.color, this.position);
            case "knight":
                return new Knight(this.color, this.position);
        }
    }

    #setPromotionMoves(move: Move): Move {
        if (move.piece.color === 'white' && move.to.row === 1) {
            return new Move(move.from, move.to, move.piece, move.type, undefined, true)
        } else if (move.piece.color === 'black' && move.to.row === 8) {
            return new Move(move.from, move.to, move.piece, move.type, undefined, true)
        } else {
            return move;
        }
    }

    #getEnPassant(board: Board): Move[] {
        const pieceOnRight: ChessPiece|null = this.position.add(0,1) && board.getFromPosition(this.position.add(0,1)!);
        const pieceOnLeft: ChessPiece|null = this.position.add(0,-1) && board.getFromPosition(this.position.add(0,-1)!);

        const enemyPawnOnRight: Pawn|null = pieceOnRight?.type === 'pawn' && pieceOnRight.color !== this.color ? pieceOnRight as Pawn : null;
        const enemyPawnOnLeft: Pawn|null = pieceOnLeft?.type === 'pawn' && pieceOnLeft.color !== this.color ? pieceOnLeft as Pawn : null;

        const pos: [Position | null, 'left'|'right'][] = this.color === 'white' ?
            [
                [enemyPawnOnRight?.canBeEnPassant ? this.position.add(-1,1) : null, 'right'],
                [enemyPawnOnLeft?.canBeEnPassant ? this.position.add(-1,-1) : null, 'left']
            ] :
            [
                [enemyPawnOnRight?.canBeEnPassant ? this.position.add(1,1) : null, 'right'],
                [enemyPawnOnLeft?.canBeEnPassant ? this.position.add(1,-1) : null, 'left']
            ];

        return pos
            .filter(([pos, _]) => pos !== null)
            .map(([pos, side]) => new Move(this.position, pos!, this, "EN_PASSANT", side === 'right' ? enemyPawnOnRight! : enemyPawnOnLeft!));
    }

    moveTo(position: Position) {
        this.isActivated = true;
        if (Math.abs(position.row - this.position.row) === 2) {
            this.canBeEnPassant = true;
        } else  {
            this.canBeEnPassant = false;
        }
        this.position = position;
    }

    getPieceBasicMovements(board: Board): PieceMovements {
        const possibleMoves = this.color === 'white' ?
            [
                this.position.add(-1,0),
                this.isActivated ? null : this.position.add(-2,0)
            ] :
            [
                this.position.add(1,0),
                this.isActivated ? null : this.position.add(2,0)
            ];


        return possibleMoves
            .map((position) => position && this.$createMovement(board, position))
            .filter(p => p !== null);
    }

    getTakeMovements(board: Board): PieceMovements {
        const eatingMoves = this.color === 'white' ?
            [this.position.add(-1,1), this.position.add(-1,-1)] :
            [this.position.add(1,1) , this.position.add(1,-1)];

        return eatingMoves.filter(epos => epos !== null)
            .filter(epos => board.getFromPosition(epos) !== null && board.getFromPosition(epos)!.color !== this.color)
            .map((epos) => new Move(this.position, epos as Position, this, "TAKE", board.getFromPosition(epos!)!));
    }

    getPossibleMoves(board: Board): PieceMovements {
        return [
            ...this.getPieceBasicMovements(board),
            ...this.getTakeMovements(board),
            ...this.#getEnPassant(board),
        ].map(this.#setPromotionMoves);
    }
}
