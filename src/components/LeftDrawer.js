import React from 'react';
import { connect } from 'react-redux';

function LeftDrawer(store){



        return (
           <div>
           </div>
            )
}

const mapStateToProps = store => {
    return {
        leftDrawer: store.uiState.leftDrawer

    }
};

export default connect(mapStateToProps)(LeftDrawer);