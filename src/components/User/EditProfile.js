import Padder from "../UI/Padder";
import Input from "../UI/Input";
import BigButton from "../UI/BigButton";
import Button from "../UI/Button";
import classes from './EditProfile.module.css'
import { getDatabase, ref, set } from "firebase/database";
import { ImCamera } from "react-icons/im";
import { Fragment, useEffect, useState } from "react";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";


const EditProfile = props => {
    const userId = localStorage.getItem('uid');
    const db = getDatabase();
    const [isUploadedOk, setIsUploadedOk] = useState(false);
    const [enteredFoto, setEnteredFoto] = useState('');
    const [user, setUser] = useState(props.user);
    const [avatarUrl, setAvatarUrl] = useState(props.avatarUrl);
    const [isTouched, setIsTouched] = useState(false);

    async function savePicture(blobUrl, imgId) {
        const storage = getStorage();
        const imageRef = storageRef(storage, `/users/${userId}/avatar/${imgId}`);
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        await uploadBytes(imageRef, blob).then((snapshot) => {
            setIsUploadedOk(true)
          });
    }

    const [userName, setUserName] = useState(props.user.displayName);
    const userNameHandler = (event) => {
        setUserName(event.target.value);
        setIsTouched(true)
    }

    
    useEffect(() => () => {
        if (enteredFoto.startsWith('blob')) {
            URL.revokeObjectURL(enteredFoto)
        }
        
    }, [enteredFoto]);
    
    const handleCapture = (event) => {
        if (event.target.files.length > 0) {
            const file = event.target.files.item(0);
            const imageUrl = URL.createObjectURL(file);
            setEnteredFoto(imageUrl);
            setAvatarUrl(imageUrl);
            setIsTouched(true)
        }
    }    

    const changeImgHandler = () => {
        setEnteredFoto('');
        setAvatarUrl('');
    }

    const submitHandler = (event) => {
        event.preventDefault();
        if (isTouched) {
            const imgId = Date.now();
            set(ref(db, `users/${userId}/displayName`), userName);
            if (enteredFoto && enteredFoto !== '') {
                savePicture(enteredFoto, imgId);
                set(ref(db, `users/${userId}/avatar`), imgId);
                props.cancel()
            }
        } else {
            props.cancel()
        }
        
    }  

    return (
        <Padder>
            <h1>Edita tu perfil</h1>
            <form className={classes.Form} onSubmit={submitHandler}>
               <Input value={user.displayName} 
                      onInputChange={userNameHandler} 
                      name='username' type='text' 
                      label={(user.displayName) ? user.displayName : 'Elige un nombre de usuario'}/>
               
               {(avatarUrl === '') 
               ? <Fragment><p className="disclaimer">Añade una imagen para tu perfil</p>
                   <BigButton icon={<ImCamera size={30}/>}>
                   <input
                    accept="image/*"
                    className="foto-input"
                    id="icon-button-file"
                    type="file"
                    onChange={handleCapture}
                />
               </BigButton></Fragment>
               : <Fragment><div className={classes.UserImgHolder}><img src={avatarUrl} alt='user' /></div><button onClick={changeImgHandler}>QUIERO CAMBIAR LA IMAGEN</button></Fragment>
                }
               <div className={classes.Action}>
               <Button text={'¡TODO LISTO!'}/> 
               </div>
            </form>
        </Padder>
    )
}

export default EditProfile;