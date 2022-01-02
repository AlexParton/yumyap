import { Fragment, useEffect, useState } from "react";
import Padder from "../UI/Padder";
import { getDatabase, ref, onValue } from "firebase/database";
import classes from './Profile.module.css';
import MyFirebase from '../../database/firebase';
import ProfileRecetas from "./ProfileRecetas";
import { GrFormEdit } from "react-icons/gr";
import { useParams } from "react-router-dom";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
const app = MyFirebase();

const Profile = (props) => {
  const params = useParams();
  const profileId = params.userId;
  const [user, setUser] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [recetas, setRecetas] = useState([]);
  const [profileFavs, setProfileFavs] = useState([]);
  const [favBook, setFavBook] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelfRecetas, setIsSelfRecetas] = useState(true);
  const userId = localStorage.getItem("uid")
    ? localStorage.getItem("uid")
    : null;
  useEffect(() => {
    const db = getDatabase(app);
    const userRef = ref(db, "users/" + profileId);
    onValue(userRef, (snapshot) => {
      let loadedUser = {
        displayName: snapshot.val().displayName,
        avatarId: snapshot.val().avatar,
      };
      setUser(loadedUser);
    });
    const recetasRef = ref(db, "recetas/" + profileId);
    onValue(recetasRef, (snapshot) => {
        let loadedRecetas = [];
        for (const key in snapshot.val()) {
            loadedRecetas.push({
                id: key,
                title: snapshot.val()[key].title,
                categoria: snapshot.val()[key].categoria,
                cook: snapshot.val()[key].cook,
                dificultad: snapshot.val()[key].dificultad,
                tiempo: snapshot.val()[key].tiempo,
                imgSrc: snapshot.val()[key].imgSrc,
                preparacion: snapshot.val()[key].preparacion,
                ingredientes: snapshot.val()[key].ingredientes,
                filtros: snapshot.val()[key].filtros,
            })
        }
      setRecetas(loadedRecetas);
      setIsLoading(false);
    });

    const storage = getStorage();
    getDownloadURL(storageRef(storage, `users/${profileId}/avatar/${user.avatarId}`))
      .then((url) => {
      setAvatarUrl(url);
    })
      .catch((error) => {
      // Handle any errors
    });

    const userFavsRef = ref(db, `users/${profileId}/favIds`);
    onValue(userFavsRef, (snapshot) => {
      let favsArray = [];
      for (const key in snapshot.val()) {
        favsArray.push(key);
      }
      setProfileFavs(favsArray);  
    });

    const profileFavRecetas = [];
    for (let i = 0; i < profileFavs.length; i++) {
      const tempRef = ref(db, `book/${profileFavs[i]}`);
      onValue(tempRef, (snapshot) => {
        profileFavRecetas.push(snapshot.val())
      })
    }
    setFavBook(profileFavRecetas)
  }, [isLoading, userId, avatarUrl, user.avatarId]);

  const isSelfProfile = (userId === profileId);
  const displayRecetas = (isSelfRecetas) ? recetas : favBook;

  const displayHandler = () => {
      setIsSelfRecetas(!isSelfRecetas)
  }

  return (
      <Fragment>
        <Padder>
           <div className={classes.ProfileHeader}>
             <div className={classes.ImgContainer}> <img src={avatarUrl} alt='user'/></div>
             <div className={classes.dataContainer}>
                <h1>{user.displayName}</h1>
                <p className={classes.Counter}>{recetas.length} Receta{(recetas.length === 1) ? '' : 's'}</p>
              </div>
              {(isSelfProfile) ?  <button className={classes.EditButton} onClick={props.onEdit}><GrFormEdit size={22}/></button> : ''}
           </div>
        </Padder>
        <div className={classes.Selectors}>
            <button onClick={displayHandler} className={(isSelfRecetas) ? classes.Active : ''}>{isSelfProfile ? 'Mis Recetas' : `Sus Recetas`}</button>
            <button onClick={displayHandler} className={(!isSelfRecetas) ? classes.Active : ''}>{isSelfProfile ? 'Mis Favoritas' : `Sus Favoritas`}</button>
        </div>
        <ProfileRecetas recetas={displayRecetas}/>
      </Fragment>
    
      );
};

export default Profile;
