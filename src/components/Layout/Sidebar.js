import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Fragment } from "react/cjs/react.production.min";
import { IoCaretBackCircleOutline as Back, IoSettingsSharp as SettingsIcon } from "react-icons/io5";
import RegisterPage from "../../pages/RegisterPage";

const Sidebar = props => {
    const navigate = useNavigate();
    const logoutHandler = () => {
        localStorage.removeItem('uid');
        props.onTap();
        navigate('/registro')
    }

    const [settingsShow, setSettingsShow] = useState(false);
    const settingsHandler = () => {
        setSettingsShow(!settingsShow)
    }

    return (
        <Fragment>
           
            <div className={(props.status === 'on') ? 'sidebar show' : 'sidebar'}>
            
            {(props.isLoggedIn) 
                ?   <Fragment>
                    <button onClick={props.onTap} className="backbutton"><Back /></button>
                    <Link className="userheader" to={`/users/${localStorage.getItem('uid')}`}>
                     <div className="sidebar-header">
                        <div className="side-img-wrapper">
                          {props.userImage}
                        </div>
                        <p><strong>{props.user}</strong></p>
                     </div>
                   </Link>
                   <div className="action">
                    <Link onClick={props.onTap} to={`/users/${localStorage.getItem('uid')}`}>Ver mi Perfil</Link>
                    <Link onClick={props.onTap} to={`/crear-receta`}>Crear nueva receta</Link>
                   </div>
                   {(props.isDesktop)
                    ?<div className={(settingsShow) ? 'settings show' : 'settings'}>
                        <button className="setbut" onClick={settingsHandler}><SettingsIcon /></button>
                        <div className="admin-dk">
                            <button onClick={logoutHandler}>Cerrar sesión</button>
                            <button>Eliminar cuenta</button>
                        </div>
                    </div>

                    :<div className="admin">
                        <button onClick={logoutHandler}>Cerrar sesión</button>
                        <button>Eliminar cuenta</button>
                    </div>
                   }
                   
                   </Fragment>      
                
                : <Fragment>
                    {(props.isDesktop)
                     ? <div className="linkregistro"><Link to={'/registro'}>Entrar / Registrarse</Link></div>
                     :<Fragment>
                        <RegisterPage onTap={props.onTap}/>
                        <button onClick={props.onTap} className="backbutton-static"><Back /></button>
                      </Fragment>  
                    }
                  </Fragment>
                     
            }
               
            </div>
        </Fragment>
        
    );
}

export default Sidebar;