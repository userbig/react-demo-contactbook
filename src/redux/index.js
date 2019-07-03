import { combineReducers } from 'redux'
import ui from './reducers/ui'
import userReducer from './reducers/user'
import sessionReducer from './reducers/session'

const rootReducer = combineReducers({
    uiState: ui,
    sessionState: sessionReducer,
    userState: userReducer,
});

export default rootReducer;