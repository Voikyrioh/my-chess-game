import {Position} from "./game/entities/game/position.ts";
import type {boardColumns, boardRows} from "./game/entities/game/board.ts";

import './assets/html-chess.css';
import type {ChessPiece} from "./game/entities/pieces/chess-piece.ts";
import {Gameplay} from "./game/gameplay.ts";
import type {Move} from "./game/entities/game/move.ts";
import pieceAssets from './html-pieces-assets.ts';

const fenUrl = new URLSearchParams(document.location.search).get('fen');
const game = new Gameplay(fenUrl ?? undefined);
const cases = new Map<string, HTMLDivElement>();
let checkmateModal: HTMLDialogElement;
let moveToPlay: Move|null = null;

function getBoardChessChar(pos: string): string|null {
    const piece = game.getPieceFromPosition(Position.fromString(pos));

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

function renderPossibleMoves(piece: ChessPiece) {
    defaultClick();
    game.getPossibleMoves(piece).forEach(move => {
        const ca = cases.get(move.to.toString());
        if (ca) {
            ca.classList.add('possible-move');
            ca.onclick = () => moveToPlay = move;
        }
    })
}

function render() {
    cases.forEach((p, pos) => {
        p.childNodes.forEach(c => {c.remove()})
        const piece = getBoardChessChar(pos);
        if (piece) {
            const pieceElement = document.createElement('div');
            const pieceAsset = document.createElement('img');
            const boardPiece = game.getPieceFromPosition(Position.fromString(pos))!;
            pieceAsset.alt = `${boardPiece.color} ${boardPiece.type}`;
            pieceAsset.src = piece;
            pieceElement.appendChild(pieceAsset);
            let gamePiece = game.getPieceFromPosition(Position.fromString(pos));
            if (gamePiece) {
                pieceElement.classList.add('piece');
                if (gamePiece.color === 'white') {
                    pieceElement.classList.remove('piece-black');
                    pieceElement.classList.add('piece-white');
                } else {
                    pieceElement.classList.remove('piece-white');
                    pieceElement.classList.add('piece-black');
                }
                pieceElement.draggable = true;
                pieceElement.ondragend = canDrop;
                pieceElement.ondragstart = () => {
                    moveToPlay = null;
                    renderPossibleMoves(gamePiece)
                }
            } else {
                pieceElement.remove()
            }
            p.appendChild(pieceElement);
        }
    })
    if (game.checkmate && !checkmateModal) {
        openCheckmateModal();
    }
}

function openCheckmateModal() {
    checkmateModal = document.createElement('dialog');
    checkmateModal.classList.add('modal');
    const title = document.createElement('h3')
    title.innerText = `Echec et mat`;
    const text = document.createElement('span')
    text.innerText = `Les ${game.getCheck() === 'white' ? 'Noirs' : 'Blancs'} gagnent !`
    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'Ok';
    closeBtn.onclick = () => checkmateModal.remove();
    document.body.appendChild(checkmateModal);
    checkmateModal.appendChild(title);
    checkmateModal.appendChild(text);
    checkmateModal.appendChild(closeBtn);
    checkmateModal.show();
}

function canDrop(event: DragEvent) {
    const moveTarget = document.elementFromPoint(event.x, event.y) as HTMLDivElement;
    if (moveTarget) moveTarget.click();
    if (moveToPlay) {
        movePiece(moveToPlay);
    }

    defaultClick();
    render();
}

function defaultClick() {
    cases.forEach((p) => {
        if (p.classList.contains('possible-move')) {
            p.classList.remove('possible-move');
            p.onclick = null;
        }
    })
}

function movePiece(move: Move) {
    defaultClick();
    game.play(move);
    render();
}

export function startGame() {
    const app = document.getElementById('app') as HTMLDivElement;
    const colRefs = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    for (let r = 1; r <= 8; r++) {
        for (let c = 1; c <= 8; c++) {
            const ca = document.createElement('div');
            ca.classList.add('case');
            ca.classList.add((r + c) % 2 === 0 ? 'white' : 'black');
            ca.id = `${r}${colRefs[c - 1]}`;
            cases.set(new Position(colRefs[c-1] as boardColumns, r as boardRows).toString(), ca);
            app.appendChild(ca);
        }
    }

    render();
}
