import React from 'react';
import {Container, Header} from "semantic-ui-react";
// import fire from "../components/firebase/Fire";

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {data: []};
    }
    componentDidMount() {

    }



    render() {
         return (
             <Container>
                 <Header as={'h2'}>
                     Hello there!
                 </Header>
                 <p>
                     This is my test project of creating contact list using React +
                     Redux and Firebase as database. Also i use Semantic-ui as my UI wrapper.
                 </p>
                     <h3>Okay, how i cant start using this 'app'?</h3>
                 <p>
                     <p>
                         First of all you need to proceed registration on the site via that tiny on right side of navbar. <br/>
                         Then you will have access to page with your contact book where you can <b>add, edit, delete</b> contacts.
                     </p>
                 </p>
             </Container>

         )
    }
}


export default Index;