import React from 'react'
// import {toggleLeftDrawer} from "../../redux/actions/drawer";
import {connect} from "react-redux";
import {Container, Menu} from 'semantic-ui-react'
import './Header.scss';
import routes from '../../routes/routes'
import { NavLink } from 'react-router-dom'
import HeaderAuth from './HeaderAuth';

class Header extends React.Component {

    render() {

        return (
            <Menu className={'AppBar'}>
                <Container>
                    <Menu.Item>
                        <img src='https://react.semantic-ui.com/logo.png' />
                    </Menu.Item>

                    {routes.map((route, index) => (
                        route.path
                            ? <Menu.Item
                            as={NavLink}
                            to={route.path}
                            exact
                            key={index}
                        >
                            {route.name}
                        </Menu.Item>
                            : ''

                    ))}
                    <HeaderAuth/>

                </Container>
            </Menu>

        )
    }
}

const mapStateToProps = store => {
    return {
        leftDrawer: store.uiState.leftDrawer
    }
};


export default connect(mapStateToProps)(Header);