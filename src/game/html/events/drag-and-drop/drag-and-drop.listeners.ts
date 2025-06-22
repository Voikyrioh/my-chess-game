export function moving(e: MouseEvent, target: HTMLDivElement, originalPos: { x: number, y: number }) {
    target.style.position = 'absolute';
    target.style.transform = `translate(${e.clientX - originalPos.x}px, ${e.clientY - originalPos.y}px)`;
    const pointingElement = document.elementFromPoint(e.clientX, e.clientY);
    if (pointingElement && pointingElement.classList.contains('case')) {
        pointingElement.classList.add('selection-hover');
        (pointingElement as HTMLDivElement)!.onmouseleave = () => pointingElement.classList.remove('selection-hover');
    }
}
