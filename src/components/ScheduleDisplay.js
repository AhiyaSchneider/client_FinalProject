const ScheduleDisplay = ({ schedule }) => (
    console.log(schedule), // Debugging the schedule data

    <table>
        <thead>
            <tr>
                <th>Day</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Skill</th>
                <th>Workers</th>
            </tr>
        </thead>
        <tbody>
            {schedule.map((shift, idx) => (
                <tr key={idx}>
                    <td>{shift.day}</td>
                    <td>{shift.startTime}</td>
                    <td>{shift.endTime}</td>
                    <td>{shift.skill}</td>
                    <td>{shift.workers.map(w => w.workerName || w.workerId).join(', ')}</td>
                    </tr>
            ))}
        </tbody>
    </table>
);

export default ScheduleDisplay;
