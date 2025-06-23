import {Board,type boardRows} from "./board.ts";
import {BoardSquare} from "./board-square.ts";
import {Position} from "./position.ts";
import type {ChessPiece} from "../pieces/chess-piece.ts";
import {Rook} from "../pieces/rook.ts";
import {Knight} from "../pieces/knight.ts";
import {Bishop} from "../pieces/bishop.ts";
import {King} from "../pieces/king.ts";
import {Pawn} from "../pieces/pawn.ts";
import {Queen} from "../pieces/queen.ts";

interface Fen {
    rows: string;
    trait_to: string;
    castles: string;
    en_passant: string;
    white_plays: number;
    black_plays: number;
}
type fenErrors = "FEN_ERROR" | "INVALID_FEN_STRING" | "INVALID_ROWS";
export class FenError extends Error {
    name: string = 'FEN_ERROR';
    readonly type: fenErrors = 'FEN_ERROR';
    constructor(errorType: fenErrors, msg: string) {
        super(msg);
        this.type = errorType;
    }
}

const FEN_REGEX = /^(?<rows>(?:(?:[1-8rnbqkpRNBQKP])+\/){7}[1-8rnbqkpRNBQKP]+) (?<trait_to>w|b) (?<castles>-|(?:K?Q?k?q?)) (?<en_passant>-|(?:[a-h][1-8])+) (?<white_plays>\d+) (?<black_plays>\d+)$/;

export class FenNotation {
    readonly fenString: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    readonly parsed: Fen;

    constructor(fenString?: string) {
        if (fenString) {
            const fen = this.getFenJson(fenString);
            this.parsed = fen;
            this.fenString = fenString;
        } else this.parsed = this.getFenJson(this.fenString);
    }

    private getFenJson(fenString: string): Fen {
        const fen = FEN_REGEX.exec(fenString);
        if (fen && fen.groups) {
            this.rowsValidations(fen.groups as unknown as Fen);
            return fen.groups as unknown as Fen;
        }

        throw new FenError('INVALID_FEN_STRING' ,'Invalid FEN string');
    }

    private rowsValidations(fen: Fen) {
        const kings = fen.rows.split('').filter(c => c==='k' || c==='K');
        if (kings.length !== 2 || !(kings.includes('k') && kings.includes('K'))) throw new FenError("INVALID_ROWS", 'should have one king per side');
        const fenRows = fen.rows.split('/');
        for (const row of fenRows) {
            let columns = 0;
            row.split('').forEach(column => {
                if (Number.isNaN(parseInt(column))) {
                    columns++;
                } else {
                    columns += parseInt(column);
                }
            });

            if (columns !== 8) throw new FenError("INVALID_ROWS", 'Too many columns in rows');
        }
    }

    private getChessPiece(char: string, pos: Position): ChessPiece {
        switch (char) {
            case 'R':
            case 'r': return new Rook(char === 'R' ? "white" : "black", pos);
            case 'N':
            case 'n': return new Knight(char === 'N' ? "white" : "black", pos);
            case 'B':
            case 'b': return new Bishop(char === 'B' ? "white" : "black", pos);
            case 'K':
            case 'k':
                if (char === 'K') return new King('white', pos, !(this.parsed.castles.split('').filter(cas => ['K','Q'].includes(cas)).length > 0));
                else return new King('black', pos, !(this.parsed.castles.split('').filter(cas => ['k','q'].includes(cas)).length > 0));
            case 'P':
            case 'p': return new Pawn(char === 'P' ? "white" : "black", pos);
            case 'Q':
            case 'q': return new Queen(char === 'Q' ? "white" : "black", pos);
            default: throw new FenError('INVALID_ROWS' ,'Invalid char in rows');
        }
    }

    private generateBoardSquares(): Map<string, BoardSquare> {
        const squares: Map<string, BoardSquare> = new Map();

        this.parsed.rows.split('/').forEach((row, indexRow) => { //4r1k1/p1p2pp1/1q1p3p/1P3P2/1P6/2n1Q3/PB4PP/4R1K1 w - - 0 1
            let colCount = 1;
            row.split('').forEach((column) => {
                if(parseInt(column)) {
                    for (let j = 0; j < parseInt(column); j++) {
                        const pos = new Position(Position.columnFromNumber(colCount), indexRow+1 as unknown as boardRows);
                        squares.set(pos.toString(), new BoardSquare(pos));
                        colCount++;
                    }
                } else {
                    const pos = new Position(Position.columnFromNumber(colCount), indexRow+1 as unknown as boardRows);
                    const square = new BoardSquare(pos);
                    square.occupiedBy = this.getChessPiece(column, pos);
                    squares.set(pos.toString(), square);
                    colCount++;
                }
            })
        });

        return squares;
    }

    generateBoard(): Board {
        return Board.createFromBoardSquares(this.generateBoardSquares())
    }

    static fromBoard(_board: Board): FenNotation {
        return new FenNotation();
    }
}
