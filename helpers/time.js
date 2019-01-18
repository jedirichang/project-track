const moment=require('moment');

exports.getMinutesDiff=(start,end)=>{
    start=moment(start);
    end=moment(end);
    return parseFloat(moment.duration(end.diff(start)).asMinutes().toFixed(2));
}

exports.convertMinutesToHumanReadableTime= time=>{
    let hour=time/60;
    let fHour=Math.floor(hour);
    let minutes=Math.round((hour - fHour) * 60);
    let hourString = fHour > 1 ? fHour + ' Hours' : fHour + ' Hour';
    let minuteString = minutes > 1 ? minutes + ' Minutes' : minutes + ' Minute';
    return hourString + ' ' + minuteString;
}