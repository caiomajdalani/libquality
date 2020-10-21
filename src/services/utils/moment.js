const moment = require('moment')

/**
 * Transform date on quantity of days
 */
const _getDays = (date) => {
    let date1 = moment(date);
    let today = moment();
    //Get the difference between variable date from today 
    let diff = today.diff(date1, 'days');
    return diff
}

const _getHours = (date) => {
    console.log(date)
    let date1 = moment(date);
    let today = moment();
    //Get the difference between variable date from today 
    let diff = today.diff(date1, 'hours');
    return diff
}

/**
 * Here we will get the list of issues from github's API, and catch the date from "created_at" field for each issue in the list.
 * We need to sum all dates to get the AvgAge and StdAge
 */
const _getDatesFromList = (items) => {
    let sum = 0;
    let newList = []
    for (const [i, item] of items.entries()) {
        // get the date
        let date = item.created_at
        // transform into days
        let days = _getDays(date)
        // lets push the result into a new list (we will use that to StdAge)
        newList.push(days)
        // now we sum the days to get the total after the process end
        sum += days
    }
    return { sum, newList }
}

module.exports = { _getDays, _getDatesFromList, _getHours }