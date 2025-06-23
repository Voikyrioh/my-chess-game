export function getCursorPos(): Promise<{x: number, y: number}> {
    return new Promise<{x: number, y: number}>((resolve) => {
        const listener = (event: MouseEvent) => {
            event.preventDefault();
            resolve({x: event.clientX, y: event.clientY});
            document.removeEventListener('mousemove', listener);
        };
        document.addEventListener('mousemove', listener);
    })
}
