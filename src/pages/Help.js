import React from 'react';
import { compose } from 'recompose';
import { connect } from "react-redux";
// import { withFirebase } from "../components/firebase";
import { withAuthorization } from '../components/Session';

class Help extends React.Component {
    render() {
        return (
            <div>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vulputate eu scelerisque felis imperdiet proin. Velit laoreet id donec ultrices tincidunt arcu non. Mollis aliquam ut porttitor leo a diam sollicitudin tempor id. Sollicitudin ac orci phasellus egestas tellus. Elit eget gravida cum sociis natoque penatibus. Elementum tempus egestas sed sed risus pretium quam vulputate dignissim. Arcu felis bibendum ut tristique et egestas quis ipsum suspendisse. Laoreet id donec ultrices tincidunt arcu non sodales neque sodales. Curabitur gravida arcu ac tortor. Tristique nulla aliquet enim tortor at auctor urna nunc. Velit egestas dui id ornare arcu odio ut sem nulla. Egestas integer eget aliquet nibh praesent tristique magna sit amet.
                </p>
                <p>
                    Tellus id interdum velit laoreet. Velit laoreet id donec ultrices tincidunt arcu non sodales. Suspendisse sed nisi lacus sed viverra tellus in hac. Sit amet facilisis magna etiam tempor orci eu lobortis elementum. Euismod in pellentesque massa placerat. Aenean pharetra magna ac placerat vestibulum lectus mauris. Id consectetur purus ut faucibus. Facilisi morbi tempus iaculis urna id volutpat lacus laoreet non. Amet nisl purus in mollis nunc. Non curabitur gravida arcu ac tortor dignissim convallis. Imperdiet massa tincidunt nunc pulvinar sapien et ligula. Mi bibendum neque egestas congue quisque egestas diam in arcu. Nibh cras pulvinar mattis nunc sed. Dignissim diam quis enim lobortis scelerisque. Dui id ornare arcu odio ut sem. Amet facilisis magna etiam tempor orci eu lobortis. Volutpat blandit aliquam etiam erat velit.
                </p>
           </div>
        )
    }
}



const mapStateToProps = state => ({
    authUser: state.sessionState.authUser
});

const condition = authUser => !!authUser;

export default compose(
    connect(mapStateToProps),
    withAuthorization(condition)
)(Help);