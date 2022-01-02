import HeartLogo from '../../assets/recetapp-logo.png';
import classes from './Footer.module.css';
const Footer = () => {
    const date = new Date().getFullYear();
    return (
        <footer>
            <img src={HeartLogo} alt="logo" />
            <section className={classes.Brand}>
                <h1>YumYap</h1>
                <h2>heartly delicious</h2>
                <p><span>®</span> {date}</p>
            </section>
        </footer>
    )
}

export default Footer;