import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'semantic-ui-css/semantic.min.css'

import { Provider } from 'react-redux';
import store from './configureStore';

import Fire, { FirebaseContext } from './components/firebase';

import * as serviceWorker from './serviceWorker';


ReactDOM.render(
    <FirebaseContext.Provider value={new Fire()}>
        <Provider store={store}>
            <App/>
        </Provider>
    </FirebaseContext.Provider>

    , document.getElementById('root'));

serviceWorker.unregister();
