import w_rook from './assets/web/wrook.svg';
import b_rook from './assets/web/brook.svg';
import w_bishop from './assets/web/wbishop.svg';
import b_bishop from './assets/web/bbishop.svg';
import w_queen from './assets/web/wqueen.svg';
import b_queen from './assets/web/bqueen.svg';
import w_king from './assets/web/wking.svg';
import b_king from './assets/web/bking.svg';
import w_pawn from './assets/web/wpawn.svg';
import b_pawn from './assets/web/bpawn.svg';
import w_knight from './assets/web/wknight.svg';
import b_knight from './assets/web/bknight.svg';

const pieces = {
    white: {
        king: w_king,
        queen: w_queen,
        rook: w_rook,
        knight: w_knight,
        bishop: w_bishop,
        pawn: w_pawn,
    },
    black: {
        king: b_king,
        queen: b_queen,
        rook: b_rook,
        knight: b_knight,
        bishop: b_bishop,
        pawn: b_pawn,
    }
};

export default Object.freeze(pieces);
