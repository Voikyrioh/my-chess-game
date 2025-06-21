import {BaseModal} from "./base-modal.ts";
import pieceAssets from "../assets/html-pieces-assets.ts";

export function promoteModal(color: 'white'|'black', pos: {x: number, y: number}, callback: Function): BaseModal {
    console.log('createModal ');
    const t0 = performance.now();
    const modal = new BaseModal('promote-diag');
    const t1 = performance.now();
    console.log('modal created ', t1-t0);

    ['queen', 'rook', 'knight', 'bishop'].map(p => {
        const div = document.createElement('div')
        const img = document.createElement('img');
        div.classList.add('promote-btn');
        div.onclick = () => {
            callback(p);
            modal.close();
        };
        img.src = pieceAssets[color][p as 'queen'|'knight'|'bishop'|'rook'];
        div.appendChild(img);
        modal.append(div);
        modal.append(document.createElement('hr'));
    });
    modal.element.removeChild(modal.element.lastChild!);

    const t2 = performance.now();
    console.log("generated content ", t2-t1);

    modal.element.style.transform = `translate(calc(${pos.x}px - 50vw), calc(${pos.y}px - 50vh))`;

    return modal;
}
