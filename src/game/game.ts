import { createGame, hardDeleteGame, softDeleteGame, updateGame } from "src/utils/types";

export interface IGameService {
    createGame(data:createGame);
    getAllGame();
    updateGame(data:updateGame);
    softDeleteGame(data:softDeleteGame);
    hardDeleteGame(data:hardDeleteGame);
    getGameByName(name:string)
}