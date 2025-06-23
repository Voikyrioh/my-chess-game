import {ChessPiece, Move} from "../../../../engine";
import {Observable} from "../../../../tools/observable.ts";
import {GameHTML} from "../../game.ts";
import {caseToPosition, getNearestCase} from "../../tools/dom-chess-utilities.ts";
import {moving} from "./drag-and-drop.listeners.ts";

export class DragAndDropEvent {
    readonly gameref: Readonly<GameHTML>;
    readonly target: HTMLDivElement;
    readonly piece: ChessPiece;

    readonly observable: Observable<Move|null>;
    #possibleMoves: Move[] = [];

    constructor(event: DragEvent, piece: ChessPiece, gameref: Readonly<GameHTML>) {
        this.target = event.target as HTMLDivElement;
        this.piece = piece;
        this.gameref = gameref;
        this.observable = new Observable<Move|null>();

        this.#possibleMoves = this.gameref.renderPossibleMoves(piece);
        if (this.#possibleMoves.length === 0) return;

        event.preventDefault();

        const originalPos = {x: event.clientX, y: event.clientY};
        const handleMove = (e: MouseEvent) => moving(e, this.target, originalPos);

        document.addEventListener('mousemove', handleMove);
        this.target.classList.add('dragging');

        const handleDragEnd = (event: MouseEvent) => {
            this.target.classList.remove('dragging');
            document.removeEventListener('mousemove', handleMove);
            this.target.style.position = 'unset';
            this.target.style.transform = 'unset';
            const move = this.getPossibleMove(event);
            this.observable.emit(move ?? null);
            document.removeEventListener('mouseup', handleDragEnd);
        }

        document.addEventListener('mouseup', handleDragEnd);
        this.target.classList.add('dragging');
    }

    getPossibleMove(event: MouseEvent): Move | undefined {
        const eventCase = getNearestCase({x: event.clientX, y: event.clientY});
        if (!eventCase) return;
        return this.#possibleMoves.find(move => move.to.equals(caseToPosition(eventCase)));
    }
}
