import {Board} from "./entities/game/board.ts";
import type {Player} from "./entities/game/player.ts";
import type {ChessPiece, PieceMovements} from "./entities/pieces/chess-piece.ts";
import type {Position} from "./entities/game/position.ts";
import type {Move} from "./entities/game/move.ts";

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
        return true;
    }

    play(move: Move) {
        if (this.#isPiecePlayable(move.piece)) {
            this.#board.executeMove(move);
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

    getPieceFromPosition(position: Position) {
        return this.#board.getFromPosition(position);
    }

    getPossibleMoves(piece: ChessPiece): PieceMovements {
        if (piece.color !== this.#turn.type) return [];
        return piece.getPossibleMoves(this.#board);
    }
}
