import { Link } from 'react-router-dom';
import ulclass from '../components/Layout/CardWrapper.module.css';
import classes from '../components/Layout/RecipeCard.module.css';
import Padder from "../components/UI/Padder";


const dummyCats = [
    {title: 'TODAS LAS RECETAS', imgSrc: 'https://thefoodtech.com/wp-content/uploads/2020/12/ingredientes-saludables.jpg', id: 'todas'},  
    {title: 'SOPAS Y PURÉS', imgSrc: 'https://ep01.epimg.net/elcomidista/imagenes/2019/10/29/receta/1572344836_658092_1572345064_media_normal.jpg', id: 'sopa'},
    {title: 'PLATOS DE CUCHARA', imgSrc: 'https://www.centrallecheraasturiana.es/wp-content/uploads/2017/02/PC_garbanzos-con-tomate-y-cebolla.jpg', id: 'cuchara'},
    {title: 'ARROCES', imgSrc: 'https://hostalandres-elsaler.es/wp-content/uploads/2017/08/shutterstock_644611660.jpg', id: 'arroz'},
    {title: 'APERITIVOS', imgSrc: 'https://st2.depositphotos.com/4341251/8841/i/950/depositphotos_88415420-stock-photo-cocktail-party-with-variety-of.jpg', id: 'aperitivo'},
    {title: 'ENTRANTES', imgSrc: 'https://cdn.cookmonkeys.es/recetas/medium/espinacas-a-la-catalana-con-brandy-9913.jpeg', id: 'Entrantes'},
    {title: 'PLATOS PRINCIPALES', imgSrc: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/hamburguesa-1590595900.jpg', id: 'principal'},
    {title: 'DULCES', imgSrc: 'https://x3jme3vmctf3dmlkql5tzx17-wpengine.netdna-ssl.com/wp-content/uploads/2020/10/cupcakes-de-chocolate-940x580.jpg', id: 'dulce'},
  ];


  const CategoriesPage = props => {
      return (
          <Padder>
            <ul className={ulclass.CardWrapper}>
               {dummyCats.map(receta =>  
                  <li key={receta.id}>
                    <Link className={classes.RecipeCard} to={`/recetas/${receta.id}`}>
                    <img src={receta.imgSrc} alt={receta.id}/>
                        <h2>{receta.title}</h2>
                    </Link>   
                  </li>
                )}
                
            </ul>  
          </Padder>
      );
  }

  export default CategoriesPage