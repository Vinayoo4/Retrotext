import { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { useDBStore } from '../store/dbStore';

export const BackupRestore = () => {
  const [importError, setImportError] = useState<string | null>(null);
  const { exportNotes, importNotes } = useDBStore();

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImportError(null);
      await importNotes(file);
      // Refresh the page to show imported notes
      window.location.reload();
    } catch (error) {
      setImportError('Failed to import notes. Please make sure the file is valid.');
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <button
        onClick={exportNotes}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
      >
        <Download className="w-5 h-5" />
        Export Notes
      </button>

      <div className="relative">
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
          id="import-file"
        />
        <label
          htmlFor="import-file"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer"
        >
          <Upload className="w-5 h-5" />
          Import Notes
        </label>
      </div>

      {importError && (
        <div className="text-red-500 text-sm">{importError}</div>
      )}
    </div>
  );
}; 