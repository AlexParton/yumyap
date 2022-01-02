import { Link } from 'react-router-dom';
import classes from './RecipeCard.module.css';
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import {  useEffect, useState } from 'react';
import Loader from '../UI/Loader';

const RecipeCard = props => {
  const userId = localStorage.getItem('uid');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const storage = getStorage();
  useEffect(() => {
    getDownloadURL(storageRef(storage, `users/${props.card.cook}/recetas/${props.card.imgSrc}`))
    .then((url) => {
        setImageUrl(url);
        setIsLoading(false)
    })
    .catch((error) => {
        // Handle any errors
    });
  }, [isLoading, props.imgSrc, storage, userId])
  

  if (isLoading) {
    return <Loader size='s' />
  }

    return(
       <li>
         <Link className={classes.RecipeCard} to={`${props.link}&cook=${props.card.cook}`}>
           <img src={imageUrl} alt={props.card.id}/>
            <h2>{props.card.title}</h2>
         </Link>   
       </li>
    );
}

export default RecipeCard;