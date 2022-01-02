import { Fragment, useEffect, useState } from "react";
import BigButton from "../components/UI/BigButton";
import Heading from "../components/UI/Heading";
import Input from "../components/UI/Input";
import Select from "../components/UI/Select";
import TextArea from "../components/UI/TextArea";
import { ImCamera } from "react-icons/im";
import Button from "../components/UI/Button";
import classes from './CrearRecetaPage.module.css';
import Footer from "../components/Layout/Footer";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { BsEmojiHeartEyes as Hearty } from "react-icons/bs";
import { AiFillDelete as TrashIcon } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import MyFirebase from "../database/firebase";

const app = MyFirebase();

const categoriaTitle = {
    'Sopas y Purés': 'sopa',
    'Platos de Cuchara': 'cuchara',
    'Arroces': 'arroz',
    'Aperitivos': 'aperitivo',
    'Entrantes': 'entrante',
    'Platos Principales': 'principal',
    'Dulces': 'dulce'    
};
const reverseCategoriaTitle = {
    'sopa': 'Sopas y Purés',
    'cuchara': 'Platos de Cuchara',
    'arroz': 'Arroces',
    'aperitivo': 'Aperitivos',
    'entrante': 'Entrantes',
    'principal': 'Platos Principales',
    'dulce': 'Dulces'    
};

const optionsCat = ['Sopas y Purés','Platos de Cuchara','Arroces','Aperitivos','Entrantes','Platos Principales','Dulces'];
const optionsLevel = ['Muy Fácil', 'Fácil', 'Media', 'Requiere un poco de maña', 'Díficil', 'Hazlo o no lo hagas, pero no lo intentes'];
const optionsTime = ['5 minutos', '10 minutos', '15 minutos', '20 minutos', '25 minutos', '30 minutos', '40 minutos', '45 minutos', '60 minutos', '90 minutos', '120 minutos']


const CrearRecetaPage = () => {
    const db = getDatabase(app);
    const navigate = useNavigate();
    const params = useParams();
    const recetaId = params.recetaId;
    const [status, setStatus] = useState('onHold');
    const [error, setError] = useState('');
    const [isUploadedOk, setIsUploadedOk] = useState(false);
    const [enteredFoto, setEnteredFoto] = useState('');
    const [recetaToEdit, setRecetaToEdit] = useState({
        title:'', categoria:'', cook:'', dificultad:'', filtros:'', imgSrc:'', tiempo:'', ingredientes:'', preparacion:'' 
    })
    const storage = getStorage();
    useEffect(() => {
        if (recetaId){
            const recetaRef = ref(db, `recetas/${localStorage.getItem('uid')}/${recetaId}`);
            const unsubscribe = onValue(recetaRef, (snapshot) => {
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
                setRecetaToEdit(loadedReceta);
    
                getDownloadURL(storageRef(storage, `users/${localStorage.getItem('uid')}/recetas/${recetaToEdit.imgSrc}`))
                    .then((url) => {
                        setEnteredFoto(url);
                       
                    })
                    .catch((error) => {
                        // Handle any errors
                    });
               
            });
    
            return () => unsubscribe()
        }
        

    }, [db, recetaId, recetaToEdit.imgSrc, storage])


    const recetaHandler = (event) => {
        setRecetaToEdit(prevState => ({
            ...prevState, title: event.target.value
        }))
        setError('')
    }

    const categoriaHandler = (event) => {
        const categoria = categoriaTitle[event.target.value]
        setRecetaToEdit(prevState => ({
            ...prevState, categoria: categoria
        }))
        setError('')
    }

    const minutosHandler = (event) => {
        const tiempo = event.target.value.replace(' minutos', '');
        setRecetaToEdit(prevState => ({
            ...prevState, tiempo: tiempo
        }))
        setError('')
    }

    const dificultadHandler = (event) => {
        const nivel = optionsLevel.indexOf(event.target.value)
        setRecetaToEdit(prevState => ({
            ...prevState, dificultad: nivel
        }))
        setError('')
    }

    const filtroHandler = (event) => {
        setRecetaToEdit(prevState => ({
            ...prevState, filtros: event.target.value
        }))
        setError('')
    }

    const preparacionHandler = (event) => {
        setRecetaToEdit(prevState => ({
            ...prevState, preparacion: event.target.value
        }))
        setError('')
    }    

    const ingredientesHandler = (event) => {
        setRecetaToEdit(prevState => ({
            ...prevState, ingredientes: event.target.value
        }))
        setError('')
    }

    async function savePicture(blobUrl, imgId) {
        const storage = getStorage();
        const imageRef = storageRef(storage, `/users/${localStorage.getItem('uid')}/recetas/${imgId}`);
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        await uploadBytes(imageRef, blob).then((snapshot) => {
            setIsUploadedOk(true)
          });
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
            setError('')
        }
    }    
    const [newFoto, setNewFoto] = useState(false)
    const changeImgHandler = () => {
        setEnteredFoto('');
        setNewFoto(true);
    }

    const resetForm = () => {
        setEnteredFoto('');
        setRecetaToEdit( {title:'', categoria:'', cook:'', dificultad:'', filtros:'', imgSrc:'', tiempo:'', ingredientes:'', preparacion:''} )
        setIsUploadedOk(false)

    }

    const showError = (message) => {
        setError(message)
    }

    const formIsValid = (post) => {
        if (post.title === '') {
            showError('Falta el nombre de tu receta');
            return false
        }
        if (post.categoria === '') {
            showError('Falta la categoría');
            return false
        }
        if (post.tiempo === '') {
            showError('Falta el tiempo de preparación');
            return false
        }
        if (post.dificultad === '') {
            showError('Falta el nivel de dificultad');
            return false
        }
        if (post.filtros === '') {
            showError('Falta qué tipo de receta es');
            return false
        }
        if (post.ingredientes === '') {
            showError('Falta la lista de ingredientes');
            return false
        }
        if (post.preparacion === '') {
            showError('Falta que nos cuentes cómo se hace');
            return false
        }
        if (setEnteredFoto === '') {
            showError('Falta la foto');
            return false
        }
        return true;
    }

    const submitHandler = (event) => {
        event.preventDefault();
        const newRecetaId = (recetaId) ? recetaId : (Date.now() + Math.floor(Math.random() * 100));
        const imgId = (recetaId && !newFoto) ? recetaToEdit.imgSrc : Date.now();
        if (!recetaId || newFoto) {
           savePicture(enteredFoto, imgId);
        }
       
        const post = {
            title: recetaToEdit.title,
            cook: localStorage.getItem('uid'),
            dificultad: recetaToEdit.dificultad,
            filtros: recetaToEdit.filtros,
            ingredientes: recetaToEdit.ingredientes,
            preparacion: recetaToEdit.preparacion,
            tiempo: recetaToEdit.tiempo,
            categoria: recetaToEdit.categoria,
            imgSrc:imgId,
        }
        
        if (formIsValid(post)) {
            const db = getDatabase();
            set(ref(db, `/recetas/${localStorage.getItem('uid')}/${newRecetaId}`), post);
            set(ref(db, `/book/${newRecetaId}`), post);
            setStatus('uploading');
            setTimeout(() => {
                setStatus('onHold');
                resetForm();
                navigate(`/${newRecetaId}&cook=${localStorage.getItem('uid')}`, {replace:true})
            }, 2000)
        } 
    }
    
    const [areYouSure, setAreYouSure] = useState(false);
    const deleteReceta = () => {
        setAreYouSure(true)
    }

    const confirmedDeletion = () => {
        setAreYouSure(false)
        remove(ref(db, `/recetas/${localStorage.getItem('uid')}/${recetaId}`));
        remove(ref(db, `/book/${recetaId}`));
        navigate(`/users/${localStorage.getItem('uid')}`, {replace:true})
    }

    const cancelDelete = () => {
        setAreYouSure(false)
    }
    
    return(
        <Fragment>
            {(status === 'onHold')
              ?<Fragment>
                  <Heading heading='Crea tu Receta' />
                    <form className={classes.Form} onSubmit={submitHandler}>
                        <Input value={(recetaId) ? recetaToEdit.title : ''} 
                               onInputChange={recetaHandler} 
                               name='receta' type='text' 
                               label={(recetaId) ? recetaToEdit.title : '¿Qué receta vas a crear?'}
                        />
                        <div className={classes.SelectWrapper}>
                            <Select value={(recetaId) ? recetaToEdit.categoria : ''} 
                                    onSelectChange={categoriaHandler} 
                                    name='categoria' 
                                    label={(recetaId) ? reverseCategoriaTitle[recetaToEdit.categoria] : 'Elige una categoría'} 
                                    options={optionsCat}
                            />
                            <Select value={(recetaId) ? recetaToEdit.tiempo : ''} 
                                    onSelectChange={minutosHandler} 
                                    name='tiempo' type='number' 
                                    options={optionsTime}  
                                    label={(recetaId) ? `${recetaToEdit.tiempo} minutos` : 'Tiempo de preparación'} 
                            />
                            <Select value={(recetaId) ? recetaToEdit.dificultad : ''} 
                                    onSelectChange={dificultadHandler} 
                                    name='categoria' options={optionsLevel} 
                                    label={(recetaId) ? optionsLevel[recetaToEdit.dificultad] : 'Elige un nivel de dificultad' } 
                            />
                        </div>
                        <p className="disclaimer">Ayúdanos a encontrar tu receta y añadele filtros que la identifiquen. Sepáralos por comas, así: vegana, barbacoa, merienda, cocktail...</p>
                        <Input value={(recetaId) ? recetaToEdit.filtros : ''} 
                               onInputChange={filtroHandler} 
                               name='filtro' type='text'  
                               label={(recetaId) ? recetaToEdit.filtros : '¿Qué tipo de receta es?'} 
                        />
                        <p className="disclaimer">¿Qué ingredientes se necesitan? Sepáralos por comas, así: 2 huevos, 10g de azúcar, 200ml de leche...</p>
                        <TextArea value={(recetaId) ? recetaToEdit.ingredientes : ''} 
                                  isList={true} 
                                  onInputChange={ingredientesHandler} 
                                  name='ingredientes' rows={5} 
                                  label='Lista de ingredientes'
                                  placeholder={(recetaId) ? recetaToEdit.ingredientes : ''} 
                        />
                        <TextArea value={(recetaId) ? recetaToEdit.preparacion : ''} 
                                  isList={false} onInputChange={preparacionHandler} 
                                  name='preparacion' rows={10}  
                                  label='¿Cómo se prepara?' 
                                  placeholder={(recetaId) ? recetaToEdit.preparacion : ''} 
                        />
                        {(enteredFoto === '') 
                        ? <Fragment><p className="disclaimer">¡Hora de lucirse! Añade una buena foto a tu receta. Recuerda poner el móvil en horizontal y tener una buena iluminación.</p>
                            <BigButton icon={<ImCamera size={30}/>}>
                            <input
                            accept="image/*"
                            className="foto-input"
                            id="icon-button-file"
                            type="file"
                            capture="environment"
                            onChange={handleCapture}
                        />
                        </BigButton>
                        </Fragment>
                        : <Fragment><div className={classes.UserImgHolder}><img src={enteredFoto} alt='user' /></div><button onClick={changeImgHandler}>QUIERO CAMBIAR LA IMAGEN</button></Fragment>
                        }
                        
                        <div className={classes.Action}>
                        {(error !== '') ? <div className={classes.ErrorPop}>{error}</div> : ''}
                        <Button text={'¡TODO LISTO!'}/> 
                        {(recetaId && !areYouSure) ? <button onClick={deleteReceta} className={classes.Trash}><TrashIcon /> Eliminar Receta</button> : ''}
                        {(areYouSure) 
                            ? <div className={classes.AreYouSure}>
                                <h3>¿De verdad quieres eliminar esta receta?</h3>
                                <div><button onClick={cancelDelete}>CANCELAR</button><button onClick={confirmedDeletion}>ELIMINAR</button></div>
                              </div> 
                            : ''
                        }
                        </div>
                    </form>
                    <Footer />
                </Fragment>
              : <div className={classes.Subida}><div><Hearty size={70} /></div>¡QUÉ BUENA PINTA!<span>La receta se ha añadido a tu perfil.</span></div>
            }
        </Fragment>
    )
}

export default CrearRecetaPage;