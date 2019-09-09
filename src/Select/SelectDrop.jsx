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
const SelectDrop = ({
    searchable, tabbed, footerHeight, optionsConfig, containerId, ...props
}) => {
    // console.log('[SelectDrop] rendering');
    const dropRef = useRef(null);
    const { style } = props;

    function getDistanceFromBottom(elementRef) {
        return window.innerHeight - elementRef.current.getBoundingClientRect().bottom;
    }

    // If dropdown bottom not in viewport add some margin and scroll to bottom of the container
    // TODO: add container id to props
    useEffect(() => {
        if (dropRef.current) {
            if (getDistanceFromBottom(dropRef) < footerHeight) {
                dropRef.current.style.marginBottom = `${footerHeight + 20}px`;

                if (containerId) {
                    const objDiv = document.getElementById(containerId);
                    objDiv.scroll({
                        top: objDiv.scrollHeight,
                        left: 0,
                        behavior: 'smooth',
                    });
                } else {
                    window.scrollTo(0, document.body.scrollHeight);
                }
            }
        }
    }, [containerId, footerHeight, searchable]);

    return (
        <>
            <div
                ref={dropRef}
                className={classNames('lgw-select-drop')}
                style={!tabbed ? style : null}
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
    optionsConfig: PropTypes.object,
    style: PropTypes.object,
    containerId: PropTypes.string,
};

SelectDrop.defaultProps = {};

export default SelectDrop;
