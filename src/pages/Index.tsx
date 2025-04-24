
import ParkingDashboard from "@/components/ParkingDashboard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <h1 className="text-4xl font-bold text-center mb-3">EasyPark</h1>
      <p className="text-xs font-bold text-center">Mobile Application Demo for User</p>
      <Button onClick={() => navigate('/data')}>Parking Data</Button>
      <ParkingDashboard />
    </div>
  );
};

export default Index;
