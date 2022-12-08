const initialState = false

export function IsPlaying(state = initialState, action){
    const {type, payload} = action
    switch(type){
        case 'TOGGLE':
            return !payload
        default:
            return state
    }
}