import classes from './RoundButton.module.css';

const RoundButton = props => {
    return (
        <button className={classes.Button}>{props.icon}{props.children}</button>
    );
}

export default RoundButton;