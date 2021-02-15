(() =>{
    const params = (new URL(document.location)).searchParams;
    const startHour = parseInt(params.get('start_hour')) || 0;
    const startMinute = parseInt(params.get('start_minute')) || 0;
    document.querySelectorAll('.time_schedule_list span').forEach( item => {
        const scheduleTime = item.innerText;
        item.innerText = convertScheduleTime(scheduleTime, startHour, startMinute);
    });
    document.querySelectorAll('.time_schedule').forEach( item => {
        const scheduleStartTime = item.getAttribute('data-start');
        item.setAttribute('data-start', convertScheduleTime(scheduleStartTime, startHour, startMinute));
        const scheduleEndTime = item.getAttribute('data-end');
        item.setAttribute('data-end', convertScheduleTime(scheduleEndTime, startHour, startMinute));
    });
    function convertScheduleTime(scheduleTime, startHour, startMinute) {
        const times = scheduleTime.split(':');
        let hour = parseInt(times[0]) + startHour;
        let minute = parseInt(times[1]) + startMinute;
        if (minute >= 60) {
            hour += 1;
        }
        minute = minute % 60;
        console.log(minute);
        return ('00' + hour).slice(-2) + ':' + ('00' + minute).slice(-2);
    }
})();