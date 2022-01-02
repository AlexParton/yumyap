import classes from './Button.module.css';

const Button = props => {
    return (
        <button className={classes.Button}>{props.icon}<span>{props.text}</span></button>
    );
}

export default Button;