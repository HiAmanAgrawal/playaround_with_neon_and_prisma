'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';


interface Note {
  id: string;
  title: string;
  content: string;
  createdAt?: Date; 
  updatedAt?: Date; 
  userId?: string;   
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Load notes after login
  useEffect(() => {
    if (session) {
      fetch('/api/notes')
        .then(res => res.json())
        .then(data => setNotes(data));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/notes', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
    });
    setTitle('');
    setContent('');
    // Reload notes
    const res = await fetch('/api/notes');
    const data = await res.json();
    setNotes(data);
  };

  if (status === 'loading') return <p>Loading...</p>;

  if (!session) {
    return (
      <div>
        <h2>You are not logged in</h2>
        <button onClick={() => signIn('github')}>Sign in with GitHub</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Welcome, {session.user?.name}!</h2>
      <button onClick={() => signOut()}>Log out</button>

      <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
        <input
          placeholder="Note title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Note content"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
        <br />
        <button type="submit">Add Note</button>
      </form>

      <div style={{ marginTop: 40 }}>
        <h3>Your Notes:</h3>
        <ul>
          {notes.map((note: Note) => (
            <li key={note.id}>
              <strong>{note.title}</strong>: {note.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}