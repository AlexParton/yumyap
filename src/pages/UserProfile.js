import { Fragment, useEffect, useState } from "react";
import Padder from "../components/UI/Padder";
import { getDatabase, ref, onValue } from "firebase/database";
import classes from '../components/User/Profile.module.css';
import Footer from "../components/Layout/Footer";
import MyFirebase from '../database/firebase';
import ProfileRecetas from "../components/User/ProfileRecetas";
import { GrFormEdit } from "react-icons/gr";
import { MdVerified as SuperCook } from "react-icons/md";
import { useLocation, useParams } from "react-router-dom";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import EditProfile from "../components/User/EditProfile";
const app = MyFirebase();

const UserProfile = () => {

    const { state } = useLocation();
    const [isEditMode, setIsEditMode] = useState((state === 'edit'));
    const params = useParams();
  
    const profileId = params.userId;
    const [user, setUser] = useState({
      displayName: '',
      avatarId: null,
    });
    const [avatarUrl, setAvatarUrl] = useState('');
    const [recetas, setRecetas] = useState([]);
    const [profileFavs, setProfileFavs] = useState([]);
    const [favBook, setFavBook] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSelfRecetas, setIsSelfRecetas] = useState(true);
    
    const userId = localStorage.getItem("uid")
      ? localStorage.getItem("uid")
      : null;

    const db = getDatabase(app);
    const userRef = ref(db, "users/" + profileId);
    const recetasRef = ref(db, "recetas/" + profileId);
    const userFavsRef = ref(db, `users/${profileId}/favIds`);
    const storage = getStorage();
    useEffect(() => {    
      onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          let loadedUser = {
            displayName: snapshot.val().displayName,
            avatarId: snapshot.val().avatar,
          };

          setUser(loadedUser);
          
          getDownloadURL(storageRef(storage, `users/${profileId}/avatar/${user.avatarId}`))
          .then((url) => {
          setAvatarUrl(url);
          })
            .catch((error) => {
            // Handle any errors
          });
        } 
      });
    }, [user.avatarId, profileId]);
    
    useEffect(() => {    
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
    }, []);

    useEffect(() => {   
      onValue(userFavsRef, (snapshot) => {
        let favsArray = [];
        for (const key in snapshot.val()) {
          favsArray.push(key);
        }
        setProfileFavs(favsArray);  
      });
    }, []);

    useEffect(() => {   
      const profileFavRecetas = [];
      for (let i = 0; i < profileFavs.length; i++) {
        const tempRef = ref(db, `book/${profileFavs[i]}`);
        onValue(tempRef, (snapshot) => {
          const loadedReceta = {
            ...snapshot.val(),
            id: profileFavs[i]
          }
          profileFavRecetas.push(loadedReceta)
        })
      }
      setFavBook(profileFavRecetas)
    }, [profileFavs]);
    
    const isSelfProfile = (userId === profileId);
    const displayRecetas = (isSelfRecetas) ? recetas : favBook;
  
    const displayHandler = () => {
        setIsSelfRecetas(!isSelfRecetas)
    }
    
    const onEdit = () => {
        setIsEditMode(!isEditMode)
    }

    return(
        <Fragment>
            {
            (!isEditMode)
            ?<Fragment>
                <Padder>
                    <div className={classes.ProfileHeader}>
                      {(avatarUrl !== '') ?  <div className={classes.ImgContainer}> <img src={avatarUrl} alt='user'/></div> : ''}                
                      <div className={classes.DataContainer}>
                          {(user.displayName === '')
                           ? <button onClick={onEdit}>Todavía no has editado tu perfil</button>
                           : <Fragment>
                              <h1>{user.displayName}</h1>
                              <p className={classes.Counter}>{recetas.length} Receta{(recetas.length === 1) ? '' : 's'}</p>
                              {(recetas.length > 10) ? <div className={classes.Topchef}><SuperCook /> Top Chef</div> : ''}
                           </Fragment>
                          }
                          
                      </div>
                      {(isSelfProfile) ?  <button className={classes.EditButton} onClick={onEdit}><GrFormEdit /></button> : ''}
                    </div>
                </Padder>
                <div className="profilerecetas-wrapper">
                  <div className={classes.Selectors}>
                      <button onClick={displayHandler} className={(isSelfRecetas) ? classes.Active : ''}>{isSelfProfile ? 'Mis Recetas' : `Sus Recetas`}</button>
                      <button onClick={displayHandler} className={(!isSelfRecetas) ? classes.Active : ''}>{isSelfProfile ? 'Mis Favoritas' : `Sus Favoritas`}</button>
                  </div>
                  <ProfileRecetas recetas={displayRecetas}/> 
                </div>
             </Fragment>
            
            :<EditProfile cancel={onEdit} user={user} avatarUrl={avatarUrl}/>
            }
        
        <Footer />
      </Fragment>
    );
}

export default UserProfile;