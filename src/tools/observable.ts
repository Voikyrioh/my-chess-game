class Subscription {
    #function: () => void;
    readonly id: string;

    constructor(id: string ,fn: () => void) {
        this.#function = fn;
        this.id = id;
    }

    unsubscribe() {
        this.#function();
    }
}

export class Observable<T> {
    #value: T | undefined;
    #clients: Map<string, (v: T) => any> = new Map();

    constructor(defaultValue?: T) {
        if (defaultValue) {
            this.emit(defaultValue);
        }
    }

    #removeSubscription(subId: string) {
        this.#clients.delete(subId);
    }

    subscribe(callback: (v: T) => any): Subscription {
        const subID = crypto.randomUUID();
        this.#clients.set(subID, callback);

        if (this.#value) {
            callback(this.#value);
        }
        return new Subscription(subID, this.#removeSubscription.bind(this, subID));
    }

    emit(value: T) {
        this.#value = value;
        this.#clients.forEach(callback => callback(this.#value!));
    }
}
