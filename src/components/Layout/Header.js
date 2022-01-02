import React from "react";
import { AiOutlineUserAdd as UserIcon } from "react-icons/ai";
import { GiCook as MenuIcon } from "react-icons/gi";
import { IoArrowBack as BackIcon } from "react-icons/io5";
import HeartLogo from '../../assets/recetapp-logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import MyFirebase from '../../database/firebase';
import Sidebar from './Sidebar';
import Overlay from './Overlay';

const app = MyFirebase();

const Header = props => {
    const navigate = useNavigate();
    const [sidebarStatus, setSidebarStatus] = useState('off');
    const [user, setUser] = useState([]);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [userComplete, setUserComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const userId = (localStorage.getItem('uid')) ? localStorage.getItem('uid') : null;
    const isLoggedIn = !!(localStorage.getItem('uid'));
    const isDesktop = window.matchMedia('(min-width:1000px)').matches;
    useEffect(() => {
        if (isLoggedIn) {
            const db = getDatabase(app);
            const userRef = ref(db, 'users/'+userId);
            onValue(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    let loadedUser = {
                        avatarId: snapshot.val().avatar,
                        displayName: snapshot.val().displayName,
                        };
                        setUser(loadedUser);
                } else {
                    let loadedUser = {
                        avatarId: null,
                        displayName: '',
                        };
                        setUser(loadedUser);
                }
                
                setIsLoading(false);
            });

            const storage = getStorage();
            getDownloadURL(storageRef(storage, `users/${userId}/avatar/${user.avatarId}`))
            .then((url) => {
                setAvatarUrl(url);
                setUserComplete(true);
            })
            .catch((error) => {
                // Handle any errors
            });
        }
        setIsLoading(false);
        return () => {}
   },[isLoading, isLoggedIn, user.avatarId, avatarUrl])
  
   

    const sidebarHandler = () => {
        (sidebarStatus === 'on') ? setSidebarStatus('off') : setSidebarStatus('on')
    }
  
    const userImage = (isLoggedIn && userComplete) ? <img src={avatarUrl} alt={user.displayName}/> : <div className="usericon"><UserIcon /></div>;
    

    return(
        <header>
            <button onClick={sidebarHandler} className='menu-button'><MenuIcon /></button>
            <Link className={(props.path === '/') ? 'logo-wrapper home' : 'logo-wrapper'} to={'/'}>
            <img src={HeartLogo} alt="logo" />
            </Link>
            {(props.path !== '/') ? <button onClick={() => navigate(-1)} className='backbutton'><BackIcon /></button> : ''}
            <Sidebar isDesktop={isDesktop} onTap={sidebarHandler} userImage={userImage} isLoggedIn={isLoggedIn} user={user.displayName} status={(isDesktop) ? 'on' : sidebarStatus}/>
            <Overlay onTap={sidebarHandler} status={sidebarStatus}/>
        </header>
    );
}

export default Header;