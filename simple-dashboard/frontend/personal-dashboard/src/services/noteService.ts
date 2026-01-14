// Simple 5-Node Note Service
// Manages a simple note with 5 sections/nodes

export interface Note {
  id: string;
  nodes: string[]; // Array of 5 note nodes
  lastUpdated: number;
}

const NOTES_KEY = 'simple_5_node_notes';

// Get all notes
export const getNotes = (): Note[] => {
  try {
    const stored = localStorage.getItem(NOTES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading notes:', e);
  }
  return [];
};

// Get single note by ID
export const getNote = (id: string): Note | null => {
  const notes = getNotes();
  return notes.find(n => n.id === id) || null;
};

// Create new note with 5 empty nodes
export const createNote = (): Note => {
  const newNote: Note = {
    id: Date.now().toString(),
    nodes: ['', '', '', '', ''], // 5 empty nodes
    lastUpdated: Date.now(),
  };
  
  const notes = getNotes();
  notes.unshift(newNote);
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  
  return newNote;
};

// Update note
export const updateNote = (id: string, nodes: string[]): void => {
  const notes = getNotes();
  const index = notes.findIndex(n => n.id === id);
  
  if (index !== -1) {
    notes[index].nodes = nodes.slice(0, 5); // Ensure only 5 nodes
    notes[index].lastUpdated = Date.now();
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }
};

// Delete note
export const deleteNote = (id: string): void => {
  const notes = getNotes();
  const filtered = notes.filter(n => n.id !== id);
  localStorage.setItem(NOTES_KEY, JSON.stringify(filtered));
};

// Get most recent note
export const getLatestNote = (): Note | null => {
  const notes = getNotes();
  return notes.length > 0 ? notes[0] : null;
};

// Get or create current note
export const getCurrentNote = (): Note => {
  const latest = getLatestNote();
  if (latest) {
    return latest;
  }
  return createNote();
};

// Clear all notes
export const clearAllNotes = (): void => {
  localStorage.removeItem(NOTES_KEY);
};

// Format last updated time
export const formatLastUpdated = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};
