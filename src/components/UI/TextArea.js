import classes from './TextArea.module.css';
import { useState } from 'react';
import { GrFormEdit } from "react-icons/gr";
const TextArea = props => {
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState(props.placeholder)
    const [hasValue, setHasValue] = useState(false);

    const [isTouched, setIsTouched] = useState(false);
    const valueIsValid = inputValue.trim() !== '';
    const hasError = !valueIsValid && isTouched;

    const checkValue = () => {
        (inputValue === '') ? setHasValue(false) : setHasValue(true);
        setIsFocused(false);
        setIsTouched(true);
    };

    const onChangeHandler = (event) => {
        setInputValue(event.target.value);
        props.onInputChange(event);
    };

    const inputValueArray = inputValue.split(',')
    const cleanInputValue = inputValueArray.filter(line => line.length !== 0);
    const displayedValue = (props.isList) 
                    ? <ul className={classes.IngList}>{cleanInputValue.map(line => <li key={Math.floor(Math.random() * 10000)}>{line}</li>)}</ul> 
                    : inputValue.split('.').map(line => <p key={Math.floor(Math.random() * 10000)} className={classes.Preparacion}>{line}.</p>);

    return (
        <div className={`${classes.TextArea} ${hasError ? 'error' : ''} ${hasValue ? 'withValue' : ''}`}>
            <label htmlFor={props.name}>{props.label}</label>
            {(!isFocused && hasValue) 
            ? <div><span>{displayedValue}</span><button onClick={() => setHasValue(false)}><GrFormEdit size={20} className={classes.EditIcon}/></button></div>
            : <textarea
                defaultValue={props.placeholder}
                onFocus={() => setIsFocused(true)} 
                onBlur={checkValue}  
                onChange={onChangeHandler} 
                rows={props.rows} type={props.type} name={props.name}
              ></textarea>
            }
            
        </div>
    )
}

export default TextArea;