import React, {
    useRef, useState, useEffect, useContext, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList as List } from 'react-window';
// import { DynamicSizeList as List } from 'react-window';
import classNames from 'classnames';

import findIndex from 'lodash/findIndex';

import { useOnKeyPressed, useAutoresize } from '../utils/hooks';

import { SelectContext } from './SelectContext';

import SelectOptionItem from './SelectOptionItem';

const SelectOptions = ({ optionsConfig }) => {
    const optionsListRef = useRef(null);
    const listRef = useRef(null);

    // Get data from react context api
    const {
        dispatch,
        valueKey,
        labelKey,
        optionRenderer,
        optionCallback,
        noResultRenderer,
        searchValue,
        selectedValue: selectedOption,
        filteredOptions: options,
        optionsTabs,
        selectedTab,
    } = useContext(SelectContext);

    const [listHeight, setListHeight] = useState(optionsConfig.listHeight);
    const [hovered, setHovered] = useState(-1);
    const [cursor, setCursor] = useState(0);

    const { width } = useAutoresize(optionsListRef);

    const optionsLength = options.length;

    function onClicked(callback, index) {
        optionCallback(callback);
        setCursor(index);
    }

    function itemKey(index, data) {
        const item = data[index];
        return item[valueKey];
    }

    const onSelected = useCallback(
        (opt) => {
            dispatch({ type: 'selectValue', payload: opt });
        },
        [dispatch],
    );
    /* Keyboard navigation */
    const downKeyPressed = useOnKeyPressed('ArrowDown');
    const upKeyPressed = useOnKeyPressed('ArrowUp');
    const enterKeyPressed = useOnKeyPressed('Enter');
    useEffect(() => {
        if (selectedOption) {
            setCursor(findIndex(options, (o) => o[valueKey] === selectedOption[valueKey]));
        }
    }, [selectedOption, options, valueKey]);

    useEffect(() => {
        if (optionsLength && downKeyPressed) {
            setCursor((current) => (current < optionsLength - 1 ? current + 1 : current));
        }
    }, [downKeyPressed, optionsLength]);

    useEffect(() => {
        if (upKeyPressed) {
            setCursor((current) => (current > 0 ? current - 1 : current));
        }
    }, [upKeyPressed]);

    useEffect(() => {
        if (hovered !== -1) {
            setCursor(hovered);
        }
    }, [hovered]);

    useEffect(() => {
        if (options.length) {
            listRef.current.scrollToItem(cursor, 'smart');
        }
    }, [cursor, options.length]);
    /* END keyboard navigation */

    useEffect(() => {
        if (enterKeyPressed && !options[cursor].grpTitle) {
            onSelected(options[cursor]);
        }
    }, [enterKeyPressed, options, cursor, dispatch, onSelected]);

    useEffect(() => {
        const itemSizeIndex = optionsTabs ? optionsTabs.indexOf(selectedTab) : 0;
        const listFullHeight = options.length * optionsConfig.itemSize[itemSizeIndex];
        setListHeight(listFullHeight < optionsConfig.listHeight ? listFullHeight : optionsConfig.listHeight);
    }, [options.length, optionsConfig, optionsTabs, selectedTab]);

    // eslint-disable-next-line react/prop-types
    const renderOption = React.forwardRef(({ index, style }, ref) => (
        <SelectOptionItem
            ref={ref}
            style={style}
            index={index}
            focused={index === cursor}
            isSelected={selectedOption && (selectedOption[valueKey] === options[index][valueKey])}
            onSelected={onSelected}
            onClicked={onClicked}
            onHovered={setHovered}
            option={options[index]}
            labelKey={labelKey}
            optionRenderer={optionRenderer}
        />
    ));

    return (
        <div ref={optionsListRef} className={classNames('lgw-select-results')}>
            {options.length ? (
                <List
                    ref={listRef}
                    height={listHeight}
                    itemCount={optionsLength}
                    itemSize={optionsConfig.itemSize[optionsTabs ? optionsTabs.indexOf(selectedTab) : 0]}
                    itemData={options}
                    itemKey={itemKey}
                    width={width}
                >
                    {renderOption}
                </List>
            ) : (
                <div className="no-results">
                    {noResultRenderer(searchValue)}
                </div>
            )}
        </div>
    );
};

SelectOptions.propTypes = {
    optionsConfig: PropTypes.object,
};

export default SelectOptions;
