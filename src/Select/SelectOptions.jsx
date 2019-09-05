import React, { useRef, useState, useEffect, useContext } from 'react';
import { FixedSizeList as List } from 'react-window';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';

import findIndex from 'lodash/findIndex';

import { useOnKeyPressed, useAutoresize } from '../utils/hooks';

import { SelectContext } from './SelectContext';

import SelectOptionItem from './SelectOptionItem';

const ITEM_SIZE = 44;
const LIST_HEIGHT = 300;

const SelectOptions = ({ optionsConfig, ...props }) => {
    const optionsListRef = useRef();
    const listRef= useRef();

    // Get data from react context api
    const {
        dispatch,
        valueKey,
        labelKey,
        optionRenderer,
        noResultRenderer,
        searchValue,
        selectedValue: selectedOption,
        filteredOptions: options,
    } = useContext(SelectContext);

    const [listHeight, setListHeight] = useState(optionsConfig.list);
    const [hovered, setHovered] = useState(-1);
    const [cursor, setCursor] = useState(0);

    const { width } = useAutoresize(optionsListRef);

    const optionsLength = options.length;

    function getListHeight() {
        const listFullHeight = optionsLength * optionsConfig.itemSize
        return listFullHeight < optionsConfig.listHeight ? listFullHeight : optionsConfig.listHeight;
    }

    function itemKey(index, data) {
        const item = data[index];
        return item[valueKey];
    }

    function onSelected(opt) {
        dispatch({ type: 'selectValue', payload: opt });
    }

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
            setCursor((current) => current < optionsLength - 1 ? current + 1 : current);
        }
    }, [downKeyPressed, optionsLength]);

    useEffect(() => {
        if (upKeyPressed) {
            setCursor((current) => current > 0 ? current - 1 : current);
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
            onSelected(options[cursor])
        }
    }, [enterKeyPressed, options, cursor, dispatch]);

    useEffect(() => {
        const listFullHeight = options.length * optionsConfig.itemSize;
        setListHeight(listFullHeight < optionsConfig.listHeight ? listFullHeight : optionsConfig.listHeight);
    }, [options.length]);

    const renderOption = React.forwardRef(({ index, style }, ref) => (
        <SelectOptionItem
            ref={ref}
            style={style}
            index={index}
            focused={index === cursor}
            isSelected={selectedOption && (selectedOption[valueKey] === options[index][valueKey])}
            onSelected={onSelected}
            onHovered={setHovered}
            option={options[index]}
            valueKey={valueKey}
            labelKey={labelKey}
            optionRenderer={optionRenderer}
        />
    ));

    return (
        <div ref={optionsListRef} className={classNames('lgw-select-results')}>
            <CSSTransition classNames="fade" timeout={300}>
                {options.length ? (
                    <List
                    ref={listRef}
                    height={getListHeight()}
                    itemCount={optionsLength}
                    itemSize={optionsConfig.itemSize}
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
            </CSSTransition>
        </div>
    );
};

SelectOptions.propTypes = {};

export default SelectOptions;