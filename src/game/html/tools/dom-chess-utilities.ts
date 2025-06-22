import {type boardColumns, type boardRows, Position} from "../../../engine";

export function getNearestCase(domPos: {x: number, y: number}): HTMLDivElement|null {
    const caseTarget = document.elementsFromPoint(domPos.x, domPos.y);

    const nearestCase = caseTarget.find(elem  => {
        if (elem instanceof HTMLElement) {
            if (elem.classList.contains('case')) return elem as HTMLDivElement;
        }
    })

    return nearestCase as HTMLDivElement ?? null;
}

export function caseToPosition(caseElement: HTMLDivElement): Position {
    const [row, column]: string[] = caseElement.id.split('');

    return new Position(column as boardColumns, Number(row) as boardRows);
}
