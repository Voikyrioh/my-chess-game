export class BaseModal {
    element: HTMLDialogElement;

    constructor(id?: string) {
        this.element = document.createElement('dialog');
        this.element.classList.add('modal');
        if (id) this.element.id = id;
    }

    open() {
        console.log("openModal");
        document.body.appendChild(this.element);
        this.element.show();
    }

    close() {
        this.element.remove();
    }

    append(elem: HTMLElement) {
        this.element.appendChild(elem);
    }

    setModalPos(x: string, y: string) {
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }
}
