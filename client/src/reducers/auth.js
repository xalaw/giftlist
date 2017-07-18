const initialState = {
    sanity: 'Hello'
}

const authReducer = (state=initialState, action) => {
    switch(action.types) {
        case '': 
            return {};
        
        default :
            return state;
    }
}

export default authReducer;