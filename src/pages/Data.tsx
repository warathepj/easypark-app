import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ParkingData {
  levels: {
    levelNumber: number;
    totalSpots: number;
    availableSpots: number;
    occupiedSpots: number;
    spots: {
      spotNumber: number;
      isOccupied: boolean;
      registrationNumber?: string;
    }[];
  }[];
  totalOccupancy: {
    total: number;
    available: number;
    occupied: number;
    occupancyRate: number;
  };
}

const Data: React.FC = () => {
  const navigate = useNavigate();
  const [parkingData, setParkingData] = useState<ParkingData | null>(null);

  useEffect(() => {
    // Function to fetch initial data
    const fetchParkingData = async () => {
      try {
        const response = await fetch('/api/parking-data');
        if (!response.ok) {
          throw new Error('Failed to fetch parking data');
        }
        const data = await response.json();
        setParkingData(data);
      } catch (error) {
        console.error('Failed to fetch parking data:', error);
        toast.error('Failed to fetch parking data');
      }
    };

    // Set up EventSource for real-time updates
    const setupEventSource = () => {
      const eventSource = new EventSource('/api/parking-data/stream');
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setParkingData(data);
        } catch (error) {
          console.error('Error parsing parking data:', error);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setTimeout(setupEventSource, 5000); // Retry connection after 5 seconds
      };

      return eventSource;
    };

    // Initial fetch
    fetchParkingData();

    // Set up real-time updates
    const eventSource = setupEventSource();

    // Cleanup
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Parking Data</h1>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {parkingData ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Total Occupancy</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm text-blue-600">Total Spots</p>
                  <p className="text-2xl font-bold">{parkingData.totalOccupancy.total}</p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <p className="text-sm text-green-600">Available</p>
                  <p className="text-2xl font-bold">{parkingData.totalOccupancy.available}</p>
                </div>
                <div className="bg-red-50 p-4 rounded">
                  <p className="text-sm text-red-600">Occupied</p>
                  <p className="text-2xl font-bold">{parkingData.totalOccupancy.occupied}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded">
                  <p className="text-sm text-purple-600">Occupancy Rate</p>
                  <p className="text-2xl font-bold">{parkingData.totalOccupancy.occupancyRate.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Level Details</h2>
              <div className="space-y-4">
                {parkingData.levels.map((level) => (
                  <div key={level.levelNumber} className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">Level {level.levelNumber}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Spots</p>
                        <p className="text-xl">{level.totalSpots}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Available</p>
                        <p className="text-xl text-green-600">{level.availableSpots}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Occupied</p>
                        <p className="text-xl text-red-600">{level.occupiedSpots}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Loading parking data...</p>
        )}
      </div>
    </div>
  );
};

export default Data;
