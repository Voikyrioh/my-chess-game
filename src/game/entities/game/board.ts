import type {Player} from "./player.ts";
import type {ChessPiece} from "../pieces/chess-piece.ts";
import type {Move} from "./move.ts";
import {Position} from "./position.ts";
import {BoardSquare} from "./board-square.ts";

export type boardRows = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type boardColumns = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';

export class Board {
    #board: Map<string, BoardSquare>;
    #history: Array<Move> = [];

    static #generateDefaultBoard(): Map<string, BoardSquare> {
        const tempBoard: Map<string, BoardSquare> = new Map();
        for (let x = 1; x <= 8; x++) {
            for (let y = 1; y <= 8; y++) {
                const pos = new Position(Position.columnFromNumber(x), y as boardRows);
                tempBoard.set(pos.toString(), new BoardSquare(pos));
            }
        }
        return tempBoard;
    }
    static initBoard(playerW: Player, playerB: Player): Board {
        const board = new Board(this.#generateDefaultBoard());
        playerW.setDefaultPieces();
        playerW.pieces.forEach((piece, pos) => { board.#board.get(pos.toString())!.occupiedBy = piece;})

        playerB.setDefaultPieces();
        playerB.pieces.forEach((piece, pos) => { board.#board.get(pos.toString())!.occupiedBy = piece;})

        return board;
    }

    private constructor(board: Map<string, BoardSquare> ) {
        this.#board = board;
    }

    static createFromBoardSquares(squares:  Map<string, BoardSquare>): Board {
        return new this(squares);
    }

    getFromPosition(pos: Position): ChessPiece | null {
        return this.#board.get(pos.toString())?.occupiedBy ?? null;
    }

    getSquare(pos: Position): BoardSquare | null {
        return this.#board.get(pos.toString()) ?? null;
    }

    executeMove(move: Move){
        this.#board.get(move.from.toString())!.occupiedBy = null;
        this.#board.get(move.to.toString())!.occupiedBy = move.piece;
        move.piece.moveTo(move.to);
        if (move.type === "CASTLING") {
            if(!move.target) throw new Error("Target is not defined");
            this.#board.get(move.target.position.toString())!.occupiedBy = null;
            const newPos = move.to.column === 'g' ? new Position('f', move.target.position.row) : new Position('d', move.target.position.row);
            if (!newPos) throw new Error("New position is not defined");
            this.#board.get(newPos.toString())!.occupiedBy = move.target;
        }
        this.#history.push(move);

        this.#calculateBoardState();
    }

    #calculateBoardState() {
        this.#board.forEach(square => { square.menacedBy = [] });
        this.#board.forEach(square => {
            if (square.occupiedBy) {
                square.occupiedBy.getPossibleMoves(this).filter(move => ["MOVE", "TAKE"].includes(move.type)).forEach(move => {
                    this.#board.get(move.to.toString())!.menacedBy.push(square.occupiedBy!)
                })
            }
        })
    }
}
