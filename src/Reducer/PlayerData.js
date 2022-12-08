const initialState = []

export function PlayerData(state = initialState, action){
    const {type,payload} = action
    switch(type){
        case 'START':
            return [payload]
        case 'CLOSE':
            return []
        default:
            return state
    }
}