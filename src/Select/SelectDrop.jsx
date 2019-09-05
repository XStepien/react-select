import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import SelectSearch from './SelectSearch';
import SelectTabs from './SelectTabs';
import SelectOptions from './SelectOptions';

/**
 * Render Select dropdown with search bar, tabs, options list and footer
 * 
 * 1 - Search bar
 * 2 - tabs
 * 3 - options list
 * 4 - footer
 */
const SelectDrop = ({ searchable, tabbed, footerHeight, optionsConfig, ...props }) => {
    // console.log('[SelectDrop] rendering');
    const dropRef = useRef();

    function getDistanceFromBottom(elementRef) {
        return window.innerHeight - elementRef.current.getBoundingClientRect().bottom;
    }

    // If dropdown bottom not in viewport add some margin and scroll to bottom
    useEffect(() => {
        if (dropRef.current) {
            if (getDistanceFromBottom(dropRef) < 0) {
                dropRef.current.style.marginBottom = `${footerHeight + 20}px`;
                window.scrollTo(0,document.body.scrollHeight);
            }
        }
    }, [footerHeight]);
    

    return (
        <>
            <div
                ref={dropRef}
                className={classNames('lgw-select-drop')}
                style={props.style}
            >
                {/* Search input */}
                {searchable && (
                    <SelectSearch />
                )}
                {/* Tabs */}
                {tabbed && (
                    <SelectTabs />
                )}
                {/* Options list */}
                <SelectOptions optionsConfig={optionsConfig} />
                {/* footer */}
            </div>
        </>
    );
};

SelectDrop.propTypes = {
    searchable: PropTypes.bool,
    tabbed: PropTypes.bool,
    footerHeight: PropTypes.number,
};

SelectDrop.defaultProps = {}

export default SelectDrop;