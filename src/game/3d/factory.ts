import '../../assets/html-chess.css';
import {Game3D} from "./game.ts";

async function main() {
    const game = new Game3D(document.getElementById('app') as HTMLDivElement);
    await game.init();
}

export async function startGame() {
    return main().catch(console.error);
}
