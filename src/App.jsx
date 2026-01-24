import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Mic, Music, Trash2, Edit2, X, ChevronDown, ChevronUp, Save, Filter, Mic2, RotateCcw, ListPlus, Loader2, Check, AlertCircle, ListMusic, ArrowLeft, CheckSquare, Square, Library, SlidersHorizontal, Clock, ArrowDownToLine, ArrowUpToLine } from 'lucide-react';

// --- 定数・ヘルパー関数 ---

const RANGES = ['low', 'mid1', 'mid2', 'hi', 'hihi'];
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const getPitchValue = (pitchStr) => {
  if (!pitchStr) return -999;
  const match = pitchStr.match(/^(low|mid1|mid2|hi|hihi)([A-G]#?)$/);
  if (!match) return -999;
  const range = match[1];
  const note = match[2];
  const rangeIndex = RANGES.indexOf(range);
  const noteIndex = NOTES.indexOf(note);
  return (rangeIndex * 12) + noteIndex;
};

const normalize = (str) => str ? str.trim().toLowerCase() : '';

const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// --- コンポーネント ---

const PitchSelector = ({ label, value, onChange, placeholder = "- 未設定 -" }) => {
  const [lastRange, setLastRange] = useState('mid2');
  const [lastNote, setLastNote] = useState('C');

  useEffect(() => {
    if (value) {
      const match = value.match(/^(low|mid1|mid2|hi|hihi)([A-G]#?)$/);
      if (match) {
        setLastRange(match[1]);
        setLastNote(match[2]);
      }
    }
  }, [value]);

  const handleUpdate = (newRange, newNote) => {
    setLastRange(newRange);
    setLastNote(newNote);
    onChange(`${newRange}${newNote}`);
  };

  const isSet = !!value;

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex justify-between items-end">
        <label className="text-xs text-slate-400 font-medium">{label}</label>
        {!isSet && (
           <button 
             onClick={() => onChange(`${lastRange}${lastNote}`)}
             className="text-[10px] text-blue-400 bg-blue-900/20 hover:bg-blue-900/40 px-2 py-0.5 rounded transition"
           >
             + 設定
           </button>
        )}
        {isSet && (
            <button 
                onClick={() => onChange('')}
                className="text-[10px] text-slate-500 hover:text-red-400 transition flex items-center gap-1"
                title="クリア"
            >
                <RotateCcw size={10} /> 解除
            </button>
        )}
      </div>

      {isSet ? (
        <div className="flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <select
            value={lastRange}
            onChange={(e) => handleUpdate(e.target.value, lastNote)}
            className="bg-slate-700 text-white rounded px-1 py-2 text-xs border border-slate-600 flex-1 focus:outline-none focus:border-blue-400 cursor-pointer"
          >
            {RANGES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select
            value={lastNote}
            onChange={(e) => handleUpdate(lastRange, e.target.value)}
            className="bg-slate-700 text-white rounded px-1 py-2 text-xs border border-slate-600 flex-1 focus:outline-none focus:border-blue-400 cursor-pointer"
          >
            {NOTES.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      ) : (
        <div className="h-[34px] flex items-center justify-center bg-slate-800/50 rounded border border-slate-700/50 border-dashed">
            <span className="text-xs text-slate-600">{placeholder}</span>
        </div>
      )}
    </div>
  );
};

const SongCard = ({ song, onEdit, onDelete, compact = false }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-3.5 border border-slate-700 shadow-sm hover:border-slate-600 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0 mr-3">
          <div className="flex items-center gap-2 mb-1">
             <h3 className="text-lg font-bold text-white truncate leading-tight">{song.title}</h3>
             <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold ${song.key === 0 ? 'bg-slate-700 text-slate-300' : song.key > 0 ? 'bg-blue-900/30 text-blue-300' : 'bg-red-900/30 text-red-300'}`}>
                {song.key > 0 ? '+' : ''}{song.key}
             </span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-sm">
             <p className="truncate flex items-center gap-1">
                <Mic size={12} className="flex-shrink-0" /> {song.artist || '歌手未設定'}
             </p>
             {song.duration > 0 && (
                 <p className="flex items-center gap-1 text-slate-500 text-xs bg-slate-900/50 px-1.5 py-0.5 rounded border border-slate-700/50">
                    <Clock size={10} /> {formatDuration(song.duration)}
                 </p>
             )}
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {onEdit && (
            <button 
              onClick={() => onEdit(song)} 
              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded transition"
            >
              <Edit2 size={18} />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(song.id)}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {!compact && (
        <div className="flex gap-2 mt-3 text-sm">
           <div className="flex-1 bg-slate-900/50 rounded px-3 py-1.5 border border-slate-700/50 flex justify-between items-center">
              <span className="text-[10px] text-slate-500 uppercase font-medium">地声</span>
              <span className={`font-mono font-bold ${song.chestHigh ? 'text-green-400' : 'text-slate-700 text-xs'}`}>{song.chestHigh || '-'}</span>
           </div>
           <div className="flex-1 bg-slate-900/50 rounded px-3 py-1.5 border border-slate-700/50 flex justify-between items-center">
              <span className="text-[10px] text-slate-500 uppercase font-medium">裏声</span>
              <span className={`font-mono font-bold ${song.falsettoHigh ? 'text-purple-400' : 'text-slate-700 text-xs'}`}>{song.falsettoHigh || '-'}</span>
           </div>
        </div>
      )}

      {!compact && (song.tags || song.memo) && (
           <div className="mt-3 pt-2 border-t border-slate-700/50 flex flex-col gap-1.5">
              {song.tags && (
                  <div className="flex flex-wrap gap-1.5">
                      {song.tags.split(',').map((tag, i) => tag.trim() && (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">#{tag.trim()}</span>
                      ))}
                  </div>
              )}
              {song.memo && (
                  <p className="text-xs text-slate-500 line-clamp-1 flex items-center gap-1">
                      <span className="opacity-50">📝</span>{song.memo}
                  </p>
              )}
           </div>
      )}
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 p-1 rounded-full transition">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Playlist Specific Components ---

const PlaylistCard = ({ playlist, songCount, onClick, onEdit, onDelete }) => {
    return (
        <div 
            onClick={onClick}
            className="bg-slate-800 rounded-lg p-4 border border-slate-700 shadow-sm hover:border-slate-500 transition-colors cursor-pointer group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-700 p-3 rounded-lg text-blue-400 group-hover:text-blue-300 transition-colors">
                        <ListMusic size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors">{playlist.title}</h3>
                        <p className="text-xs text-slate-400">{songCount} 曲</p>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                 <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(playlist); }}
                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded transition"
                 >
                    <Edit2 size={16} />
                 </button>
                 <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(playlist.id); }}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition"
                 >
                    <Trash2 size={16} />
                 </button>
            </div>
        </div>
    );
};

const PlaylistModal = ({ isOpen, onClose, playlist, allSongs, onSave }) => {
    const [title, setTitle] = useState('');
    const [selectedSongIds, setSelectedSongIds] = useState(new Set());
    const [searchQ, setSearchQ] = useState('');

    useEffect(() => {
        if (isOpen) {
            setTitle(playlist ? playlist.title : '');
            setSelectedSongIds(new Set(playlist ? playlist.songIds : []));
            setSearchQ('');
        }
    }, [isOpen, playlist]);

    const handleToggleSong = (songId) => {
        const newSet = new Set(selectedSongIds);
        if (newSet.has(songId)) newSet.delete(songId);
        else newSet.add(songId);
        setSelectedSongIds(newSet);
    };

    const handleSave = () => {
        if (!title.trim()) return alert('プレイリスト名を入力してください');
        onSave({
            id: playlist ? playlist.id : crypto.randomUUID(),
            title: title.trim(),
            songIds: Array.from(selectedSongIds),
            createdAt: playlist ? playlist.createdAt : Date.now()
        });
        onClose();
    };

    const filteredSongs = allSongs.filter(s => 
        s.title.toLowerCase().includes(searchQ.toLowerCase()) || 
        s.artist.toLowerCase().includes(searchQ.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={playlist ? 'プレイリスト編集' : '新規プレイリスト'}>
            <div className="space-y-4 h-[60vh] flex flex-col">
                <div>
                    <label className="block text-xs text-slate-400 mb-1">プレイリスト名</label>
                    <input 
                        type="text" 
                        className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:border-blue-500 focus:outline-none"
                        placeholder="例: 盛り上げ用、練習曲"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                    <label className="block text-xs text-slate-400 mb-1">曲を選択 ({selectedSongIds.size}曲)</label>
                    <div className="relative mb-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                            type="text" 
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                            placeholder="曲を検索..."
                            value={searchQ}
                            onChange={e => setSearchQ(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex-1 overflow-y-auto bg-slate-900/30 rounded-lg border border-slate-700 p-2 space-y-1">
                        {filteredSongs.length > 0 ? filteredSongs.map(song => {
                            const isSelected = selectedSongIds.has(song.id);
                            return (
                                <div 
                                    key={song.id} 
                                    onClick={() => handleToggleSong(song.id)}
                                    className={`flex items-center gap-3 p-2 rounded cursor-pointer transition ${isSelected ? 'bg-blue-900/30 border border-blue-500/30' : 'hover:bg-slate-700/50 border border-transparent'}`}
                                >
                                    <div className={`flex-shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-600'}`}>
                                        {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                                    </div>
                                    <div className="min-w-0">
                                        <div className={`text-sm font-bold truncate ${isSelected ? 'text-blue-200' : 'text-slate-300'}`}>{song.title}</div>
                                        <div className="text-xs text-slate-500 truncate flex items-center gap-2">
                                            {song.artist}
                                            {song.duration > 0 && <span className="opacity-50 text-[10px]">({formatDuration(song.duration)})</span>}
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="text-center py-8 text-slate-500 text-xs">
                                曲が見つかりません
                            </div>
                        )}
                    </div>
                </div>

                <button 
                    onClick={handleSave}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition"
                >
                    <Save size={18} />
                    保存する
                </button>
            </div>
        </Modal>
    );
};

// --- Bulk Add Modal ---
const BulkAddModal = ({ isOpen, onClose, onAddSongs, existingSongs }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [error, setError] = useState(null);

  const existingSet = useMemo(() => {
    const set = new Set();
    existingSongs.forEach(s => {
        set.add(`${normalize(s.title)}|${normalize(s.artist)}`);
    });
    return set;
  }, [existingSongs]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIds(new Set());
      setError(null);
    }
  }, [isOpen]);

  const searchItunes = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    setSelectedIds(new Set());
    
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=50&country=JP&lang=ja_jp`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      
      const tracks = data.results.map(track => ({
        id: track.trackId,
        title: track.trackName,
        artist: track.artistName,
        previewUrl: track.previewUrl,
        duration: track.trackTimeMillis ? Math.floor(track.trackTimeMillis / 1000) : 0 // 秒単位に変換
      }));
      setResults(tracks);
      
      if (tracks.length === 0) {
        setError('見つかりませんでした');
      }
    } catch (err) {
      console.error(err);
      setError('検索に失敗しました。通信環境を確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  const isAlreadyRegistered = (track) => {
      return existingSet.has(`${normalize(track.title)}|${normalize(track.artist)}`);
  };

  const toggleSelection = (track) => {
    if (isAlreadyRegistered(track)) return;

    const newSelected = new Set(selectedIds);
    if (newSelected.has(track.id)) {
      newSelected.delete(track.id);
    } else {
      newSelected.add(track.id);
    }
    setSelectedIds(newSelected);
  };

  const handleAdd = () => {
    const selectedTracks = results.filter(r => selectedIds.has(r.id));
    onAddSongs(selectedTracks);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col h-[80vh] animate-in zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <div>
             <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ListPlus size={20} className="text-blue-400" />
                曲を一括検索・追加
             </h2>
             <p className="text-xs text-slate-400">iTunesで検索してまとめて登録</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 p-1.5 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 bg-slate-900/50 border-b border-slate-700">
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none placeholder-slate-500"
              placeholder="アーティスト名、曲名..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchItunes()}
            />
            <button 
              onClick={searchItunes}
              disabled={isLoading || !query}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 rounded-lg font-bold transition flex items-center justify-center min-w-[60px]"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {error && <div className="text-center py-10 text-slate-500 text-sm">{error}</div>}
          {!isLoading && !error && results.length === 0 && (
            <div className="text-center py-10 text-slate-500 text-sm">
                <Music size={40} className="mx-auto mb-2 opacity-20" />
                検索して曲を追加しましょう
            </div>
          )}

          <div className="space-y-1">
            {results.map((track) => {
              const isSelected = selectedIds.has(track.id);
              const isRegistered = isAlreadyRegistered(track);

              return (
                <div 
                  key={track.id}
                  onClick={() => toggleSelection(track)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition border 
                    ${isRegistered ? 'opacity-50 cursor-not-allowed bg-slate-800 border-transparent' : 
                      isSelected ? 'bg-blue-900/30 border-blue-500/50 cursor-pointer' : 'bg-transparent border-transparent hover:bg-slate-700/50 cursor-pointer'}`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition 
                     ${isRegistered ? 'bg-slate-700 border-slate-600' : 
                       isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-500'}`}>
                    {isRegistered ? <Check size={12} className="text-slate-400" /> : 
                     isSelected && <Check size={14} className="text-white" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`font-bold text-sm truncate ${isSelected ? 'text-blue-200' : 'text-slate-200'}`}>{track.title}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
                        <span>{track.artist}</span>
                        {track.duration > 0 && <span>({formatDuration(track.duration)})</span>}
                    </div>
                  </div>
                  {isRegistered && (
                      <span className="text-[10px] bg-slate-700 text-slate-400 px-2 py-0.5 rounded">登録済</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-slate-700 bg-slate-800">
           <button 
             onClick={handleAdd}
             disabled={selectedIds.size === 0}
             className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition"
           >
             <ListPlus size={18} />
             {selectedIds.size}曲を追加する
           </button>
        </div>
      </div>
    </div>
  );
};

// --- Filter Modal ---
const FilterModal = ({ isOpen, onClose, filters, setFilters }) => {
    const [localFilters, setLocalFilters] = useState({ 
        chestMin: '', chestMax: '', falsettoMin: '', falsettoMax: '' 
    });

    useEffect(() => {
        if (isOpen) {
            setLocalFilters(filters);
        }
    }, [isOpen, filters]);

    const handleApply = () => {
        setFilters(localFilters);
        onClose();
    };

    const handleClear = () => {
        const cleared = { chestMin: '', chestMax: '', falsettoMin: '', falsettoMax: '' };
        setLocalFilters(cleared);
        setFilters(cleared);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="絞り込み検索">
            <div className="space-y-6">
                {/* Chest Voice */}
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-2 h-4 bg-green-500 rounded-full"></span>
                        地声最高音
                    </h4>
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                             <PitchSelector 
                                label="下限 (以上)" 
                                value={localFilters.chestMin} 
                                onChange={val => setLocalFilters(prev => ({ ...prev, chestMin: val }))} 
                                placeholder="下限なし"
                            />
                        </div>
                        <div className="pt-5 text-slate-500">〜</div>
                        <div className="flex-1">
                            <PitchSelector 
                                label="上限 (以下)" 
                                value={localFilters.chestMax} 
                                onChange={val => setLocalFilters(prev => ({ ...prev, chestMax: val }))} 
                                placeholder="上限なし"
                            />
                        </div>
                    </div>
                </div>

                {/* Falsetto Voice */}
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-2 h-4 bg-purple-500 rounded-full"></span>
                        裏声最高音
                    </h4>
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <PitchSelector 
                                label="下限 (以上)" 
                                value={localFilters.falsettoMin} 
                                onChange={val => setLocalFilters(prev => ({ ...prev, falsettoMin: val }))} 
                                placeholder="下限なし"
                            />
                        </div>
                        <div className="pt-5 text-slate-500">〜</div>
                        <div className="flex-1">
                            <PitchSelector 
                                label="上限 (以下)" 
                                value={localFilters.falsettoMax} 
                                onChange={val => setLocalFilters(prev => ({ ...prev, falsettoMax: val }))}
                                placeholder="上限なし"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-slate-700">
                    <button 
                        onClick={handleClear}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-3 rounded-lg text-sm font-bold transition"
                    >
                        クリア
                    </button>
                    <button 
                        onClick={handleApply}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-sm font-bold shadow-lg shadow-blue-900/20 transition"
                    >
                        適用する
                    </button>
                </div>
            </div>
        </Modal>
    );
};


// --- Main App ---

export default function App() {
  // --- State ---
  const [songs, setSongs] = useState(() => {
    try {
        const saved = localStorage.getItem('karaoke-songs-v1');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });

  const [playlists, setPlaylists] = useState(() => {
    try {
        const saved = localStorage.getItem('karaoke-playlists-v1');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });

  // UI State
  const [activeTab, setActiveTab] = useState('songs');
  const [viewingPlaylist, setViewingPlaylist] = useState(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filter State
  const [filterConditions, setFilterConditions] = useState({ 
      chestMin: '', chestMax: '', falsettoMin: '', falsettoMax: '' 
  });

  // Edit Targets
  const [currentSong, setCurrentSong] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', artist: '', key: 0, chestHigh: '', falsettoHigh: '', tags: '', memo: '',
    durationM: '', durationS: '' // 分・秒の入力用State
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('karaoke-songs-v1', JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    localStorage.setItem('karaoke-playlists-v1', JSON.stringify(playlists));
  }, [playlists]);

  // --- Helper Functions ---
  const getSortedSongs = (sourceSongs) => {
    let result = [...sourceSongs];

    // 1. Text Search
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(s => 
            s.title.toLowerCase().includes(q) || 
            s.artist.toLowerCase().includes(q) ||
            s.tags.toLowerCase().includes(q)
        );
    }

    // 2. Range Filter (Pitch)
    const checkPitchRange = (valStr, minStr, maxStr) => {
        const val = getPitchValue(valStr);
        if (val === -999) return false; // 値が設定されていない場合は除外（フィルタ適用時）
        
        let passMin = true;
        let passMax = true;
        
        if (minStr) {
            const min = getPitchValue(minStr);
            if (min !== -999 && val < min) passMin = false;
        }
        if (maxStr) {
            const max = getPitchValue(maxStr);
            if (max !== -999 && val > max) passMax = false;
        }
        return passMin && passMax;
    };

    if (filterConditions.chestMin || filterConditions.chestMax) {
        result = result.filter(s => checkPitchRange(s.chestHigh, filterConditions.chestMin, filterConditions.chestMax));
    }
    if (filterConditions.falsettoMin || filterConditions.falsettoMax) {
        result = result.filter(s => checkPitchRange(s.falsettoHigh, filterConditions.falsettoMin, filterConditions.falsettoMax));
    }

    // 3. Sort
    result.sort((a, b) => {
        let valA, valB;
        if (sortConfig.key === 'chestHigh') {
            valA = getPitchValue(a.chestHigh);
            valB = getPitchValue(b.chestHigh);
        } else if (sortConfig.key === 'falsettoHigh') {
            valA = getPitchValue(a.falsettoHigh);
            valB = getPitchValue(b.falsettoHigh);
        } else if (sortConfig.key === 'createdAt') {
            valA = a.createdAt;
            valB = b.createdAt;
        } else if (sortConfig.key === 'duration') {
            valA = a.duration || 0;
            valB = b.duration || 0;
        } else {
            valA = a[sortConfig.key] || '';
            valB = b[sortConfig.key] || '';
        }
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });
    return result;
  };

  const sortedSongs = useMemo(() => getSortedSongs(songs), [songs, searchQuery, sortConfig, filterConditions]);

  const playlistSongs = useMemo(() => {
      if (!viewingPlaylist) return [];
      const ids = new Set(viewingPlaylist.songIds);
      const filtered = songs.filter(s => ids.has(s.id));
      return getSortedSongs(filtered);
  }, [viewingPlaylist, songs, searchQuery, sortConfig, filterConditions]);

  // --- Handlers ---
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
    setIsSortMenuOpen(false);
  };

  const openSongModal = (song = null) => {
    if (song) {
      setCurrentSong(song);
      const m = song.duration ? Math.floor(song.duration / 60) : '';
      const s = song.duration ? (song.duration % 60) : '';
      setFormData({ 
          ...song,
          durationM: m,
          durationS: s
      });
    } else {
      setCurrentSong(null);
      setFormData({
        title: '', artist: '', key: 0, chestHigh: '', falsettoHigh: '', tags: '', memo: '',
        durationM: '', durationS: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveSong = () => {
    if (!formData.title) return alert('曲名は必須です');
    
    // Duration Calculation
    let duration = 0;
    const m = parseInt(formData.durationM);
    const s = parseInt(formData.durationS);
    if (!isNaN(m) || !isNaN(s)) {
        duration = (isNaN(m) ? 0 : m) * 60 + (isNaN(s) ? 0 : s);
    }

    const songData = {
        title: formData.title,
        artist: formData.artist,
        key: formData.key,
        chestHigh: formData.chestHigh,
        falsettoHigh: formData.falsettoHigh,
        tags: formData.tags,
        memo: formData.memo,
        duration: duration
    };

    const isDuplicate = songs.some(s => 
        s.id !== (currentSong?.id || '') &&
        normalize(s.title) === normalize(songData.title) &&
        normalize(s.artist) === normalize(songData.artist)
    );
    if (isDuplicate) {
        if (!confirm(`「${songData.title}」は既にリストに存在します。\nそれでも保存しますか？`)) return;
    }

    if (currentSong) {
      setSongs(prev => prev.map(s => s.id === currentSong.id ? { ...songData, id: s.id, createdAt: s.createdAt } : s));
    } else {
      const newSong = { ...songData, id: crypto.randomUUID(), createdAt: Date.now() };
      setSongs(prev => [newSong, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteSong = (id) => {
    if (confirm('本当に削除しますか？\n（登録されているプレイリストからも削除されます）')) {
      setSongs(prev => prev.filter(s => s.id !== id));
      setPlaylists(prev => prev.map(p => ({
          ...p,
          songIds: p.songIds.filter(sid => sid !== id)
      })));
    }
  };

  const handleBulkAdd = (tracks) => {
    const existingSet = new Set(songs.map(s => `${normalize(s.title)}|${normalize(s.artist)}`));
    const newSongs = [];
    let skippedCount = 0;

    tracks.forEach(track => {
        const key = `${normalize(track.title)}|${normalize(track.artist)}`;
        if (!existingSet.has(key)) {
            newSongs.push({
                id: crypto.randomUUID(),
                title: track.title,
                artist: track.artist,
                key: 0,
                chestHigh: '',
                falsettoHigh: '',
                tags: '',
                memo: '',
                duration: track.duration || 0, // Duration from iTunes
                createdAt: Date.now()
            });
            existingSet.add(key);
        } else {
            skippedCount++;
        }
    });
    
    if (newSongs.length > 0) setSongs(prev => [...newSongs, ...prev]);
    if (skippedCount > 0) alert(`${skippedCount}曲は既に登録済みのためスキップされました。`);
  };

  // Playlist Handlers
  const openPlaylistModal = (playlist = null) => {
      setCurrentPlaylist(playlist);
      setIsPlaylistModalOpen(true);
  };

  const handleSavePlaylist = (playlistData) => {
      if (currentPlaylist) {
          setPlaylists(prev => prev.map(p => p.id === playlistData.id ? playlistData : p));
          if (viewingPlaylist && viewingPlaylist.id === playlistData.id) {
              setViewingPlaylist(playlistData);
          }
      } else {
          setPlaylists(prev => [playlistData, ...prev]);
      }
  };

  const handleDeletePlaylist = (id) => {
      if (confirm('プレイリストを削除しますか？\n（曲自体は削除されません）')) {
          setPlaylists(prev => prev.filter(p => p.id !== id));
          if (viewingPlaylist && viewingPlaylist.id === id) setViewingPlaylist(null);
      }
  };

  const getSortLabel = () => {
    const dir = sortConfig.direction === 'asc' ? '▲' : '▼';
    switch (sortConfig.key) {
      case 'chestHigh': return `地声最高 ${dir}`;
      case 'falsettoHigh': return `裏声最高 ${dir}`;
      case 'createdAt': return `登録順 ${dir}`;
      case 'title': return `曲名順 ${dir}`;
      case 'artist': return `歌手順 ${dir}`;
      case 'duration': return `時間 ${dir}`;
      default: return 'ソート';
    }
  };

  const hasActiveFilters = filterConditions.chestMin || filterConditions.chestMax || filterConditions.falsettoMin || filterConditions.falsettoMax;

  // --- Render Contents ---

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-24 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10 safe-area-pt shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
            {viewingPlaylist ? (
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setViewingPlaylist(null)} 
                        className="p-1 -ml-2 text-slate-400 hover:text-white"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold truncate max-w-[200px]">{viewingPlaylist.title}</h1>
                        <span className="text-xs text-slate-400">{playlistSongs.length} 曲</span>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-2 select-none" onClick={() => {setSearchQuery(''); setSortConfig({key:'createdAt', direction:'desc'})}}>
                    <div className="bg-gradient-to-tr from-blue-500 to-purple-500 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                    <Music className="text-white" size={20} />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight cursor-pointer">Karaoke<span className="text-blue-400">Log</span></h1>
                </div>
            )}

            {/* Header Actions */}
            <div className="flex gap-2">
                {activeTab === 'songs' || viewingPlaylist ? (
                    <>
                        {!viewingPlaylist && (
                             <button 
                                onClick={() => setIsBulkModalOpen(true)}
                                className="bg-slate-700 hover:bg-slate-600 text-blue-300 p-2.5 rounded-full transition-all active:scale-95 border border-slate-600"
                                title="一括検索・追加"
                            >
                                <ListPlus size={24} />
                            </button>
                        )}
                        <button 
                            onClick={() => openSongModal()}
                            className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-full shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                            title="手動で追加"
                        >
                            <Plus size={24} />
                        </button>
                    </>
                ) : (
                    // Playlists Tab Actions
                    <button 
                        onClick={() => openPlaylistModal()}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-full shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                        title="新規プレイリスト"
                    >
                        <Plus size={24} />
                    </button>
                )}
            </div>
        </div>

        {/* Search & Sort Bar */}
        {(activeTab === 'songs' || viewingPlaylist) && (
            <div className="max-w-3xl mx-auto px-4 pb-4 space-y-3">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                    type="text" 
                    placeholder={viewingPlaylist ? `${viewingPlaylist.title}内を検索...` : "リスト内を検索..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none placeholder-slate-500 transition-colors focus:bg-slate-800"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                            <X size={14} />
                        </button>
                    )}
                </div>
                <button 
                    onClick={() => setIsFilterModalOpen(true)}
                    className={`px-3 rounded-lg border flex items-center justify-center transition ${hasActiveFilters ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                    title="絞り込み"
                >
                    <SlidersHorizontal size={18} />
                </button>
            </div>
            
            <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-2">
                    {viewingPlaylist ? playlistSongs.length : sortedSongs.length} 曲
                    {hasActiveFilters && (
                        <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[10px] border border-blue-500/30">絞り込み中</span>
                    )}
                </span>
                <div className="relative">
                <button 
                    onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                    className="flex items-center gap-2 text-xs font-medium bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-full transition border border-slate-600"
                >
                    <Filter size={12} />
                    {getSortLabel()}
                </button>
                
                {isSortMenuOpen && (
                    <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsSortMenuOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <div className="py-1">
                        <button onClick={() => handleSort('createdAt')} className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-700 flex justify-between items-center group">
                            <span>登録順</span>
                            {sortConfig.key === 'createdAt' && <span className="text-blue-400 text-xs">{sortConfig.direction === 'desc' ? '新しい順' : '古い順'}</span>}
                        </button>
                        <button onClick={() => handleSort('title')} className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-700 flex justify-between items-center">
                            <span>曲名順</span>
                            {sortConfig.key === 'title' && <span className="text-blue-400 text-xs">{sortConfig.direction === 'desc' ? '降順' : '昇順'}</span>}
                        </button>
                        <button onClick={() => handleSort('artist')} className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-700 flex justify-between items-center">
                            <span>歌手順</span>
                            {sortConfig.key === 'artist' && <span className="text-blue-400 text-xs">{sortConfig.direction === 'desc' ? '降順' : '昇順'}</span>}
                        </button>
                        <button onClick={() => handleSort('duration')} className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-700 flex justify-between items-center">
                            <span>曲の長さ</span>
                            <span className="text-xs bg-slate-700 px-1.5 py-0.5 rounded text-blue-300">{sortConfig.key === 'duration' && (sortConfig.direction === 'desc' ? '長い順' : '短い順')}</span>
                        </button>
                        <div className="h-px bg-slate-700 my-1"></div>
                        <button onClick={() => handleSort('chestHigh')} className="w-full text-left px-4 py-2.5 text-sm text-green-400 hover:bg-slate-700 flex justify-between items-center">
                            <span>地声最高音</span>
                            <span className="text-xs bg-green-400/10 px-1.5 py-0.5 rounded">{sortConfig.key === 'chestHigh' && (sortConfig.direction === 'desc' ? '高い順' : '低い順')}</span>
                        </button>
                        <button onClick={() => handleSort('falsettoHigh')} className="w-full text-left px-4 py-2.5 text-sm text-purple-400 hover:bg-slate-700 flex justify-between items-center">
                            <span>裏声最高音</span>
                            <span className="text-xs bg-purple-400/10 px-1.5 py-0.5 rounded">{sortConfig.key === 'falsettoHigh' && (sortConfig.direction === 'desc' ? '高い順' : '低い順')}</span>
                        </button>
                        </div>
                    </div>
                    </>
                )}
                </div>
            </div>
            </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 py-6 w-full flex-1">
        {activeTab === 'songs' ? (
            // --- Songs Tab ---
            sortedSongs.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {sortedSongs.map(song => (
                    <SongCard 
                        key={song.id} 
                        song={song} 
                        onEdit={() => openSongModal(song)}
                        onDelete={handleDeleteSong}
                    />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-slate-500">
                    <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mic2 size={32} className="opacity-40" />
                    </div>
                    {searchQuery || hasActiveFilters ? <p>条件に合う曲が見つかりませんでした</p> : (
                        <>
                            <p>曲が登録されていません</p>
                            <p className="text-sm mt-2 text-slate-400">右上のボタンから追加しましょう</p>
                        </>
                    )}
                </div>
            )
        ) : (
            // --- Playlists Tab ---
            viewingPlaylist ? (
                // Detailed View
                playlistSongs.length > 0 ? (
                    <div className="flex flex-col gap-3">
                         <div className="flex justify-end mb-2">
                             <button onClick={() => openPlaylistModal(viewingPlaylist)} className="text-xs text-blue-400 mr-4 hover:underline">編集</button>
                         </div>
                        {playlistSongs.map(song => (
                            <SongCard 
                                key={song.id} 
                                song={song} 
                                onEdit={() => openSongModal(song)}
                                onDelete={null} 
                                compact={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <p>このプレイリストには曲がありません</p>
                        <button onClick={() => openPlaylistModal(viewingPlaylist)} className="text-blue-400 mt-2 hover:underline">
                            曲を追加する
                        </button>
                    </div>
                )
            ) : (
                // Playlist List
                playlists.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {playlists.map(playlist => (
                            <PlaylistCard 
                                key={playlist.id} 
                                playlist={playlist} 
                                songCount={playlist.songIds.length}
                                onClick={() => setViewingPlaylist(playlist)}
                                onEdit={openPlaylistModal}
                                onDelete={handleDeletePlaylist}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Library size={32} className="opacity-40" />
                        </div>
                        <p>プレイリストがありません</p>
                        <p className="text-sm mt-2 text-slate-400">右上の＋ボタンから作成しましょう</p>
                    </div>
                )
            )
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 pb-safe z-20">
          <div className="max-w-3xl mx-auto flex justify-around items-center h-16">
              <button 
                onClick={() => { setActiveTab('songs'); setViewingPlaylist(null); }}
                className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'songs' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                  <Music size={24} className="mb-1" />
                  <span className="text-[10px] font-bold">曲一覧</span>
              </button>
              <button 
                onClick={() => { setActiveTab('playlists'); setViewingPlaylist(null); }}
                className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'playlists' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                  <Library size={24} className="mb-1" />
                  <span className="text-[10px] font-bold">プレイリスト</span>
              </button>
          </div>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={currentSong ? '曲を編集' : '新しい曲を追加'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">曲名 <span className="text-red-400">*</span></label>
            <input 
              type="text" 
              className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:border-blue-500 focus:outline-none placeholder-slate-500"
              placeholder="例: 怪獣の花唄"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">歌手名</label>
                <input 
                type="text" 
                className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:border-blue-500 focus:outline-none placeholder-slate-500"
                placeholder="例: Vaundy"
                value={formData.artist}
                onChange={e => setFormData({...formData, artist: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">曲の長さ</label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input 
                            type="number" 
                            className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:border-blue-500 focus:outline-none text-center"
                            placeholder="分"
                            value={formData.durationM}
                            onChange={e => setFormData({...formData, durationM: e.target.value})}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-xs">分</span>
                    </div>
                    <div className="relative flex-1">
                        <input 
                            type="number" 
                            className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:border-blue-500 focus:outline-none text-center"
                            placeholder="秒"
                            max="59"
                            value={formData.durationS}
                            onChange={e => setFormData({...formData, durationS: e.target.value})}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-xs">秒</span>
                    </div>
                </div>
              </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs text-slate-400 mb-1">キー設定</label>
                <div className="flex items-center gap-2 h-[46px]">
                  <button onClick={() => setFormData(prev => ({...prev, key: prev.key - 1}))} className="bg-slate-700 w-10 h-full rounded flex items-center justify-center hover:bg-slate-600 border border-slate-600 active:scale-95 transition"><ChevronDown size={18} /></button>
                  <span className={`flex-1 flex items-center justify-center h-full bg-slate-800 rounded border border-slate-700 font-mono font-bold text-lg ${formData.key === 0 ? 'text-slate-400' : formData.key > 0 ? 'text-blue-400' : 'text-red-400'}`}>{formData.key > 0 ? '+' : ''}{formData.key}</span>
                  <button onClick={() => setFormData(prev => ({...prev, key: prev.key + 1}))} className="bg-slate-700 w-10 h-full rounded flex items-center justify-center hover:bg-slate-600 border border-slate-600 active:scale-95 transition"><ChevronUp size={18} /></button>
                </div>
             </div>
             <div>
               <label className="block text-xs text-slate-400 mb-1">タグ (カンマ区切り)</label>
               <input type="text" className="w-full h-[46px] bg-slate-700 border border-slate-600 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none placeholder-slate-500" placeholder="ロック, 18番" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
             </div>
          </div>
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider border-b border-slate-800 pb-2">音域設定</h4>
            <div className="grid grid-cols-2 gap-4">
              <PitchSelector label="地声最高音" value={formData.chestHigh} onChange={val => setFormData({...formData, chestHigh: val})} />
              <PitchSelector label="裏声最高音" value={formData.falsettoHigh} onChange={val => setFormData({...formData, falsettoHigh: val})} />
            </div>
            <p className="text-[10px] text-slate-500 mt-3 text-right">※ 指定しない場合は空のままにしてください</p>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">メモ</label>
            <textarea className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-sm text-white focus:border-blue-500 focus:outline-none h-24 resize-none placeholder-slate-500" placeholder="歌うコツ、感想、次回試したいこと..." value={formData.memo} onChange={e => setFormData({...formData, memo: e.target.value})} />
          </div>
          <button onClick={handleSaveSong} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 mt-4 transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20"><Save size={18} />保存する</button>
        </div>
      </Modal>

      <BulkAddModal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} onAddSongs={handleBulkAdd} existingSongs={songs} />
      
      <PlaylistModal 
        isOpen={isPlaylistModalOpen} 
        onClose={() => setIsPlaylistModalOpen(false)} 
        playlist={currentPlaylist} 
        allSongs={songs} 
        onSave={handleSavePlaylist} 
      />

      <FilterModal 
         isOpen={isFilterModalOpen} 
         onClose={() => setIsFilterModalOpen(false)} 
         filters={filterConditions} 
         setFilters={setFilterConditions} 
      />

    </div>
  );
}