import {Board, Player, Position, Move} from "./entities";
import type {ChessPiece, PieceMovements} from "./entities/pieces/chess-piece.ts";
import {FenNotation} from "./entities/game/fen-notation.ts";
import {simulateMove} from "./simulation.ts";

export class Gameplay {
    #playerWhite: Player;
    #playerBlack: Player;
    #board: Board;
    #turn: Player;
    #checkmate: 'black'|'white'|null = null;
    #stalemate: boolean = false;

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
            this.#handleCheckmate()
            if (this.#checkmate) return;
            this.#turn = this.#turn === this.#playerWhite ? this.#playerBlack : this.#playerWhite;
            this.#handleStalemate()
        } else {
            console.error('not playable', {
                rightTurn: move.piece.color === this.#turn.type,
                isChecked: this.#turn.isChecked,
                hasPiece: this.#turn.hasPiece(move.piece.position),
                move
            });
        }
    }

    get checkmate(): 'black'|'white'|null {
        return this.#checkmate;
    }

    get stalemate(): boolean {
        return this.#stalemate;
    }

    get turn(): 'black'|'white' {
        return this.#turn.type;
    }

    getPieceFromPosition(position: Position) {
        return this.#board.getFromPosition(position);
    }

    getPossibleMoves(piece: ChessPiece): PieceMovements {
        if (this.#checkmate || this.#stalemate) return [];
        if (piece.color !== this.#turn.type) return [];
        return piece.getPossibleMoves(this.#board).filter(move => {
            return simulateMove(this.#board, move).check !== this.#turn.type
        });
    }

    #handleStalemate() {
        if (!this.#checkmate) {
            const playerPossibleMoves = [...this.#board.getPlayerPieces(this.#turn.type).values()].map(piece => {
                return piece.getPossibleMoves(this.#board).filter(move => simulateMove(this.#board, move).check !== this.#turn.type)
            });
            if (!playerPossibleMoves.flat().length) {
                this.#stalemate = true;
            } else {
                const history = [...this.#board.history];
                const shortHistory = history.slice(history.length - 6);
                if (shortHistory.find(move => move.type !== "MOVE")) {
                    return;
                }
                shortHistory.map(move => `${move.piece.type}${move.from.toString()}${move.to.toString()}`)

                if (history.length > 50) {
                    const longHistory = history.slice(history.length - 50);
                    if (!longHistory.find(move => move.type !== "MOVE")) {
                        this.#stalemate = true;
                        return;
                    }
                }

            }
        }
    }

    #handleCheckmate() {
        if (this.#board.check) {
            const possibleMoves =[...this.#board.getPlayerPieces(this.#board.check).values()]
            .map(piece =>
                piece.getPossibleMoves(this.#board)
                    .filter(move => simulateMove(this.#board, move).check !== this.#board.check)
            )
            .flat();
            if (!possibleMoves.length) {
                this.#checkmate = this.#turn.type;
            }
        }
    }
}
