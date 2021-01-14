(() =>{
    const params = (new URL(document.location)).searchParams;
    const startHour = parseInt(params.get('start_hour')) || 0;
    document.querySelectorAll('.time_schedule_list span').forEach( item => {
        const scheduleTime = item.innerText;
        item.innerText = convertScheduleTime(scheduleTime, startHour);
    });
    document.querySelectorAll('.time_schedule').forEach( item => {
        const scheduleStartTime = item.getAttribute('data-start');
        item.setAttribute('data-start', convertScheduleTime(scheduleStartTime, startHour));
        const scheduleEndTime = item.getAttribute('data-end');
        item.setAttribute('data-end', convertScheduleTime(scheduleEndTime, startHour));
    });
    function convertScheduleTime(scheduleTime, startHour) {
        return ('00' + (parseInt(scheduleTime.split(':')[0]) + startHour)).slice(-2) + ':' + scheduleTime.split(':')[1];
    }
})();