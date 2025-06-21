import { GameHTML } from './src/game/html/game.ts';
import * as chess3d from './src/game/3d/factory.ts';
import {Gameplay} from "./src/engine";
// @ts-ignore
import loaderSVG from './src/assets/web/loader.svg';


const gameplay = new Gameplay()
export function openOptions() {
    const menuOptions = document.getElementById('checkbox-menu-options') as HTMLInputElement | null;
    if (menuOptions) menuOptions.checked = !menuOptions.checked
}

function switchGameType() {
    const gameTypeSwitch = document.getElementById('gametype') as HTMLInputElement | null;
    if(!gameTypeSwitch) throw new Error('options not found');

    const loader = document.createElement('img');
    if(!loader) throw new Error('loader not found');

    const app = document.getElementById('app') as HTMLDivElement | null;
    if(!app) throw new Error('app not found');

    app.innerHTML = '';
    app.appendChild(loader);
    if(gameTypeSwitch.checked) {
        chess3d?.startGame().then(() => app.removeChild(loader));
    } else {
        GameHTML.load(gameplay, app).then(() => app.removeChild(loader));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const settingsButton = document.getElementById('settings-btn');
    if(settingsButton) settingsButton.onclick = openOptions;

    const gameTypeSwitch = document.getElementById('gametype');
    if(!gameTypeSwitch) throw new Error('options not found');

    const loader = document.createElement('img');
    if(!loader) throw new Error('loader not found');

    const app = document.getElementById('app') as HTMLDivElement | null;
    if(!app) throw new Error('app not found');

    loader.classList.add('loader');
    loader.src = loaderSVG;
    app.appendChild(loader);
    GameHTML.load(gameplay, app).then(() => app.removeChild(loader));
    gameTypeSwitch.addEventListener('input', switchGameType);
})


