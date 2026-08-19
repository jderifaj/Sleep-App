import { useState } from 'react';
import { statusText, useSaveStatus } from './useSaveStatus';

interface Props {
  date: string;
  initialExercised: boolean;
  initialActivity: string;
  initialMinutes: number;
}

export default function Exercise({ date, initialExercised, initialActivity, initialMinutes }: Props) {
  const [exercised, setExercised] = useState(initialExercised);
  const [activity, setActivity] = useState(initialActivity);
  const [minutes, setMinutes] = useState(initialMinutes);
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
          <label htmlFor="exercise-minutes">Duration (minutes, optional)</label>
          <input
            id="exercise-minutes"
            type="number"
            min={0}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          />
        </>
      )}
      <div className="row" style={{ justifyContent: 'space-between', marginTop: '0.6rem' }}>
        <button
          disabled={status === 'saving'}
          onClick={() =>
            save('/api/save-exercise', {
              date,
              exercised,
              exercise_activity: activity,
              exercise_minutes: minutes,
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
