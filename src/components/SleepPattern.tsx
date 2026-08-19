import { useState } from 'react';
import { statusText, useSaveStatus } from './useSaveStatus';

interface Props {
  date: string;
  initialTrouble: boolean;
  initialWoke: boolean;
  initialWakeCount: number;
}

export default function SleepPattern({ date, initialTrouble, initialWoke, initialWakeCount }: Props) {
  const [trouble, setTrouble] = useState(initialTrouble);
  const [woke, setWoke] = useState(initialWoke);
  const [wakeCount, setWakeCount] = useState(initialWakeCount);
  const { status, save } = useSaveStatus();

  return (
    <section className="card">
      <h2>Sleep Pattern</h2>

      <label>Trouble falling asleep?</label>
      <div className="toggle-group">
        <button type="button" className={trouble ? 'active' : ''} onClick={() => setTrouble(true)}>
          Yes
        </button>
        <button type="button" className={!trouble ? 'active' : ''} onClick={() => setTrouble(false)}>
          No
        </button>
      </div>

      <label>Woke up during the night?</label>
      <div className="toggle-group">
        <button type="button" className={woke ? 'active' : ''} onClick={() => setWoke(true)}>
          Yes
        </button>
        <button
          type="button"
          className={!woke ? 'active' : ''}
          onClick={() => {
            setWoke(false);
            setWakeCount(0);
          }}
        >
          No
        </button>
      </div>

      {woke && (
        <>
          <label htmlFor="wake-count">How many times?</label>
          <input
            id="wake-count"
            type="number"
            min={0}
            value={wakeCount}
            onChange={(e) => setWakeCount(Number(e.target.value))}
          />
        </>
      )}

      <div className="row" style={{ justifyContent: 'space-between', marginTop: '0.6rem' }}>
        <button
          disabled={status === 'saving'}
          onClick={() =>
            save('/api/save-sleep', {
              date,
              trouble_falling_asleep: trouble,
              woke_in_night: woke,
              wake_count: wakeCount,
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
