import React, {
    useRef, useState, useEffect, useContext,
} from 'react';

import { useDebounce } from '../utils/hooks';
import { SelectContext } from './SelectContext';

const SelectSearch = () => {
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState('');

    const { dispatch, labelKey } = useContext(SelectContext);

    function onInputChange({ target }) {
        setInputValue(target.value);
    }

    const retValue = useDebounce(inputValue, 500);

    useEffect(() => {
        dispatch({ type: 'filterOptions', payload: retValue, labelKey });
    }, [retValue, dispatch, labelKey]);

    return (
        <div className="lgw-select-search">
            <input
                autoFocus
                className="lgw-select-search-input"
                type="text"
                autoComplete="off"
                ref={inputRef}
                onBlur={onInputChange}
                onChange={onInputChange}
                value={inputValue}
            />
        </div>
    );
};

export default SelectSearch;
