import { Fragment, useState } from "react";
import Brand from "../components/UI/Brand";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Padder from "../components/UI/Padder";
import classes from './RegisterPage.module.css'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

import UserProfile from "./UserProfile";
import { useNavigate } from "react-router-dom";

const RegisterPage = props => {
    const [isEntrar, setIsEntrar] = useState(true);

    const [enteredEmail, setEnteredEmail] = useState('');
    const emailHandler = (event) => {
        setEnteredEmail((event.target.value))
    }

    const [enteredPass, setEnteredPass] = useState('');
    const passHandler = (event) => {
        setEnteredPass((event.target.value))
    }

    const [enteredRepeatedPass, setEnteredRepeatedPass] = useState('');
    const repeatedPassHandler = (event) => {
        setEnteredRepeatedPass((event.target.value))
    }

    const repeatPass = (!isEntrar) ? <Input onInputChange={repeatedPassHandler} name='password' type='password'  label='Repite Contraseña'/> : '';
    const passIsTheSame = (enteredPass === enteredRepeatedPass);
    const auth = getAuth();

    const navigate = useNavigate();
    const isDesktop = window.matchMedia('(min-width:1000px)').matches;

    const [errMessage, setErrMessage] = useState('');
    const [showErr, setShowErr] = useState(false);

    const submitHandler = (event) => {
        event.preventDefault();

        if (isEntrar) {
           
            signInWithEmailAndPassword(auth, enteredEmail, enteredPass)
            .then((userCredential) => {
                const user = userCredential.user;
                localStorage.setItem('uid', user.uid);
                (isDesktop) ? navigate('/') : props.onTap();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
                if (errorCode === 'auth/wrong-password') {
                    setErrMessage('La contraseña no es correcta');
                    setShowErr(true);
                }
                if (errorCode === 'auth/user-not-found') {
                    setErrMessage('Este email no está registrado');
                    setShowErr(true);
                }
            });
        } else {
            if (!passIsTheSame) {
                setErrMessage('Las contraseñas no coinciden');
                setShowErr(true);
                return
            }
           
            if (enteredPass.length < 6) {
                setErrMessage('La contraseña debe tener 6 caracteres mínimo');
                setShowErr(true);
            }
            createUserWithEmailAndPassword(auth, enteredEmail, enteredPass)
            .then((userCredential) => {
                const user = userCredential.user;
                localStorage.setItem('uid', user.uid);
                props.onTap();
                navigate(`/users/${user.uid}`, { state: 'edit'})
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === 'auth/email-already-in-use') {
                    setErrMessage('Este correo electrónico ya existe');
                    setShowErr(true);
                }
                // ..
            });    
        }

    }


    if (!!localStorage.getItem('uid')) {
        return (<UserProfile />)
    }
    
    return(
        <Fragment>
            <Brand />
            <Padder>
                <form className={classes.Form} onSubmit={submitHandler}>
                    <Input onInputChange={emailHandler} name='email' type='text'  label='Dirección de e-mail'/>
                    <Input onInputChange={passHandler} name='password' type='password'  label='Contraseña'/>
                    {repeatPass}
                    {(showErr) ? <p className="warning">{errMessage}</p> : ''}
                    <Button text={(isEntrar) ? 'ENTRAR' : 'REGISTRARME'}/> 
                </form>
                <button 
                    onClick={() => setIsEntrar(!isEntrar)} 
                    className={classes.Cta2}>{(isEntrar) ? '¿Todavía no tienes cuenta? ' : '¿Ya tienes cuenta? '} 
                    <strong>{(isEntrar) ? 'Regístrate!' : 'Entra!'}</strong>
                </button> 
            </Padder>
        </Fragment>
       
    );
}

export default RegisterPage;