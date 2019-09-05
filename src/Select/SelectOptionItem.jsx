import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useHover } from '../utils/hooks';

const SelectOptionItem = React.forwardRef(({
    option,
    valueKey,
    labelKey,
    focused,
    isSelected,
    onHovered,
    onSelected,
    optionRenderer,
    index,
    style,
}, ref) => {
    // console.log('[SelectOptionItem] rendering');
    
    function renderOption(option) {
        return optionRenderer ? optionRenderer(option) : (
            <span>{option[labelKey]}</span>
        );
    }

    function handleOptionClicked(e) {
        e.preventDefault();
        e.stopPropagation();
        onSelected(option);
    }

    const [isHovered, bind] = useHover();

    useEffect(() => {
        if (isHovered) {
            onHovered(index);
        }
    }, [isHovered, index, onHovered]);

    return (
        <div
            style={style}
            ref={ref}
            className={classNames('lgw-select-result', {
                highlighted: (focused || isHovered) && !option.grpTitle,
                'active-result': !option.disabled,
                'disabled-result': option.disabled || option.grpTitle,
                'result-selected': isSelected,
                'group-result': option.grpTitle,
            })}
            onClick={!option.grpTitle ? handleOptionClicked : null}
            {...bind}
        >
            {renderOption(option)}
        </div>
    );
});

SelectOptionItem.propTypes = {
    option: PropTypes.object,
    valueKey: PropTypes.string,
    labelKey: PropTypes.string,
};

export default React.memo(SelectOptionItem, (prevProps, nextProps) => {
    return prevProps.focused === nextProps.focused;
});