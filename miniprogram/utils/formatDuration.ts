// 将秒数转为 hh:mm:ss
export function formatDuration(duration: number) :string{
    var h = duration / 3600
    h = Math.floor(h)
    duration = duration - h  * 3600
    var m = duration / 60
    m = Math.floor(m)
    duration = duration - m * 60
    var s = duration
    s = Math.floor(s)
    
    var str = ''
    if(h < 10) {
        str = '0' + h + ':'
    } else {
        str = '' + h + ':'
    }
    
    if(m < 10){
        str += '0' + m + ':'
    } else {
        str += m + ':'
    }

    if(s < 10){
        str += '0' + s
    }else {
        str += s
    }

    return str
}