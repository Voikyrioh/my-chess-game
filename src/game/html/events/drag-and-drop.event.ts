import {type boardColumns, type boardRows, ChessPiece, Move, Position} from "../../../engine";
import {Observable} from "../../../tools/observable.ts";
import {GameHTML} from "../game.ts";

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
        const moving = (e: MouseEvent) => {
            this.target.style.position = 'absolute';
            this.target.style.transform = `translate(${e.clientX - originalPos.x}px, ${e.clientY - originalPos.y}px)`;
            const pointingElement = document.elementFromPoint(e.clientX, e.clientY);
            if (pointingElement && pointingElement.classList.contains('case')) {
                pointingElement.classList.add('selection-hover');
                (pointingElement as HTMLDivElement)!.onmouseleave = () => pointingElement.classList.remove('selection-hover');
            }
        };

        document.addEventListener('mousemove', moving);
        this.target.classList.add('dragging');

        const onEnd = (event: MouseEvent) => {
            this.target.classList.remove('dragging');
            document.removeEventListener('mousemove', moving);
            this.target.style.position = 'unset';
            this.target.style.transform = 'unset';
            const move = this.getPossibleMove(event);
            this.observable.emit(move ?? null);
            document.removeEventListener('mouseup', onEnd);
        }

        document.addEventListener('mouseup', onEnd);
        this.target.classList.add('dragging');
    }

    getNearestCase(event: MouseEvent): HTMLDivElement {
        const caseTarget = document.elementFromPoint(event.clientX, event.clientY);

        if (caseTarget instanceof HTMLElement) {
            if (caseTarget.classList.contains('case')) return caseTarget as HTMLDivElement;
            else if (caseTarget.parentElement instanceof HTMLDivElement && caseTarget.parentElement.classList.contains('case')) return caseTarget.parentElement
            else throw new Error('Cannot find case');
        }
        else throw new Error('Invalid target');
    }

    caseToPosition(caseElement: HTMLDivElement): Position {
        const [row, column]: string[] = caseElement.id.split('');

        return new Position(column as boardColumns, Number(row) as boardRows);
    }

    getPossibleMove(event: MouseEvent): Move | undefined {
        const eventCase = this.getNearestCase(event);

        return this.#possibleMoves.find(move => move.to.equals(this.caseToPosition(eventCase)));
    }
}
