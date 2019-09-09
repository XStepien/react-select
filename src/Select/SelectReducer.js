import isArray from 'lodash/isArray';
import has from 'lodash/has';

function filterOptions(options, searchValue, labelKey) {
    return options
        .filter((opt) => opt[labelKey].toUpperCase().includes(searchValue.toUpperCase()));
}

const SelectReducer = (state, action) => {
    switch (action.type) {
    case 'setOptions': {
        let optionsObject = null;
        let optionsTabs = null;
        let selectOptions = [];
        let selectedTab = '';
        if (isArray(action.payload)) {
            selectOptions = action.payload;
        } else {
            optionsObject = action.payload;
            optionsTabs = Object.keys(optionsObject);
            selectOptions = action.payload[optionsTabs[0]];
            [selectedTab] = optionsTabs;
        }

        return {
            ...state,
            optionsObject,
            optionsTabs,
            selectOptions,
            selectedTab,
            filteredOptions: selectOptions,
        };
    }
    case 'filterOptions': {
        const filteredOptions = action.payload
            ? filterOptions(state.selectOptions, action.payload, action.labelKey)
            : state.selectOptions;

        return {
            ...state,
            filteredOptions,
            searchValue: action.payload,
            labelKey: action.labelKey,
        };
    }
    case 'changeTab': {
        const selectedTab = action.payload;
        const selectOptions = state.optionsObject[selectedTab];

        return {
            ...state,
            selectOptions,
            selectedTab,
            filteredOptions: state.searchValue
                ? filterOptions(selectOptions, state.searchValue, state.labelKey)
                : selectOptions,
        };
    }
    case 'toggleDropdown': {
        const isOpen = has(action, 'payload') ? action.payload : !state.isOpen;
        return { ...state, isOpen };
    }
    case 'selectValue': {
        return {
            ...state,
            selectedValue: action.payload,
            isOpen: false,
        };
    }
    default: throw new Error('Unexpected action');
    }
};

export default SelectReducer;
