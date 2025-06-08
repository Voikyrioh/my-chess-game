import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import type {Object3D} from "three";
import chessAssets from "../assets/chess.glb?url";

type PiecesNames = "Pawn" | "King" | "Queen" | "Knight" | "Bishop" | "Rook";

class Assets {
    public readonly loaded: Promise<boolean>;
    #pieces!: Record<PiecesNames, Object3D>;
    #board!: Object3D;

    constructor(url: string) {
        const loader = new GLTFLoader();
        this.loaded = new Promise((resolve) => {
            loader.load(url, (gltf) => {
                this.#board = gltf.scene.children.find(({name}) => name === "Case") as Object3D;
                this.#pieces = Object.fromEntries(
                    gltf.scene.children
                    .filter(({name}) => ["Pawn", "King", "Queen", "Knight", "Bishop", "Rook"].includes(name))
                    .map((obj) => [[obj.name as PiecesNames], obj as Object3D])
                );
                resolve(true);
            });
        });
    }

    get board(): Object3D {
        return this.#board;
    }

    get pieces(): Record<PiecesNames, Object3D> {
        return this.#pieces;
    }
}

export default new Assets(chessAssets);
