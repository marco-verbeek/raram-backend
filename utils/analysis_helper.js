const _ = require('lodash');

/**
 * Creates a new Map containing each champion's Id as key, and its name as value.
 * @returns {Map<number, string>}
 * @note This function definately needs to be placed elsewhere.
 */
const mapChampionNameToId = () => {
    const champions = require('../data/champions.json')
    const championMap = new Map()

    _.forEach(champions.data, (c) => {
        championMap.set(parseInt(c["key"]), c["id"])
    })

    return championMap
}

/**
 * Limits a certain number with following logic: <br/>
 * * if the number is lower than min, selects min. <br/>
 * * if the number is higher than max, selects max.
 * @param gain The number that is going to get limited.
 * @param min The lowest amount allowed
 * @param max The highest amount allowed
 * @returns {number} gain if between min and max, min if lower than min, max if higher than max
 */
exports.limit = (gain = 0, min = -4, max = 4) => {
    return gain < 0 ? _.max([min, gain]) : _.min([gain, max])
}

/**
 * Calculates how much LP should be gained.
 * @note this is a helper function specific to my needs. You will probably never ever need it.
 * @param gain percentage that will determine pre-multiplier amount
 * @param multiplier will be multiplied with gain
 * @param resultMultiplier result of previous operation will be multiplied with resultMultiplier
 * @returns {number} 2-decimal float representing (gain*multiplier) * resultMultiplier
 */
exports.calculateGain = (gain, multiplier = 10, resultMultiplier = 1) => {
    return (gain * 10).toFixed(2) * resultMultiplier
}

/**
 * Map containing every champion name mapped to its internal ID.
 * @type {Map<number, string>}
 */
const ChampionList = mapChampionNameToId()

/**
 * Gets the champion's name from its championId.
 * @param id champion id
 * @returns {string} the champion's name.
 */
exports.getChampionNameById = (id) => {
    return ChampionList.get(parseInt(id)) ?? "Not found"
}

/**
 * Formats the value provided to a 2-decimal float
 * @param value the value you wish to format
 * @returns {number} formatted value
 */
exports.format = (value) => {
    return parseFloat(value.toFixed(2))
}