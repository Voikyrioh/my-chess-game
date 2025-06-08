import type {ChessPiece, PieceType} from "../pieces/chess-piece.ts";
import type {Position} from "./position.ts";


export type PossibleMoves  = "MOVE" | "TAKE" | "EN_PASSANT" | "CASTLING" | "PROMOTION";
export const dictionaryPieces: Record<PieceType, string> = {
    king: "K",
    queen: "Q",
    bishop: "B",
    knight: "N",
    rook: "R",
    pawn: "",
};

export class Move {
    public readonly from: Position;
    public readonly to: Position;
    public readonly piece: ChessPiece;
    public readonly type: PossibleMoves;
    public readonly target: ChessPiece | undefined;

    constructor(
        from: Position,
        to: Position,
        piece: ChessPiece,
        type: PossibleMoves,
        target?: ChessPiece,
    ) {
        this.from = from;
        this.to = to;
        this.piece = piece;
        this.type = type;
        this.target = target;
    }

    toString() {
        switch (this.type) {
            case "MOVE":
                const isPawn = this.piece.type === 'pawn';
                return `${isPawn ? this.from.column : this.from.toString()}${dictionaryPieces[this.piece.type]}${this.to.toString()}`;
            case "CASTLING":
                return `${this.from.toString()}${this.piece.type} ${this.to.column === 'b' ? 'o-o-o' : 'o-o'} ${this.to.toString()}`;
            case "TAKE":
                return `${this.from.toString()}${this.piece.type}x${this.to.toString()}`;
        }
    }
}
