const _ = require("lodash")

/**
 * Creates an array of numbers between 0-29 (League of Legends free starter icons) without duplicates, in ascending order.
 * @returns {[number]} array of integers of size 3
 */
exports.getRandomIcons = () => {
    return _.orderBy(_.sampleSize(_.range(0, 29), 3))
}