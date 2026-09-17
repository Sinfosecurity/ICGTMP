# Lagos State map — geographic source

The interactive map in **Our Presence in Lagos East** is drawn from open
administrative boundaries, not from any election-map product.

## Source

- **Dataset:** geoBoundaries Nigeria ADM2 (Local Government Areas)
- **Producer of the source geometry:** GRID3
- **License:** Creative Commons Attribution 4.0 International (CC BY 4.0)
- **Boundary ID:** `NGA-ADM2-59680162`
- **Links:** [geoBoundaries](https://www.geoboundaries.org/), [GRID3](https://data.grid3.org/)

The Stears 2023 Lagos presidential page was used only as a visual check of
LGA *positions*. No Stears artwork, colours, labels, or SVG paths were copied.

## How the website SVG was made

1. Download the geoBoundaries NGA ADM2 GeoJSON.
2. Keep features whose names match the 20 Lagos LGAs and whose centroids fall
   inside the Lagos bounding box (so Oyo’s Surulere is excluded).
3. Project longitude/latitude to SVG with a latitude-corrected equirectangular
   projection.
4. Keep the official polygons; simplify only as already provided in the
   geoBoundaries simplified release.

## Geographic check

Centroids (lon, lat) from the source, west → east:

| LGA | lon | lat | Expected position |
|---|---:|---:|---|
| Badagry | 2.94 | 6.46 | Far west, coastal |
| Ojo | 3.16 | 6.47 | West of the metropolis |
| Alimosho | 3.25 | 6.56 | Northwest, large |
| Ikeja | 3.35 | 6.61 | North-central |
| Shomolu | 3.38 | 6.54 | Small mainland, west of Kosofe |
| Kosofe | 3.40 | 6.60 | East of Shomolu |
| Ikorodu | 3.55 | 6.60 | Northeast, north of the lagoon |
| Eti-Osa | 3.51 | 6.46 | Lekki / Victoria Island peninsula |
| Ibeju-Lekki | 3.97 | 6.46 | Eastern coastal corridor |
| Epe | 4.00 | 6.53 | Far east |

Lagos East (highlighted): Epe, Ibeju-Lekki, Ikorodu, Kosofe, Shomolu.
