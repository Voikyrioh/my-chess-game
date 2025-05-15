import type {ChessPiece} from "./pieces/chess-piece.ts";
import type {Position} from "./position.ts";


export type PossibleMoves  = "MOVE" | "TAKE" | "EN_PASSANT" | "CASTLING" | "PROMOTION";

export class Move {
    public readonly from: Position;
    public readonly to: Position;
    public readonly piece: ChessPiece;
    public readonly type: PossibleMoves;

    constructor(
        from: Position,
        to: Position,
        piece: ChessPiece,
        type: PossibleMoves
    ) {
        this.from = from;
        this.to = to;
        this.piece = piece;
        this.type = type;
    }
}
