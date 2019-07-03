import React from 'react';
import { connect } from "react-redux";
import { compose } from "recompose";
import { withFirebase } from "../firebase";

const withAuthorization = condition => Component => {
    class WithAuthorization extends React.Component {
        componentDidMount() {
            this.listener = this.props.fire.onAuthUserListener(
                authUser => {
                    if(!condition(authUser)) {
                        console.log('user not sighned')
                    }
                },
                () => {
                    console.log('another not sighned?!?!?')
                }
            )
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            return condition(this.props.authUser) ? (
                <Component {...this.props} />
            ) : null;
        }
    }

    const mapStateToProps = state => ({
        authUser: state.sessionState.authUser,
    });

    return compose(
        withFirebase,
        connect(
            mapStateToProps
        )
    )(WithAuthorization);

};

export default withAuthorization;
