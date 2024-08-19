import { useState } from 'react';

const Calendar = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsOfYear = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentDate = new Date();

    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [showEventPopup, setShowEventPopup] = useState(false);
    const [events, setEvents] = useState([]);
    const [eventTime, setEventTime] = useState({ hours: '', minutes: '' });
    const [eventText, setEventText] = useState('');
    const [editingEvent, setEditingEvent] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const prevMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
        setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear));
    };

    const nextMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
        setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear));
    };

    const handleDayClick = (day) => {
        const clickedDate = new Date(currentYear, currentMonth, day);
        const today = new Date();

        if (clickedDate >= today || isSameDay(clickedDate, today)) {
            setSelectedDate(clickedDate);
            setShowEventPopup(true);
            setEventTime({ hours: '', minutes: '' });
            setEventText('');
            setEditingEvent(null);
        }
    };

    const isSameDay = (date1, date2) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    const handleEventSubmit = () => {
        const newEvent = {
            id: editingEvent ? editingEvent.id : Date.now(),
            date: selectedDate,
            time: `${eventTime.hours.padStart(2, '0')}:${eventTime.minutes.padStart(2, '0')}`,
            text: eventText,
        };

        let updatedEvents = [...events];

        if (editingEvent) {
            updatedEvents = updatedEvents.map((event) =>
                event.id === editingEvent.id ? newEvent : event
            );
        } else {
            updatedEvents.push(newEvent);
        }

        updatedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

        setEvents(updatedEvents);
        setEventTime({ hours: '', minutes: '' });
        setEventText('');
        setShowEventPopup(false);
        setEditingEvent(null);
    };

    const handleDetails = (event) => {
        setSelectedEvent(event);
    };

    const handleEditEvent = (event) => {
        setSelectedDate(new Date(event.date));
        setEventTime({
            hours: event.time.split(':')[0],
            minutes: event.time.split(':')[1],
        });
        setEventText(event.text);
        setEditingEvent(event);
        setShowEventPopup(true);
    };

    const handleDeleteEvent = (eventId) => {
        const updatedEvents = events.filter((event) => event.id !== eventId);
        setEvents(updatedEvents);
    };

    const handleTimeChange = (e) => {
        const { name, value } = e.target;
        setEventTime((prevTime) => ({ ...prevTime, [name]: value.padStart(2, '0') }));
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
    };

    return (
        <div className="flex flex-col md:flex-row lg:flex-row gap-12 p-12 bg-[#05152d] rounded-3xl border-4 border-[#0f1319] relative min-w-[90vmin] w-[60%] mx-auto">
            <div className=" w-full lg:w-1/2 md:w-1/2">
                <h1 className="text-white text-5xl font-bold mb-8 pl-5">Calendar</h1>
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-gray-400 text-2xl">
                        {monthsOfYear[currentMonth]}, {currentYear}
                    </h2>
                    <div className="flex gap-2">
                        <button className="text-white text-2xl px-2 rounded-full" onClick={prevMonth}>
                            &lt;
                        </button>
                        <button className="text-white text-2xl" onClick={nextMonth}>
                            &gt;
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-4 text-white">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="text-center">{day}</div>
                    ))}
                </div>
                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                    {[...Array(firstDayOfMonth).keys()].map((_, index) => (
                        <div key={`empty-${index}`} className="text-center"></div>
                    ))}
                    {[...Array(daysInMonth).keys()].map((day) => (
                        <div
                            key={day + 1}
                            className={`text-center cursor-pointer p-2 rounded-lg ${day + 1 === currentDate.getDate() &&
                                currentMonth === currentDate.getMonth() &&
                                currentYear === currentDate.getFullYear()
                                ? 'bg-blue-500 text-white shadow-md hover:bg-blue-900 shadow-blue-600'
                                : 'text-white hover:bg-blue-900'
                                }`}
                            onClick={() => handleDayClick(day + 1)}
                        >
                            {day + 1}
                        </div>
                    ))}
                </div>
            </div>

            {/* Event list with scrollbar when more than 3 events */}
            <div className="w-full md:w-1/2 lg:w-1/2 max-h-[70vh] overflow-y-auto">
                {showEventPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <div className="flex items-center gap-2 mb-4">
                                <input
                                    type="number"
                                    name="hours"
                                    min={0}
                                    max={24}
                                    placeholder='00'
                                    className="border p-2 rounded w-16 text-center"
                                    value={eventTime.hours}
                                    onChange={handleTimeChange}
                                />
                                <span>:</span>
                                <input
                                    type="number"
                                    name="minutes"
                                    min={0}
                                    max={59}
                                    placeholder='00'
                                    className="border p-2 rounded w-16 text-center"
                                    value={eventTime.minutes}
                                    onChange={handleTimeChange}
                                />
                            </div>
                            <textarea
                                placeholder="Event description..."
                                className="border p-2 rounded w-full mb-4"
                                value={eventText}
                                onChange={(e) => setEventText(e.target.value)}
                            />
                            <div className="flex gap-4">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={handleEventSubmit}
                                >
                                    {editingEvent ? 'Update' : 'Add'} Event
                                </button>
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                    onClick={() => setShowEventPopup(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    {events.length > 0 ? (
                        events.map((event) => (
                            <div key={event.id} className="border p-4 rounded mb-4">
                                <div className="flex justify-between mb-2">
                                    <div className='text-white'>
                                        {monthsOfYear[new Date(event.date).getMonth()]} {new Date(event.date).getDate()}, {new Date(event.date).getFullYear()}
                                    </div>
                                    <div className='text-white'>{event.time}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleDetails(event)}
                                    >
                                        Details
                                    </button>
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleEditEvent(event)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleDeleteEvent(event.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-white">No events added.</div>
                    )}
                </div>
            </div>

            {/* Event Details Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-2">
                                Event on {monthsOfYear[new Date(selectedEvent.date).getMonth()]} {new Date(selectedEvent.date).getDate()}, {new Date(selectedEvent.date).getFullYear()}
                            </h2>
                            <p className="mb-2">Time: {selectedEvent.time}</p>
                            <p>Description: {selectedEvent.text}</p>
                        </div>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={handleCloseModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;

