import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import {
  eastLegendItems,
  lagosEastColors,
  lagosEastMapView,
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

const eastLgas = lagosLgas.filter((lga) => lga.highlighted);
const fullViewBox = `-12 -28 ${lagosMapView.width + 24} ${lagosMapView.height + 52}`;
const eastViewBox = `${lagosEastMapView.x} ${lagosEastMapView.y} ${lagosEastMapView.width} ${lagosEastMapView.height}`;

export function LagosMap() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [eastCrop, setEastCrop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)');
    const sync = () => setEastCrop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const focusId = activeId ?? selectedId;
  const focus = useMemo(() => lagosLgas.find((lga) => lga.id === focusId) ?? null, [focusId]);
  const selected = useMemo(
    () => lagosLgas.find((lga) => lga.id === selectedId) ?? null,
    [selectedId],
  );

  const focusDetail = useMemo(() => {
    if (!focus || !focus.highlighted) return null;
    const east = lgaDirectory[focus.name as LgaName];
    return {
      name: focus.name,
      district: 'Lagos East Senatorial District',
      note: lgaNotes[focus.name as LgaName],
      lcdas: east,
    };
  }, [focus]);

  const selectedDetail = useMemo(() => {
    if (!selected || !selected.highlighted) return null;
    const east = lgaDirectory[selected.name as LgaName];
    return {
      name: selected.name,
      note: lgaNotes[selected.name as LgaName],
      lcdas: east,
    };
  }, [selected]);

  const setFocus = (id: string | null) => setActiveId(id);
  const selectEast = (id: string) => setSelectedId((current) => (current === id ? null : id));

  const onEastKeyDown = (event: KeyboardEvent, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectEast(id);
    }
  };

  const layers = [...lagosLgas].sort((a, b) => Number(a.highlighted) - Number(b.highlighted));
  const viewBox = eastCrop ? eastViewBox : fullViewBox;

  return (
    <figure className="eastMapFigure">
      <div className="eastMapFrame">
        <svg
          className="eastMap"
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Map of Lagos East local government areas"
        >
          <rect
            x={eastCrop ? lagosEastMapView.x : -12}
            y={eastCrop ? lagosEastMapView.y : -28}
            width={eastCrop ? lagosEastMapView.width : lagosMapView.width + 24}
            height={eastCrop ? lagosEastMapView.height : lagosMapView.height + 52}
            rx="10"
            fill="#d7e6ec"
          />
          {!eastCrop
            ? lagosWaterLabels.map((label) => (
                <text key={label.text} className="mapWater" x={label.x} y={label.y} fontSize={11}>
                  {label.text}
                </text>
              ))
            : null}
          {layers.map((lga) => {
            const isFocus = focusId === lga.id;
            if (!lga.highlighted) {
              return (
                <path
                  key={lga.id}
                  className="mapLga"
                  d={lga.path}
                  fill={fillFor(lga.id, false, isFocus)}
                  fillRule={lga.evenodd ? 'evenodd' : 'nonzero'}
                  stroke="#ffffff"
                  strokeWidth={isFocus ? 1.8 : 1}
                  aria-hidden="true"
                  onMouseEnter={() => setFocus(lga.id)}
                  onMouseLeave={() => setFocus(null)}
                />
              );
            }
            return (
              <path
                key={lga.id}
                className="mapLga mapLgaEast"
                d={lga.path}
                fill={fillFor(lga.id, true, isFocus)}
                fillRule={lga.evenodd ? 'evenodd' : 'nonzero'}
                stroke="#ffffff"
                strokeWidth={isFocus ? 1.8 : 1}
                tabIndex={0}
                role="button"
                aria-label={`${lga.name}, Lagos East Senatorial District`}
                aria-pressed={selectedId === lga.id}
                onMouseEnter={() => setFocus(lga.id)}
                onMouseLeave={() => setFocus(null)}
                onFocus={() => setFocus(lga.id)}
                onBlur={() => setFocus(null)}
                onClick={() => selectEast(lga.id)}
                onKeyDown={(event) => onEastKeyDown(event, lga.id)}
              >
                <title>{lga.name}</title>
              </path>
            );
          })}
          {eastLgas.map((lga) =>
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
        <div
          className={`mapTooltip ${focusDetail ? 'isVisible' : 'isIdle'}`}
          aria-hidden="true"
        >
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
              <b>Lagos East</b>
              <small>5 local government areas</small>
              <p>Select an East LGA from the list or map.</p>
            </>
          )}
        </div>
      </div>

      <ul className="eastLgaPicker" aria-label="Lagos East local government areas">
        {eastLgas.map((lga) => {
          const note = lgaNotes[lga.name as LgaName];
          const lcdas = lgaDirectory[lga.name as LgaName];
          const pressed = selectedId === lga.id;
          return (
            <li key={lga.id}>
              <button
                type="button"
                className={pressed ? 'eastLgaPickerBtn isSelected' : 'eastLgaPickerBtn'}
                aria-pressed={pressed}
                onClick={() => selectEast(lga.id)}
                onMouseEnter={() => setFocus(lga.id)}
                onMouseLeave={() => setFocus(null)}
                onFocus={() => setFocus(lga.id)}
                onBlur={() => setFocus(null)}
              >
                <i
                  className="mapSwatch"
                  style={{ background: lagosEastColors[lga.id] }}
                  aria-hidden="true"
                />
                <span className="eastLgaPickerText">
                  <strong>{lga.name}</strong>
                  <small>
                    {note}
                    {lcdas?.length
                      ? ` · ${lcdas.length} LCDA${lcdas.length === 1 ? '' : 's'}`
                      : ''}
                  </small>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="visuallyHidden" aria-live="polite" aria-atomic="true">
        {selectedDetail
          ? `${selectedDetail.name} selected. ${selectedDetail.note}${
              selectedDetail.lcdas?.length
                ? ` ${selectedDetail.lcdas.length} LCDA${selectedDetail.lcdas.length === 1 ? '' : 's'}: ${selectedDetail.lcdas.join(', ')}.`
                : ''
            }`
          : ''}
      </div>

      <figcaption className="visuallyHidden">
        Map boundaries: geoBoundaries / GRID3, CC BY 4.0. Interactive controls list the five Lagos
        East LGAs: Shomolu, Kosofe, Ikorodu, Epe and Ibeju-Lekki.
      </figcaption>
    </figure>
  );
}
