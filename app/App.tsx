import React, { useState, useEffect } from 'react';

const TYPE_COLORS = {
  fire:'#fd7d24', water:'#4592c4', grass:'#9bcc50', electric:'#eed535',
  psychic:'#f366b9', ice:'#51c4e7', dragon:'#6a6fc9', dark:'#707070',
  fe:'#fdb9e9', normal:'#a4acaf', fighting:'#d56723', flying:'#3dc7ef',
  gift:'#b97fc9', ground:'#f7de3f', rock:'#a38c21', bug:'#729f3f',
  ghost:'#7b62a3', steel:'#9eb7b8'
};
const LIGHT_TYPES = ['grass','electric','ice','fairy','normal','flying','ground','steel'];

const STAT_COLORS = {
  hp:'#ff5959', attack:'#f5ac78', defense:'#fae078',
  'special-attack':'#9db7f5', 'special-defense':'#a7db8d', speed:'#fa92b2'
};
const STAT_LABELS = {
  hp:'HP', attack:'ATK', defense:'DEF',
  'special-attack':'SP.ATK', 'special-defense':'SP.DEF', speed:'SPD'
};

function TypeBadge({ type }) {
  return (
    <span className="type-badge" style={{
      background: TYPE_COLORS[type] || '#888',
      color: LIGHT_TYPES.includes(type) ? '#1a1a2e' : 'white'
    }}>
      {type}
    </span>
  );
}

function StatBar({ name, value }) {
  const pct = Math.min(100, (value / 255) * 100);
  return (
    <div className="stat-row">
      <span className="stat-name">{STAT_LABELS[name] || name}</span>
      <span className="stat-val">{value}</span>
      <div className="stat-bar-bg">
        <div className="stat-bar-fill" style={{ width: `${pct}%`, background: STAT_COLORS[name] || '#ccc' }} />
      </div>
    </div>
  );
}

function DetailView({ pokemon, onClose, onPrev, onNext }) {
  const [detail, setDetail] = useState(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = React.useRef(null);

  useEffect(() => {
    setDetail(null);
    setPlaying(false);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`)
      .then(r => r.json())
      .then(setDetail);
  }, [pokemon.id]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onPrev, onNext, onClose]);

  function playCry() {
    const cryUrl = detail?.cries?.latest || detail?.cries?.legacy;
    if (!cryUrl) return;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; setPlaying(false); return; }
    const audio = new Audio(cryUrl);
    audioRef.current = audio;
    setPlaying(true);
    audio.play();
    audio.onended = () => { setPlaying(false); audioRef.current = null; };
  }

  const img = detail
    ? (detail.sprites.other['official-artwork']?.front_default || detail.sprites.front_default)
    : null;

  return (
    <div className="detail-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <button className="nav-btn prev" onClick={onPrev} disabled={!onPrev}>&#8592;</button>
      <button className="nav-btn next" onClick={onNext} disabled={!onNext}>&#8594;</button>
      <div className="detail-card">
        <div className="detail-hero">
          <button className="close-btn" onClick={onClose}>×</button>
          <div className="detail-num">#{String(pokemon.id).padStart(3, '0')}</div>
          {img
            ? <img className="detail-img" src={img} alt={pokemon.name} />
            : <div style={{width:160,height:160,display:'flex',alignItems:'center',justifyContent:'center'}}><div className="spinner"/></div>
          }
          <div className="detail-name">{pokemon.name.toUpperCase()}</div>
          <div className="detail-types">
            {detail && detail.types.map(t => <TypeBadge key={t.type.name} type={t.type.name} />)}
          </div>
          {detail && detail.cries && (
            <button className={`cry-btn${playing ? ' playing' : ''}`} onClick={playCry}>
              <span className="cry-icon">{playing ? '🔊' : '🔈'}</span>
              {playing ? 'Spiller...' : 'Hør skrik'}
            </button>
          )}
        </div>

        {detail ? (
          <div className="detail-body">
            <div className="detail-info-grid">
              <div className="info-box">
                <div className="info-box-label">Høyde</div>
                <div className="info-box-val">{(detail.height / 10).toFixed(1)} m</div>
              </div>
              <div className="info-box">
                <div className="info-box-label">Vekt</div>
                <div className="info-box-val">{(detail.weight / 10).toFixed(1)} kg</div>
              </div>
            </div>
            <div className="detail-section-title">Base Stats</div>
            {detail.stats.map(s => <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />)}
          </div>
        ) : (
          <div style={{padding:'30px',textAlign:'center',color:'var(--muted)',fontSize:13}}>Loading stats...</div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const list = await Promise.all(
        Array.from({ length: 151 }, (_, i) => i + 1).map(async id => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const d = await res.json();
          return {
            id,
            name: d.name,
            sprite: d.sprites.front_default,
            types: d.types.map(t => t.type.name),
          };
        })
      );
      setPokemon(list);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = pokemon.filter(p =>
    p.name.includes(search.toLowerCase()) || String(p.id).includes(search)
  );

  if (loading) return (
    <div className="loading">
      <div className="spinner" />
      Laster Pokédex...
    </div>
  );

  return (
    <>
      <div className="header">
        <div className="pokeball-icon" />
        <div>
          <div className="header-logo">Leo og Ellas Pokédex</div>
          <div className="header-sub">Original 151</div>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Søk"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th></th>
              <th>Navn</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} onClick={() => setSelected(p)}>
                <td className="num-cell">#{String(p.id).padStart(3, '0')}</td>
                <td className="img-cell"><img src={p.sprite} alt={p.name} /></td>
                <td className="name-cell">{p.name.toUpperCase()}</td>
                <td>{p.types.map(t => <TypeBadge key={t} type={t} />)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <DetailView
          pokemon={selected}
          onClose={() => setSelected(null)}
          onPrev={selected.id > 1 ? () => setSelected(pokemon.find(p => p.id === selected.id - 1)) : null}
          onNext={selected.id < pokemon.length ? () => setSelected(pokemon.find(p => p.id === selected.id + 1)) : null}
        />
      )}
    </>
  );
}