import {Board} from "../game/entities/game/board.ts";
import {Move} from "../game/entities/game/move.ts";
import {Position} from "../game/entities/game/position.ts";

class SimulatedBoard extends Board {
    constructor(board: Board) {
        super(board.export());
    }

    executeMove(move: Move) {
        this.$board.get(move.from.toString())!.occupiedBy = null;
        this.$board.get(move.to.toString())!.occupiedBy = move.piece;
        if (move.type === "CASTLING") {
            if(!move.target) throw new Error("Target is not defined");
            this.$board.get(move.target.position.toString())!.occupiedBy = null;
            const newPos = move.to.column === 'g' ? new Position('f', move.target.position.row) : new Position('d', move.target.position.row);
            if (!newPos) throw new Error("New position is not defined");
            this.$board.get(newPos.toString())!.occupiedBy = move.target;
        }
        this.$history.push(move);

        this.$calculateBoardState();
    }
}

export function simulateMove(board: Board, move: Move) {
    const simulation = new SimulatedBoard(board);
    simulation.executeMove(move);

    return simulation;
}
