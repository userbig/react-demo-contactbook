import Index from '../pages/Index'
// import About from '../pages/About'
// import Help from '../pages/Help'
// import NoMatch from '../pages/NoMatch'
import Contacts from '../components/Contacts'
// import Child from "../components/Contacts/child";


// pizdec a ne routing

const routes = [
    {
        path: '/',
        exact: true,
        component: Index,
        name: 'Home'
    },
    {
        path: '/contacts',
        component: Contacts,
        name: 'Contacts',
    },
    // {
    //     path: '/about',
    //     component: About,
    //     name: 'About',
    // },
    // {
    //     path: '/help',
    //     component: Help,
    //     name: 'Help'
    // },
    // {
    //     component: NoMatch
    // }
];

export default routes;