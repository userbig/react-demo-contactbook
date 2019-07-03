import React from 'react';


const FirebaseContext = React.createContext(null)

export const withFirebase = Component => props => (
    <FirebaseContext.Consumer>
        {fire => <Component {...props} fire={fire}/>}
    </FirebaseContext.Consumer>
)


export default FirebaseContext;