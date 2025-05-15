import type {Player} from "./player.ts";
import type {Position} from "./position.ts";
import type {ChessPiece} from "./pieces/chess-piece.ts";

export type boardRows = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type boardColumns = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type BoardTemplate = Record<boardColumns, Record<boardRows, ChessPiece | null>>;

export class Board {
    static readonly DEFAULT_BOARD: BoardTemplate = {
        ['a']: {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null},
        ['b']: {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null},
        ['c']: {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null},
        ['d']: {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null},
        ['e']: {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null},
        ['f']: {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null},
        ['g']: {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null},
        ['h']: {1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null},
    };
    #board: BoardTemplate;

    static initBoard(playerW: Player, playerB: Player): Board {
        const board = new Board(this.DEFAULT_BOARD);
        playerW.setDefaultPieces();
        playerW.pieces.forEach((piece, pos) => {board.#board[pos.column][pos.row] = piece;})

        playerB.setDefaultPieces();
        playerB.pieces.forEach((piece, pos) => {board.#board[pos.column][pos.row] = piece;})

        return board;
    }

    private constructor(board: BoardTemplate) {
        this.#board = board;
    }

    getFromPosition(pos: Position): ChessPiece | null {
        return this.#board[pos.column][pos.row];
    }

    setForPosition(piece: ChessPiece, pos: Position) {
        this.#board[piece.position.column][piece.position.row] = null;
        piece.moveTo(pos);
        this.#board[pos.column][pos.row] = piece;
    }
}
