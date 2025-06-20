import {Position} from "./engine/entities/game/position.ts";
import type {boardColumns, boardRows} from "./engine/entities/game/board.ts";

import './assets/html-chess.css';
import type {ChessPiece} from "./engine/entities/pieces/chess-piece.ts";
import {Gameplay} from "./engine/gameplay.ts";
import type {Move} from "./engine/entities/game/move.ts";
import pieceAssets from './game/html/assets/html-pieces-assets.ts';
import type {Pawn} from "./engine/entities/pieces/pawn.ts";

const fenUrl = new URLSearchParams(document.location.search).get('fen');
const game = new Gameplay(fenUrl ?? undefined);
const cases = new Map<string, HTMLDivElement>();
let checkmateModal: HTMLDialogElement;
let moveToPlay: Move|null = null;
let selectedPiece: ChessPiece|null = null;

function handleTouchScreen(event: TouchEvent) {
    console.log(event);
    if(event.touches.length === 1) {
        const touch = event.touches[0];
        let target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLDivElement | undefined;
        if (target) {
            if ((selectedPiece && target.parentElement?.classList.contains(('possible-move'))) ||
                target.parentElement?.classList.contains('piece')
            ) {
                target = target.parentElement as HTMLDivElement;
            }

            if (selectedPiece && target.classList.contains('possible-move')) {
                console.log("I'm playing move !");
                target.click();
                if (moveToPlay) {
                    game.play(moveToPlay);
                    defaultClick();
                    render();
                }
            } else if (target.classList.contains('piece')) {
                const pieceCase = target.parentElement as HTMLDivElement;
                const [row, column] = pieceCase.id.split('')
                if (!column || !row) throw new Error('Invalid column or row');
                selectedPiece = game.getPieceFromPosition(new Position(column as boardColumns, Number(row) as boardRows))!;
                renderPossibleMoves(selectedPiece)
            } else {
                defaultClick();
            }
        }
    }
}

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
            if (['TAKE', 'EN_PASSANT'].includes(move.type)) {
                ca.classList.add('take');
            }
            if (move.type === "CASTLING") {
                ca.classList.add('castling');
            }
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

function openPromoteDialog(x:number, y: number, color: 'white'|'black', callback: Function) {
    const dialog = document.createElement('dialog');
    dialog.id = 'promote-diag';
    dialog.style.top = `calc(${y}px - ${color === "white" ? '0px' : '400px'})`;
    dialog.style.left = `calc(${x}px - 50vw)`;

    const dialogContent = ['queen', 'rook', 'knight', 'bishop'].map(p => {
        const div = document.createElement('div')
        const img = document.createElement('img');
        div.classList.add('promote-btn');
        div.onclick = () => {
            callback(p);
            dialog.remove();
        };
        img.src = pieceAssets[color][p as 'queen'|'knight'|'bishop'|'rook'];
        div.appendChild(img);
        return div;
    });
    dialogContent.forEach((elem, index) => {
        dialog.appendChild(elem);
        if (index !== dialogContent.length - 1) dialog.appendChild(document.createElement('hr'));
    })

    document.body.appendChild(dialog);
    dialog.show();
}

function promote(x: number, y: number, piece: Pawn,  ): Promise<ChessPiece> {
    return new Promise<ChessPiece>((resolve) => {
        openPromoteDialog(x, y, piece.color, (value: 'queen'|'knight'|'bishop'|'rook') => {
            resolve(piece.promote(value))
        });
    })
}

function canDrop(event: DragEvent) {
    const moveTarget = document.elementFromPoint(event.x, event.y) as HTMLDivElement;
    if (moveTarget) moveTarget.click();
    if (moveToPlay) {
        if (moveToPlay.promoteMovement && moveToPlay.piece.type === 'pawn') {
            promote(event.x, event.y, moveToPlay.piece as Pawn).then(newPiece => {
                movePiece(moveToPlay!.promote(newPiece) ?? moveToPlay!);
            })
        } else movePiece(moveToPlay);

    }

    defaultClick();
    render();
}

function defaultClick() {
    cases.forEach((p) => {
        if (p.classList.contains('possible-move')) {
            p.classList.remove('possible-move');
            p.classList.remove('take');
            p.classList.remove('castling');
            p.onclick = null;
        }
    })
}

function movePiece(move: Move) {
    defaultClick();
    game.play(move);
    render();
}

export async function startGame() {
    return new Promise<void>((resolve) => {
        const app = document.getElementById('app') as HTMLDivElement;
        document.addEventListener('touchstart', handleTouchScreen);
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
        resolve();
    })

}
