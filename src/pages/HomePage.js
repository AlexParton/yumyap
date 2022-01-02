import Brand from "../components/UI/Brand";
import { Link } from 'react-router-dom';
import ulclass from '../components/Layout/CardWrapper.module.css';
import classes from '../components/Layout/RecipeCard.module.css';
import Padder from "../components/UI/Padder";

const dummyCats = [
    {title: 'VER RECETAS', imgSrc: 'https://thefoodtech.com/wp-content/uploads/2020/12/ingredientes-saludables.jpg', id: 'ver', link: '/categorias'},
    {title: 'CREAR RECETA', imgSrc: 'https://i.pinimg.com/736x/c2/77/d8/c277d8cd1b69d8d30558eef6c78f69d5.jpg', id: 'crear', link: '/crear-receta'},
  ];

const HomePage = props => {
    return (     
          <Padder>
            <Brand />
              <ul className={ulclass.CardWrapper}>
              {dummyCats.map(receta =>  
                    <li key={receta.id}>
                      <Link className={classes.RecipeCard} to={receta.link}>
                      <img src={receta.imgSrc} alt={receta.id}/>
                          <h2>{receta.title}</h2>
                      </Link>   
                    </li>
                  )}
              </ul>  
          </Padder>     
    );
}

export default HomePage;