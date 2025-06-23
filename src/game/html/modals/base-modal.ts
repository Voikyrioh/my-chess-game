export class BaseModal {
    element: HTMLDialogElement;
    #background: HTMLDivElement | null = null;

    constructor(id?: string, background = false) {
        if (background) {
            this.#background = document.createElement('div');
            this.#background.classList.add('modal-bg');
            document.body.append(this.#background);
        }
        this.element = document.createElement('dialog');
        this.element.classList.add('modal');
        if (id) this.element.id = id;
    }

    open() {
        document.body.appendChild(this.element);
        this.element.show();
    }

    close() {
        this.element.remove();
        this.#background?.remove();
    }

    append(elem: HTMLElement) {
        this.element.appendChild(elem);
    }
}
