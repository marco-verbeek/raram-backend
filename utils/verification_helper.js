const _ = require("lodash")

/**
 * Creates an array of numbers between 0-29 (League of Legends free starter icons) without duplicates, in ascending order.
 * @returns {[number]} array of integers of size 3
 */
exports.getRandomIcons = () => {
    return _.orderBy(_.sampleSize(_.range(0, 28), 3))
}

/**
 * Removes value from container if present.
 * @param container array containing values
 * @param value value to look out for and remove from container if present
 */
exports.removeIfContained = (container, value) => {
    return _.without(container, value)
}