import React from 'react';

const SelectContext = React.createContext(false);

const SelectProvider = (props) => {
    return (
        <SelectContext.Provider value={props.value}>
            {props.children}
        </SelectContext.Provider>
    );
};

export { SelectContext, SelectProvider };