import { useState, useRef } from 'react';
import { Download, Upload, X } from 'lucide-react';
import { useDBStore } from '../store/dbStore';

export const BackupRestore = () => {
  const { exportNotes, importNotes } = useDBStore();
  const [importError, setImportError] = useState<string | null>(null);
  const [loading, setLoading] = useState<'import' | 'export' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateNotesFile = (notes: any): boolean => {
    return Array.isArray(notes) && notes.every(note => 'id' in note && 'title' in note);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading('import');
      setImportError(null);
      const text = await file.text();
      const notes = JSON.parse(text);

      if (!validateNotesFile(notes)) {
        throw new Error('Invalid file format');
      }

      await importNotes(file);
      window.location.reload();
    } catch (error) {
      console.error(error);
      setImportError('⚠️ Failed to import notes. Please ensure the file is valid JSON.');
    } finally {
      setLoading(null);
      // Reset input so user can re-upload the same file if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleExport = async () => {
    setLoading('export');
    try {
      await exportNotes();
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <button
          onClick={handleExport}
          disabled={loading === 'export'}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-60"
        >
          <Download className="w-5 h-5" />
          {loading === 'export' ? 'Exporting...' : 'Export Notes'}
        </button>

        <div className="relative">
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleImport}
            className="hidden"
            id="import-file"
          />
          <label
            htmlFor="import-file"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer"
          >
            <Upload className="w-5 h-5" />
            {loading === 'import' ? 'Importing...' : 'Import Notes'}
          </label>
        </div>
      </div>

      {importError && (
        <div className="flex items-center gap-2 text-red-500 bg-red-100 border border-red-300 rounded-md px-3 py-2 text-sm max-w-md">
          <span>{importError}</span>
          <button
            onClick={() => setImportError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
