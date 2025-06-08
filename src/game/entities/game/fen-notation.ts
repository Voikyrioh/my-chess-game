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

const FEN_REGEX = /^(?<rows>(?:(?:[1-8rnbqkpRNBQKP])+\/){7}[1-8rnbqkpRNBQKP]+) (?<traitTo>w|b) (?<castles>K?Q?k?q?) (?<en_passant>-|(?:[a-h][1-8])+) (?<white_plays>\d+) (?<black_plays>\d+)$/gm

export class FenNotation {
    readonly fenString: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    private fen: Fen;

    constructor(fenString?: string) {
        if (fenString) {
            const fen = this.getFenJson(fenString);
            this.fen = fen;
            this.fenString = fenString;
        } else this.fen = this.getFenJson(this.fenString);
    }

    private getFenJson(fenString: string): Fen {
        const fen = FEN_REGEX.exec(fenString)?.groups as unknown as Fen|undefined;
        if (fen) {
            this.rowsValidations(fen);
            return fen ;
        }

        throw new Error('Invalid FEN string');
    }

    private rowsValidations(fen: Fen) {
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

            if (columns !== 8) throw new Error('Invalid FEN string');
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
            case 'k': return new King(char === 'K' ? "white" : "black", pos);
            case 'P':
            case 'p': return new Pawn(char === 'P' ? "white" : "black", pos);
            case 'Q':
            case 'q': return new Queen(char === 'Q' ? "white" : "black", pos);
            default: throw new Error('Invalid FEN string');
        }
    }

    private generateBoardSquares(): Map<string, BoardSquare> {
        const squares: Map<string, BoardSquare> = new Map();

        for (const [row, indexRow] of this.fen.rows.split('/')) {
            row.split('').forEach((column, indexCol) => {
                const pos = new Position(Position.columnFromNumber(indexCol), indexRow as unknown as boardRows);
                if(parseInt(column)) {
                    for (let j = 0; j < parseInt(column); j++) {
                        squares.set(pos.toString(), new BoardSquare(pos));
                    }
                } else {
                    const square = new BoardSquare(pos);
                    square.occupiedBy = this.getChessPiece(column, pos);
                    squares.set(pos.toString(), square);
                }
            })
        }

        return squares;
    }

    generateBoard(): Board {
        return Board.createFromBoardSquares(this.generateBoardSquares())
    }

    static fromBoard(_board: Board): FenNotation {
        return new FenNotation();
    }
}
