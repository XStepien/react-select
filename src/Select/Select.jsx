import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Select = ({ placeholder, value, style }) => {
    return (
        <div
            className={classNames(
                'lgw-select-container', {
                    'lgw-select-container-single': true,
                    'lgw-select-container-multi': false,
                },
            )}
            style={style.container}
        >
            <div
                className={classNames(
                    'lgw-select-single', {
                        'lgw-select-default': !value,
                    },
                )}
            >
                {value || placeholder}
                <div>
                    <b className="lgw-select-arrow" />
                </div>
            </div>
        </div>
    );
};

Select.propTypes = {
    placeholder: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.oneOfType([
        PropTypes.string, PropTypes.number, PropTypes.object,
    ]),
};

Select.defaultProps = {
    placeholder: 'Select an option...',
    style: {
        container: {}
    }
}

export default Select;
