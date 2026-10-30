import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  CheckCircle,
  Compass,
  Wrench,
  AlertTriangle,
  ArrowRight,
  Plus,
  TrendingUp,
  Fuel,
  FileText
} from 'lucide-react';

// Import Reusable Design System components
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import MetricCard from '../../components/ui/MetricCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import showToast from '../../components/ui/Toast';

// Import Mock Services
import { vehicleService } from '../../services/vehicleService';

const FleetDashboard = () => {
  const navigate = useNavigate();

  // Data states
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFleetStats = async () => {
    setIsLoading(true);
    try {
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (err) {
      showToast.error("Failed to load Fleet indicators.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFleetStats();
  }, []);

  // Fleet Calculations
  const stats = useMemo(() => {
    const total = vehicles.length;
    const available = vehicles.filter(v => v.status === 'Available').length;
    const onTrip = vehicles.filter(v => v.status === 'On Trip').length;
    const maintenance = vehicles.filter(v => v.status === 'Maintenance').length;
    const retired = vehicles.filter(v => v.status === 'Retired').length;

    // Compliance metrics
    const today = new Date();
    const insuranceExpiring = vehicles.filter(v => new Date(v.insuranceExpiry) <= today).length;
    const fitnessExpiring = vehicles.filter(v => new Date(v.fitnessExpiry) <= today).length;
    const pucExpiring = vehicles.filter(v => new Date(v.pucExpiry) <= today).length;
    const upcomingServices = vehicles.filter(v => v.odometer >= 200000 && v.status !== 'Maintenance').length;

    // Fuel indices
    const totalOdo = vehicles.reduce((sum, v) => sum + v.odometer, 0);
    const avgOdom = total > 0 ? Math.round(totalOdo / total) : 0;
    const efficiency = total > 0 ? (totalOdo / (total * 30000)).toFixed(1) : '3.3'; // mock avg mileage

    return {
      total,
      available,
      onTrip,
      maintenance,
      retired,
      insuranceExpiring,
      fitnessExpiring,
      pucExpiring,
      upcomingServices,
      avgOdom,
      efficiency: `${efficiency} km/L`
    };
  }, [vehicles]);

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
        title="Fleet Overview Dashboard"
        subtitle="Operations dashboard monitoring fleet capacity, diagnostic compliance and efficiencies"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              rightIcon={ArrowRight}
              onClick={() => navigate('/vehicles/registry')}
              className="text-xs"
            >
              Open Registry Table
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={Plus}
              onClick={() => navigate('/vehicles/add')}
              className="text-xs"
            >
              Register Vehicle
            </Button>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Fleet Assets" value={stats.total} change="2.4" isPositive={true} icon={Truck} sparklineData={[42, 45, 47, 48, 48, 49, 50]} />
        <StatCard title="Available Carriers" value={stats.available} change="5.2" isPositive={true} icon={CheckCircle} sparklineData={[20, 22, 24, 25, 23, 27, 28]} />
        <StatCard title="Vehicles On Trip" value={stats.onTrip} change="8.8" isPositive={true} icon={Compass} sparklineData={[12, 13, 14, 15, 14, 15, 15]} />
        <StatCard title="In Maintenance" value={stats.maintenance} change="4.1" isPositive={false} icon={Wrench} sparklineData={[8, 6, 7, 5, 6, 4, 5]} />
        <StatCard title="Decommissioned/Retired" value={stats.retired} change="0.0" isPositive={true} icon={AlertTriangle} sparklineData={[2, 2, 2, 2, 2, 2, 2]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compliance Indicators summaries card */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Compliance Warnings Summary" subtitle="Fleet assets requiring documentation or service updates">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-hover/20 border border-border/80 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block">Insurance Expired</span>
                  <span className="text-xl font-black text-danger">{stats.insuranceExpiring}</span>
                </div>
                <div className="p-2 bg-danger/10 text-danger rounded-lg">
                  <FileText size={18} />
                </div>
              </div>

              <div className="p-4 bg-hover/20 border border-border/80 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block">Fitness Expired</span>
                  <span className="text-xl font-black text-danger">{stats.fitnessExpiring}</span>
                </div>
                <div className="p-2 bg-danger/10 text-danger rounded-lg">
                  <AlertTriangle size={18} />
                </div>
              </div>

              <div className="p-4 bg-hover/20 border border-border/80 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block">PUC Expired</span>
                  <span className="text-xl font-black text-danger">{stats.pucExpiring}</span>
                </div>
                <div className="p-2 bg-danger/10 text-danger rounded-lg">
                  <AlertTriangle size={18} />
                </div>
              </div>

              <div className="p-4 bg-hover/20 border border-border/80 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block">Service Overdue</span>
                  <span className="text-xl font-black text-warning">{stats.upcomingServices}</span>
                </div>
                <div className="p-2 bg-warning/10 text-warning rounded-lg">
                  <Wrench size={18} />
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/vehicles/registry')}
                rightIcon={ArrowRight}
                className="text-xs"
              >
                Inspect Compliance Issues in Table
              </Button>
            </div>
          </Card>

          {/* Efficiency indicators card */}
          <Card title="Mileage & Consumption Indices" subtitle="Fleet performance aggregates">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MetricCard label="Average Asset Mileage" value={`${stats.avgOdom.toLocaleString()} km`} change="1.5" isPositive={true} icon={TrendingUp} />
              <MetricCard label="Fleet Fuel Efficiency" value={stats.efficiency} change="3.2" isPositive={true} icon={Fuel} />
            </div>
          </Card>
        </div>

        {/* Quick compliance warning list */}
        <div className="space-y-6">
          <Card title="Expired Documents Registry" subtitle="Assets blocked from routes dispatch">
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {vehicles.filter(v => new Date(v.insuranceExpiry) < new Date() || new Date(v.fitnessExpiry) < new Date() || new Date(v.pucExpiry) < new Date()).map(v => (
                <div
                  key={v.id}
                  onClick={() => navigate(`/vehicles/${v.id}`)}
                  className="p-3 bg-card border border-border/80 rounded-xl cursor-pointer hover:border-danger/40 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-info">{v.plateNumber}</span>
                    <Badge status="Retired" />
                  </div>
                  <div className="text-[10.5px] text-text-secondary font-medium leading-normal space-y-1">
                    {new Date(v.insuranceExpiry) < new Date() && <p className="text-danger">🔴 Insurance Policy Expired</p>}
                    {new Date(v.fitnessExpiry) < new Date() && <p className="text-danger">🔴 Fitness Certificate Expired</p>}
                    {new Date(v.pucExpiry) < new Date() && <p className="text-danger">🔴 Pollution PUC Certificate Expired</p>}
                  </div>
                </div>
              ))}
              {vehicles.filter(v => new Date(v.insuranceExpiry) < new Date() || new Date(v.fitnessExpiry) < new Date() || new Date(v.pucExpiry) < new Date()).length === 0 && (
                <div className="p-8 text-center text-xs font-semibold text-text-secondary">All vehicles documents currently comply with fleet laws!</div>
              )}
            </div>
          </Card>

          {/* Soft-Archived/Retired redirect card */}
          <Card title="Archived Vehicles Registry" subtitle="Retired and archived assets">
            <p className="text-xs text-text-secondary leading-relaxed font-semibold">
              View decommissioned assets, retired trailers or archive logs history.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/vehicles/archived')}
              rightIcon={ArrowRight}
              className="mt-4 text-xs w-full"
            >
              Open Archives folder
            </Button>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default FleetDashboard;
export { FleetDashboard };
