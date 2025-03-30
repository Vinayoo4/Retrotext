import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, BookOpen, Tag } from 'lucide-react';
import type { Note } from './types';
import { IntroAnimation } from './components/IntroAnimation';
import { NoteCard } from './components/NoteCard';
import { useNoteStore } from './store/noteStore';

function App() {
  const { notes, addNote, updateNote } = useNoteStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewNote, setShowNewNote] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const themes = ['Personal', 'Work', 'Ideas', 'Tasks', 'Journal'];
  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags || [])));

  useEffect(() => {
    //Function to disable certain actions/copying,cutting
    const disableActions = (e: { preventDefault: () => void }) => {
      e.preventDefault();
      alert('Hey 👶🫵🏼 ,Stay Out of it 🙅🧌.');
    };
    // Add event listeners for 'copy', 'cut', and 'contextmenu'
    document.addEventListener('copy', disableActions);
    document.addEventListener('cut', disableActions);
    document.addEventListener('contextmenu', disableActions);

    // Clean up event listeners on component unmount
    return () => {
      document.removeEventListener('copy', disableActions);
      document.removeEventListener('cut', disableActions);
      document.removeEventListener('contextmenu', disableActions);
    };
  }, []);

  const handleSaveNote = (note: Partial<Note>) => {
    if (currentNote) {
      updateNote(currentNote.id, note);
    } else {
      addNote({
        title: note.title || '',
        content: note.content || '',
        theme: note.theme || themes[0],
      });
    }
    setShowNewNote(false);
    setCurrentNote(null);
  };

  const filteredNotes = notes
    .filter(
      (note) =>
        (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!selectedTheme || note.theme === selectedTheme) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) => note.tags?.includes(tag)))
    )
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}

      <div className="min-h-screen bg-[#2c2c2c] ancient-paper">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-amber-800" />
                <h1 className="text-4xl font-serif text-amber-800">
                  Retro Notes
                </h1>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewNote(true)}
                className="px-4 py-2 bg-amber-800 text-amber-50 rounded-lg flex items-center gap-2 hover:bg-amber-700 transition-colors shadow-lg"
              >
                <Plus className="w-5 h-5" />
                New Entry
              </motion.button>
            </div>

            <div className="flex flex-col gap-4 mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-800/50" />
                <input
                  type="text"
                  placeholder="Search your journal..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-amber-50/90 text-amber-900 placeholder-amber-800/50 focus:outline-none focus:ring-2 focus:ring-amber-800 shadow-lg font-serif"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-4 flex-wrap">
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-amber-50/90 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-800 shadow-lg font-serif"
                >
                  <option value="">All Themes</option>
                  {themes.map((theme) => (
                    <option key={theme} value={theme}>
                      {theme}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2 flex-wrap">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        setSelectedTags((prev) =>
                          prev.includes(tag)
                            ? prev.filter((t) => t !== tag)
                            : [...prev, tag]
                        )
                      }
                      className={`px-3 py-1 rounded-full font-serif flex items-center gap-1
                        ${
                          selectedTags.includes(tag)
                            ? 'bg-amber-800 text-amber-50'
                            : 'bg-amber-50/90 text-amber-900'
                        }`}
                    >
                      <Tag className="w-4 h-4" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <AnimatePresence>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                layout
              >
                {filteredNotes.map((note) => (
                  <NoteCard key={note.id} note={note} onEdit={setCurrentNote} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {(showNewNote || currentNote) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="note-paper rounded-lg p-6 w-full max-w-lg"
              >
                <h2 className="text-2xl font-serif mb-4 ink-text">
                  {currentNote ? 'Edit Entry' : 'New Entry'}
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleSaveNote({
                      title: formData.get('title') as string,
                      content: formData.get('content') as string,
                      theme: formData.get('theme') as string,
                    });
                  }}
                >
                  <input
                    name="title"
                    defaultValue={currentNote?.title}
                    placeholder="Title"
                    className="w-full mb-4 p-3 border-b border-amber-800/20 bg-transparent font-serif focus:outline-none focus:border-amber-800"
                    required
                  />
                  <textarea
                    name="content"
                    defaultValue={currentNote?.content}
                    placeholder="Write your thoughts... (Markdown supported)"
                    className="w-full mb-4 p-3 border-b border-amber-800/20 bg-transparent font-serif h-32 focus:outline-none focus:border-amber-800 resize-none"
                    required
                  />
                  <select
                    name="theme"
                    defaultValue={currentNote?.theme || themes[0]}
                    className="w-full mb-4 p-3 border border-amber-800/20 rounded bg-transparent font-serif focus:outline-none focus:border-amber-800"
                  >
                    {themes.map((theme) => (
                      <option key={theme} value={theme}>
                        {theme}
                      </option>
                    ))}
                  </select>
                  <div className="flex justify-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setShowNewNote(false);
                        setCurrentNote(null);
                      }}
                      className="px-4 py-2 text-amber-800 hover:bg-amber-800/10 rounded font-serif"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-4 py-2 bg-amber-800 text-amber-50 rounded hover:bg-amber-700 font-serif"
                    >
                      Save
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
