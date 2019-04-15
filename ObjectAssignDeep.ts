// Based on: https://www.npmjs.com/package/object-assign-deep

/**
 * A unified way of returning a string that
 * describes the type of the given variable.
 */
const getTypeOf = function (input:any) {
    if (input === null) return 'null';
    if (typeof input === 'undefined') return 'undefined';
    if (typeof input === 'object') return (Array.isArray(input) ? 'array' : 'object');

    return typeof input;
};

/**
 * Branching logic which calls the correct function to
 * clone the given value base on its type.
 */
const cloneValue = function (value:any) {
    if (getTypeOf(value) === 'object') return quickCloneObject(value); // The value is an object so lets clone it.
    if (getTypeOf(value) === 'array') return quickCloneArray(value); // The value is an array so lets clone it.

    return value; // Any other value can just be copied.
};

/**
 * Enumerates the given array and returns a new array,
 * with each of its values cloned (i.e. references broken).
 */
const quickCloneArray = function (input:any) {
    return input.map(cloneValue);
};

/**
 * Enumerates the properties of the given object (ignoring the prototype chain) and returns a new object, with each of
 * its values cloned (i.e. references broken).
 */
const quickCloneObject = function (input:any) {
    const output:{[key:string]:any} = {};

    for (const key in input)
        if (input.hasOwnProperty(key))
            output[key] = cloneValue(input[key]);

    return output;
};

/** Does the actual deep merging. */
const executeDeepMerge = function (target:any, _objects:Array<any> = [], _options:any = {}) {
    const options = {
        arrayBehaviour: _options.arrayBehaviour || 'replace',  // Can be "merge" or "replace".
    };

    // Ensure we have actual objects for each.
    const objects = _objects.map(object => object || {});
    const output = target || {};

    // Enumerate the objects and their keys.
    for (let oindex = 0; oindex < objects.length; oindex++) {
        const object = objects[oindex];
        const keys = Object.keys(object);

        for (let kindex = 0; kindex < keys.length; kindex++) {
            const key = keys[kindex];
            const value = object[key];
            const type = getTypeOf(value);
            const existingValueType = getTypeOf(output[key]);

            if (type === 'object') {
                if (existingValueType !== 'undefined') {
                    const existingValue = (existingValueType === 'object' ? output[key] : {});
                    output[key] = executeDeepMerge({}, [existingValue, quickCloneObject(value)], options);
                } else {
                    output[key] = quickCloneObject(value);
                }
            } else if (type === 'array') {
                if (existingValueType === 'array') {
                    const newValue = quickCloneArray(value);
                    output[key] = (options.arrayBehaviour === 'merge' ? output[key].concat(newValue) : newValue);
                } else {
                    output[key] = quickCloneArray(value);
                }
            } else {
                output[key] = value;
            }
        }
    }

    return output;
};

/**
 * Merge all the supplied objects into the target object,
 * breaking all references, including those of nested objects
 * and arrays, and even objects nested inside arrays.
 * The first parameter is not mutated unlike Object.assign().
 * Properties in later objects will always overwrite.
 */
const objectAssignDeep = function (target:any, ...objects:Array<any>) {
    return executeDeepMerge(target, objects);
};

/*
 * Same as objectAssignDeep() except it doesn't mutate the
 * target object and returns an entirely new object.
 */
const noMutate = function (...objects:Array<any>) {
    return executeDeepMerge({}, objects);
};

/**
 * Allows an options object to be passed in to
 * customise the behaviour of the function.
 */
const withOptions = function (target:any, objects:any, options:any) {
    return executeDeepMerge(target, objects, options);
};

export default objectAssignDeep;
export {objectAssignDeep as ObjectAssignDeep};
export {noMutate, withOptions};