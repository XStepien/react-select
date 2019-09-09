import React, { useContext } from 'react';

import classNames from 'classnames';

import { SelectContext } from './SelectContext';

const SelectTabs = () => {
    const { dispatch, optionsTabs, selectedTab } = useContext(SelectContext);

    function onTabClicked(e, tab) {
        e.preventDefault();
        if (tab !== selectedTab) {
            dispatch({ type: 'changeTab', payload: tab });
        }
    }

    return (
        <ul className="lgw-select-tabs">
            {optionsTabs && optionsTabs.map(
                (tab) => (
                    <li
                        key={tab}
                        className={classNames('lgw-select-tab', { 'is-active': tab === selectedTab })}
                    >
                        <a
                            href="#"
                            className="lgw-select-tab-anchor"
                            onClick={(e) => onTabClicked(e, tab)}
                        >
                            {tab}
                        </a>
                    </li>
                ),
            )}
        </ul>
    );
};

export default SelectTabs;
