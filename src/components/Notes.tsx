import { useState } from 'react';
import { statusText, useSaveStatus } from './useSaveStatus';

interface Props {
  date: string;
  initialValue: string;
}

export default function Notes({ date, initialValue }: Props) {
  const [value, setValue] = useState(initialValue);
  const { status, save } = useSaveStatus();

  return (
    <section className="card">
      <h2>Notes</h2>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Anything else worth remembering about today..."
      />
      <div className="row" style={{ justifyContent: 'space-between', marginTop: '0.6rem' }}>
        <button
          disabled={status === 'saving'}
          onClick={() => save('/api/save-notes', { date, notes: value })}>
          Save
        </button>
        <span className={`status ${status === 'error' ? 'error' : ''}`}>{statusText(status)}</span>
      </div>
    </section>
  );
}
