const initialState = {
    sanity: 'Hello',
    isLoggedin: false,
    token: null,
    loading: false
}

const authReducer = (state=initialState, action) => {
    switch(action.type) {
        case 'IS_LOGGED_IN':
            console.log('Action Triggered.'); 
            return {
                ...state,
                isLoggedin: true,
                loading: false,
            };
    
        default :
            return state;
    }
}

export default authReducer;