import {type Move, type Pawn, Position} from "../../engine";
import type {ChessPiece, Gameplay, boardColumns, boardRows} from "../../engine";
import pieceAssets from "./assets/html-pieces-assets.ts";
import modal from "./modals";
import {PieceDragAndDropEvent} from "./events/piece-drag-and-drop.event.ts";
import {getCursorPos} from "../../tools/get-cursor-pos.ts";
import {PieceTouchEvent} from "./events/touch.event.ts";
import {detectDevice} from "../../tools/detect-device.ts";

export class GameHTML {
    static readonly colRefs = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

    #game: Gameplay;
    #htmlCases = new Map<string, HTMLDivElement>();
    #touchEvent: PieceTouchEvent | null = null;

    private constructor(game: Gameplay) {
        this.#game = game;
    }

    private registerGlobalEvents() {
        this.#registerTouchEvent();
    }

    private init(app: HTMLDivElement) {
        for (let r = 1; r <= 8; r++) {
            for (let c = 1; c <= 8; c++) {
                const ca = document.createElement('div');
                ca.classList.add('case');
                ca.classList.add((r + c) % 2 === 0 ? 'white' : 'black');
                ca.id = `${r}${GameHTML.colRefs[c - 1]}`;
                this.#htmlCases.set(new Position(GameHTML.colRefs[c-1] as boardColumns, r as boardRows).toString(), ca);
                app.appendChild(ca);
            }
        }

        this.registerGlobalEvents()
    }

    #getGameAssetFromPosition(pos: Position): string|null {
        const piece = this.#game.getPieceFromPosition(pos);
        if (!piece) return '';
        switch (piece.type) {
            case 'pawn': return pieceAssets[piece.color].pawn;
            case 'rook': return pieceAssets[piece.color].rook;
            case 'knight': return pieceAssets[piece.color].knight;
            case 'bishop': return pieceAssets[piece.color].bishop;
            case 'queen': return pieceAssets[piece.color].queen;
            case 'king': return pieceAssets[piece.color].king;
            default: return null;
        }
    }

    promote(piece: Pawn): Promise<ChessPiece> {
        return new Promise<ChessPiece>((resolve) => {
            getCursorPos().then(pos => {
                modal.promoteModal(piece.color, pos, (value: 'queen'|'knight'|'bishop'|'rook') => {
                    resolve(piece.promote(value))
                }).open();
            })

        })
    }

    movePiece(move: Move) {
        this.defaultClick();
        if (move.promoteMovement && move.piece.type === 'pawn' && !move.target) {
           this.promote(move.piece as Pawn).then(piece => {
               this.#game.play(move.promote(piece) ?? move);
               this.#render();
           })
        } else {
            this.#game.play(move);
            this.#render();
        }
    }

    defaultClick() {
        this.#htmlCases.forEach((p) => {
            if (p.classList.contains('possible-move')) {
                p.classList.remove('possible-move');
                p.classList.remove('take');
                p.classList.remove('castling');
                p.onclick = null;
            }
        })
    }

    renderPossibleMoves(piece: ChessPiece): Move[] {
        this.defaultClick();
        const possibleMoves: Move[] =  this.#game.getPossibleMoves(piece);
        possibleMoves.forEach(move => {
            const ca = this.#htmlCases.get(move.to.toString());
            if (ca) {
                ca.classList.add('possible-move');
                if (['TAKE', 'EN_PASSANT'].includes(move.type)) {
                    ca.classList.add('take');
                }
                if (move.type === "CASTLING") {
                    ca.classList.add('castling');
                }
            }
        });
        return possibleMoves;
    }

    #render() {
        this.#htmlCases.forEach((p, pos) => {
            p.childNodes.forEach(c => {c.remove()})
            const piece = this.#getGameAssetFromPosition(Position.fromString(pos));
            if (piece) {
                const pieceElement = document.createElement('div');
                const pieceAsset = document.createElement('img');
                const boardPiece = this.#game.getPieceFromPosition(Position.fromString(pos))!;
                pieceAsset.alt = `${boardPiece.color} ${boardPiece.type}`;
                pieceAsset.src = piece;
                pieceElement.appendChild(pieceAsset);
                let gamePiece = this.#game.getPieceFromPosition(Position.fromString(pos));
                if (gamePiece) {
                    pieceElement.classList.add('piece');
                    if (gamePiece.color === 'white') {
                        pieceElement.classList.remove('piece-black');
                        pieceElement.classList.add('piece-white');
                    } else {
                        pieceElement.classList.remove('piece-white');
                        pieceElement.classList.add('piece-black');
                    }

                    if (boardPiece.color === this.#game.turn) {
                        pieceElement.classList.add('playable');
                        this.#registerDragEvent(pieceElement, gamePiece);
                    }

                } else {
                    pieceElement.remove()
                }
                p.appendChild(pieceElement);
            }
        })
        if (this.#game.checkmate) {
            modal.checkmateModal(this.#game.getCheck()!).open();
        }
    }

    getPieceFromPosition(position: Position): ChessPiece | null {
        return this.#game.getPieceFromPosition(position);
    }

    private handleDragEvent(event: DragEvent, piece: ChessPiece) {
        const subscription = new PieceDragAndDropEvent(event, piece, this).observable.subscribe(move => {
            if (move) this.movePiece(move);
            else this.defaultClick();

            subscription.unsubscribe();
        })
    }

    static async load(game: Gameplay, app: HTMLDivElement): Promise<GameHTML> {
        return new Promise<GameHTML>((resolve) => {
            const gameHTML = new GameHTML(game);
            gameHTML.init(app);
            gameHTML.#render();

            resolve(gameHTML);
        })
    }

    #registerTouchEvent() {
        if (detectDevice() === 'mobile') {
            document.addEventListener('touchstart', event => {
                if (this.#touchEvent) this.#touchEvent.detectSecondTouch(event);
                else {
                    this.#touchEvent = new PieceTouchEvent(event, this);
                    this.#touchEvent.observable.subscribe(move => {
                        if (move) {
                            this.movePiece(move)
                        }
                        this.#touchEvent = null;
                    });
                }
            });
        }
    }

    #registerDragEvent(pieceElement: HTMLDivElement, gamePiece: ChessPiece) {
        if (detectDevice() === 'desktop') {
            pieceElement.draggable = true;
            pieceElement.ondragstart = (event) => this.handleDragEvent(event, gamePiece);
        }
    }
}
