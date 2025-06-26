import React, { useState, useEffect, useContext } from 'react';
import heroImage from '../../public/flight.jpg';
import { ContextData } from '../context/context';

const Home = () => {
  const [departureCity, setDepartureCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [journeyDate, setJourneyDate] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const {userId} = useContext(ContextData)

  // Load all available flights ON PAGE LOAD
  useEffect(() => {
    const loadAllFlights = async () => {
      setLoading(true);
      const res = await fetch(`http://localhost:8082/flights`);
      const result = await res.json();
      if (result.status) {
        setResults(result.data);
      }
      setLoading(false);
    };
    loadAllFlights();
  }, []);

  const handleSearch = async () => {
    if (!departureCity && !destinationCity && !journeyDate) {
      alert('Please select at least one search criteria!');
      return;
    }
    setLoading(true);
    const query = new URLSearchParams({
      departureCity,
      destinationCity,
      journeyDate,
    });
    const res = await fetch(`http://localhost:8082/flights?${query.toString()}`);
    const result = await res.json();
    if (result.status) {
      setResults(result.data);
    } else {
      alert(result.message || 'No flights found');
    }
    setLoading(false);
  };
  
  const handleBook = async (flightId) => {
    const res = await fetch(`http://localhost:8082/book`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ userId, flightId }),
    });
    const result = await res.json();
    alert(result.message || 'Error booking flight');
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-start items-center relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Header Text */}
      <div className="relative z-10 text-center p-10 max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-bold text-white">
          Embark on an Extraordinary Flight Booking Adventure!
        </h1>
        <p className="text-gray-200 mt-3">
          Unleash your travel desires and book extraordinary flight journeys
          that will transport you to unforgettable destinations.
        </p>
      </div>

      {/* Search Form */}
      <div className="relative z-10 w-full flex justify-center">
        <div className="bg-white rounded-xl p-4 flex flex-col md:flex-row items-center justify-around space-y-3 md:space-y-0 md:space-x-4 w-11/12 max-w-5xl">
          
          <select
            value={departureCity}
            onChange={(e) => setDepartureCity(e.target.value)}
            className="p-2 rounded-xl border flex-1"
          >
            <option value="">Departure City</option>
            <option>New York</option>
            <option>Los Angeles</option>
            <option>Paris</option>
            <option>London</option>
            <option>Dubai</option>
            <option>Tokyo</option>
          </select>

          <select
            value={destinationCity}
            onChange={(e) => setDestinationCity(e.target.value)}
            className="p-2 rounded-xl border flex-1"
          >
            <option value="">Destination City</option>
            <option>New York</option>
            <option>Los Angeles</option>
            <option>Paris</option>
            <option>London</option>
            <option>Dubai</option>
            <option>Tokyo</option>
          </select>

          <input
            className="p-2 rounded-xl border flex-1"
            type="date"
            value={journeyDate}
            onChange={(e) => setJourneyDate(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white rounded-xl p-2 flex-1"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="relative z-10 p-5 flex flex-col items-center w-full max-w-5xl">
        {loading && <div className="text-white">Loading flights...</div>}

        {!loading && results.length > 0 && (
          <>
            <h2 className="text-white font-bold text-2xl mt-5">Available Flights</h2>
            <div className="bg-white rounded p-3 mt-3 w-full">
              {results.map((f, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b p-3 flex-col sm:flex-row"
                >
                  <div className="text-left">
                    <p className="font-bold text-gray-800">
                      {f.departureCity} → {f.destinationCity}
                    </p>
                    <p className="text-gray-600">Date: {f.journeyDate}</p>
                  </div>
                  <button
                    onClick={() => handleBook(f._id)}
                    className="bg-green-600 text-white rounded p-2 mt-3 sm:mt-0"
                  >
                    Book
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        {!loading && results.length === 0 && (
          <div className="text-white mt-5">No flights available</div>
        )}
      </div>
    </div>
  );
};

export default Home;
