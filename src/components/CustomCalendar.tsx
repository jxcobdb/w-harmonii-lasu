import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pl";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CustomCalendar.css";

moment.locale("pl");

interface Event {
  start: string;
  end: string;
  summary: string;
}

interface CustomCalendarProps {
  initialEvents?: Event[];
}

const localizer = momentLocalizer(moment);

const formatEvent = (e: Event) => ({
  start: new Date(e.start),
  end: new Date(e.end),
  title:
    (e.summary?.trim().toUpperCase() === "ROOMADMIN-CLOSED"
      ? "Zarezerwowane"
      : e.summary) || "Zajęte",
});

const messages = {
  date: "Data",
  time: "Godzina",
  event: "Wydarzenie",
  allDay: "Cały dzień",
  week: "Tydzień",
  work_week: "Tydzień roboczy",
  day: "Dzień",
  month: "Miesiąc",
  previous: "Poprzedni",
  next: "Następny",
  yesterday: "Wczoraj",
  tomorrow: "Jutro",
  today: "Dziś",
  agenda: "Agenda",
  noEventsInRange: "Brak wydarzeń w tym okresie.",
  showMore: (total: number) => `+${total} więcej`,
};

// Wymuszenie polskich nazw miesięcy/dni (localizer czasem nie stosuje culture)
const formats = {
  monthHeaderFormat: (date: Date) =>
    moment(date).locale("pl").format("MMMM YYYY"),
  dayHeaderFormat: (date: Date) => moment(date).locale("pl").format("dddd, LL"),
  dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
    moment(start).locale("pl").format("D MMM") +
    " – " +
    moment(end).locale("pl").format("D MMM YYYY"),
  agendaDateFormat: (date: Date) =>
    moment(date).locale("pl").format("ddd D MMM"),
  weekdayFormat: (date: Date) => moment(date).locale("pl").format("ddd"),
  dayFormat: (date: Date) => moment(date).locale("pl").format("D ddd"),
  dateFormat: (date: Date) => moment(date).locale("pl").format("D"),
};

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  initialEvents = [],
}) => {
  const [date, setDate] = useState(() => new Date());
  const [events, setEvents] = useState<
    { start: Date; end: Date; title: string }[]
  >(() => initialEvents.map(formatEvent));

  useEffect(() => {
    fetch("/api/rezerwacje")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Event[]) => setEvents(data.map(formatEvent)))
      .catch((err) => console.error("Błąd pobierania rezerwacji:", err));
  }, []);

  const handleNavigate = (
    _currentDate: Date,
    _view: string,
    action: string,
  ) => {
    let next = new Date(_currentDate);
    if (action === "PREV")
      next = moment(_currentDate).subtract(1, "month").toDate();
    if (action === "NEXT") next = moment(_currentDate).add(1, "month").toDate();
    if (action === "TODAY") next = new Date();
    setDate(next);
  };

  // Intl zawsze po polsku (nie zależy od moment/locale)
  const monthLabelRaw = new Intl.DateTimeFormat("pl-PL", {
    month: "long",
    year: "numeric",
  }).format(date);
  const monthLabel =
    monthLabelRaw.charAt(0).toUpperCase() + monthLabelRaw.slice(1);

  return (
    <div className="custom-calendar-wrapper" style={{ height: "700px" }}>
      <div className="rbc-toolbar rbc-toolbar--minimal">
        <div className="rbc-toolbar--minimal__left">
          <span className="rbc-btn-group">
            <button
              type="button"
              onClick={() => handleNavigate(date, "month", "TODAY")}
            >
              Dziś
            </button>
            <button
              type="button"
              onClick={() => handleNavigate(date, "month", "PREV")}
            >
              Poprzedni
            </button>
            <button
              type="button"
              onClick={() => handleNavigate(date, "month", "NEXT")}
            >
              Następny
            </button>
          </span>
        </div>
        <span className="rbc-toolbar-label">{monthLabel}</span>
        <div className="rbc-toolbar--minimal__right" aria-hidden />
      </div>
      <Calendar
        localizer={localizer}
        culture="pl"
        formats={formats}
        events={events}
        date={date}
        onNavigate={handleNavigate}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        messages={messages}
        toolbar={false}
        style={{ height: "calc(100% - 52px)" }}
        view="month"
        views={["month"]}
        defaultView="month"
      />
    </div>
  );
};

export default CustomCalendar;
