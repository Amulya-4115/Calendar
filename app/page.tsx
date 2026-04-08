"use client";

import { useState, useEffect } from "react";

export default function Calendar() {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(today);
  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getKey = (day: number) => `${year}-${month}-${day}`;

  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleClick = (day: number) => {
    setSelectedDay(day);

    if (!start) {
      setStart(day);
    } else if (!end) {
      setEnd(day);
    } else {
      setStart(day);
      setEnd(null);
    }

    setNote(notes[getKey(day)] || "");
  };

  const saveNote = () => {
    if (selectedDay) {
      setNotes({ ...notes, [getKey(selectedDay)]: note });
    }
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(year, month + direction, 1);
    setCurrentDate(newDate);
    setStart(null);
    setEnd(null);
    setSelectedDay(null);
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div style={{ padding: "20px" }}>
      
      {/* 🔥 Main Container */}
      <div
        style={{
          maxWidth: "800px",
          margin: "auto",
          display: "flex",
          flexWrap: "wrap",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          borderRadius: "12px",
          overflow: "hidden",
          background: "white",
        }}
      >

        {/* 📅 Calendar Section */}
        <div style={{ flex: "1 1 300px", padding: "15px" }}>

          {/* Header with Month Switch */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => changeMonth(-1)}>⬅️</button>

            <h2>
              📅 {monthName} {year}
            </h2>

            <button onClick={() => changeMonth(1)}>➡️</button>
          </div>

          {/* Days */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              fontSize: "10px",
              textAlign: "center",
              marginBottom: "4px",
              color: "#666",
            }}
          >
            {daysOfWeek.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "4px",
              justifyItems: "center",
            }}
          >
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={"empty-" + i} />
            ))}

            {days.map((day) => {
              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

              const isInRange =
                start &&
                end &&
                day >= Math.min(start, end) &&
                day <= Math.max(start, end);

              const isStart = start === day;
              const isEnd = end === day;

              return (
                <div
                  key={day}
                  onClick={() => handleClick(day)}
                  style={{
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    cursor: "pointer",
                    border: isToday ? "2px solid red" : "1px solid #ddd",
                    borderRadius: "6px",
                    position: "relative",

                    background:
                      isStart || isEnd
                        ? "#2563eb"
                        : isInRange
                        ? "#bfdbfe"
                        : "#fff",

                    color: isStart || isEnd ? "white" : "black",
                  }}
                >
                  {day}

                  {notes[getKey(day)] && (
                    <div
                      style={{
                        width: "4px",
                        height: "4px",
                        background: "red",
                        borderRadius: "50%",
                        position: "absolute",
                        bottom: "3px",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Range */}
          {start && end && (
            <p style={{ marginTop: "10px", fontSize: "12px" }}>
              Selected: {start} → {end}
            </p>
          )}
        </div>

        {/* 📝 Notes Section */}
        <div
          style={{
            flex: "1 1 250px",
            padding: "15px",
            borderLeft: "1px solid #eee",
          }}
        >
          <h3>Notes</h3>

          {selectedDay ? (
            <>
              <p>Day {selectedDay}</p>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                style={{ width: "100%", marginTop: "5px" }}
              />

              <button
                onClick={saveNote}
                style={{
                  marginTop: "8px",
                  width: "100%",
                  padding: "8px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </>
          ) : (
            <p>Select a day to add notes</p>
          )}
        </div>

      </div>
    </div>
  );
}