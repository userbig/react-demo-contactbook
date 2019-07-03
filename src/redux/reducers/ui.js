import { TOGGLE_LEFTDRAWER } from '../actions/drawer';
import { TOGGLE_SIGHIN_MODAL } from '../actions/modal';
import { TOGGLE_ADD_MODAL } from '../actions/modal';

const INITIAL_STATE = {
    leftDrawer: {
        isOpen: false,
        width: 300
    },
    sighInModal: {
        isOpen: false,
    },
    addContactModal: {
        isOpen: false
    }
};

function ui(state = INITIAL_STATE, action) {
    console.log('reducer toggled');
    switch(action.type) {
        case TOGGLE_LEFTDRAWER:
            return {
                ...state,
                leftDrawer: {
                    isOpen: !state.leftDrawer.isOpen,
                    width: state.leftDrawer.width
                }
            };
        case TOGGLE_SIGHIN_MODAL: {
            return {
                ...state,
                sighInModal: {
                    isOpen: !state.sighInModal.isOpen
                }
            }
        }
        case TOGGLE_ADD_MODAL: {
            return {
                ...state,
                addContactModal: {
                    isOpen: !state.addContactModal.isOpen
                }
            }
        }
        default: return state;
    }
}



export default ui;