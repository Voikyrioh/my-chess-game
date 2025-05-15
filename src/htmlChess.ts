import {Player} from "./classes/player.ts";
import {Position} from "./classes/position.ts";
import type {boardColumns, boardRows} from "./classes/board.ts";

import './assets/style.css';
import type {ChessPiece} from "./classes/pieces/chess-piece.ts";
import {Gameplay} from "./classes/gameplay.ts";

const game = new Gameplay(new Player('white'), new Player('black'));

function getBoardChessChar(pos: string): string {
    const piece = game.getPieceFromPosition(Position.fromString(pos));

    if (!piece) return '';
    switch (piece.type) {
        case 'pawn': return '♟';
        case 'rook': return '♜';
        case 'knight': return '♞';
        case 'bishop': return '♝';
        case 'queen': return '♛';
        case 'king': return '♚';
        default: return '';
    }
}

const app = document.getElementById('app') as HTMLDivElement;
const cases = new Map<string, HTMLDivElement>();
let colRefs = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
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

function renderPossibleMoves(piece: ChessPiece) {
    defaultClick();

    game.getPossibleMoves(piece).forEach(pos => {
        const ca = cases.get(pos.toString());
        if (ca) {
            ca.classList.add('possible-move');
            ca.onclick = () => movePiece(piece, pos);
        }
    })
}

function render() {
    cases.forEach((p, pos) => {
        p.innerText = getBoardChessChar(pos);
        let piece = game.getPieceFromPosition(Position.fromString(pos));
        if (piece) {
            p.classList.add('piece');
            p.classList.add(piece.color === 'white' ? 'piece-white' : 'piece-black');
            p.onclick = () => renderPossibleMoves(piece)
        } else {
            p.onclick = () => defaultClick();
        }
    })
}

function defaultClick() {
    cases.forEach((p) => {
        p.classList.remove('possible-move');
    })
}

function movePiece(piece: ChessPiece, pos: Position) {
    defaultClick();
    game.play(piece, pos);
    render();
}

render();
