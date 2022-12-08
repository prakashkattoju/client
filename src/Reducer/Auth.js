const initialState = {
    auth: false
}

export function Auth(state = initialState, action) {
    const { type, payload } = action
    switch (type) {
        case 'LOGIN':
            localStorage.setItem('accessToken', payload)
            return { ...state, auth: true }
        case 'LOGOUT':
            localStorage.removeItem('accessToken')
            return { ...state, auth: false}
        default:
            return state
    }
}