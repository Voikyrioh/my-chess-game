export const GameClickEvent = Symbol('Click');
export const GameDragEvent = Symbol('Drag');
export const GameDropEvent = Symbol('Drop');
export const GameTouchEvent = Symbol('Touch');

export type HTMLChessEventTypes = typeof GameClickEvent | typeof GameDragEvent | typeof GameDropEvent | typeof GameTouchEvent;
