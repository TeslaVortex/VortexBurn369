import React, { useState, useEffect } from 'react';
import { getCurrentNote, updateNote, clearAllNotes, formatLastUpdated } from '../services/noteService';
import { notifySuccess } from '../utils/notifications';

function SimpleNote() {
  const [note, setNote] = useState(getCurrentNote());
  const [nodes, setNodes] = useState<string[]>(note.nodes);
  const [lastSaved, setLastSaved] = useState(note.lastUpdated);

  useEffect(() => {
    const currentNote = getCurrentNote();
    setNote(currentNote);
    setNodes(currentNote.nodes);
    setLastSaved(currentNote.lastUpdated);
  }, []);

  const handleNodeChange = (index: number, value: string) => {
    const newNodes = [...nodes];
    newNodes[index] = value;
    setNodes(newNodes);
    
    // Auto-save after typing
    updateNote(note.id, newNodes);
    setLastSaved(Date.now());
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all notes? This cannot be undone.')) {
      clearAllNotes();
      const newNote = getCurrentNote();
      setNote(newNote);
      setNodes(newNote.nodes);
      setLastSaved(newNote.lastUpdated);
      notifySuccess('All notes cleared');
    }
  };

  const nodeLabels = ['Node 1', 'Node 2', 'Node 3', 'Node 4', 'Node 5'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          📝 Quick Notes
        </h2>
        <button
          onClick={handleClearAll}
          className="text-xs text-red-500 hover:text-red-700 transition"
          title="Clear all notes"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3">
        {nodes.map((node, index) => (
          <div key={index}>
            <label className="block text-xs text-gray-500 mb-1 font-medium">
              {nodeLabels[index]}
            </label>
            <textarea
              value={node}
              onChange={(e) => handleNodeChange(index, e.target.value)}
              placeholder={`Enter ${nodeLabels[index].toLowerCase()}...`}
              className="w-full p-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              rows={2}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-400 text-right">
        Last saved: {formatLastUpdated(lastSaved)}
      </div>
    </div>
  );
}

export default SimpleNote;
