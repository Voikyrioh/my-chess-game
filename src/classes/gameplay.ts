import {Board} from "./board.ts";
import type {Player} from "./player.ts";
import type {ChessPiece} from "./pieces/chess-piece.ts";
import type {Position} from "./position.ts";

export class Gameplay {
    #playerWhite: Player;
    #playerBlack: Player;
    #board: Board;
    #turn: Player;

    constructor(playerWhite: Player, playerBlack: Player) {
        this.#playerWhite = playerWhite;
        this.#playerBlack = playerBlack;
        this.#turn = playerWhite;
        this.#board = Board.initBoard(playerWhite, playerBlack);
    }

    #isPiecePlayable(chessPiece: ChessPiece): boolean {
        if (chessPiece.color !== this.#turn.type) return false;
        if (this.#turn.isChecked) return false;
        return this.#turn.hasPiece(chessPiece.position);
    }

    play(chessPiece: ChessPiece, pos: Position) {
        if (this.#isPiecePlayable(chessPiece)) {
            this.#board.setForPosition(chessPiece, pos);
            this.#turn = this.#turn === this.#playerWhite ? this.#playerBlack : this.#playerWhite;
        }
    }

    getPieceFromPosition(position: Position) {
        return this.#board.getFromPosition(position);
    }

    getPossibleMoves(piece: ChessPiece): Array<Position> {
        return piece.getPossibleMoves(this.#board).possibleMoves;
    }
}
