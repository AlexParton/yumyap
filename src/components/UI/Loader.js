import classes from './Loader.module.css';

const Loader = props => {
    return (
        <div className={classes.Loader}>
            <div className={(props.size === 's' ? classes.SmallSpinner : classes.Spinner)}></div>
        </div>
    )
}

export default Loader;