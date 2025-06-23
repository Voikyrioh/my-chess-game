import {BaseModal} from "./base-modal.ts";

export function checkmateModal(color: string): BaseModal {
    const modal = new BaseModal('checkmate-diag', true);

    const title = document.createElement('h3')
    title.innerText = `Echec et mat`;
    const text = document.createElement('span')
    text.innerText = `Les ${color} gagnent !`
    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'Ok';

    modal.element.appendChild(title);
    modal.element.appendChild(text);

    closeBtn.onclick = () => {modal.close()}
    modal.element.appendChild(closeBtn);

    return modal;
}
