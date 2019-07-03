import React from 'react';
import Header from './components/Header/Header';
import {
    BrowserRouter,
    Route,
    Switch,
} from 'react-router-dom'
import { connect } from 'react-redux';
import routes from './routes/routes';

import { compose } from "recompose";
import { withFirebase}  from "./components/firebase";
import { withAuthentication } from './components/Session';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class App extends React.Component {
    render() {
        return (
            <div>
                <BrowserRouter>
                    <Header/>
                        <Switch>
                            {routes.map((route, index) => (
                                <Route
                                    key={index}
                                    {...route}
                                />
                            ))}

                        </Switch>
                </BrowserRouter>
                <ToastContainer />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        uiState: state.uiState,
    }
};

export default  compose(withFirebase, withAuthentication,connect(mapStateToProps))(App);
