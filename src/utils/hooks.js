import { useState, useEffect, useDebugValue, useRef } from 'react';
import fetch from 'isomorphic-fetch';
import isEqual from 'lodash/isEqual';

/**
 * Get previous state or props
 */
export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

/**
 * Fetch data hook
 *
 * @param {String} url
 * @param {Object} params
 * @returns {Array.<{data: JSON, loading: Boolean}>}
 */
export function useFetch(url, params = {}) {
    const [fUrl] = useState(url);
    const [fParams] = useState(params);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController(); // eslint-disable-line no-undef
        const { signal } = controller;

        async function fetchUrl() {
            const response = await fetch(fUrl, { ...fParams, signal });
            return response.json();
        }

        fetchUrl()
            .then((res) => setData(res))
            .catch((error) => {
                console.error('[useFetch] error', error.message);
            })
            .finally(() => setLoading(false));

        return () => {
            controller.abort();
        };
    }, [fUrl, fParams]);

    return [data, loading];
}

/**
 * Attach event handler
 *
 * @param {String} event
 * @param {Function} handler
 * @param {Object} ref
 */
export function useEventHandler(event, handler, ref = null) {
    const elementRef = (ref && ref.current) ? ref.current : window;
    useEffect(() => {
        elementRef.addEventListener(event, handler);
        return () => {
            elementRef.removeEventListener(event, handler);
        };
    }, [elementRef, event, handler]);
}

/**
 * Check if a key is pressed
 *
 * @param {String} whichKey
 * @param {Function} callback
 * @param {Object} ref
 *
 * @returns {boolean}
 */
export function useOnKeyPressed(whichKey, callback = null, ref = null) {
    const [isKeyPressed, setIsKeyPressed] = useState(false);

    useEventHandler('keydown', (event) => {
        if (event.key === whichKey) {
            setIsKeyPressed(true);
            if (callback) {
                callback(event);
            }
        }
    }, ref);

    useEventHandler('keyup', (event) => {
        if (event.key === whichKey) {
            setIsKeyPressed(false);
            if (callback) {
                callback(event);
            }
        }
    }, ref);

    useDebugValue(isKeyPressed ? `${whichKey} key pressed` : `${whichKey} key not pressed`);

    return isKeyPressed;
}

/**
 * Call callback function when Esc key pressed
 *
 * @param {Function} callback
 * @param ref
 *
 * @returns {Boolean}
 */
export function useEscKeyPressed(callback, ref = null) {
    const [isKeyPressed, setIsKeyPressed] = useState(false);

    useEventHandler('keydown', (event) => {
        if (event.key === 'Escape') {
            setIsKeyPressed(true);
            if (callback) {
                callback(event);
            }
        }
    }, ref);

    return isKeyPressed;
}

/**
 * Call callback function when click outside the ref element
 *
 * @param {Object} ref
 * @param {Function} callback
 *
 * @returns {Boolean}
 */
export function useClickOutside(ref, callback) {
    const [isClickedOutside, setIsClickedOutside] = useState(false);

    useEventHandler('click', ({ target }) => {
        if (ref.current !== null && !ref.current.contains(target)) {
            callback();
            setIsClickedOutside(true);
        }
    });

    useDebugValue(isClickedOutside ? 'Clicked oustside' : 'Not clicked outside');

    return isClickedOutside;
}

/**
 * Check if mouse is over an element ( example: <div {...bind} ></div> )
 *
 * @returns {Array}
 */
export function useHover() {
    const [isHovered, setIsHovered] = useState(false);

    const bind = {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
    };

    useDebugValue(isHovered ? 'Hovering' : 'Not hovering');

    return [isHovered, bind];
}

/**
 * Hook for debugging purpose
 *
 * @param name
 * @param props
 */
export function useWhyDidYouUpdate(name, props) {
    // Get a mutable ref object where we can store props ...
    // ... for comparison next time this hook runs.
    const previousProps = useRef(null);

    useEffect(() => {
        if (previousProps.current) {
            // Get all keys from previous and current props
            const allKeys = Object.keys({ ...previousProps.current, ...props });
            // Use this object to keep track of changed props
            const changesObj = {};
            // Iterate through keys
            allKeys.forEach((key) => {
                // If previous is different from current
                if (!isEqual(previousProps.current[key], props[key])) {
                    // Add to changesObj
                    changesObj[key] = {
                        from: previousProps.current[key],
                        to: props[key],
                    };
                }
            });

            // If changesObj not empty then output to console
            if (Object.keys(changesObj).length) {
                console.log('[why-did-you-update]', name, changesObj);
            }
        }

        // Finally update previousProps with current props for next hook call
        previousProps.current = props;
    });
}

export const useAutoresize = (elementRef) => {
    const [{ width, height }, setMeasurements] = useState({ width: 0, height: 0 });
    const observer = new ResizeObserver(([{ contentRect }]) => {
        setMeasurements({ width: contentRect.width, height: contentRect.height });
    });
    useEffect(
        () => {
            if (elementRef.current) {
                observer.observe(elementRef.current);
            }
            return () => observer.disconnect();
        },
        [elementRef]
    );
    return { width, height };
};

export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(
        () => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => {
                clearTimeout(handler);
            };
        },
        [value, delay] 
    );

    return debouncedValue;
}