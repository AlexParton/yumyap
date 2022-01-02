import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}
});

export const AuthContextProvider = props => {
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [loggedIn, setLoggedIn] = useState(false)

    const loginHandler = (token) => {
        setToken(token);
        setLoggedIn(true)
        navigate('/', {replace:true})
    }

    const logoutHandler = () => {
        setToken('');
        navigate('/registro', {replace:true})
    }

    const contextValue = [{
        token: token,
        isLoggedIn: loggedIn,
        login: (token) => loginHandler(token),
        logout: logoutHandler
    }];

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
        );
}

export default AuthContext;