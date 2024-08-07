export function timeDateFormatter(theDate) {
    const date = theDate.substring(0, 10)
    const time = theDate.substring(11, 16)
    
    if (time.startsWith('0')) {
        return `${date} at ${time.substring(1)} AM`
    }
    
    if (time.substring(0,2) > 12) {
        return `${date} at ${time.substring(0,2) - 12}:${time.substring(3)} PM`
    }
    
    return `${date} at ${time} AM`
}