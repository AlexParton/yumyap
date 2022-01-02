import { Link, useParams } from "react-router-dom";
import CardWrapper from "../components/Layout/CardWrapper";
import RecipeCard from "../components/Layout/RecipeCard";
import { Fragment, useEffect, useState } from "react";
import MyFirebase from "../database/firebase";
import { getDatabase, ref, onValue } from "firebase/database";
import Button from "../components/UI/Button";
import Loader from "../components/UI/Loader";
import Input from "../components/UI/Input";
import Padder from "../components/UI/Padder";

const app = MyFirebase();

const categoriaTitle = {
    todas: 'Todas las Recetas',
    sopa: 'Sopas y Purés',
    cuchara: 'Platos de Cuchara',
    arroz: 'Arroces',
    aperitivo: 'Aperitivos',
    entrante: 'Entrantes',
    principal: 'Platos Principales',
    dulce: 'Dulces'    
};

const RecetasPage = props => {
    const params = useParams();
    const categoriaId = params.categoriaId;
    const [recetas, setRecetas] = useState([]);
    const [recetasList, setRecetasList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const db = getDatabase(app);
        const recetaDbRef = ref(db, 'book');
        let loadedRecetas = [];
       
        onValue(recetaDbRef, (snapshot) => {
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

        if (categoriaId.includes('filter')) {
            const filtro = categoriaId.replace('filter=', '').trim();
            const categorizedListCopy = [...recetas];
            const filteredList = categorizedListCopy.filter((receta) => receta.filtros.toLowerCase().includes(filtro));
            
            setRecetasList(filteredList);
        } else {
            const categorizedList = (categoriaId === 'todas') ? recetas : recetas.filter((receta) => receta.categoria === categoriaId)
            setRecetasList(categorizedList);
        }
        
        return () => {};
       
   },[isLoading, categoriaId])
    

   if (isLoading) {
       return <div className="loader-full"><Loader /></div>
   }

    const searchHandler = (event) => {
         const categorizedListCopy = [...recetas];
         const searchedList = (event.target.value.length === 0) 
            ? recetas 
            : categorizedListCopy.filter((receta) => 
                (receta.categoria.toLowerCase().includes(event.target.value)) || (receta.title.toLowerCase().includes(event.target.value))
                );
         setRecetasList(searchedList)
    }

    const cardList = recetasList.map(card => <RecipeCard key={card.id} card={card} link={`/${card.id}`}/>);

    return (
        <Fragment>
            <Padder>
                <h1>{categoriaTitle[categoriaId]}</h1>
                <div>
                    <Input onInputChange={searchHandler} name="buscar" label={(categoriaId.includes('filter')) ? `#${categoriaId.replace('filter=', '').trim()}` : 'Buscar Receta'} type="text"/>
                </div>
                {(cardList.length === 0) 
                    ? <section className="no-hay">
                        <h1>Todavía no hay recetas de esta categoría.</h1>
                        <h2>¿Quieres crear la primera?</h2>  
                        <Link to='/crear-receta'>
                        <Button text={'CREAR RECETA'}/> 
                        </Link>
                      </section>
                    : <CardWrapper cards={cardList}/>
                }
            </Padder>
        </Fragment>
        
    );
}

export default RecetasPage;