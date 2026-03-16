import { useEffect, useState, useRef } from "react";
import TypeBadge from "./TypeBadge";
import StatBar from "./StatBar";

type DetailsProps = {
  pokemon: any;
  onClose: () => void;
  onPrev: (() => void) | null;
  onNext: (() => void) | null;
};

type TDetail = {
    sprites: any;
    types: any[];
    height: number;
    weight: number;
    stats: any[];
    cries?: {
      latest?: string;
      legacy?: string;
    };
}

export default function Details({ pokemon, onClose, onPrev, onNext }: DetailsProps) {
  const [detail, setDetail] = useState<TDetail | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

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
      <button className="btn nav-btn prev" onClick={onPrev} disabled={!onPrev}>&#8592;</button>
      <button className="btn nav-btn next" onClick={onNext} disabled={!onNext}>&#8594;</button>
      <div className="detail-card">
        <div className="detail-hero">
          <button className="btn close-btn" onClick={onClose}>×</button>
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
            <button className={`btn cry-btn${playing ? ' playing' : ''}`} onClick={playCry}>
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
            {detail.stats.map(s => <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />)}
          </div>
        ) : (
          <div style={{padding:'30px',textAlign:'center',color:'var(--muted)',fontSize:13}}>Loading stats...</div>
        )}
      </div>
    </div>
  );
}