// src/pages/EditAndPreviewWithBank.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  fetchQuestionSummaries,
  fetchQuestionRaw,
  updateQuestionRaw,
} from '../../lib/api';
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
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// LaTeX renderer
const renderContent = (text = ''): string =>
  text.replace(/\\\((.+?)\\\)/g, (_, expr) =>
    katex.renderToString(expr, { throwOnError: false })
  );

interface Option { value: string; label: string; }

const EditAndPreviewWithBank: React.FC = () => {
  // Bank filters
  const [selectedTypes, setSelectedTypes] = useState<Option[]>([]);
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [difficultyRange, setDifficultyRange] = useState<number[]>([1, 7]);
  const [onlyNew, setOnlyNew] = useState(false);

  const debouncedTypes = useDebounce(selectedTypes, 500);
  const debouncedTags = useDebounce(selectedTags, 500);
  const debouncedDifficulty = useDebounce(difficultyRange, 500);

  // Summaries & pagination
  const [summaries, setSummaries] = useState<any[]>([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Editor state
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const previewRef = useRef<HTMLIFrameElement>(null);
  const sourceRef = useRef<HTMLIFrameElement>(null);

  // Resizer state
  const [leftPct, setLeftPct] = useState(25);
  const [midPct, setMidPct] = useState(25);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<'left' | 'mid' | null>(null);

  // Build filter options
  const typeOptions: Option[] = questionCategories.map(c => ({
    value: c.type,
    label: c.label,
  }));
  const tagOptions: Option[] = questionCategories
    .filter(c => debouncedTypes.map(t => t.value).includes(c.type))
    .flatMap(c => c.tags)
    .map(t => ({ value: t.value, label: t.label }));

  // Fetch question summaries
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

  // Load raw JSON + source
  const handleSelect = async (id: string) => {
    setCurrentId(id);
    setError(null);
    setSuccess(null);
    try {
      const data = await fetchQuestionRaw(id);
      setJsonText(JSON.stringify(data, null, 2));
      setSourceUrl(data.source || null);
      setRefreshKey(k => k + 1);
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Save JSON edits
  const handleSave = async () => {
    if (!currentId) {
      setError('No question selected');
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
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  // Reload iframes on refresh
  useEffect(() => {
    if (previewRef.current) previewRef.current.src = previewRef.current.src;
    if (sourceRef.current) sourceRef.current.src = sourceRef.current.src;
  }, [refreshKey]);

  // Drag-to-resize handlers
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const total = rect.width;
      const x = e.clientX - rect.left;
      if (draggingRef.current === 'left') {
        let pct = (x / total) * 100;
        const max = 100 - midPct - 5;
        pct = Math.min(Math.max(5, pct), max);
        setLeftPct(pct);
      } else if (draggingRef.current === 'mid') {
        let pct = (x / total) * 100 - leftPct;
        const max = 100 - leftPct - 5;
        pct = Math.min(Math.max(5, pct), max);
        setMidPct(pct);
      }
    };
    const onMouseUp = () => {
      draggingRef.current = null;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [leftPct, midPct]);

  const col3Pct = 100 - leftPct - midPct;

  return (
    <div ref={containerRef} className="flex h-full relative">
      {/* Bank column */}
      <div
        className="p-4 border-r flex flex-col overflow-auto"
        style={{ width: `${leftPct}%` }}
      >
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
          <div className="flex justify-center py-10">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <ul className="flex-1 divide-y overflow-y-auto">
            {summaries.map(q => {
              const id = q.first_subquestion_id || q.id;
              return (
                <li
                  key={id}
                  className="py-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSelect(id)}
                >
                  <div
                    className="font-medium truncate"
                    dangerouslySetInnerHTML={{
                      __html: renderContent(q.preview_text || ''),
                    }}
                  />
                  <div className="text-xs text-gray-500">
                    Difficulty: {q.difficulty}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <div className="flex justify-between mt-4">
          <Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            Previous
          </Button>
          <span>Page {page}</span>
          <Button
            disabled={summaries.length < pageSize}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Divider 1 */}
      <div
        className="cursor-col-resize hover:bg-gray-200 bg-transparent"
        style={{ width: '4px' }}
        onMouseDown={() => (draggingRef.current = 'left')}
      />

      {/* JSON Editor column */}
      <div
        className="p-4 border-r flex flex-col overflow-auto"
        style={{ width: `${midPct}%` }}
      >
        <h2 className="text-lg font-semibold mb-4">JSON Editor</h2>
        {error && <div className="text-red-500 mb-2">❌ {error}</div>}
        {success && <div className="text-green-600 mb-2">✔️ {success}</div>}
        <textarea
          value={jsonText}
          onChange={e => setJsonText(e.target.value)}
          className="flex-1 border rounded p-2 font-mono text-sm overflow-y-auto"
          style={{ whiteSpace: 'pre', minHeight: 0 }}
        />
        <Button
          onClick={handleSave}
          disabled={saving || !currentId}
          className="mt-4 self-start"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>

      {/* Divider 2 */}
      <div
        className="cursor-col-resize hover:bg-gray-200 bg-transparent"
        style={{ width: '4px' }}
        onMouseDown={() => (draggingRef.current = 'mid')}
      />

      {/* Preview & Source column */}
      <div
        className="p-4 flex flex-col overflow-auto space-y-4"
        style={{ width: `${col3Pct}%` }}
      >
        <h2 className="text-lg font-semibold">Preview</h2>
        <div className="flex-1 border rounded overflow-hidden" style={{ zoom: 0.6 }}>
          <iframe
            ref={previewRef}
            key={`preview-${currentId}-${refreshKey}`}
            src={`${window.location.origin}/app/questions/${currentId}`}
            title="Question Preview"
            className="w-full h-full"
            frameBorder="0"
          />
        </div>

        {sourceUrl && (
          <>
            <a href = {sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              <h2 className="text-lg font-semibold">Source Page</h2>
            </a>
            <div className="flex-1 border rounded overflow-hidden" style={{ zoom: 0.6 }}>
              <iframe
                ref={sourceRef}
                key={`source-${currentId}-${refreshKey}`}
                src={sourceUrl}
                title="Source Page"
                className="w-full h-full"
                frameBorder="0"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditAndPreviewWithBank;
