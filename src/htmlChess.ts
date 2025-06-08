import {Position} from "./game/entities/game/position.ts";
import type {boardColumns, boardRows} from "./game/entities/game/board.ts";

import './assets/style.css';
import type {ChessPiece} from "./game/entities/pieces/chess-piece.ts";
import {Gameplay} from "./game/gameplay.ts";
import type {Move} from "./game/entities/game/move.ts";


const fenUrl = new URLSearchParams(document.location.search).get('fen');
const game = new Gameplay(fenUrl ?? undefined);

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
    game.getPossibleMoves(piece).forEach(move => {
        console.log(move);
        const ca = cases.get(move.to.toString());
        if (ca) {
            ca.classList.add('possible-move');
            ca.onclick = () => movePiece(move);
        }
    })
}

function render() {
    cases.forEach((p, pos) => {
        p.innerText = getBoardChessChar(pos);
        let piece = game.getPieceFromPosition(Position.fromString(pos));
        if (piece) {
            p.classList.add('piece');
            if (piece.color === 'white') {
                p.classList.remove('piece-black');
                p.classList.add('piece-white');
            } else {
                p.classList.remove('piece-white');
                p.classList.add('piece-black');
            }
            p.onclick = () => renderPossibleMoves(piece)
        } else {
            p.classList.remove('piece');
            p.onclick = () => defaultClick();
        }
    })
}

function defaultClick() {
    cases.forEach((p) => {
        if (p.classList.contains('possible-move')) {
            p.classList.remove('possible-move');
            render();
        }
    })
}

function movePiece(move: Move) {
    defaultClick();
    game.play(move);
    render();
}

render();
