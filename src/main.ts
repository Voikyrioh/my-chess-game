import './assets/style.css';
import {Game} from "./game.ts";

async function main() {
    const game = new Game(document.getElementById('app') as HTMLDivElement);
    await game.init();
}

main().catch(console.error);
