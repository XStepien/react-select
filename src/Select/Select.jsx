import React, { useEffect, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import get from 'lodash/get';

import { useClickOutside, useEscKeyPressed, usePrevious } from '../utils/hooks';

import { SelectProvider } from './SelectContext';
import SelectValue from './SelectValue';
import SelectDrop from './SelectDrop';

import SelectReducer from './SelectReducer';

const initialState = {
    isOpen: false,
    optionsObject: null,
    optionsTabs: null,
    selectedTab: null,
    selectOptions: [],
    filteredOptions: [],
    selectedValue: null,
    searchValue: '',
    labelKey: '',
};

/**
 * NEW LENGOW SELECT - container
 */
const Select = ({
    value,
    valueRenderer,
    options,
    optionRenderer,
    noResultRenderer,
    valueKey,
    labelKey,
    onChanged,
    placeholder,
    style,
    searchable,
    tabbed,
    footerHeight,
    optionsConfig,
    ...props
}) => {
    const containerRef = useRef();

    const [state, dispatch] = useReducer(SelectReducer, initialState);

    const { isOpen, selectedValue, selectOptions } = state;

    // close dropdown on click outside or escape key pressed
    function closeDropdown() {
        if (isOpen) {
            dispatch({ type: 'toggleDropdown', payload: false });
        }
    }

    // Open dropdown when container clicked
    function onContainerClicked(e) {
        if (props.disabled
            || (e.type === 'click' && e.button !== 0)
            || e.target.tagName === 'INPUT'
            || ['lgw-select-results', 'lgw-select-tab-anchor'].includes(e.target.classList.value)) {
            return null;
        }

        e.stopPropagation();
        e.preventDefault();

        dispatch({ type: 'toggleDropdown', payload: true });
    }

    // Close dropdown on Escape key pressed or click outside
    useClickOutside(containerRef, closeDropdown);
    useEscKeyPressed(closeDropdown);

    const prevSelectedValue = usePrevious(selectedValue);

    useEffect(() => {
        dispatch({ type: 'setOptions', payload: options });
    }, [options]);

    useEffect(() => {
        const preSelectedValue = selectOptions.find((opt) => opt[valueKey] === value);
        if (value 
            && preSelectedValue 
            && (!prevSelectedValue || (prevSelectedValue && preSelectedValue[valueKey] !== prevSelectedValue[valueKey]))) {
            dispatch({ type: 'selectValue', payload: preSelectedValue });
        }
    }, [value, selectOptions, valueKey, prevSelectedValue]);

    useEffect(() => {
        // TODO: handle multiple values
        if (prevSelectedValue 
            && get(selectedValue, valueKey, false) !== get(prevSelectedValue, valueKey, false)
        ) {
            onChanged(selectedValue);
        }
    });

    return (
        // Container
        <div
            ref={containerRef}
            className={classNames(
                'lgw-select-container',
                {
                    'lgw-select-container-single': true,
                    'lgw-select-container-multi': false,
                    'lgw-select-container-active lgw-select-with-drop': isOpen,
                    'is-active': isOpen || !!selectedValue,
                    'mod-tabs': tabbed,
                },
                props.className,
            )}
            onClick={onContainerClicked}
            style={style.container}
        >
            {/* Value (single/multi) */}
            <SelectValue
                dispatch={dispatch}
                placeholder={placeholder}
                value={selectedValue}
                valueRenderer={valueRenderer}
                labelKey={labelKey}
            />
            {/* Dropdown (search input/tabs/options list) */}
            {isOpen && (
                <SelectProvider value={{ ...state, labelKey, valueKey, optionRenderer, noResultRenderer, dispatch }}>
                    <SelectDrop
                        style={style.dropDown}
                        searchable={searchable}
                        tabbed={tabbed}
                        footerHeight={footerHeight}
                        optionsConfig={optionsConfig}
                    />
                </SelectProvider>
            )}
        </div>
    );
};

Select.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string, PropTypes.number, PropTypes.object,
    ]),
    valueRenderer: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
    ]),
    options: PropTypes.oneOfType([
        PropTypes.object, PropTypes.array
    ]).isRequired,
    optionRenderer: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
    ]),
    noResultRenderer: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
    ]),
    valueKey: PropTypes.string,
    labelKey: PropTypes.string,
    onChanged: PropTypes.func,
    placeholder: PropTypes.string,
    style: PropTypes.object,
    searchable: PropTypes.bool,
    tabbed: PropTypes.bool,
    footerHeight: PropTypes.number,
    optionsConfig: PropTypes.object,
    optionCallback: PropTypes.func,
};

Select.defaultProps = {
    placeholder: 'Select an option...',
    style: {
        container: { width: '100%' },
        dropDown: { width: '100%' },
    },
    optionsConfig: {
        itemSize: 44,
        listHeight: 300 
    },
    valueKey: 'value',
    labelKey: 'label',
    onChanged: (val) => console.log('changed value => ', val),
    searchable: false,
    tabbed: false,
    noResultRenderer: (search) => (
        <div>
            No results match
            <span> "{search}"</span>
        </div>
    ),
    footerHeight: 0,
}

export default Select;
