import { expect } from 'chai';
import { Observable } from '../../src/tools/observable';

describe('Observable', () => {
    let observable: Observable<number>;

    beforeEach(() => {
        observable = new Observable<number>();
    });

    it('devrait émettre la valeur initiale aux nouveaux abonnés si elle existe', () => {
        const observable = new Observable<number>(42);
        let valeurReçue: number | undefined;

        observable.subscribe((valeur) => {
            valeurReçue = valeur;
        });

        expect(valeurReçue).to.equal(42);
    });

    it('devrait notifier tous les abonnés lors d\'un emit', () => {
        let valeur1: number | undefined;
        let valeur2: number | undefined;

        observable.subscribe((v) => valeur1 = v);
        observable.subscribe((v) => valeur2 = v);

        observable.emit(123);

        expect(valeur1).to.equal(123);
        expect(valeur2).to.equal(123);
    });

    it('devrait permettre de se désabonner correctement', () => {
        let compteur = 0;
        const subscription = observable.subscribe(() => compteur++);

        observable.emit(1);
        expect(compteur).to.equal(1);

        subscription.unsubscribe();
        observable.emit(2);
        expect(compteur).to.equal(1); // Le compteur ne devrait pas augmenter après désabonnement
    });

    it('devrait gérer plusieurs abonnements et désabonnements', () => {
        const valeurs: number[] = [];
        const subscription1 = observable.subscribe((v) => valeurs.push(v));
        observable.subscribe((v) => valeurs.push(v * 2));

        observable.emit(5);
        expect(valeurs).to.deep.equal([5, 10]);

        subscription1.unsubscribe();
        observable.emit(3);
        expect(valeurs).to.deep.equal([5, 10, 6]); // Seul le deuxième abonné reçoit la valeur
    });

    it('devrait avoir des identifiants uniques pour chaque abonnement', () => {
        const subscription1 = observable.subscribe(() => {});
        const subscription2 = observable.subscribe(() => {});

        expect(subscription1.id).to.not.equal(subscription2.id);
    });
});
