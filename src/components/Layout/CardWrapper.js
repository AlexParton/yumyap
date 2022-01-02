import classes from './CardWrapper.module.css';

const CardWrapper = props => {

    return (
        <ul className={classes.CardWrapper}>
            {props.cards}
        </ul>  
    );
}

export default CardWrapper;