import React from 'react';
import { connect } from "react-redux";
import { compose } from "recompose";
import { Dropdown, Menu } from "semantic-ui-react";
import HeaderAuthModalSighIn from './HeaderAuthModalSignIn';
import {TOGGLE_SIGHIN_MODAL} from "../../redux/actions/modal";

import { withFirebase } from "../firebase";


class HeaderAuth extends React.Component {

    signOutHandler(e) {
        e.preventDefault();
        this.props.fire.doSignOut()
    }

    render() {
        return (
        <Menu.Menu position='right'>
            <HeaderAuthModalSighIn/>
            {this.props.authUser ?
                (
                   <Dropdown text={'Hello ' + this.props.authUser.email} pointing className={'link item'} >
                       <Dropdown.Menu>
                            <Dropdown.Item onClick={this.signOutHandler.bind(this)}>
                                SignOut
                            </Dropdown.Item>
                       </Dropdown.Menu>
                   </Dropdown>
                ) : (
                    <Menu.Item onClick={this.props.toggleModal}>
                        You need to SignIn
                    </Menu.Item>
                )

            }
        </Menu.Menu>

        )
    }
}



function mapStateToProps (state){
    return {
        authUser: state.sessionState.authUser,
        modal: state.uiState.sighInModal
    }
}

function mapDispatchToProps(dispatch) {
    return {
        toggleModal: () => dispatch({type: TOGGLE_SIGHIN_MODAL})
    }
}



export default compose(withFirebase, connect(mapStateToProps, mapDispatchToProps))(HeaderAuth);