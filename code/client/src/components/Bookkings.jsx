import React, { useContext, useEffect, useState } from 'react';
import { ContextData } from '../context/context';

const Bookkings = () => {
  const { bookkings, setBooks, userId, type } = useContext(ContextData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const res = await fetch('http://localhost:8082/bookkings', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ type: 'bookings' }),
      });
      const result = await res.json();

      if (result.status) {
        // ✅ Admin sees ALL, user sees only their bookings
        const data = type === 'admin'
          ? result.data.filter((b) => b.status !== 'canceled')
          : result.data.filter((b) => b.userId === userId && b.status !== 'canceled');

        // ✅ Get flight details
        const updatedData = await Promise.all(
          data.map(async (b) => {
            const flightRes = await fetch('http://localhost:8082/flightDetails', {
              method: 'POST',
              headers: { 'Content-type': 'application/json' },
              body: JSON.stringify({ flightId: b.flightId }),
            });
            const flightResult = await flightRes.json();
            return {
              ...b,
              flightDetails: flightResult.data || {},
            };
          })
        );
        setBooks(updatedData);
      } else {
        alert('Not Found');
      }
      setLoading(false);
    };
    load();
  }, [setBooks, userId, type]);

  const handleCancel = async (bookingId) => {
    const res = await fetch('http://localhost:8082/cancelBooking', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ bookingId }),
    });
    const result = await res.json();
    if (result.status) {
      alert(result.message);
      setBooks((prev) => prev.filter((b) => b._id !== bookingId));
    } else {
      alert(result.message || 'Error canceling booking');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center p-5 bg-gray-100">
      <h1 className="text-3xl font-bold mt-5">{type === 'admin' ? 'All Bookings' : 'My Bookings'}</h1>

      {loading && <div className="mt-5 text-gray-600">Loading bookings...</div>}

      {!loading && bookkings.length === 0 && (
        <div className="mt-5 text-gray-600">No bookings found</div>
      )}

      {!loading && bookkings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 w-11/12 max-w-5xl">
          {bookkings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl p-4 shadow-lg flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-bold">
                  {booking.flightDetails?.departureCity ?? '...'} → {booking.flightDetails?.destinationCity ?? '...'}
                </h2>
                <p className="text-gray-600">Date: {booking.flightDetails?.journeyDate ?? '...'}</p>
                <p className="text-gray-500">Booked At: {new Date(booking.bookedAt).toLocaleString()}</p>
                {type === 'admin' && (
                  <p className="text-gray-700">User ID: {booking.userId}</p>
                )}
                <p
                  className={`mt-2 font-bold ${booking.status === 'canceled' ? 'text-red-600' : 'text-green-600'}`}
                >
                  Status: {booking.status || 'active'}
                </p>
              </div>

              {booking.status !== 'canceled' && (
                <button
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl p-2 mt-3"
                  onClick={() => handleCancel(booking._id)}
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookkings;
