import {FenError, FenNotation} from "../../src/game/entities/game/fen-notation";
import {expect} from "chai";

describe('Fen String Generator', () => {
    it('should create a default board fen string if no fen string passed', () => {
        expect(new FenNotation()).to.be.an.instanceof(FenNotation).that.have.a.property('fenString').which.is.equal('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    });

    it('should throw an error if fen string is invalid', () => {
        expect(() => new FenNotation('123')).to.throw(FenError).that.includes({'type': 'INVALID_FEN_STRING', 'message': 'Invalid FEN string'});
    });

    it('should throw an error if fen string is valid but there\'s not enough kings', () => {
        expect(() => new FenNotation('8/8/8/8/8/8/8/7k w KQkq - 0 1')).to.throw(FenError).that.includes({'type': 'INVALID_ROWS', 'message': 'should have one king per side'});
    });

    it('should throw an error if fen string is valid but there\'s too much kings', () => {
        expect(() => new FenNotation('8/8/8/8/8/8/6kk/6kK w KQkq - 0 1')).to.throw(FenError).that.includes({'type': 'INVALID_ROWS', 'message': 'should have one king per side'});
    });

    it('should throw an error if fen string is valid but there\'s king in only one side', () => {
        expect(() => new FenNotation('8/8/8/8/8/8/6kk/8 w KQkq - 0 1')).to.throw(FenError).that.includes({'type': 'INVALID_ROWS', 'message': 'should have one king per side'});
    });

    it('should throw an error if fen string is valid but value is incorrect', () => {
        expect(() => new FenNotation('8/8/8/8/8/7kK/8/8 w KQkq - 0 1')).to.throw(FenError).that.includes({'type': 'INVALID_ROWS', 'message': 'Too many columns in rows'});
    });
});
