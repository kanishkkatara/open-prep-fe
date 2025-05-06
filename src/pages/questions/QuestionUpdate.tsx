// src/pages/EditAndPreviewQuestion.tsx

import React, { useState, FC, useRef, useEffect } from 'react';
import { fetchQuestionRaw, updateQuestionRaw } from '../../lib/api';

const EditAndPreviewQuestionPage: FC = () => {
  const [inputId, setInputId]           = useState('');
  const [currentId, setCurrentId]       = useState<string | null>(null);
  const [jsonText, setJsonText]         = useState('');
  const [loading, setLoading]           = useState(false);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [success, setSuccess]           = useState<string | null>(null);
  const [refreshKey, setRefreshKey]     = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLoad = async () => {
    if (!inputId.trim()) {
      setError('Please enter a question ID');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await fetchQuestionRaw(inputId.trim());
      const pretty = JSON.stringify(data, null, 2);
      setJsonText(pretty);
      setCurrentId(inputId.trim());
      setRefreshKey(k => k + 1);
    } catch (err: any) {
      setError(err.message || 'Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentId) {
      setError('No question loaded');
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e: any) {
      setError('Invalid JSON: ' + e.message);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await updateQuestionRaw(currentId, parsed);
      setJsonText(JSON.stringify(data, null, 2));
      setSuccess('Saved successfully!');
      setRefreshKey(k => k + 1);
    } catch (err: any) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  // reload iframe whenever refreshKey increments
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  }, [refreshKey]);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        JSON Edit & Live Preview
      </h1>

      {/* ID input */}
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={inputId}
          onChange={e => setInputId(e.target.value)}
          placeholder="Enter question ID"
          className="flex-1 border rounded px-3 py-2 mr-2"
        />
        <button
          onClick={handleLoad}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Loading…' : 'Load'}
        </button>
      </div>

      {/* Error / Success */}
      {error && (
        <div className="text-red-500 bg-red-100 p-3 rounded mb-4">
          ❌ {error}
        </div>
      )}
      {success && (
        <div className="text-green-700 bg-green-100 p-3 rounded mb-4">
          ✔️ {success}
        </div>
      )}

      {/* Editor + Preview */}
      {currentId && (
        <div className="flex space-x-4">
          {/* Left: textarea */}
          <div className="w-1/2 flex flex-col">
            <textarea
              value={jsonText}
              onChange={e => setJsonText(e.target.value)}
              className="flex-1 border rounded p-2 font-mono text-sm leading-snug"
              style={{ minHeight: '80vh', whiteSpace: 'pre', overflow: 'auto' }}
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 self-start"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>

          {/* Right: live preview via iframe */}
          <div className="w-1/2 border rounded" style={{ height: '80vh' }}>
            <iframe
              ref={iframeRef}
              key={`${currentId}-${refreshKey}`}
              src={`${window.location.origin}/app/questions/${currentId}`}
              title="Question Preview"
              className="w-full h-full"
              frameBorder="0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditAndPreviewQuestionPage;
