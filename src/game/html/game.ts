import type {Gameplay} from "../../engine/gameplay.ts";
import {Position} from "../../engine/entities/game/position.ts";
import type {boardColumns, boardRows} from "../../engine/entities/game/board.ts";
import {type HTMLChessEventTypes, GameTouchEvent} from "./types/events.ts";

export class GameHTML {
    #game: Gameplay;
    #htmlCases = new Map<string, HTMLDivElement>();

    private constructor(game: Gameplay) {
        this.#game = game;
    }

    render() {

    }

    runEvent(event: HTMLChessEventTypes, originalEvent: Event) {

    }

    static async load(game: Gameplay, app: HTMLDivElement): Promise<GameHTML> {
        return new Promise<GameHTML>((resolve) => {
            const gameHTML = new GameHTML(game);
            document.addEventListener('touchstart', event => { gameHTML.runEvent(GameTouchEvent, event) });
            const colRefs = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
            for (let r = 1; r <= 8; r++) {
                for (let c = 1; c <= 8; c++) {
                    const ca = document.createElement('div');
                    ca.classList.add('case');
                    ca.classList.add((r + c) % 2 === 0 ? 'white' : 'black');
                    ca.id = `${r}${colRefs[c - 1]}`;
                    gameHTML.#htmlCases.set(new Position(colRefs[c-1] as boardColumns, r as boardRows).toString(), ca);
                    app.appendChild(ca);
                }
            }

            gameHTML.render();
            resolve(gameHTML);
        })
    }
}
