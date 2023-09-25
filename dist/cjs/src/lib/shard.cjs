'use strict';

const handleInvoke = (callback) => {
    return (...rest) => {
        if (typeof window !== 'undefined') {
            callback(...rest);
        }
        else {
            const name = callback.name;
            console.warn(`The current running environment does not support calling the ${name}`);
        }
    };
};

exports.handleInvoke = handleInvoke;
