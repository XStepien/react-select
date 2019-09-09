import React from 'react';
import PropTypes from 'prop-types';

const SelectContext = React.createContext(false);

const SelectProvider = ({ value, children }) => (
    <SelectContext.Provider value={value}>
        {children}
    </SelectContext.Provider>
);

SelectProvider.propTypes = {
    value: PropTypes.object,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
    ]),
};

export { SelectContext, SelectProvider };
