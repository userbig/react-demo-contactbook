import React from 'react';
import {withFirebase} from "../firebase";
import {connect} from "react-redux";
import {compose} from "recompose";
import {TOGGLE_ADD_MODAL} from "../../redux/actions/modal";
import { Button, Modal, Form, Grid } from "semantic-ui-react";
import { Textbox } from "react-inputs-validation";
import ImageUploader from 'react-images-upload';


import 'react-inputs-validation/lib/react-inputs-validation.min.css';






const INITIAL_STATE = {
    name: {
        value: '',
        validate: false
    },
    phone: {
        value: '',
        validate: false
    },
    email: {
        value: '',
        validate: false
    },
    company: {
        value: '',
        validate: false
    },
    photo: {
        file: null,
        url: null,
    },
};

class ContactsAddModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};

    }


    onSubmit = event => {
        const key = this.props.fire.db.ref().child(this.props.authUser.uid).push().key;
        const img = this.props.fire.storage.ref().child(this.props.authUser.uid).child(key);

        var that = this;

        var uploadTask = img.put(this.state.photo.file);

        uploadTask.on('state_changed',
            function (snapshot) {
                switch (snapshot.state) {
                    case 'paused': // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case 'running': // or 'running'
                        console.log('Upload is running');
                        break;
                }
            }, function(error) {
                switch (error.code) {
                    case 'storage/unauthorized':
                        break;
                    case 'storage/canceled':

                        break;
                    case 'storage/unknown':
                        break;
                }
            }, function() {
                // Upload completed successfully, now we can get the download URL
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    console.log('File available at', downloadURL);

                    that.props.fire.contact(that.props.authUser.uid).push({
                            name: that.state.name.value,
                            phone: that.state.phone.value,
                            email: that.state.email.value,
                            company: that.state.company.value,
                            photo: downloadURL
                        }).then((res) => {
                            that.props.childEvent(res.key)
                    });
                    that.props.toggleModal();
                    that.setState(INITIAL_STATE);

                });
            });
    }


    handlePhoto(photo) {
        console.log(photo[0])
        this.setState({
            photo:{
                file: photo[0],
                url: URL.createObjectURL(photo[0])
            }
        })
        console.log()
    }

    onChange = event => {
        this.setState({[event.target.name.value]: event.target.value})
    };

    render() {


        const isInvalid =  this.state.photo.file !== null && this.state.email.validate === true && this.state.name.validate === true && this.state.phone.validate === true && this.state.company.validate === true;



        return (
            <Modal open={this.props.modal.isOpen}>
                <Modal.Header>Create new contact</Modal.Header>
                <Modal.Content>
                    <Form>
                    <Grid columns={2} divided>
                        <Grid.Row >
                            <Grid.Column>

                                <ImageUploader
                                    withIcon={true}
                                    onChange={this.handlePhoto.bind(this)}
                                    imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                    maxFileSize={5242880}
                                    singleImage={true}
                                    // withPreview
                                    buttonText={'Chose image'}
                                />

                                <img src={this.state.photo.url} alt=""/>
                            </Grid.Column>
                            <Grid.Column>
                                    <Form.Field>
                                        <label>Name, Surname</label>
                                        <Textbox
                                            tabIndex="1"
                                            type="text"
                                            id={'name'}
                                            name={'name'}
                                            value={this.state.name.value}
                                            placeholder="Name, Surname"
                                            onBlur={e => {}}
                                            validationOption={{
                                                name: 'Name',
                                                check: true,
                                                required: true,
                                            }}

                                            validationCallback={res =>
                                                this.setState({name: {
                                                    ...this.state.name,
                                                        validate: !res
                                                    }})}




                                            onChange={(name, e) => {
                                                this.setState({name: {
                                                    ...this.state.name,
                                                    value: name
                                                    }});
                                            }} />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Email</label>
                                        <Textbox
                                        tabIndex="1" //Optional.[String or Number].Default: -1.
                                        id={"email"} //Optional.[String].Default: "".  Input ID.
                                        name="email" //Optional.[String].Default: "". Input name.
                                        type="text" //Optional.[String].Default: "text". Input type [text, password, phone, number].
                                        value={this.state.email.value} //Optional.[String].Default: "".
                                        placeholder="Email" //Optional.[String].Default: "".
                                        onChange={(email, e) => {
                                            this.setState({ email: {
                                                value: email
                                                } });
                                            console.log(e);
                                        }}

                                        validationCallback={res =>
                                            this.setState({email: {
                                                    ...this.state.email,
                                                    validate: !res
                                                }})}
                                        onBlur={e => {}} //Optional.[Func].Default: none. In order to validate the value on blur, you MUST provide a function, even if it is an empty function. Missing this, the validation on blur will not work.
                                        validationOption={{
                                            name: "Email", //Optional.[String].Default: "". To display in the Error message. i.e Please enter your {name}.
                                            check: true, //Optional.[Bool].Default: true. To determin if you need to validate.
                                            required: true, //Optional.[Bool].Default: true. To determin if it is a required field.
                                            customFunc: email => {
                                                const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                                if (reg.test(String(email).toLowerCase())) {
                                                    return true;
                                                } else {
                                                    return "is not a valid email address";
                                                }
                                            }
                                        }}
                                    />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Phone number</label>
                                        <Textbox type="text"
                                                 name={'phone'}
                                                 onChange={(phone, e) => {
                                                     this.setState({ phone: {
                                                         value: phone
                                                         } });
                                                     console.log(e);
                                                 }}
                                                 value={this.state.phone.value}
                                                 placeholder="Phone"
                                                 onBlur={e => {}}
                                                 validationOption={{
                                                     name: 'Phone',
                                                     check: true,
                                                     required: true,
                                                 }}
                                                 validationCallback={res =>
                                                     this.setState({phone: {
                                                             ...this.state.phone,
                                                             validate: !res
                                                         }})}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Company</label>
                                        <Textbox type="text"
                                                 name={'company'}

                                                 onChange={(company, e) => {
                                                     this.setState({ company: {
                                                         value: company
                                                         } });
                                                     console.log(e);
                                                 }}
                                                 value={this.state.company.value}
                                                 placeholder="Сompany"
                                                 onBlur={e => {}}
                                                 validationOption={{
                                                     name: 'Сompany',
                                                     check: true,
                                                     required: true,
                                                 }}
                                                 validationCallback={res =>
                                                     this.setState({company: {
                                                             ...this.state.company,
                                                             validate: !res
                                                         }})}

                                        />
                                    </Form.Field>

                            </Grid.Column>

                        </Grid.Row>

                    </Grid>
                    </Form>
                </Modal.Content>
                <Modal.Actions>

                    <Button.Group>

                        <Button type="submit" onClick={this.onSubmit} disabled={!isInvalid}>
                            Store
                        </Button>
                        <Button.Or />
                        <Button onClick={this.props.toggleModal} secondary>
                            i change my mind
                        </Button>
                    </Button.Group>
                </Modal.Actions>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        modal: state.uiState.addContactModal,
        authUser: state.sessionState.authUser,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        toggleModal: () => dispatch({type: TOGGLE_ADD_MODAL})
    }
}

export default compose(withFirebase, connect(mapStateToProps,mapDispatchToProps))(ContactsAddModal);