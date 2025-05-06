// src/pages/EditAndPreviewWithBank.tsx

import React, { useState, useEffect, useRef } from 'react';
import { fetchQuestionSummaries, fetchQuestionRaw, updateQuestionRaw } from '../../lib/api';
import Select from 'react-select';
import * as Slider from '@radix-ui/react-slider';
import * as Switch from '@radix-ui/react-switch';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import Button from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Loader } from 'lucide-react';
import { questionCategories } from '../../lib/questionCategories';
import 'tailwindcss/tailwind.css';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

// LaTeX renderer for preview titles
const renderContent = (text: string = ""): string =>
  text.replace(/\\\((.+?)\\\)/g, (_, expr) =>
    katex.renderToString(expr, { throwOnError: false })
  );

interface Option { value: string; label: string; }

const EditAndPreviewWithBank: React.FC = () => {
  // Bank filter states
  const [selectedTypes, setSelectedTypes] = useState<Option[]>([]);
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [difficultyRange, setDifficultyRange] = useState<number[]>([1, 7]);
  const [onlyNew, setOnlyNew] = useState<boolean>(false);
  const debouncedTypes = useDebounce(selectedTypes, 500);
  const debouncedTags = useDebounce(selectedTags, 500);
  const debouncedDifficulty = useDebounce(difficultyRange, 500);

  // Pagination & summaries
  const [summaries, setSummaries] = useState<any[]>([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Editor states
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [editorLoading, setEditorLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Build filter select options
  const typeOptions: Option[] = questionCategories.map(c => ({ value: c.type, label: c.label }));
  const tagOptions: Option[] = questionCategories
    .filter(c => debouncedTypes.map(t => t.value).includes(c.type))
    .flatMap(c => c.tags)
    .map(t => ({ value: t.value, label: t.label }));

  // Fetch filtered questions
  useEffect(() => {
    let active = true;
    setBankLoading(true);
    (async () => {
      try {
        const data = await fetchQuestionSummaries({
          type: debouncedTypes.map(t => t.value),
          tags: debouncedTags.map(t => t.value),
          minDifficulty: debouncedDifficulty[0],
          maxDifficulty: debouncedDifficulty[1],
          progress_filter: onlyNew ? 'non-attempted' : 'all',
          page,
          pageSize,
        });
        if (!active) return;
        setSummaries(data.filter(q => !q.parentId));
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setBankLoading(false);
      }
    })();
    return () => { active = false; };
  }, [debouncedTypes, debouncedTags, debouncedDifficulty, onlyNew, page]);

  // Load raw JSON
  const handleSelect = async (id: string) => {
    setCurrentId(id);
    setError(null); setSuccess(null);
    setEditorLoading(true);
    try {
      const data = await fetchQuestionRaw(id);
      setJsonText(JSON.stringify(data, null, 2));
      setRefreshKey(k => k + 1);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setEditorLoading(false);
    }
  };

  // Save updated JSON
  const handleSave = async () => {
    if (!currentId) { setError('No question selected'); return; }
    let parsed;
    try { parsed = JSON.parse(jsonText); }
    catch (e: any) { setError('Invalid JSON: '+e.message); return; }
    setSaving(true); setError(null); setSuccess(null);
    try {
      const data = await updateQuestionRaw(currentId, parsed);
      setJsonText(JSON.stringify(data, null, 2));
      setSuccess('Saved successfully!');
      setRefreshKey(k => k + 1);
    } catch (e: any) {
      setError(e.message);
    } finally { setSaving(false); }
  };

  // Reload preview iframe
  useEffect(() => { if (iframeRef.current) iframeRef.current.src = iframeRef.current.src; }, [refreshKey]);

  return (
    <div className="flex h-full">
      {/* Left: Bank & Filters */}
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Question Bank</h2>
        <Card className="mb-4">
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Type</label>
                <Select
                  options={typeOptions}
                  isMulti value={selectedTypes}
                  onChange={v => setSelectedTypes(v as Option[])}
                  placeholder="All types"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Tags</label>
                <Select
                  options={tagOptions}
                  isMulti value={selectedTags}
                  onChange={v => setSelectedTags(v as Option[])}
                  placeholder="All tags"
                  isDisabled={!debouncedTypes.length}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">
                  Difficulty: {difficultyRange[0]} – {difficultyRange[1]}
                </label>
                <Slider.Root
                  value={difficultyRange}
                  onValueChange={setDifficultyRange}
                  min={1} max={7} step={1}
                  className="relative flex items-center h-6"
                >
                  <Slider.Track className="bg-gray-200 h-1 flex-1 rounded-full">
                    <Slider.Range className="bg-blue-500 h-full rounded-full" />
                  </Slider.Track>
                  <Slider.Thumb className="w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow" />
                  <Slider.Thumb className="w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow" />
                </Slider.Root>
              </div>
              <div className="flex items-center space-x-2">
                <Switch.Root
                  id="onlyNew" checked={onlyNew}
                  onCheckedChange={setOnlyNew}
                  className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-600"
                >
                  <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow translate-x-1 data-[state=checked]:translate-x-6" />
                </Switch.Root>
                <label htmlFor="onlyNew" className="text-sm">Only new</label>
              </div>
            </div>
          </CardContent>
        </Card>
        {bankLoading ? (
          <div className="flex justify-center py-10"><Loader className="animate-spin" /></div>
        ) : (
          <ul className="divide-y">
            {summaries.map(q => {
              const id = q.first_subquestion_id || q.id;
              return (
                <li key={id} className="py-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSelect(id)}>
                  <div className="font-medium truncate" dangerouslySetInnerHTML={{ __html: renderContent(q.preview_text || '') }} />
                  <div className="text-xs text-gray-500">Difficulty: {q.difficulty}</div>
                </li>
              );
            })}
          </ul>
        )}
        <div className="flex justify-between mt-4">
          <Button disabled={page===1} onClick={()=>setPage(p=>p-1)}>Previous</Button>
          <span>Page {page}</span>
          <Button disabled={summaries.length<pageSize} onClick={()=>setPage(p=>p+1)}>Next</Button>
        </div>
      </div>

      {/* Right: JSON Editor & Preview */}
      <div className="w-2/3 flex flex-col p-4">
        <h2 className="text-lg font-semibold mb-4">JSON Editor & Preview</h2>
        {error && <div className="text-red-500 mb-2">❌ {error}</div>}
        {success && <div className="text-green-600 mb-2">✔️ {success}</div>}
        <div className="flex-1 flex space-x-4">
          <textarea
            value={jsonText}
            onChange={e => setJsonText(e.target.value)}
            className="w-1/2 h-full border rounded p-2 font-mono text-sm overflow-auto"
            style={{ whiteSpace: 'pre' }}
          />
          <div className="w-1/2 border rounded h-full">
            <iframe
              ref={iframeRef}
              key={`${currentId}-${refreshKey}`}
              src={`${window.location.origin}/app/questions/${currentId}`}
              title="Preview"
              className="w-full h-full"
              frameBorder="0"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={handleSave} disabled={saving || !currentId}>{saving ? 'Saving…' : 'Save Changes'}</Button>
        </div>
      </div>
    </div>
  );
};

export default EditAndPreviewWithBank;