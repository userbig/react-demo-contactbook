import { AUTH_USER_SET } from '../actions/user';


const INITIAL_STATE = {
    authUser: null,
};

const applySetAuthUser = (state, action) => ({
   ...state,
   authUser: action.authUser,
});

function sesstionReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
        case AUTH_USER_SET: {
            return applySetAuthUser(state,action)
        }
        default: {
            return state;
        }
    }
}


export default sesstionReducer;