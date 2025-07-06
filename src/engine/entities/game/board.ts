import type {ChessPiece} from "../pieces/chess-piece.ts";
import type {Move} from "./move.ts";
import {Position} from "./position.ts";
import {BoardSquare} from "./board-square.ts";

export type boardRows = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type boardColumns = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';

export class Board {
    $board: Map<string, BoardSquare>;
    $history: Array<Move> = [];
    $check: 'white'|'black'|null = null;
    $checkedBy: Position[] = [];

    protected constructor(board: Map<string, BoardSquare> ) {
        this.$board = board;
        this.$calculateBoardState();
    }

    static createFromBoardSquares(squares:  Map<string, BoardSquare>): Board {
        return new this(squares);
    }

    get check(): 'white'|'black'|null {
        return this.$check;
    }

    getFromPosition(pos: Position): ChessPiece | null {
        return this.$board.get(pos.toString())?.occupiedBy ?? null;
    }

    getSquare(pos: Position): BoardSquare | null {
        return this.$board.get(pos.toString()) ?? null;
    }

    executeMove(move: Move){
        this.$board.get(move.from.toString())!.occupiedBy = null;
        this.$board.get(move.to.toString())!.occupiedBy = move.piece;
        move.piece.moveTo(move.to);

        if (move.type === "CASTLING") {
            if(!move.target) throw new Error("Target is not defined");
            this.$board.get(move.target.position.toString())!.occupiedBy = null;
            const newPos = move.to.column === 'g' ? new Position('f', move.target.position.row) : new Position('d', move.target.position.row);
            if (!newPos) throw new Error("New position is not defined");
            this.$board.get(newPos.toString())!.occupiedBy = move.target;
            move.target.moveTo(newPos);
        }

        if (move.promoteMovement && move.target) {
            this.$board.get(move.to.toString())!.occupiedBy = move.target;
            move.target.moveTo(move.to);
        }

        if (move.type === "EN_PASSANT") {
            if(!move.target) throw new Error("Target is not defined");
            this.$board.get(move.target.position.toString())!.occupiedBy = null
        }

        this.#clearEnPassant()
        if (move.piece.type === 'pawn' && Math.abs(move.from.row - move.to.row) === 2) {
            const enPassantCase = move.to.add((move.from.row - move.to.row)/2, 0)!.toString()
            this.$board.get(enPassantCase)!.canBeEnPassant = !this.$board.get(enPassantCase)!.occupiedBy;
        }

        this.$history.push(move);

        this.$calculateBoardState();
    }

    $calculateBoardState() {
        this.$board.forEach(square => { square.menacedBy = [] });
        this.$board.forEach(square => {
            if (square.occupiedBy) {
                square.occupiedBy.getPossibleMoves(this).filter(move => ["MOVE", "TAKE"].includes(move.type)).forEach(move => {
                    this.$board.get(move.to.toString())!.menacedBy.push(square.occupiedBy!)
                })
            }
        })
        this.$check = null;
        this.getKingsSquares().forEach(square => {
            if (square.menacedBy.filter(piece => piece.color !== square.occupiedBy!.color).length > 0) {
                this.$check = square.occupiedBy!.color;
                this.$checkedBy = square.menacedBy.filter(piece => piece.color !== square.occupiedBy!.color).map(piece => piece.position)
            }
        })
    }

    getKingsSquares(): BoardSquare[] {
        return [...this.$board.values()].filter(c => c.occupiedBy?.type === "king");
    }

    getPlayerPieces(type: "white" | "black"): Map<Position, ChessPiece> {
        const pieces:  Map<Position, ChessPiece> = new Map();

         [...this.$board.values()].filter(c => c.occupiedBy?.color === type).forEach(c => {
             pieces.set(c.position, c.occupiedBy!)
        });

        return pieces;
    }

    export(): Map<string, BoardSquare> {
        return new Map([...this.$board.entries()].map(([_, square]) => [_, Object.assign({}, square)]));
    }

    #clearEnPassant() {
        this.$board.forEach(square => {
            if (square.canBeEnPassant) {
                square.canBeEnPassant = false;
            }
        })
    }
}
