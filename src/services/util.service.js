export const utilService = {
    makeId,
    makeLorem,
    getRandomIntInclusive,
    delay,
    debounce,
    shuffle,
    decodeHtmlCharCodes,
    daysAgo
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}

function delay(ms = 1500) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

function debounce(func, wait = 500) {
    let timeout

    return function (...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }

        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5)
}

function decodeHtmlCharCodes(str) {
    return str.replace(/(&#(\d+);)/g, function (match, capture, charCode) {
        return String.fromCharCode(charCode)
    })
    // Will output "The show that gained int’l reputation’!"
    // console.log(decodeHtmlCharCodes('The show that gained int&#8217;l reputation&#8217;!'));
}

function daysAgo(timestamp) {
    const timeBetween = Date.now() - timestamp
    const days = timeBetween / (1000 * 3600 * 24)
    if (days <= 14) {
        if (days < 1) return 'Today'
        if (days < 2) return '1 day ago'
        return `${Math.floor(days)} days ago`
    }
    const timestampYear = new Date(timestamp).getFullYear()
    const currYear = new Date().getFullYear()
    const options = (timestampYear === currYear) ? { month: 'short', day: 'numeric' }
        : { month: 'short', day: 'numeric', year: 'numeric' }
    return new Date(timestamp).toLocaleString('en-US', options)
}

