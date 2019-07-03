import React from 'react';

import {Container, Segment, Search, List, Image, Modal, Form, Grid, Label, Popup} from "semantic-ui-react";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import ContactsAddModal from "./ContactsAddModal";

import {connect} from "react-redux";
import {compose} from "recompose";
import {withFirebase} from "../firebase";
import { withAuthorization } from '../../components/Session';
import {TOGGLE_ADD_MODAL} from "../../redux/actions/modal";

import ImageUploader from 'react-images-upload';
import 'react-inputs-validation/lib/react-inputs-validation.min.css';

import { toast } from 'react-toastify';

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            contacts: [],
            selected: null,
            modal: {
                isOpen: false,
            },
            edit: {
                name: null,
                phone: null,
                email: null,
                company: null,
                photo: {
                    file: null,
                    url: null,
                },
            },
            search: {
                isLoading: false,
                results: [],
                value: ''
            }
        }
    }

    componentDidMount() {
        this.setState({loading: true});

        this.props.fire.contact(this.props.authUser.uid).on('value', snapshot => {
            const contactsObject = snapshot.val();

            if(contactsObject) {
                const contactsList = Object.keys(contactsObject).map(key => ({
                    ...contactsObject[key],
                    uid: key,
                }));


                this.setState({
                    contacts: contactsList,
                    loading: false
                })
            }
        })
    }

    onSelect = (e) => {
        console.log('selected contact');
        this.setState({
            selected: e.uid
        })
    };

    modalHandler = (e) => {
        this.setState({
            modal: {
                isOpen: !this.state.modal.isOpen
            },
            edit: e,
        })
    };

    handlePhoto = (e) => {
        this.setState(prevState => ({
            ...prevState,
            edit: {
                ...prevState.edit,
                photo:{
                    file: e[0],
                    url: URL.createObjectURL(e[0])
                }
            }
        }));

    };

    editHandler = (e) => {
        console.log(e)
        e.persist()
        this.setState(prevState => ({
            ...prevState,
            edit: {
                ...prevState.edit,
                [e.target.name]: e.target.value
            }
        }));
    };

    deleteHandler = (e) => {
        if(window.confirm('are you sure?')) {
            this.props.fire.contact(this.props.authUser.uid).child(this.state.selected).remove().then(() => {
                toast.success("Contact was deleted!");

                this.setState({
                    modal: {
                        isOpen: !this.state.modal.isOpen
                    }
                });
            }
        );
        }
    };

    handleResultSelect = (e, {result}) => {
        this.setState({
            selected: result.uid
        })
        console.log('select SEARCH');
    };
    handleSearchChange = (e) => {
        this.props.fire.contact(this.props.authUser.uid).orderByChild('name')
            .startAt(e.target.value)
            .endAt(`${e.target.value}\uf8ff`)
            .on('value', (snap) => {
                if(snap.val()) {
                    var contactsList = Object.keys(snap.val()).map(key => ({
                        ...snap.val()[key],
                        uid: key,
                        title: snap.val()[key].name
                    }))
                }

                    this.setState({
                search: {
                    results: contactsList
                }
            })
        })
    };

    submitHandler = (e) => {

        const key = this.props.fire.db.ref().child(this.props.authUser.uid).push().key;
        const img = this.props.fire.storage.ref().child(this.props.authUser.uid).child(key);

        const updateContact = (url = null) => {
            this.props.fire.contact(this.props.authUser.uid).child(this.state.selected).update({
                name: this.state.edit.name,
                phone: this.state.edit.phone,
                company: this.state.edit.company,
                email: this.state.edit.email,
                photo: (url ? url : this.state.edit.photo)
            });

            this.setState({
                modal: {
                    isOpen: !this.state.modal.isOpen
                }
            });
            toast.success("Contact was updated!");

        };


        if(this.state.edit.photo.file) {

            var uploadTask = img.put(this.state.edit.photo.file);


            console.log(this.state.selected.uid);


            uploadTask.on('state_changed',
                function (snapshot) {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes * 100);
                    switch (snapshot.state) {
                        case 'paused': // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case 'running': // or 'running'
                            console.log('Upload is running');
                            break;
                    }
                }, function (error) {
                    switch (error.code) {
                        case 'storage/unauthorized':
                            break;
                        case 'storage/canceled':

                            break;
                        case 'storage/unknown':
                            break;
                    }
                }, function () {
                    // Upload completed successfully, now we can get the download URL
                    uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                        console.log('File available at', downloadURL);

                        updateContact(downloadURL)

                    });
                });
        } else {
            updateContact()
        }
    };

    childEvent = (e) => {
       this.setState({
           selected: e
       })
    }


    render() {
        const { contacts, loading, selected, modal, edit } = this.state;

        return (
            <Container>
                <Segment>
                    Here you go! This is your contacts! Create some!
                </Segment>


                <div style={{display: 'flex',
                    justifyContent: 'space-between'}}>
                    <div style={{display: 'flex'}}>
                    <Button onClick={this.props.toggleModal}>Add new</Button>
                    </div>

                    <div style={{display: 'flex'}}>
                        <Popup content='❗ Case sensitive ❗'
                               position='top center'
                               trigger={
                            <Search
                                onResultSelect={this.handleResultSelect}
                                fluid
                                onSearchChange={this.handleSearchChange}
                                resultRenderer={resultRenderer}

                                results={this.state.search.results}
                            >
                            </Search>
                        }/>
                    </div>
                </div>
                <br/>

                {loading && <React.Fragment>Loading...</React.Fragment>}

                { contacts ? (
                    <div style={{display: 'flex'}}>
                        <div style={{width: 256}}>
                            <ContactList
                                contacts={contacts}
                                onSelect={this.onSelect}
                            />
                        </div>
                        <div style={{width: '100%'}}>
                            <ContactData selected={this.state.contacts.find(obj => {
                                return obj.uid === this.state.selected
                            })}
                                         modalHandler={this.modalHandler}/>
                        </div>
                        <EditModal edit={edit} modal={modal} modalHandler={this.modalHandler}
                                   handlePhoto={this.handlePhoto}
                                   editHandler={this.editHandler}
                                   submitHandler={this.submitHandler}
                                   deleteHandler={this.deleteHandler}
                        />
                    </div>

                    ) : (
                    <React.Fragment>you dont have any contacts</React.Fragment>
                    )}

                    <ContactsAddModal childEvent={this.childEvent} />
            </Container>
        )
    }
}



const resultRenderer = ({ name, photo, phone, title }) => {
    return (
        <React.Fragment key={name}>
            <Label content={name}/>
            <Image src={photo} style={{borderRadius: '50%', height: 32, width: 32}} />
        </React.Fragment>
        )
};


const EditModal = ({edit, modal, modalHandler, handlePhoto, editHandler, submitHandler, deleteHandler}) => (
    <div>
    {edit ? (
    <Modal
        open={modal.isOpen}
    >
        <Modal.Header>Edit {edit.name} contact</Modal.Header>
        <Modal.Content>
           <Form>
               <Grid columns={2} divided>
                   <Grid.Row >
                       <Grid.Column>

                           {/*<input type="file" id={'photoFile'} name={'photo'} onChange={(e) => handlePhoto(e)}/>*/}


                           <ImageUploader
                               withIcon={true}
                               onChange={(e) => handlePhoto(e)}
                               imgExtension={['.jpg', '.gif', '.png', '.gif']}
                               maxFileSize={5242880}
                               singleImage={true}
                               // withPreview
                               buttonText={'Chose image'}
                           />

                           <img src={edit.photo.url || edit.photo} alt=""/>
                       </Grid.Column>
                       <Grid.Column>
                           <Form.Field>
                               <label>Name, Surname</label>
                               <input type="text" name={'name'} value={edit.name}  onChange={(e) => editHandler(e)} />
                           </Form.Field>
                           <Form.Field>
                               <label>Email</label>
                               <input type="text" name={'email'} value={edit.email} onChange={(e) => editHandler(e)} />
                           </Form.Field>

                           <Form.Field>
                               <label>Phone number</label>
                               <input type="text" name={'phone'} value={edit.phone} onChange={(e) => editHandler(e)}  />
                           </Form.Field>
                           <Form.Field>
                               <label>Company</label>
                               <input type="text" name={'company'} value={edit.company} onChange={(e) => editHandler(e)} />
                           </Form.Field>
           </Grid.Column>

        </Grid.Row>

    </Grid>

           </Form>
        </Modal.Content>
        <Modal.Actions>
            <Button.Group>
                <Button type="submit" onClick={(e) => submitHandler(e)} confirm>
                    Update
                </Button>
                <Button.Or />
                <Button onClick={(e) => deleteHandler()} negative>
                    I want to delete this
                </Button>
                <Button.Or />
                <Button onClick={(e) => modalHandler()} secondary>
                    i change my mind
                </Button>
            </Button.Group>


        </Modal.Actions>
    </Modal>
        ) : ('')}
    </div>
);

const ContactData = ({selected, modalHandler}) => {

    return (
        <React.Fragment>
            {selected ? (
                <div style={{position: 'relative'}}>
                    <Button onClick={(e) => modalHandler(selected)} primary
                            style={{position: 'absolute', right: 0, top: 0}}>Edit</Button>
                    <div style={{display: 'flex', paddingBottom: '1em'}}>
                        <div style={{display: 'flex', paddingRight: '1em'}}>
                            <Image size='small' circular src={selected.photo}/>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                    <span style={{fontSize: '3em', paddingBottom: '1em'}}>
                        {selected.name}
                    </span>
                            <span>
                        <span>Phone: </span> <span>{selected.phone}</span>
                    </span>
                        </div>
                    </div>
                    <React.Fragment>
                        <List celled>
                            <List.Item>
                                <List.Icon name='mail'/>
                                <List.Content>
                                    <List.Header>Email</List.Header>
                                    {selected.email}
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='world'/>
                                <List.Content>
                                    <List.Header>Company</List.Header>
                                    {selected.company}
                                </List.Content>
                            </List.Item>
                        </List>
                    </React.Fragment>

                </div>
            ) : (
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <h1>
                        nothing
                    </h1>
                </div>
            )

            }
        </React.Fragment>
    )
};


const ContactList = ({contacts, onSelect}) => (
    <List selection verticalAlign='middle'>
        {contacts.map(contact => (
            <ContactItem
            key={contact.uid}
            contact={contact}
            onSelect={onSelect}
            />
        ))}
    </List>
);


const ContactItem = ({contact, onSelect}) => (

    <List.Item onClick={(e) => onSelect(contact)}>
        <Image avatar src={contact.photo}/>
        <List.Content>
            {contact.name}
        </List.Content>
    </List.Item>
)


function mapStateToProps(state) {
    return {
        authUser: state.sessionState.authUser,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        toggleModal: () => dispatch({type: TOGGLE_ADD_MODAL})
    }
}

const condition = authUser => !!authUser;

export default compose(withFirebase, withAuthorization(condition), connect(mapStateToProps, mapDispatchToProps))(Index);