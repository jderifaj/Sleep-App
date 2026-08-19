import { useState } from 'react';
import { statusText, useSaveStatus } from './useSaveStatus';

interface Props {
  date: string;
  initialActivity: string;
  initialBedtime: string;
}

export default function NightActivity({ date, initialActivity, initialBedtime }: Props) {
  const [activity, setActivity] = useState(initialActivity);
  const [bedtime, setBedtime] = useState(initialBedtime);
  const { status, save } = useSaveStatus();

  return (
    <section className="card">
      <h2>Night Activity</h2>
      <textarea
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
        placeholder="Device usage before bed, anything notable..."
      />
      <label htmlFor="bedtime">What time did you go to bed?</label>
      <input id="bedtime" type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} />
      <div className="row" style={{ justifyContent: 'space-between', marginTop: '0.6rem' }}>
        <button
          disabled={status === 'saving'}
          onClick={() => save('/api/save-night', { date, night_activity: activity, bedtime })}
        >
          Save
        </button>
        <span className={`status ${status === 'error' ? 'error' : ''}`}>{statusText(status)}</span>
      </div>
    </section>
  );
}
