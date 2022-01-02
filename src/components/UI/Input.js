import { useState } from 'react';
import classes from './Input.module.css';

const Input = props => {
    const preValue = (props.value) ? props.value : ''
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState(preValue)
    const preHasValue = (preValue);
    const [hasValue, setHasValue] = useState(preHasValue);

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

    

    return (
        <div className={`${classes.InputWrapper} ${isFocused ? 'focused' : ''} ${hasValue ? 'withValue' : ''} ${hasError ? 'error' : ''}`}>
            <label htmlFor={props.name}>{props.label}</label>
            <input
            value={inputValue}  
             onFocus={() => setIsFocused(true)} 
             onBlur={checkValue} 
             onChange={onChangeHandler}
             type={props.type} name={props.name}/>
        </div>
    )
}

export default Input;