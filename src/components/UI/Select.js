import { useState } from 'react';
import classes from './Select.module.css';

const Select = props => {
    const options = props.options.map(option => <option key={Math.floor(Math.random() * 1000000)} value={option}>{option}</option>);
    const [selectedValue, setSelectedValue] = useState('0');

    const selectHandler = (event) => {
        setSelectedValue(event.target.value);
        props.onSelectChange(event);
    };

    return (
        <div className={classes.SelectWrapper}>
            <label className='hide' hidden htmlFor={props.name}></label>
            <select className={props.clase} value={selectedValue} onChange={selectHandler}>
                <option value='0'>{props.label}</option>
                {options}
            </select>
        </div>
    )
}

export default Select;