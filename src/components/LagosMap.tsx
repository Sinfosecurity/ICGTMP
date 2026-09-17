import { useMemo, useState } from 'react';
import {
  eastLegendItems,
  lagosEastColors,
  lagosLgas,
  lagosMapView,
  lagosWaterLabels,
  otherLgaColor,
} from '../data/lagosLgas';
import { lgaDirectory, lgaNotes, type LgaName } from '../data/locations';

function mixTowardWhite(hex: string, amount = 0.2): string {
  const n = hex.replace('#', '');
  const mix = (start: number) => Math.round(start + (255 - start) * amount);
  const r = mix(parseInt(n.slice(0, 2), 16));
  const g = mix(parseInt(n.slice(2, 4), 16));
  const b = mix(parseInt(n.slice(4, 6), 16));
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

function fillFor(id: string, highlighted: boolean, focused: boolean): string {
  if (!highlighted) return focused ? mixTowardWhite(otherLgaColor, 0.12) : otherLgaColor;
  const base = lagosEastColors[id] ?? otherLgaColor;
  return focused ? mixTowardWhite(base, 0.22) : base;
}

export function LagosMap() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const focusId = activeId ?? selectedId;
  const focus = useMemo(() => lagosLgas.find((lga) => lga.id === focusId) ?? null, [focusId]);
  const focusDetail = useMemo(() => {
    if (!focus) return null;
    const east = focus.highlighted ? lgaDirectory[focus.name as LgaName] : null;
    return {
      name: focus.name,
      district: focus.highlighted ? 'Lagos East Senatorial District' : 'Lagos State',
      note: east ? lgaNotes[focus.name as LgaName] : 'Local government area in Lagos State.',
      lcdas: east,
    };
  }, [focus]);

  const setFocus = (id: string | null) => setActiveId(id);
  const toggleSelect = (id: string) => setSelectedId((current) => (current === id ? null : id));

  const layers = [...lagosLgas].sort((a, b) => Number(a.highlighted) - Number(b.highlighted));

  return (
    <figure className="eastMapFigure">
      <div className="eastMapFrame">
        <svg
          className="eastMap"
          viewBox={`-12 -28 ${lagosMapView.width + 24} ${lagosMapView.height + 52}`}
          role="img"
          aria-label="Map of Lagos State showing all 20 local government areas, with Lagos East highlighted: Shomolu, Kosofe, Ikorodu, Epe and Ibeju-Lekki"
        >
          <rect
            x={-12}
            y={-28}
            width={lagosMapView.width + 24}
            height={lagosMapView.height + 52}
            rx="10"
            fill="#d7e6ec"
          />
          {lagosWaterLabels.map((label) => (
            <text key={label.text} className="mapWater" x={label.x} y={label.y} fontSize={11}>
              {label.text}
            </text>
          ))}
          {layers.map((lga) => {
            const isFocus = focusId === lga.id;
            return (
              <path
                key={lga.id}
                className={lga.highlighted ? 'mapLga mapLgaEast' : 'mapLga'}
                d={lga.path}
                fill={fillFor(lga.id, lga.highlighted, isFocus)}
                fillRule={lga.evenodd ? 'evenodd' : 'nonzero'}
                stroke="#ffffff"
                strokeWidth={isFocus ? 1.8 : 1}
                tabIndex={0}
                role="button"
                aria-label={`${lga.name}, ${lga.highlighted ? 'Lagos East Senatorial District' : 'Lagos State'}`}
                aria-pressed={selectedId === lga.id}
                onMouseEnter={() => setFocus(lga.id)}
                onMouseLeave={() => setFocus(null)}
                onFocus={() => setFocus(lga.id)}
                onBlur={() => setFocus(null)}
                onClick={() => toggleSelect(lga.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggleSelect(lga.id);
                  }
                }}
              >
                <title>{lga.name}</title>
              </path>
            );
          })}
          {lagosLgas
            .filter((lga) => lga.highlighted)
            .map((lga) =>
              lga.labelKind === 'callout' && lga.lineX != null && lga.lineY != null ? (
                <g key={`${lga.id}-label`}>
                  <line className="mapCallout" x1={lga.labelX} y1={lga.labelY} x2={lga.lineX} y2={lga.lineY} />
                  <rect
                    className="mapChip"
                    x={lga.lineX - 38}
                    y={lga.lineY - 14}
                    width="76"
                    height="18"
                    rx="3"
                    fill={lagosEastColors[lga.id]}
                  />
                  <text className="mapLabel" x={lga.lineX} y={lga.lineY - 1} fontSize={10}>
                    {lga.name}
                  </text>
                </g>
              ) : (
                <text
                  key={`${lga.id}-label`}
                  className="mapLabel"
                  x={lga.labelX}
                  y={lga.labelY}
                  fontSize={lga.name === 'Ibeju-Lekki' ? 11 : lga.name === 'Kosofe' ? 10 : 13}
                >
                  {lga.name}
                </text>
              ),
            )}
        </svg>
        <div className="mapLegend">
          <div className="mapLegendEast">
            <span className="mapLegendKicker">Lagos East</span>
            <span className="mapLegendItems">
              {eastLegendItems.map((item) => (
                <span key={item.id} className="mapLegendItem">
                  <i className="mapSwatch" style={{ background: lagosEastColors[item.id] }} />
                  <span className="mapLegendItemName">{item.name}</span>
                </span>
              ))}
            </span>
          </div>
          <span className="mapLegendOther">
            <i className="mapSwatch mapSwatchOther" style={{ background: otherLgaColor }} />
            Other LGAs
          </span>
        </div>
        <div className={`mapTooltip ${focusDetail ? 'isVisible' : 'isIdle'}`} aria-live="polite">
          {focusDetail ? (
            <>
              <b>{focusDetail.name}</b>
              <small>{focusDetail.district}</small>
              <p>
                {focusDetail.lcdas
                  ? `${focusDetail.note} ${focusDetail.lcdas.length} LCDA${focusDetail.lcdas.length === 1 ? '' : 's'}.`
                  : focusDetail.note}
              </p>
            </>
          ) : (
            <>
              <b>Lagos State</b>
              <small>20 local government areas</small>
              <p>Hover or tap an LGA.</p>
            </>
          )}
        </div>
      </div>
      <figcaption className="visuallyHidden">
        Map boundaries: geoBoundaries / GRID3, CC BY 4.0.
      </figcaption>
    </figure>
  );
}
