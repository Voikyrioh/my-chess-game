import {Move} from "../../../../engine";
import {caseToPosition, getNearestCase} from "../../tools/dom-chess-utilities.ts";

export function moving(e: TouchEvent, originalPos: { x: number, y: number }, target: HTMLDivElement) {
    target.style.position = 'absolute';
    target.style.transform = `translate(${e.touches[0].clientX - originalPos.x}px, ${e.touches[0].clientY - originalPos.y}px)`;
    const pointingElement = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    if (pointingElement && pointingElement.classList.contains('case')) {
        pointingElement.classList.add('selection-hover');
        (pointingElement as HTMLDivElement)!.onmouseleave = () => pointingElement.classList.remove('selection-hover');
    }
}

export async function checkFinalTouch(event: TouchEvent, possibleMoves: Move[]): Promise<Move | null> {
    const pos: { x: number, y: number } = event.touches?.[0] ?
        {x: event.touches[0].clientX, y: event.touches[0].clientY} :
        {x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY};

    const eventCase = getNearestCase(pos);
    if (!eventCase) return null;

    const casePosition = caseToPosition(eventCase);
    const correspondingMove = possibleMoves.find(({to}) => to.equals(casePosition));

    return correspondingMove ?? null;
}
