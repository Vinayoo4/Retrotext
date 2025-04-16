import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, BookOpen, Tag, BarChart2, X } from 'lucide-react';
import type { Note } from './types';
import { IntroAnimation } from './components/IntroAnimation';
import { NoteCard } from './components/NoteCard';
import { Analytics } from './components/Analytics';
import { BackupRestore } from './components/BackupRestore';
import TemplateSelector from './components/TemplateSelector';
import useNoteStore from './store/noteStore';
import useTemplateStore from './store/templateStore';
import { useDBStore } from './store/dbStore';
import { NoteEditor } from './components/NoteEditor';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { NoteTemplate } from './types/templates';

function App() {
  const { notes, addNote, updateNote, searchNotes } = useNoteStore();
  const { loadNotes, saveNote, deleteNote, getNoteBySlug } = useDBStore();
  const { templates } = useTemplateStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewNote, setShowNewNote] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const navigate = useNavigate();

  const themes = ['Personal', 'Work', 'Ideas', 'Tasks', 'Journal'];
  const allTags = Array.from(new Set(notes.flatMap((note: Note) => note.tags || [])));

  useEffect(() => {
    const disableActions = (e: { preventDefault: () => void }) => {
      e.preventDefault();
      alert('Hey 👶🫵🏼 ,Stay Out of it 🙅🧌.');
    };
    document.addEventListener('copy', disableActions);
    document.addEventListener('cut', disableActions);
    document.addEventListener('contextmenu', disableActions);

    return () => {
      document.removeEventListener('copy', disableActions);
      document.removeEventListener('cut', disableActions);
      document.removeEventListener('contextmenu', disableActions);
    };
  }, []);

  useEffect(() => {
    loadNotes();
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

  const handleCreateNote = () => {
    const newNote: Note = {
      id: uuidv4(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
      tags: [],
      versions: [],
      theme: themes[0]
    };
    saveNote(newNote);
    setCurrentNote(newNote);
    navigate(`/note/${generateSlug('Untitled Note')}`);
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    setCurrentNote(null);
    navigate('/');
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const filteredNotes = searchNotes(searchTerm)
    .filter(
      (note: Note) =>
        (!selectedTheme || note.theme === selectedTheme) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) => note.tags?.includes(tag)))
    )
    .sort((a: Note, b: Note) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}

      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <BookOpen className="w-8 h-8 text-indigo-400" />
                </motion.div>
                <h1 className="text-4xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Retro Notes
                </h1>
              </div>
              <div className="flex gap-2">
                <BackupRestore />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className="px-4 py-2 bg-slate-800/50 text-indigo-400 rounded-lg flex items-center gap-2 hover:bg-slate-700/50 transition-all shadow-lg"
                >
                  <BarChart2 className="w-5 h-5" />
                  Analytics
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNewNote(true)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg flex items-center gap-2 hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-5 h-5" />
                  New Entry
                </motion.button>
              </div>
            </div>

            {showAnalytics && <Analytics />}

            <div className="flex flex-col gap-4 mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400/50" />
                <input
                  type="text"
                  placeholder="Search your journal..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-800/50 text-white placeholder-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg backdrop-blur-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-4 flex-wrap">
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg backdrop-blur-sm"
                >
                  <option value="">All Themes</option>
                  {themes.map((theme) => (
                    <option key={theme} value={theme}>
                      {theme}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2 flex-wrap">
                  {allTags.map((tag: string) => (
                    <button
                      key={tag}
                      onClick={() =>
                        setSelectedTags((prev) =>
                          prev.includes(tag)
                            ? prev.filter((t) => t !== tag)
                            : [...prev, tag]
                        )
                      }
                      className={`px-3 py-1 rounded-full flex items-center gap-1 transition-all
                        ${
                          selectedTags.includes(tag)
                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                            : 'bg-slate-800/50 text-indigo-400 hover:bg-slate-700/50'
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
                {filteredNotes.map((note: Note) => (
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
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-lg p-6 w-full max-w-lg shadow-xl shadow-indigo-500/20"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    {currentNote ? 'Edit Entry' : 'New Entry'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowNewNote(false);
                      setCurrentNote(null);
                    }}
                    className="p-2 hover:bg-slate-700/50 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-indigo-400" />
                  </button>
                </div>
                <TemplateSelector
                  onSelect={(template: NoteTemplate) => {
                    const newNote: Note = {
                      id: uuidv4(),
                      title: template.name,
                      content: template.content,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      isPinned: false,
                      tags: template.tags,
                      versions: [],
                      theme: themes[0]
                    };
                    saveNote(newNote);
                    setCurrentNote(newNote);
                    setShowNewNote(false);
                    navigate(`/note/${generateSlug(template.name)}`);
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note: Note) => (
                <div
                  key={note.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer"
                  onClick={() => {
                    setCurrentNote(note);
                    navigate(`/note/${note.id}`);
                  }}
                >
                  <h2 className="text-lg font-semibold">{note.title}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          }
        />
        <Route
          path="/note/:slug"
          element={
            currentNote ? (
              <NoteEditor
                note={currentNote}
                onSave={handleSaveNote}
                onDelete={() => handleDeleteNote(currentNote.id)}
              />
            ) : (
              <div>Loading...</div>
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
