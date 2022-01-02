import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import classes from './RecetaDetailPage.module.css';
import { GiCook } from "react-icons/gi";
import { AiOutlineFieldTime, AiOutlineHeart, AiOutlineStar } from "react-icons/ai";
import Footer from "../components/Layout/Footer";
import MyFirebase from "../database/firebase";
import { getDatabase, ref, onValue, set, remove } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import Loader from "../components/UI/Loader";
import { AiOutlineHeart as HeartVoid, AiFillHeart as HeartFull, AiFillStar as StarIcon } from "react-icons/ai";
import { GrFormEdit } from "react-icons/gr";
const app = MyFirebase();
  

const RecetaDetailPage = props => {
    const userId = localStorage.getItem('uid');
    const params = useParams().recetaId.split('&cook=');
    const recetaId = params[0];
    const cookId = params[1];
    const [receta, setReceta] = useState([]);
    const [cook, setCook] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState('');
    const [isFav, setIsFav] = useState(false);
    const [totalUsers, setTotalUsers] = useState(0);
    const storage = getStorage();
    const db = getDatabase(app);
    const navigate = useNavigate();

    useEffect(() => {
        const recetaRef = ref(db, `recetas/${cookId}/${recetaId}`);
        onValue(recetaRef, (snapshot) => {
            let loadedReceta = {
                id: Object.keys(snapshot.val()),
                title: snapshot.val().title,
                categoria: snapshot.val().categoria,
                cook: snapshot.val().cook,
                dificultad: snapshot.val().dificultad,
                tiempo: snapshot.val().tiempo,
                imgSrc: snapshot.val().imgSrc,
                preparacion: snapshot.val().preparacion,
                ingredientes: snapshot.val().ingredientes,
                filtros: snapshot.val().filtros,
                favs: (snapshot.val().favs) ? snapshot.val().favs : ''
        };
    
        if (loadedReceta.favs !== '') {
            (userId in loadedReceta.favs) && setIsFav(true)
        }
    
        setReceta(loadedReceta);         
      
        const usersRef = ref(db, `users/`);
        onValue(usersRef, (snapshot) => {
            let registeredUsers = [];
            for (const key in snapshot.val()) {
                registeredUsers.push(key)
            }
            setTotalUsers(registeredUsers.length);
        });

        const cookRef = ref(db, `users/${cookId}`);
        onValue(cookRef, (snapshot) => {
            setCook(snapshot.val().displayName);
        });
        getDownloadURL(storageRef(storage, `users/${cookId}/recetas/${receta.imgSrc}`))
            .then((url) => {
                setImageUrl(url);
                setIsLoading(false)
            })
            .catch((error) => {
                // Handle any errors
            });
        });    
       
        return () => {};
   },[isLoading, recetaId, receta.imgSrc, cookId, storage, db])

   if (isLoading) {
    return (<div className="loader-full"><Loader /></div>)
   }
    
    const hashArray = receta.filtros.split(',');
    const hashtags = hashArray.map(hashtag => <Link key={Math.floor(Math.random() * 1000000)} to={`/recetas/filter=${hashtag.trim()}`}>#{hashtag.trim()}</Link>);
    const ingredientesArray = receta.ingredientes.split(',');
    const ingredientes = ingredientesArray.map(ingrediente => <li key={Math.floor(Math.random() * 1000000)}>{ingrediente.trim()}</li>);
    const preparacionArray = receta.preparacion.split('.');
   
    const preparacion = preparacionArray.map(line => <p key={Math.floor(Math.random() * 1000000)}>{line}.</p>);
    const preparacionClean = preparacion.filter(line => line.props.children[0].length !== 0)
    const optionsLevel = ['Muy Fácil', 'Fácil', 'Media', 'Requiere un poco de maña', 'Díficil', 'Hazlo o no lo hagas, pero no lo intentes'];

    const heart = (isFav) ? <HeartFull color="#c61c22" /> : <HeartVoid />;
    const rate = (totalUsers > 1) ? Math.floor(Object.keys(receta.favs).length * 5 / (totalUsers - 1)) : 0;
    const starIcons = [];
    for (let i = 0; i < rate; i++){
        starIcons.push(<StarIcon key={Math.floor(Math.random() * 1000000)}/>)
    }
    const starsDisplay = (starIcons.length > 0) ? <div className={classes.StarWrapper}>{starIcons}</div> : '';
    
    const FavHandler = () => {
        const newPostRef = ref(db, `recetas/${cookId}/${recetaId}/favs/${userId}`);
        const userFavsRef = ref(db, `users/${userId}/favIds/${recetaId}`);
        if (isFav) {
            setIsFav(false)
            remove(newPostRef, userId);
            remove(userFavsRef, recetaId);        
        } else {
            setIsFav(true);
            set(newPostRef, userId);
            set(userFavsRef, recetaId)
        }
    }   

    const editRecipe = () => {
       navigate(`/crear-receta/${recetaId}`) 
    }

    const isSelfRecipe = (userId === cookId);
    const preAction = (!isSelfRecipe) 
                   ? <button onClick={FavHandler} className={classes.HeartWrapp}>{heart}</button>
                   : <button onClick={editRecipe} className={classes.HeartWrapp}><GrFormEdit /></button> 
    const action = (userId) ? preAction : '';

    return (
        <Fragment>
            <section className={classes.ImageWrapper}>
                {action}
                <img src={imageUrl} alt={receta.title} />
            </section>
            <section className={classes.Body}>
                <section className={classes.Heading}>
                    <h1>{receta.title}</h1>
                    <section className={classes.RecetaInfo}>
                        <div className={classes.Cook}><GiCook /> <span><Link to={`/users/${cookId}`}>{cook}</Link></span></div>
                        {starsDisplay}
                    </section>
                </section>
                <section className={classes.Info}>
                    <div><AiOutlineFieldTime /> <span>Preparación:</span><span><strong>{receta.tiempo} minutos</strong></span></div>
                    <div><AiOutlineStar /><span>Dificultad:</span><span><strong>{optionsLevel[receta.dificultad]}</strong></span></div>
                    <div><AiOutlineHeart /><span>{hashtags}</span></div>
                </section>
                <section className={classes.Ingredientes}>
                    <p><strong>Vas a necesitar:</strong></p>
                    <ul>
                        {ingredientes}
                    </ul>
                </section>
                <section className={classes.Descripcion}>
                    <p><strong>Así se prepara:</strong></p>
                    <section>{preparacionClean}</section>
                </section>
            </section>
            <Footer />
        </Fragment>
    )

}

export default RecetaDetailPage;