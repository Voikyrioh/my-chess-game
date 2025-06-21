import {BaseModal} from "./base-modal.ts";
import pieceAssets from "../assets/html-pieces-assets.ts";

export function promoteModal(color: 'white'|'black', pos: {x: number, y: number}, callback: Function): BaseModal {
    const modal = new BaseModal('promote-diag');

    const dialogContent = ['queen', 'rook', 'knight', 'bishop'].map(p => {
        const div = document.createElement('div')
        const img = document.createElement('img');
        div.classList.add('promote-btn');
        div.onclick = () => {
            callback(p);
            modal.close();
        };
        img.src = pieceAssets[color][p as 'queen'|'knight'|'bishop'|'rook'];
        div.appendChild(img);
        return div;
    });


    dialogContent.forEach((elem, index) => {
        modal.append(elem);
        if (index !== dialogContent.length - 1) modal.append(document.createElement('hr'));
    })
    modal.element.style.top = `calc(${pos.y}px - ${color === "white" ? '0px' : '400px'})`;

    return modal;
}
