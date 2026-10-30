import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Truck, Compass, Wrench, Fuel } from 'lucide-react';

// Import Reusable Design System components
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Timeline from '../../components/ui/Timeline';
import Loader from '../../components/ui/Loader';
import showToast from '../../components/ui/Toast';

// Import Mock Services
import { vehicleService } from '../../services/vehicleService';
import { tripService } from '../../services/tripService';
import { maintenanceService } from '../../services/maintenanceService';
import { fuelService } from '../../services/fuelService';

const VehicleTimeline = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Component states
  const [vehicle, setVehicle] = useState(null);
  const [trips, setTrips] = useState([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTimelineData = async () => {
    setIsLoading(true);
    try {
      const [vRes, tRes, mRes, fRes] = await Promise.all([
        vehicleService.getById(id),
        tripService.getAll(),
        maintenanceService.getAll(),
        fuelService.getAll()
      ]);

      setVehicle(vRes);
      setTrips(tRes.filter(t => t.vehicleId === id));
      setMaintenanceLogs(mRes.filter(m => m.vehicleId === id));
      setFuelLogs(fRes.filter(f => f.vehicleId === id));
    } catch (err) {
      showToast.error("Failed to load timeline history.");
      navigate(`/vehicles/${id}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineData();
  }, [id]);

  // Construct Event logs dynamically from data sources, sort chronologically
  const timelineEvents = useMemo(() => {
    if (!vehicle) return [];

    const list = [];

    // 1. Purchased Event
    list.push({
      date: new Date(vehicle.purchaseDate),
      dateStr: vehicle.purchaseDate,
      title: 'Vehicle Asset Purchased',
      description: `Asset acquired for $${vehicle.purchaseCost?.toLocaleString()}. Manufacturing year: ${vehicle.year}. Odometer mileage: ${vehicle.odometer} km.`,
      icon: Truck
    });

    // 2. Trips dispatches
    trips.forEach(t => {
      list.push({
        date: new Date(t.startDate),
        dateStr: new Date(t.startDate).toLocaleDateString(),
        title: `Trip Dispatched (ID: ${t.id})`,
        description: `Dispatched cargo route: ${t.origin} ➔ ${t.destination}. Status: ${t.status}. Weight: ${t.cargoWeight}.`,
        icon: Compass
      });
      if (t.endDate) {
        list.push({
          date: new Date(t.endDate),
          dateStr: new Date(t.endDate).toLocaleDateString(),
          title: `Trip Completed (ID: ${t.id})`,
          description: `Delivery completed at ${t.destination}. Distanced logged: ${t.distance} km. Fuel: ${t.fuelConsumed}L.`,
          icon: CheckCircleIcon
        });
      }
    });

    // 3. Maintenance Service tickets
    maintenanceLogs.forEach(m => {
      list.push({
        date: new Date(m.date),
        dateStr: m.date,
        title: `Service Bay Logged: ${m.type} (ID: ${m.id})`,
        description: `Description: ${m.description}. Cost: $${m.cost}. Priority: ${m.priority}. Mechanic: ${m.mechanic}. Status: ${m.status}.`,
        icon: Wrench
      });
    });

    // 4. Refueling events
    fuelLogs.forEach(f => {
      list.push({
        date: new Date(f.date),
        dateStr: f.date,
        title: `Fuel Refill Logged (ID: ${f.id})`,
        description: `Refueled ${f.quantity} Liters for $${f.cost} at ${f.stationName}. Receipt: ${f.receiptNumber}.`,
        icon: Fuel
      });
    });

    // 5. Retired event
    if (vehicle.status === 'Retired' || vehicle.archived) {
      list.push({
        date: new Date(),
        dateStr: 'Today',
        title: 'Asset Decommissioned/Retired',
        description: 'Vehicle asset marked as retired/archived from commercial operations. Compliance status locked.',
        icon: AlertTriangle
      });
    }

    // Sort newest first
    return list.sort((a, b) => b.date - a.date);
  }, [vehicle, trips, maintenanceLogs, fuelLogs]);

  // Helper
  const CheckCircleIcon = () => (
    <div className="h-2 w-2 rounded-full bg-success mt-1.5" />
  );

  if (isLoading) {
    return (
      <PageContainer className="flex items-center justify-center min-h-[40vh]">
        <Loader size="lg" />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      
      {/* Header */}
      <PageHeader
        title={`Asset Lifecycle Timeline: ${vehicle.plateNumber}`}
        subtitle={`Chronological event trail for ${vehicle.make} ${vehicle.model}`}
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={ArrowLeft}
            onClick={() => navigate(`/vehicles/${id}`)}
            className="text-xs"
          >
            Back to Vehicle Profile
          </Button>
        }
      />

      <Card title="Operational Lifecycle Log" subtitle="History details sorted chronologically">
        {timelineEvents.length === 0 ? (
          <div className="p-8 text-center text-xs font-semibold text-text-secondary">No lifecycle events recorded.</div>
        ) : (
          <div className="px-2 pt-4">
            <Timeline
              items={timelineEvents.map(evt => {
                const Icon = evt.icon;
                return {
                  title: (
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{evt.title}</span>
                    </div>
                  ),
                  description: evt.description,
                  date: evt.dateStr
                };
              })}
            />
          </div>
        )}
      </Card>
    </PageContainer>
  );
};

export default VehicleTimeline;
export { VehicleTimeline };
