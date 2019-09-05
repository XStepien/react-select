import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Display placeholder or selected value(s)
 * 
 * 1 => handle multi select
 * 3 => handle adding values ?
 */
const SelectValue = ({ value, placeholder, dispatch, ...props }) => {
    function renderValue(val) {
        return props.valueRenderer ? props.valueRenderer(val) : (
            <span>{val[props.labelKey]}</span>
        );
    }

    function handleArrowClick(e) {
        e.stopPropagation();
        e.preventDefault();
        dispatch({ type: 'toggleDropdown' });
    }

    return (
        <div
            role="option"
            aria-selected="true"
            className={classNames(
                'lgw-select-single', {
                    'lgw-select-default': !value,
                },
            )}
        >
            {value ? renderValue(value) : placeholder}
            <div onClick={handleArrowClick}>
                <b className="lgw-select-arrow" />
            </div>
        </div>
    );
};

SelectValue.propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string, PropTypes.number, PropTypes.object,
    ]),
};

export default React.memo(SelectValue);