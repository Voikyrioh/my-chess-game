import { expect } from 'chai';
import { Observable } from '../../src/tools/observable';

describe('Observable', () => {
    let observable: Observable<number>;

    beforeEach(() => {
        observable = new Observable<number>();
    });

    it('should emit initial value to new subscribers if it exists', () => {
        const observable = new Observable<number>(42);
        let receivedValue: number | undefined;

        observable.subscribe((value) => {
            receivedValue = value;
        });

        expect(receivedValue).to.equal(42);
    });

    it('should notify all subscribers on emit', () => {
        let value1: number | undefined;
        let value2: number | undefined;

        observable.subscribe((v) => value1 = v);
        observable.subscribe((v) => value2 = v);

        observable.emit(123);

        expect(value1).to.equal(123);
        expect(value2).to.equal(123);
    });

    it('should allow unsubscribing correctly', () => {
        let counter = 0;
        const subscription = observable.subscribe(() => counter++);

        observable.emit(1);
        expect(counter).to.equal(1);

        subscription.unsubscribe();
        observable.emit(2);
        expect(counter).to.equal(1); // Counter should not increase after unsubscribing
    });

    it('should handle multiple subscriptions and unsubscriptions', () => {
        const values: number[] = [];
        const subscription1 = observable.subscribe((v) => values.push(v));
        observable.subscribe((v) => values.push(v * 2));

        observable.emit(5);
        expect(values).to.deep.equal([5, 10]);

        subscription1.unsubscribe();
        observable.emit(3);
        expect(values).to.deep.equal([5, 10, 6]); // Only the second subscriber receives the value
    });

    it('should have unique IDs for each subscription', () => {
        const subscription1 = observable.subscribe(() => {});
        const subscription2 = observable.subscribe(() => {});

        expect(subscription1.id).to.not.equal(subscription2.id);
    });
});
