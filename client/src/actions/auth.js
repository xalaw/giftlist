export const IS_LOGGED_IN = 'IS_LOGGED_IN';
export const isLoggedIn = (_id, token) => ({
    type: IS_LOGGED_IN,
    isLoggedin : true,
    _id,
    token
});