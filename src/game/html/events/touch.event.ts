import {ChessPiece, Move} from "../../../engine";
import type {GameHTML} from "../game.ts";
import {Observable} from "../../../tools/observable.ts";
import {caseToPosition, getNearestCase} from "../tools/dom-chess-utilities.ts";

function moving(e: TouchEvent, originalPos: {x: number, y: number}, target: HTMLDivElement) {
    target.style.position = 'absolute';
    target.style.transform = `translate(${e.touches[0].clientX - originalPos.x}px, ${e.touches[0].clientY - originalPos.y}px)`;
    const pointingElement = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    if (pointingElement && pointingElement.classList.contains('case')) {
        pointingElement.classList.add('selection-hover');
        (pointingElement as HTMLDivElement)!.onmouseleave = () => pointingElement.classList.remove('selection-hover');
    }
}

async function checkFinalTouch(event: TouchEvent, possibleMoves: Move[]): Promise<Move|null> {
    const pos: {x:number, y:number} = event.touches?.[0] ?
        { x: event.touches[0].clientX, y: event.touches[0].clientY } :
        { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };

    const eventCase = getNearestCase(pos);
    if (!eventCase) return null;

    const casePosition = caseToPosition(eventCase);
    const correspondingMove = possibleMoves.find(({to}) => to.equals(casePosition));

    return correspondingMove ?? null;
}

export class PieceTouchEvent {
    readonly observable = new Observable<Move|null>()
    readonly piece!: ChessPiece;
    readonly gameRef: Readonly<GameHTML>;
    #possibleMoves: Move[] = [];
    #target: HTMLDivElement;
    #originalPos!: { x: number; y: number };

    constructor(event: TouchEvent, gameRef: Readonly<GameHTML>) {
        this.gameRef = gameRef;

        if (!(event.target instanceof HTMLDivElement) || !event.target.classList.contains('piece')) throw new Error('Invalid target');
        this.#target = event.target;

        const piece = this.#getPieceFromEvent(event);
        if (!piece) throw new Error('Invalid target');
        this.piece = piece;

        this.#possibleMoves = this.gameRef.renderPossibleMoves(this.piece);
        if (this.#possibleMoves.length === 0) throw new Error('No possible moves');

        this.#startDragging(event);
    }

    #emitMove(move: Move|null) {
        this.observable.emit(move);
        this.gameRef.defaultClick();
    }

    #startDragging(event: TouchEvent) {
        this.#originalPos = {x: event.touches[0].clientX, y: event.touches[0].clientY};

        const handleMove = (e: TouchEvent) => moving(e, this.#originalPos, this.#target);
        const handleEnd = (e: TouchEvent) => {
            checkFinalTouch(e, this.#possibleMoves).then(move => {
                document.removeEventListener('touchmove', handleMove);
                document.removeEventListener('touchend', handleEnd);
                this.#target.style.position = 'unset';
                this.#target.style.transform = 'unset';

                if (move) {
                    this.#emitMove(move);
                    this.gameRef.defaultClick();
                }
            })
        }

        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', handleEnd)
        this.#target.classList.add('dragging');
    }

    #getPieceFromEvent(event: TouchEvent): ChessPiece | null {
        const eventCase = getNearestCase({x: event.touches[0].clientX, y: event.touches[0].clientY});
        if (!eventCase) return null;
        return this.gameRef.getPieceFromPosition(caseToPosition(eventCase));
    }

    detectSecondTouch(event: TouchEvent) {
        const piece = this.#getPieceFromEvent(event);
        if (piece && piece === this.piece) this.#startDragging(event);
        else checkFinalTouch(event, this.#possibleMoves).then(this.#emitMove.bind(this));
    }
}
