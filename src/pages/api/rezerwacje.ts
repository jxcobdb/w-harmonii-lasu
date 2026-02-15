import type { APIRoute } from "astro";
import IcalExpander from "ical-expander";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const debug = url.searchParams.get("debug") === "1";

  try {
    const icsUrl =
      "https://roomadmin.pl/ws/ics/room/25754/2bf2285529791b50aada1e2d9a1d9813208e69d7/read.ics";
    const res = await fetch(icsUrl);
    if (!res.ok) {
      throw new Error(`iCal fetch failed: ${res.status} ${res.statusText}`);
    }
    const icsText = await res.text();
    if (!icsText.trim()) {
      throw new Error("iCal feed is empty");
    }

    const ical = new IcalExpander({ ics: icsText, maxIterations: 5000 });
    const now = new Date();
    // Zakres: od dziś do ~13 miesięcy (rezerwacje w roomadmin często są na wiele miesięcy do przodu)
    const endDate = new Date(Date.now() + 400 * 24 * 60 * 60 * 1000);

    const range = ical.between(now, endDate);
    const mapSummary = (s: string | undefined) =>
      s?.trim().toUpperCase() === "ROOMADMIN-CLOSED"
        ? "Zarezerwowane"
        : s ?? "Zajęte";

    const fromEvents = range.events.map((e) => ({
      start: e.startDate.toJSDate(),
      end: e.endDate.toJSDate(),
      summary: mapSummary(e.summary),
    }));
    const fromOccurrences = range.occurrences.map((o) => ({
      start: o.startDate.toJSDate(),
      end: o.endDate.toJSDate(),
      summary: mapSummary((o as { item?: { summary?: string } }).item?.summary),
    }));
    let busySlots = [...fromEvents, ...fromOccurrences];

    // Gdy between nic nie zwraca (np. daty all-day), weź all() i odfiltruj do zakresu
    if (busySlots.length === 0) {
      const all = ical.all();
      const allEvents = all.events.map((e) => ({
        start: e.startDate.toJSDate(),
        end: e.endDate.toJSDate(),
        summary: mapSummary(e.summary),
      }));
      const allOccurrences = all.occurrences.map((o) => ({
        start: o.startDate.toJSDate(),
        end: o.endDate.toJSDate(),
        summary: mapSummary(
          (o as { item?: { summary?: string } }).item?.summary,
        ),
      }));
      const combined = [...allEvents, ...allOccurrences];
      busySlots = combined
        .filter((e) => e.start >= now && e.start <= endDate)
        .sort((a, b) => a.start.getTime() - b.start.getTime());
    } else {
      busySlots.sort((a, b) => a.start.getTime() - b.start.getTime());
    }

    if (debug) {
      const all = ical.all();
      const body = {
        events: busySlots,
        debug: {
          icsLength: icsText.length,
          hasVEVENT: icsText.includes("BEGIN:VEVENT"),
          hasVFREEBUSY: icsText.includes("VFREEBUSY"),
          icsPreview: icsText.slice(0, 500).replace(/\r?\n/g, " "),
          betweenEvents: range.events.length,
          betweenOccurrences: range.occurrences.length,
          allEventsTotal: all.events.length,
          allOccurrencesTotal: all.occurrences.length,
        },
      };
      return new Response(JSON.stringify(body, null, 2), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(busySlots), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
