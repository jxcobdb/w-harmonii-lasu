import React, { useEffect, useMemo, useState } from "react";
import {
    GoogleMap as GoogleMapComponent,
    Marker,
    useLoadScript,
} from "@react-google-maps/api";

interface Props {
    apiKey: string;
    className?: string;
}

// ✅ Docelowa lokalizacja
const LOCATION = {
    lat: 53.959592986882676,
    lng: 17.197636769105006,
};

// ✅ Styl mapy (drogi #265F3E, woda #2A5453)
const MAP_STYLES: google.maps.MapTypeStyle[] = [
    { elementType: "geometry", stylers: [{ color: "#2b2b2b" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#2b2b2b" }, { weight: 3 }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#d6d6d6" }] },

    { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#4a4a4a" }, { weight: 1 }] },
    { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: "#c8c8c8" }] },

    { featureType: "water", elementType: "geometry", stylers: [{ color: "#2A5453" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },

    { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#303030" }] },

    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "poi", elementType: "geometry", stylers: [{ color: "#2f2f2f" }, { visibility: "simplified" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#2c2c2c" }] },

    { featureType: "road", elementType: "geometry", stylers: [{ color: "#242424" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1d1d1d" }, { weight: 1 }] },
    { featureType: "road.local", elementType: "geometry", stylers: [{ color: "#202020" }] },

    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#265F3E" }] },
    { featureType: "road.arterial", elementType: "geometry.stroke", stylers: [{ color: "#1e4b31" }, { weight: 1.2 }] },

    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#265F3E" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#2f7a4f" }, { weight: 1.6 }] },

    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#d0d0d0" }] },

    { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ visibility: "off" }] },
];

function SkeletonLoader({ className }: { className?: string }) {
    return (
        <div className={`w-full h-full rounded-lg shadow-md animate-pulse ${className ?? ""}`}>
            <div className="w-full h-full rounded-lg bg-gray-600/30" />
        </div>
    );
}

type ParsedLogo = {
    inner: string; // zawartość bez zewnętrznego <svg>
    vbW: number;
    vbH: number;
};

/**
 * Parsuje SVG:
 * - wyciąga viewBox i innerHTML
 * - nie zakłada nic o wymiarach -> skala policzona później
 */
function parseSvg(svgText: string): ParsedLogo | null {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const svg = doc.querySelector("svg");
        if (!svg) return null;

        // viewBox: "minX minY width height"
        const vb = svg.getAttribute("viewBox");
        let vbW = 100;
        let vbH = 100;

        if (vb) {
            const parts = vb.trim().split(/\s+|,/).map(Number);
            if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
                vbW = parts[2];
                vbH = parts[3];
            }
        } else {
            // fallback: width/height atrybuty
            const w = Number(svg.getAttribute("width"));
            const h = Number(svg.getAttribute("height"));
            if (Number.isFinite(w) && w > 0) vbW = w;
            if (Number.isFinite(h) && h > 0) vbH = h;
        }

        const inner = svg.innerHTML ?? "";
        return { inner, vbW, vbH };
    } catch {
        return null;
    }
}

export default function GoogleMap({ apiKey, className }: Props) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries: ["geometry"],
    });

    const g = useMemo(() => {
        if (typeof window === "undefined") return undefined;
        return (window as any).google as typeof google | undefined;
    }, [isLoaded]);

    const isGoogleReady = !!g?.maps && isLoaded && !loadError;

    const center = LOCATION;
    const zoom = 10;

    // ✅ wczytujemy i parsujemy logo
    const [logo, setLogo] = useState<ParsedLogo | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetch("/icons/brand-logo-simple.svg", { cache: "force-cache" })
            .then((r) => r.text())
            .then((txt) => {
                if (cancelled) return;
                setLogo(parseSvg(txt));
            })
            .catch(() => {
                if (cancelled) return;
                setLogo(null);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    // ✅ budujemy marker SVG (biały) + logo (auto skala + wymuszenie koloru)
    const markerSvg = useMemo(() => {
        // box wewnątrz pinezki na logo
        const boxX = 10;
        const boxY = 10;
        const boxSize = 20; // 20x20

        // Jeśli nie ma logo -> zostaw puste (albo możesz dać fallback kropkę)
        if (!logo) {
            return `
        <svg width="40" height="56" viewBox="0 0 40 56" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0C9 0 0 9 0 20c0 12 20 36 20 36s20-24 20-36C40 9 31 0 20 0z" fill="#ffffff"/>
        </svg>
      `.trim();
        }

        // auto skala, żeby zmieścić viewBox w boxSize
        const scale = boxSize / Math.max(logo.vbW, logo.vbH);

        // wycentrowanie: przesuwamy o ( (boxSize - vbW*scale)/2 , (boxSize - vbH*scale)/2 )
        const dx = boxX + (boxSize - logo.vbW * scale) / 2;
        const dy = boxY + (boxSize - logo.vbH * scale) / 2;

        // Wymuszamy kolor logo na ciemny. Robimy to CSS-em z !important dla wszystkich elementów.
        // To rozwiązuje przypadki, gdzie logo ma fill="white" albo stroke-only.
        const forcedColor = "#1a1a19"; // brand-black-100 (ciemny, będzie widoczny na bieli)

        return `
      <svg width="40" height="56" viewBox="0 0 40 56" xmlns="http://www.w3.org/2000/svg">
        <style>
          .logo * { fill: ${forcedColor} !important; stroke: ${forcedColor} !important; }
        </style>

        <path
          d="M20 0C9 0 0 9 0 20c0 12 20 36 20 36s20-24 20-36C40 9 31 0 20 0z"
          fill="#ffffff"
        />

        <g class="logo" transform="translate(${dx} ${dy}) scale(${scale})">
          ${logo.inner}
        </g>
      </svg>
    `.trim();
    }, [logo]);

    const getCustomMarker = (): google.maps.Icon | undefined => {
        if (!isGoogleReady || !g?.maps) return undefined;

        return {
            url: `data:image/svg+xml;utf8,${encodeURIComponent(markerSvg)}`,
            size: new g.maps.Size(40, 56),
            scaledSize: new g.maps.Size(40, 56),
            anchor: new g.maps.Point(20, 56),
        };
    };

    if (loadError) {
        return (
            <div className={`w-full h-full shadow-md flex items-center justify-center ${className ?? ""}`}>
                <p className="text-sm text-gray-600">Nie udało się załadować Google Maps.</p>
            </div>
        );
    }

    if (!isGoogleReady) {
        return <SkeletonLoader className={className} />;
    }

    return (
        <div className={`w-full h-full ${className ?? ""}`}>
            <GoogleMapComponent
                center={center}
                zoom={zoom}
                mapContainerClassName="w-full h-full"
                options={{
                    styles: MAP_STYLES,
                    zoomControl: true,
                    gestureHandling: "cooperative",
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                    zoomControlOptions: {
                        position: g.maps.ControlPosition.RIGHT_BOTTOM,
                    },
                }}
            >
                <Marker position={LOCATION} icon={getCustomMarker()} title="Ukojenie w sercu natury" />
            </GoogleMapComponent>
        </div>
    );
}
