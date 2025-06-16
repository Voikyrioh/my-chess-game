import './assets/html-chess.css';
import {Game} from "./engine/game.ts";

async function main() {
    const game = new Game(document.getElementById('app') as HTMLDivElement);
    await game.init();
}

export async function startGame() {
    return main().catch(console.error);
}
