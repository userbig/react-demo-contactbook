import React from 'react';
import { compose } from 'recompose';
import {withFirebase} from "../components/firebase";



const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};
    }

    onSubmit = event => {
        const { email, password } = this.state;

        this.props.fire
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({...INITIAL_STATE});
                console.log('i guess we sighned in?')
            })
            .catch(error => {
                this.setState({error});
            });
        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value});
    };

    render() {
        const { email, password, error } = this.state;

        const isInvalid = password === '' || email === '';

        return (
            <div>
                About page
                <hr/>
                <form onSubmit={this.onSubmit}>
                    <input
                        name={'email'}
                        type="text"
                        value={email}
                        onChange={this.onChange}
                        placeholder={'email'}
                    />
                    <input
                        name={'password'}
                        onChange={this.onChange}
                        type="password"
                        placeholder={'password'}
                    />

                    <button disabled={isInvalid} type="submit">
                        Sign In
                    </button>

                    {error && <p>{error.message}</p>}
                </form>
            </div>
        )
    }
}

export default compose(withFirebase)(About);