import { LIGHT_TYPES, translatedTypes, TYPE_COLORS } from "./types";


type TypeBadgeProps = {
  type: string;
};

export default function TypeBadge({ type }: TypeBadgeProps) {
  const translatedType = translatedTypes[type] || type;
  return (
    <span className="type-badge" style={{
      background: TYPE_COLORS[type] || '#888',
      color: LIGHT_TYPES.includes(type) ? '#1a1a2e' : 'white'
    }}>
      {translatedType}
    </span>
  );
}