// src/pages/BusRental.tsx
import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const BusRental: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const reservedDates = [
    {
      start: "2025-09-10",
      end: "2025-09-13",
      color: "#ff9f89",
      display: "background",
    },
    {
      start: "2025-09-20",
      end: "2025-09-21",
      color: "#ff9f89",
      display: "background",
    },
  ];

  const handleDateSelect = (info: any) => {
    const calendarApi = calendarRef.current?.getApi();
    const selectedEndDate = new Date(info.end);
    const startStr = info.startStr.split("T")[0];
    const endStr = selectedEndDate.toISOString().slice(0, 10);
    const selectedStart = new Date(startStr);
    const selectedEnd = new Date(endStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedStart < today) {
      alert(
        "Nie możesz rezerwować w przeszłości. Wybierz daty od dnia dzisiejszego."
      );
      calendarApi?.unselect();
      return;
    }

    const isRangeReserved = reservedDates.some((range) => {
      const start = new Date(range.start);
      const end = new Date(range.end);
      return (
        (selectedStart >= start && selectedStart < end) ||
        (selectedEnd >= start && selectedEnd < end) ||
        (selectedStart < start && selectedEnd >= end)
      );
    });

    if (isRangeReserved) {
      alert("Wybrany termin jest już zajęty. Wybierz inne daty.");
      calendarApi?.unselect();
      return;
    }
    if (formRef.current) {
      (formRef.current.querySelector("#start-date") as HTMLInputElement).value =
        startStr;
      (formRef.current.querySelector("#end-date") as HTMLInputElement).value =
        endStr;
    }

    setShowForm(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData.entries());
    console.log("Dane do wysłania na serwer:", data);
    alert("Formularz wysłany! Sprawdź konsolę, aby zobaczyć zebrane dane.");
  };

  return (
    <main className="rental-main max-w-[1200px] mx-auto p-0 sm:p-[2em] text-[#ddd]">
      <section className="bus-card bg-[rgba(0,0,0,0.4)] p-[20px] rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1)] mt-[100px]">
        <h2 className="section-title text-center text-[#c9302c] text-[2.2em] font-bold mb-[0.2em] inline-block border-b-[3px] border-[#c9302c] pb-[0.2em] mx-auto">
          Rezerwacja busa
        </h2>
        <div className="calendar-section my-[20px]">
          <h3 className="text-2xl text-center mb-4">
            Sprawdź dostępność i zarezerwuj
          </h3>
          <div className="p-4 rounded-xl shadow-lg">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale="pl"
              height="auto"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "",
              }}
              buttonText={{
                today: 'Dzisiaj'
              }}
              selectable={true}
              selectOverlap={false}
              events={reservedDates}
              select={handleDateSelect}
              longPressDelay={0}
              dayHeaderClassNames="bg-black text-white"
            />
          </div>
        </div>
        <form
          id="reservation-form"
          ref={formRef}
          onSubmit={handleSubmit}
          className={`flex flex-col gap-[10px] mt-[20px] border-t-[2px] border-t-[#ccc] pt-[20px] transition-opacity duration-500 ease-in-out ${
            showForm ? "opacity-100 visible" : "opacity-0 hidden"
          }`}
        >
          <h3 className="text-2xl text-center mb-4">Dane do rezerwacji</h3>
          <label htmlFor="name" className="block text-[#ddd] mb-1 font-bold">
            Imię i nazwisko:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="p-[10px] rounded border border-[#ccc]"
          />
          <label htmlFor="email" className="block text-[#ddd] mb-1 font-bold">
            E-mail:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="p-[10px] rounded border border-[#ccc]"
          />
          <label
            htmlFor="start-date"
            className="block text-[#ddd] mb-1 font-bold"
          >
            Data odbioru:
          </label>
          <input
            type="date"
            id="start-date"
            name="start-date"
            required
            className="p-[10px] rounded border border-[#ccc]"
          />
          <label
            htmlFor="end-date"
            className="block text-[#ddd] mb-1 font-bold"
          >
            Data zwrotu:
          </label>
          <input
            type="date"
            id="end-date"
            name="end-date"
            required
            className="p-[10px] rounded border border-[#ccc]"
          />
          <button
            type="submit"
            className="btn inline-block bg-[#c9302c] text-white py-3 px-6 rounded-md transition-colors duration-300 hover:bg-[#a52623] mt-6 uppercase font-bold w-full"
          >
            Potwierdź rezerwację
          </button>
        </form>
      </section>
    </main>
  );
};

export default BusRental;