import React from 'react';

import { connect } from "react-redux";

import { compose } from "recompose";

import { Button, Modal, Form, Tab } from "semantic-ui-react";

import { withFirebase } from "../firebase";

import {TOGGLE_SIGHIN_MODAL} from "../../redux/actions/modal";

import { toast } from 'react-toastify';


const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
    reg: {
        email: '',
        password: ''
    }
};

class HeaderAuthModalSignIn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {...INITIAL_STATE};
    }

    close = () => { this.props.toggleModal()};

    onRegistration = event => {
        const { email, password } = this.state.reg;
        this.props.fire
            .doCreateUserWithEmailAndPassword(email, password)
            .then(() => {
                console.log('new user created!')
                this.setState({...INITIAL_STATE});
                this.props.toggleModal()
                toast.success('Yay!')
            });

        event.preventDefault();
    };

    onSubmit = event => {
        const { email, password } = this.state;

        this.props.fire
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({...INITIAL_STATE});
                console.log('i guess we sighned in?')
                this.props.toggleModal()
                toast.success('Yay!')
            })
            .catch(error => {
                this.setState({error});
            });
        event.preventDefault();
    };


    onRegChange = event => {
        this.setState(
            {
                reg: {
                    ...this.state.reg,
                    [event.target.name]: event.target.value
                }

            });
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value});
    };

    render() {

        const panes = [
            { menuItem: 'Sign In', render: () =>
                    <div>
                        <Form onSubmit={this.onSubmit}>
                            <Form.Field>
                                <label>Email</label>
                                <input
                                    name={'email'}
                                    type="text"
                                    value={this.state.email}
                                    onChange={this.onChange}
                                    placeholder={'email'}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Password</label>
                                <input
                                    name={'password'}
                                    onChange={this.onChange}
                                    type="password"
                                    placeholder={'password'}
                                />
                            </Form.Field>

                            <Button disabled={this.state.isInvalid} type="submit">
                                Sign In
                            </Button>

                            {this.state.error && <p>{this.state.error.message}</p>}
                        </Form>
                    </div>
            },
            { menuItem: 'Sign Up', render: () =>
                    <div>
                        <div>
                            <Form onSubmit={this.onRegistration}>
                                <Form.Field>
                                    <label>Email</label>
                                    <input
                                        name={'email'}
                                        type="text"
                                        value={this.state.reg.email}
                                        onChange={this.onRegChange}
                                        placeholder={'email'}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Password</label>
                                    <input
                                        name={'password'}
                                        onChange={this.onRegChange}
                                        type="password"
                                        placeholder={'password'}
                                    />
                                </Form.Field>

                                <Button disabled={this.state.isInvalid} type="submit">
                                    Sign Up
                                </Button>

                                {this.state.error && <p>{this.state.error.message}</p>}
                            </Form>
                        </div>

                    </div>
            }
        ];

        return (
            <Modal
            open={this.props.modal.isOpen}
            closeOnEscape={false}
            closeOnDimmerClick={true}
            size={'tiny'}
            onClose={this.close}
            >
                <Modal.Content>
                    <div style={{display: 'inline-flex', width: '100%'}}>
                        <div className="art" style={{display: 'flex',
                            width: 260,
                            height: 400,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: '0% 50%',
                            borderTopLeftRadius: '6px',
                            borderBottomLeftRadius: '6px',
                            margin: '21px 20px 0px -21px',
                            backgroundImage: 'url(https://cdn.discordapp.com/attachments/577353780899610625/592965683713671190/unknown.png)'
                        }}/>
                        <div className="rest" style={{display: 'flex', width: '100%'}}> <Tab menu={{ secondary: true }} panes={panes} style={{width: '100%'}} /></div>
                    </div>
                </Modal.Content>

            </Modal>
        )
    }
}




function mapStateToProps(state){
    return {
        modal: state.uiState.sighInModal
    }
};

function mapDispatchToProps(dispatch){
    return {
        toggleModal: () => dispatch({type: TOGGLE_SIGHIN_MODAL})
    }
};


export default compose(withFirebase, connect(mapStateToProps, mapDispatchToProps))(HeaderAuthModalSignIn);