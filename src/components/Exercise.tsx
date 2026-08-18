import { useState } from 'react';
import { statusText, useSaveStatus } from './useSaveStatus';

interface Props {
  initialExercised: boolean;
  initialActivity: string;
  initialTime: string;
}

export default function Exercise({ initialExercised, initialActivity, initialTime }: Props) {
  const [exercised, setExercised] = useState(initialExercised);
  const [activity, setActivity] = useState(initialActivity);
  const [time, setTime] = useState(initialTime);
  const { status, save } = useSaveStatus();

  return (
    <section className="card">
      <h2>Exercise</h2>
      <div className="toggle-group">
        <button type="button" className={exercised ? 'active' : ''} onClick={() => setExercised(true)}>
          Yes
        </button>
        <button type="button" className={!exercised ? 'active' : ''} onClick={() => setExercised(false)}>
          No
        </button>
      </div>
      {exercised && (
        <>
          <label htmlFor="exercise-activity">Activity</label>
          <input
            id="exercise-activity"
            type="text"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder="e.g. Running, yoga, weights"
          />
          <label htmlFor="exercise-time">Time (optional)</label>
          <input id="exercise-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </>
      )}
      <div className="row" style={{ justifyContent: 'space-between', marginTop: '0.6rem' }}>
        <button
          disabled={status === 'saving'}
          onClick={() =>
            save('/api/save-exercise', {
              exercised,
              exercise_activity: activity,
              exercise_time: time,
            })
          }
        >
          Save
        </button>
        <span className={`status ${status === 'error' ? 'error' : ''}`}>{statusText(status)}</span>
      </div>
    </section>
  );
}
