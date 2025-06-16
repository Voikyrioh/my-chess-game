import {Board} from "./entities/game/board.ts";
import {Player} from "./entities/game/player.ts";
import type {ChessPiece, PieceMovements} from "./entities/pieces/chess-piece.ts";
import type {Position} from "./entities/game/position.ts";
import type {Move} from "./entities/game/move.ts";
import {FenNotation} from "./entities/game/fen-notation.ts";
import {simulateMove} from "../tools/simulation.ts";

export class Gameplay {
    #playerWhite: Player;
    #playerBlack: Player;
    #board: Board;
    #turn: Player;
    #checkmate: boolean = false;

    constructor(fenString?: string) {
        const fen = new FenNotation(fenString);

        this.#playerWhite = new Player('white');
        this.#playerBlack = new Player('black');
        this.#turn = fen.parsed.trait_to === 'w' ? this.#playerWhite : this.#playerBlack;
        this.#board = fen.generateBoard();

        this.#playerWhite.setPieces(this.#board.getPlayerPieces(this.#playerWhite.type));
        this.#playerBlack.setPieces(this.#board.getPlayerPieces(this.#playerBlack.type));
    }

    #isPiecePlayable(chessPiece: ChessPiece): boolean {
        if (chessPiece.color !== this.#turn.type) return false;
        return true;
    }

    play(move: Move) {
        const simulatedMove = simulateMove(this.#board, move);
        if (this.#isPiecePlayable(move.piece) && simulatedMove.check !== this.#turn.type) {
            if (this.#board.check && this.#board.check === simulatedMove.check) {
                return;
            }
            this.#board.executeMove(move);
            if (this.#board.check) {
                const possibleMoves =[...this.#board.getPlayerPieces(this.#board.check).values()]
                    .map(piece => piece.getPossibleMoves(this.#board)
                        .filter(move => simulateMove(this.#board, move).check !== this.#board.check)
                    )
                    .flat();
                console.log("moves: ", possibleMoves);
                if (!possibleMoves.length) {
                    this.#checkmate = true;
                }
            }

            this.#turn = this.#turn === this.#playerWhite ? this.#playerBlack : this.#playerWhite;
        } else {
            console.error('not playable', {
                rightTurn: move.piece.color === this.#turn.type,
                isChecked: this.#turn.isChecked,
                hasPiece: this.#turn.hasPiece(move.piece.position),
                move
            });
        }
    }

    get checkmate(): boolean {
        return this.#checkmate;
    }

    getPieceFromPosition(position: Position) {
        return this.#board.getFromPosition(position);
    }

    getPossibleMoves(piece: ChessPiece): PieceMovements {
        if (this.#checkmate) return [];
        if (piece.color !== this.#turn.type) return [];
        return piece.getPossibleMoves(this.#board).filter(move => {
            return simulateMove(this.#board, move).check !== this.#turn.type
        });
    }

    getCheck() {
        return this.#board.check
    }
}
