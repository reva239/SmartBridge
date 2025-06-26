import React, { useState } from 'react';

const PostFlight = () => {
  const [departureCity, setDepartureCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [journeyDate, setJourneyDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8082/flight', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ departureCity, destinationCity, journeyDate }),
    });
    const result = await res.json();

    if (result.status) {
      alert(result.message);
      setDepartureCity('');
      setDestinationCity('');
      setJourneyDate('');
    } else {
      alert(result.message || 'Error posting flight!');
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form
        className="bg-gray-700 p-6 rounded-xl flex flex-col gap-4 text-white"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold">Post Flight</h2>
        <input
          type="text"
          placeholder="Departure City"
          value={departureCity}
          onChange={(e) => setDepartureCity(e.target.value)}
          className="p-2 rounded text-black bg-white"
        />
        <input
          type="text"
          placeholder="Destination City"
          value={destinationCity}
          onChange={(e) => setDestinationCity(e.target.value)}
          className="p-2 rounded text-black bg-white"
        />
        <input
          type="date"
          value={journeyDate}
          onChange={(e) => setJourneyDate(e.target.value)}
          className="p-2 rounded text-black bg-white"
        />
        <button
          type="submit"
          className="bg-blue-600 rounded p-2 font-bold text-white"
        >
          Add Flight
        </button>
      </form>
    </div>
  );
};

export default PostFlight;
