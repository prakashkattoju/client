export const startPlayer = (id,current,list,alter) => async dispatch =>{
    dispatch({
        type: 'START',
        payload: {
            id: id,
            current: current,
            list: list,
            alter: alter
        }
    })
}

export const closePlayer = () => dispatch =>{
    dispatch({
        type: 'CLOSE'
    })
}

export const createList = (song) => async dispatch =>{
    dispatch({
        type: 'ADDTOLIST',
        payload: song
    })
}

export const Toggle = (toggle) => dispatch =>{
    dispatch({
        type: 'TOGGLE',
        payload: toggle
    })
}

export const setAuth = (token) => dispatch =>{
    dispatch({
        type: 'LOGIN',
        payload: token
    })
}

export const removeAuth = (token) => dispatch =>{
    dispatch({
        type: 'LOGOUT',
        payload: token
    })
}

