import { Fragment } from "react";
import { Link } from "react-router-dom";
import classes from './ProfileRecetas.module.css';
const ProfileRecetas = props => {
    const recetas = props.recetas.map(receta =>
        
        <li key={Math.floor(Math.random() * 1000000)} className={classes.Receta} >
            <Link to={`/${receta.id}&cook=${receta.cook}`}> 
            <img
             src={`https://firebasestorage.googleapis.com/v0/b/yumyap-a2ca0.appspot.com/o/users%2F${receta.cook}%2Frecetas%2F${receta.imgSrc}?alt=media&token=638d2326-6dd1-469c-943b-3bce053df501`} 
             alt={receta.title} 
            />
            </Link>
        </li>
        
        )
    return (
        <Fragment>
            <ul className={classes.RecetasWrapper}>
                {recetas}
            </ul>
        </Fragment>
    )
}

export default ProfileRecetas;