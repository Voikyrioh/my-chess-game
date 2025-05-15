import type {boardColumns, boardRows} from "./board.ts";

export class Position {
    public column: boardColumns;
    public row: boardRows;

    public toString(): string {
        return `${this.column}${this.row}`;
    }

    static fromString(str: string): Position {
        const col = str[0];
        if (!['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].includes(col)) {
            throw new Error(`Invalid column: ${col}`);
        }
        const row = Number(str[1]);
        if (row < 1 || row > 8) {
            throw new Error(`Invalid row: ${row}`);
        }
        return new this(col as boardColumns, row as boardRows);
    }

    add(row: number, column: number): Position|null {
        const newCol = String.fromCharCode(this.column.charCodeAt(0) + column);
        const newRow = this.row + row;
        if (!['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].includes(newCol)) {
            return null;
        }
        if (newRow < 1 || newRow > 8) {
            return null;
        }
        return new Position(newCol as boardColumns, newRow as boardRows);
    }

    sub(row: number, column: number): Position|null {
        const newCol = String.fromCharCode(this.column.charCodeAt(0) - column);
        const newRow = this.row - row;
        if (!['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].includes(newCol)) {
            return null;
        }
        if (newRow < 1 || newRow > 8) {
            return null;
        }
        return new Position(newCol as boardColumns, newRow as boardRows);
    }

    constructor(column: boardColumns, row: boardRows) {
        this.column = column;
        this.row = row;
    }

    equals(pos: Position) {
        return pos.toString() === this.toString();
    }
}
