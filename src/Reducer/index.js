import { combineReducers } from "redux";
import { Auth } from "./Auth";
import { IsPlaying } from "./IsPlaying";
import { PlayerData } from "./PlayerData";

const reducer = combineReducers({
    PlayerData: PlayerData,
    IsPlaying: IsPlaying,
    Auth: Auth
})

export default reducer