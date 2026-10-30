import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Chart as ChartJS } from 'chart.js/auto';
import {
  Truck,
  Users,
  Compass,
  Wrench,
  Clock,
  AlertTriangle,
  Activity,
  Fuel,
  DollarSign,
  CheckCircle,
  Calendar,
  RefreshCw,
  TrendingUp,
  FileSpreadsheet,
  Plus,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

// Import Reusable Design System components
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import ChartCard from '../../components/ui/ChartCard';
import Table, { TableHeader, TableBody, TableRow, TableCell, TableHeadCell } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Timeline from '../../components/ui/Timeline';
import Skeleton from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';

// Import Mock Services
import dashboardService from '../../services/dashboardService';
import { tripService } from '../../services/tripService';
import { activityService } from '../../services/activityService';

// Custom Self-Cleaning Chart.js Wrapper to prevent Canvas reuse errors
const DoughnutChart = ({ data, options, id }) => {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      chartInstanceRef.current = new ChartJS(canvasRef.current, {
        type: 'doughnut',
        data,
        options
      });
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data, options]);

  return <canvas ref={canvasRef} id={id} />;
};

const Dashboard = () => {
  const navigate = useNavigate();

  // Loading, error and datasets states
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const [kpis, setKpis] = useState(null);
  const [chartsData, setChartsData] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);
  const [activitiesList, setActivitiesList] = useState([]);
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  // Theme tracking state
  const [themeMode, setThemeMode] = useState(
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  // Real-time time updater
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Theme observer for Chart.js rendering
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setThemeMode(isDark ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const [kpiRes, chartRes, tripRes, actRes] = await Promise.all([
        dashboardService.getKPIs(),
        dashboardService.getChartsData(),
        tripService.getAll(),
        activityService.getAll()
      ]);

      setKpis(kpiRes);
      setChartsData(chartRes);
      
      // Get latest 5 trips with ETAs mapping
      const sortedTrips = [...tripRes]
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        .slice(0, 5)
        .map(t => {
          // Mock an ETA for display compatibility
          const etaTime = t.status === 'Active' ? '4.5 hrs' : t.status === 'Scheduled' ? 'Tomorrow' : '-';
          return { ...t, eta: etaTime };
        });
      setRecentTrips(sortedTrips);

      // Get latest 5 activities
      setActivitiesList(actRes.slice(0, 5));
    } catch (err) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Doughnut options
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: themeMode === 'dark' ? '#E5E7EB' : '#374151',
          font: { size: 10, weight: '600' },
          padding: 8
        }
      },
      tooltip: {
        backgroundColor: themeMode === 'dark' ? '#18181B' : '#FFFFFF',
        titleColor: themeMode === 'dark' ? '#FFFFFF' : '#111827',
        bodyColor: themeMode === 'dark' ? '#D1D5DB' : '#4B5563',
        borderColor: themeMode === 'dark' ? '#2E2E34' : '#E5E7EB',
        borderWidth: 1,
        padding: 8,
        cornerRadius: 8
      }
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <div className="h-10 bg-border animate-pulse rounded-lg w-1/4" />
          <Skeleton variant="dashboard" />
        </div>
      </PageContainer>
    );
  }

  if (hasError) {
    return (
      <PageContainer>
        <ErrorState
          code="500"
          title="Operations Panel Connection Failure"
          message="Could not load Command Center stats. Verify server database registries status."
          actionText="Retry Loading"
          onActionClick={fetchDashboardData}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      
      {/* HEADER: Greet, Role, Clock, Search, Refresh */}
      <PageHeader
        title="Good Morning, Alex"
        subtitle="Operations Command Center | Fleet Manager"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative rounded-lg shadow-sm w-44">
              <input
                type="text"
                placeholder="Global Registry Search..."
                onClick={() => navigate('/vehicles/registry')}
                className="block w-full rounded-lg border border-border text-xs focus:outline-none focus:ring-1 focus:ring-info pl-3 pr-3 py-1.5 bg-card text-text-main placeholder:text-text-secondary/40 cursor-pointer"
                readOnly
              />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-lg text-xs font-bold text-text-main select-none font-mono">
              <Calendar size={14} className="text-text-secondary" />
              <span>{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span className="text-border px-1">|</span>
              <span className="text-info">{time}</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              leftIcon={RefreshCw}
              onClick={fetchDashboardData}
              className="text-xs"
            >
              Refresh Ops
            </Button>
          </div>
        }
      />

      {/* SECTION 1: Exactly FOUR KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
        <StatCard title="Active Vehicles" value={kpis.activeVehicles} change="8.5" isPositive={true} icon={Truck} sparklineData={[20, 24, 22, 28, 25, 27, 28]} />
        <StatCard title="Drivers On Duty" value={kpis.driversOnTrip} change="12.5" isPositive={true} icon={Users} sparklineData={[10, 12, 11, 14, 13, 14, 15]} />
        <StatCard title="Trips Running" value={kpis.tripsToday} change="15.0" isPositive={true} icon={Compass} sparklineData={[12, 15, 14, 18, 16, 17, 19]} />
        <StatCard title="Maintenance Due" value={kpis.maintenanceDue} change="2.1" isPositive={false} icon={Wrench} sparklineData={[8, 7, 9, 6, 5, 4, 3]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SECTION 2: Operations Command Center Board */}
        <div className="lg:col-span-2">
          <Card
            title="Operational Control Deck"
            subtitle="Fleet active metrics, utility rates, and warnings index summary"
            className="h-full border-info/20"
          >
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-2">
              <div className="p-3 bg-hover/20 border border-border/60 rounded-xl space-y-0.5">
                <span className="text-[9.5px] font-bold text-text-secondary uppercase tracking-widest block">Vehicles Available</span>
                <span className="text-xl font-black text-success">{kpis.availableVehicles}</span>
              </div>
              <div className="p-3 bg-hover/20 border border-border/60 rounded-xl space-y-0.5">
                <span className="text-[9.5px] font-bold text-text-secondary uppercase tracking-widest block">Trips Running</span>
                <span className="text-xl font-black text-info">{kpis.tripsToday}</span>
              </div>
              <div className="p-3 bg-hover/20 border border-border/60 rounded-xl space-y-0.5">
                <span className="text-[9.5px] font-bold text-text-secondary uppercase tracking-widest block">Drivers Available</span>
                <span className="text-xl font-black text-success">{kpis.driversAvailable}</span>
              </div>
              <div className="p-3 bg-hover/20 border border-border/60 rounded-xl space-y-0.5">
                <span className="text-[9.5px] font-bold text-text-secondary uppercase tracking-widest block">In Maintenance</span>
                <span className="text-xl font-black text-warning">{kpis.vehiclesInMaintenance}</span>
              </div>
              <div className="p-3 bg-hover/20 border border-border/60 rounded-xl space-y-0.5">
                <span className="text-[9.5px] font-bold text-text-secondary uppercase tracking-widest block">Maintenance Due</span>
                <span className="text-xl font-black text-warning">{kpis.maintenanceDue}</span>
              </div>
              <div className="p-3 bg-hover/20 border border-border/60 rounded-xl space-y-0.5">
                <span className="text-[9.5px] font-bold text-text-secondary uppercase tracking-widest block">Fuel Cost Today</span>
                <span className="text-xl font-black text-text-main">${kpis.fuelCostToday}</span>
              </div>
              <div className="p-3 bg-hover/20 border border-border/60 rounded-xl space-y-0.5">
                <span className="text-[9.5px] font-bold text-text-secondary uppercase tracking-widest block">Fleet Utilization</span>
                <span className="text-xl font-black text-text-main">{kpis.fleetUtilization}%</span>
              </div>
              <div className="p-3 bg-hover/20 border border-border/60 rounded-xl space-y-0.5">
                <span className="text-[9.5px] font-bold text-text-secondary uppercase tracking-widest block">Upcoming Services</span>
                <span className="text-xl font-black text-text-main">3</span>
              </div>
              <div className="p-3 bg-hover/20 border border-border/60 rounded-xl space-y-0.5">
                <span className="text-[9.5px] font-bold text-text-secondary uppercase tracking-widest block">License Expiry</span>
                <span className="text-xl font-black text-danger">1</span>
              </div>
              <div className="p-3 bg-hover/20 border border-border/60 rounded-xl space-y-0.5">
                <span className="text-[9.5px] font-bold text-text-secondary uppercase tracking-widest block">Insurance Expiry</span>
                <span className="text-xl font-black text-danger">1</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border flex flex-wrap gap-2 items-center">
              <Button variant="primary" size="sm" leftIcon={Plus} onClick={() => navigate('/vehicles/add')} className="text-xs">Register Vehicle</Button>
              <Button variant="outline" size="sm" leftIcon={Plus} onClick={() => navigate('/drivers/add')} className="text-xs">Register Driver</Button>
              <Button variant="outline" size="sm" leftIcon={Compass} onClick={() => navigate('/trips/dispatch')} className="text-xs">Create Trip</Button>
              <Button variant="outline" size="sm" leftIcon={Wrench} onClick={() => navigate('/maintenance')} className="text-xs">Schedule Service</Button>
              <Button variant="outline" size="sm" leftIcon={Fuel} onClick={() => navigate('/fuel')} className="text-xs">Log Fuel</Button>
              <Button variant="outline" size="sm" leftIcon={FileSpreadsheet} onClick={() => navigate('/reports')} className="text-xs">Generate Report</Button>
            </div>
          </Card>
        </div>

        {/* SECTION 3: High-Priority Alerts Panel */}
        <div>
          <Card title="High Priority Alerts" subtitle="Issues requiring immediate attention" className="h-full border-danger/25 bg-danger/5">
            <div className="space-y-2.5">
              <div className="flex gap-2.5 items-start p-2.5 bg-card border border-danger/20 rounded-lg text-xs font-semibold text-danger">
                <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-bold text-text-main">Driver License Expiry</p>
                  <p className="text-text-secondary text-[10.5px] font-medium leading-normal">Sarah Jenkins license expires tomorrow. Actions required.</p>
                </div>
              </div>
              
              <div className="flex gap-2.5 items-start p-2.5 bg-card border border-danger/20 rounded-lg text-xs font-semibold text-danger">
                <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-bold text-text-main">Vehicle Insurance Expired</p>
                  <p className="text-text-secondary text-[10.5px] font-medium leading-normal">Vehicle V002 insurance expired. Asset dispatch locked.</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start p-2.5 bg-card border border-border/80 rounded-lg text-xs font-semibold text-text-main">
                <Wrench size={15} className="mt-0.5 flex-shrink-0 text-warning" />
                <div className="space-y-0.5">
                  <p className="font-bold text-text-main">Maintenance Overdue</p>
                  <p className="text-text-secondary text-[10.5px] font-medium leading-normal">Asset V018 scheduled brake maintenance is overdue.</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start p-2.5 bg-card border border-border/80 rounded-lg text-xs font-semibold text-text-main">
                <Clock size={15} className="mt-0.5 flex-shrink-0 text-warning" />
                <div className="space-y-0.5">
                  <p className="font-bold text-text-main">Active Trip Delayed</p>
                  <p className="text-text-secondary text-[10.5px] font-medium leading-normal">Trip T004 exceeds standard route duration by 2 hours.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* SECTION 4: Quick Actions panel list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { title: "Register Vehicle", desc: "Add vehicle asset", icon: Truck, url: "/vehicles/add" },
          { title: "Register Driver", desc: "Add driver registry", icon: Users, url: "/drivers/add" },
          { title: "Dispatch Trip", desc: "Create dispatch route", icon: Compass, url: "/trips/dispatch" },
          { title: "Maintenance", desc: "Schedule repairs check", icon: Wrench, url: "/maintenance" },
          { title: "Fuel Entry", desc: "Log refuels cards", icon: Fuel, url: "/fuel" },
          { title: "Expense Entry", desc: "Log billing items", icon: DollarSign, url: "/expenses" },
          { title: "Reports", desc: "Generate spreadsheets", icon: FileSpreadsheet, url: "/reports" }
        ].map((act, i) => {
          const Icon = act.icon;
          return (
            <div
              key={i}
              onClick={() => navigate(act.url)}
              className="p-3.5 bg-card border border-border rounded-xl cursor-pointer select-none transition-all hover:border-info/40 hover:scale-[1.01] flex flex-col items-center justify-center text-center space-y-1.5 group"
            >
              <div className="p-2 bg-hover rounded-lg text-text-secondary group-hover:text-info group-hover:bg-info/10 transition-colors">
                <Icon size={16} />
              </div>
              <div className="space-y-0.5">
                <h5 className="text-[11px] font-bold text-text-main leading-tight">{act.title}</h5>
                <p className="text-[9.5px] text-text-secondary font-medium">{act.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 5: ONE Vehicle Status Doughnut Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ChartCard title="Vehicle Status Share" subtitle="Asset availability distributions" height="h-56" isLoading={!chartsData}>
            {chartsData && <DoughnutChart id="vehicle-status-doughnut" key={`vehicle-status-${themeMode}`} data={chartsData.vehicleStatus} options={doughnutOptions} />}
          </ChartCard>
        </div>

        {/* SECTION 6: Recent Trips Table (Latest 5 only) */}
        <div className="md:col-span-2">
          <Card title="Latest Dispatch Trips" subtitle="Latest 5 trips dispatched" bodyClassName="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHeadCell>Trip ID</TableHeadCell>
                    <TableHeadCell>Vehicle</TableHeadCell>
                    <TableHeadCell>Driver</TableHeadCell>
                    <TableHeadCell>Destination</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell>ETA</TableHeadCell>
                    <TableHeadCell>Actions</TableHeadCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTrips.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-bold text-info">{row.id}</TableCell>
                      <TableCell className="font-bold text-text-main">{row.vehicleId}</TableCell>
                      <TableCell className="text-text-secondary">{row.driverId}</TableCell>
                      <TableCell>{row.destination}</TableCell>
                      <TableCell><Badge status={row.status} /></TableCell>
                      <TableCell className="text-xs font-semibold text-text-secondary">{row.eta}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          rightIcon={ChevronRight}
                          onClick={() => navigate(`/trips`)}
                          className="text-[10px] py-0.5 px-2 rounded"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>

      {/* SECTION 7: Recent Activity Timeline (Latest 5 only) */}
      <Card title="Recent Activity Timeline" subtitle="Latest 5 system events logs">
        <div className="px-2 pt-2">
          <Timeline
            items={activitiesList.map(act => ({
              title: `${act.action}`,
              description: act.description,
              date: act.date
            }))}
          />
        </div>
      </Card>
      
    </PageContainer>
  );
};

export default Dashboard;
