import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Wrench,
  Fuel,
  Compass,
  AlertTriangle,
  FileText,
  Clock,
  DollarSign,
  Truck,
  Activity,
  History
} from 'lucide-react';

// Import Reusable Design System components
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import InfoCard from '../../components/ui/InfoCard';
import Table, { TableHeader, TableBody, TableRow, TableCell, TableHeadCell } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Loader from '../../components/ui/Loader';
import showToast from '../../components/ui/Toast';

// Import Mock Services
import { vehicleService } from '../../services/vehicleService';
import { tripService } from '../../services/tripService';
import { maintenanceService } from '../../services/maintenanceService';
import { fuelService } from '../../services/fuelService';
import { driverService } from '../../services/driverService';
import { expenseService } from '../../services/expenseService';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Data states
  const [vehicle, setVehicle] = useState(null);
  const [trips, setTrips] = useState([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchVehicleDetails = async () => {
    setIsLoading(true);
    try {
      const [vRes, tRes, mRes, fRes, dRes, eRes] = await Promise.all([
        vehicleService.getById(id),
        tripService.getAll(),
        maintenanceService.getAll(),
        fuelService.getAll(),
        driverService.getAll(),
        expenseService.getAll()
      ]);

      setVehicle(vRes);
      setDrivers(dRes);

      // Filter arrays specific to this vehicle
      setTrips(tRes.filter(t => t.vehicleId === id));
      setMaintenanceLogs(mRes.filter(m => m.vehicleId === id));
      setFuelLogs(fRes.filter(f => f.vehicleId === id));
      
      // Mapped fuel & maintenance costs to expenses if needed
      setExpenses(eRes.filter(e => 
        e.description.toLowerCase().includes(vRes.id.toLowerCase()) || 
        e.description.toLowerCase().includes(vRes.plateNumber.toLowerCase())
      ));
    } catch (err) {
      showToast.error("Could not load vehicle profiles details.");
      navigate('/vehicles/registry');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleDetails();
  }, [id]);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);

    // Business Rule Check: Cannot archive a vehicle on active trip
    const activeTrip = trips.find(t => t.status === 'Active');
    if (activeTrip) {
      showToast.error("Business Rule Violation: Cannot delete/archive a vehicle while it is assigned to an Active Trip!");
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      return;
    }

    try {
      await vehicleService.delete(id);
      showToast.success("Vehicle archived successfully.");
      navigate('/vehicles/registry');
    } catch (err) {
      showToast.error("Could not delete vehicle asset.");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  const activeTrip = useMemo(() => trips.find(t => t.status === 'Active'), [trips]);
  const activeDriver = useMemo(() => activeTrip ? drivers.find(d => d.id === activeTrip.driverId) : null, [activeTrip, drivers]);

  // Expirations compliance warnings
  const isInsExpired = useMemo(() => new Date(vehicle?.insuranceExpiry) < new Date(), [vehicle]);
  const isFitExpired = useMemo(() => new Date(vehicle?.fitnessExpiry) < new Date(), [vehicle]);
  const isPucExpired = useMemo(() => new Date(vehicle?.pucExpiry) < new Date(), [vehicle]);
  const isMaintDue = useMemo(() => (vehicle?.odometer || 0) >= 200000, [vehicle]);

  if (isLoading) {
    return (
      <PageContainer className="flex items-center justify-center min-h-[40vh]">
        <Loader size="lg" />
      </PageContainer>
    );
  }

  // Properties schema definition
  const overviewProperties = [
    { label: 'Manufacturer Make', value: vehicle.make },
    { label: 'Model Code', value: vehicle.model },
    { label: 'Carrier Type', value: vehicle.type },
    { label: 'VIN (Vehicle Identification Number)', value: <span className="font-mono">{vehicle.vin}</span> },
    { label: 'Year Built', value: vehicle.year },
    { label: 'Tonnage Capacity', value: `${vehicle.carrierCap} Tons` },
    { label: 'Purchase Cost', value: `$${vehicle.purchaseCost?.toLocaleString()}` },
    { label: 'Acquisition Date', value: vehicle.purchaseDate },
    { label: 'Current Odometer', value: `${vehicle.odometer?.toLocaleString()} km` },
    { label: 'Fuel Source Type', value: vehicle.fuelType },
    { label: 'Last Service Date', value: vehicle.lastServiceDate },
    { label: 'Operating Region', value: vehicle.region }
  ];

  return (
    <PageContainer className="space-y-6">
      
      {/* Header */}
      <PageHeader
        title={`${vehicle.make} ${vehicle.model}`}
        subtitle={`Registration: ${vehicle.plateNumber} | VIN: ${vehicle.vin}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" leftIcon={ArrowLeft} onClick={() => navigate('/vehicles/registry')} className="text-xs">
              Registry Table
            </Button>
            <Button variant="outline" size="sm" leftIcon={FileText} onClick={() => navigate(`/vehicles/${id}/documents`)} className="text-xs">
              Manage Documents
            </Button>
            <Button variant="outline" size="sm" leftIcon={History} onClick={() => navigate(`/vehicles/${id}/timeline`)} className="text-xs">
              Asset Lifecycle
            </Button>
            <Button variant="outline" size="sm" leftIcon={Edit} onClick={() => navigate(`/vehicles/${id}/edit`)} className="text-xs">
              Edit Asset
            </Button>
            <Button variant="outline" size="sm" leftIcon={Trash2} onClick={() => setDeleteConfirmOpen(true)} className="text-xs hover:text-danger">
              Archive Vehicle
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Summary and Warnings Cards */}
        <div className="space-y-6">
          <Card title="Vehicle Summary" subtitle="Operational Status Overview">
            <div className="flex flex-col items-center justify-center text-center space-y-3.5 py-4">
              <div className="h-16 w-16 rounded-full border border-border bg-hover flex items-center justify-center text-text-secondary select-none">
                <Truck size={28} strokeWidth={1.5} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-text-main">{vehicle.make} {vehicle.model}</h4>
                <span className="font-mono text-xs font-bold text-info">{vehicle.plateNumber}</span>
              </div>
              <Badge status={vehicle.status} />
            </div>

            <div className="h-px bg-border/40 my-3.5" />

            <div className="space-y-4">
              <div>
                <span className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">Fuel Tank Level</span>
                <div className="flex items-center gap-2">
                  <div className="flex-grow bg-hover rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${vehicle.fuelLevel < 30 ? 'bg-danger' : vehicle.fuelLevel < 70 ? 'bg-warning' : 'bg-success'}`}
                      style={{ width: `${vehicle.fuelLevel}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-text-main">{vehicle.fuelLevel}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest">Driver Assigned</span>
                  <span className="text-xs font-semibold text-text-main">{activeDriver ? activeDriver.name : 'None'}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest">Assigned Trip</span>
                  <span className="text-xs font-semibold text-text-main">
                    {activeTrip ? <span className="text-info font-bold">{activeTrip.id}</span> : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Compliance warnings */}
          {(isInsExpired || isFitExpired || isPucExpired || isMaintDue || vehicle.status === 'Maintenance') && (
            <Card title="Compliance Warnings" subtitle="Urgent action required" className="border-danger/30 bg-danger/5">
              <div className="space-y-3.5">
                {isInsExpired && (
                  <div className="flex gap-2.5 items-start text-xs font-semibold text-danger">
                    <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-text-main">Insurance Policy Expired!</p>
                      <p className="text-text-secondary text-[11px] font-medium leading-relaxed">Expired on {vehicle.insuranceExpiry}. Do not dispatch vehicle.</p>
                    </div>
                  </div>
                )}
                {isFitExpired && (
                  <div className="flex gap-2.5 items-start text-xs font-semibold text-danger">
                    <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-text-main">Fitness Certificate Expired!</p>
                      <p className="text-text-secondary text-[11px] font-medium leading-relaxed">Safety fitness certificate expired on {vehicle.fitnessExpiry}. Inspections required.</p>
                    </div>
                  </div>
                )}
                {isPucExpired && (
                  <div className="flex gap-2.5 items-start text-xs font-semibold text-danger">
                    <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-text-main">PUC Certificate Expired!</p>
                      <p className="text-text-secondary text-[11px] font-medium leading-relaxed">Pollution check PUC expired on {vehicle.pucExpiry}. Emission test required.</p>
                    </div>
                  </div>
                )}
                {isMaintDue && (
                  <div className="flex gap-2.5 items-start text-xs font-semibold text-warning">
                    <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-text-main">Scheduled Service Due</p>
                      <p className="text-text-secondary text-[11px] font-medium leading-relaxed">Asset Odometer mileage ({vehicle.odometer.toLocaleString()} km) exceeds the 200,000 km threshold.</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Right Side: Primary Properties and Tab Logs list */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs
            tabs={[
              { id: 'overview', label: 'Vehicle Overview' },
              { id: 'trips', label: 'Trips History', count: trips.length },
              { id: 'maintenance', label: 'Service History', count: maintenanceLogs.length },
              { id: 'fuel', label: 'Fuel Receipts', count: fuelLogs.length },
              { id: 'expenses', label: 'Expense History', count: expenses.length }
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* TAB 1: OVERVIEW METADATA */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              <InfoCard title="Vehicle Specifications Details" items={overviewProperties} cols={2} />
              
              <Card title="Compliance Certificates validity" subtitle="Required regulatory checkpoints summary">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className={`p-4 bg-hover/20 border rounded-xl flex items-center justify-between ${isInsExpired ? 'border-danger/30' : 'border-border/80'}`}>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block">Insurance Policy</span>
                      <span className={`text-xs font-bold ${isInsExpired ? 'text-danger' : 'text-success'}`}>{isInsExpired ? 'Expired' : 'Active'}</span>
                    </div>
                  </div>
                  <div className={`p-4 bg-hover/20 border rounded-xl flex items-center justify-between ${isFitExpired ? 'border-danger/30' : 'border-border/80'}`}>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block">Fitness Certificate</span>
                      <span className={`text-xs font-bold ${isFitExpired ? 'text-danger' : 'text-success'}`}>{isFitExpired ? 'Expired' : 'Active'}</span>
                    </div>
                  </div>
                  <div className={`p-4 bg-hover/20 border rounded-xl flex items-center justify-between ${isPucExpired ? 'border-danger/30' : 'border-border/80'}`}>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block">PUC Emission</span>
                      <span className={`text-xs font-bold ${isPucExpired ? 'text-danger' : 'text-success'}`}>{isPucExpired ? 'Expired' : 'Active'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/vehicles/${id}/documents`)} className="text-xs">
                    Open Documents tab to view attachments
                  </Button>
                </div>
              </Card>

              {vehicle.notes && (
                <Card title="Operational Registry Notes">
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-semibold">
                    {vehicle.notes}
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* TAB 2: RECENT TRIPS TABLE */}
          {activeTab === 'trips' && (
            <div className="animate-fadeIn">
              <Card title="Dispatched Routes log" subtitle="Dispatches associated with this vehicle" bodyClassName="p-0">
                {trips.length === 0 ? (
                  <div className="p-8 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">No trips logged yet</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHeadCell>Trip ID</TableHeadCell>
                          <TableHeadCell>Driver</TableHeadCell>
                          <TableHeadCell>Route</TableHeadCell>
                          <TableHeadCell>Cargo</TableHeadCell>
                          <TableHeadCell>Status</TableHeadCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trips.map(row => (
                          <TableRow key={row.id}>
                            <TableCell className="font-bold text-info">{row.id}</TableCell>
                            <TableCell className="text-text-secondary">{row.driverId}</TableCell>
                            <TableCell>{row.origin} ➔ {row.destination}</TableCell>
                            <TableCell>{row.cargoWeight}</TableCell>
                            <TableCell><Badge status={row.status} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* TAB 3: MAINTENANCE LOGS */}
          {activeTab === 'maintenance' && (
            <div className="space-y-4 animate-fadeIn">
              {maintenanceLogs.length === 0 ? (
                <Card title="Service Registry">
                  <div className="p-8 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">No service events registered</div>
                </Card>
              ) : (
                maintenanceLogs.map(m => (
                  <div key={m.id} className="p-4 bg-card border border-border rounded-xl flex flex-col sm:flex-row justify-between gap-4 transition-all hover:border-hover">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-info">{m.id}</span>
                        <Badge status={m.status} />
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-text-main">{m.description}</h4>
                      <p className="text-xs text-text-secondary leading-relaxed font-semibold">{m.notes}</p>
                      <div className="flex flex-wrap items-center gap-4 text-[10.5px] font-semibold text-text-secondary">
                        <span className="flex items-center gap-1"><Calendar size={13} /> {m.date}</span>
                        <span>Mechanic: <strong className="text-text-main">{m.mechanic}</strong></span>
                      </div>
                    </div>
                    <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end flex-shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${m.priority === 'High' ? 'bg-danger/15 text-danger' : 'bg-hover text-text-secondary'}`}>
                        {m.priority} Priority
                      </span>
                      <span className="text-sm font-black text-text-main">${m.cost}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: REFUEL HISTORY */}
          {activeTab === 'fuel' && (
            <div className="animate-fadeIn">
              <Card title="Fuel Refill receipts" subtitle="Liters refueled and mileage odometer checks" bodyClassName="p-0">
                {fuelLogs.length === 0 ? (
                  <div className="p-8 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">No refueling logs recorded</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHeadCell>Receipt ID</TableHeadCell>
                          <TableHeadCell>Date</TableHeadCell>
                          <TableHeadCell>Volume (L)</TableHeadCell>
                          <TableHeadCell>Cost</TableHeadCell>
                          <TableHeadCell>Odometer</TableHeadCell>
                          <TableHeadCell>Station Location</TableHeadCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fuelLogs.map(row => (
                          <TableRow key={row.id}>
                            <TableCell className="font-mono text-xs">{row.receiptNumber}</TableCell>
                            <TableCell className="text-text-secondary">{row.date}</TableCell>
                            <TableCell className="font-bold text-text-main">{row.quantity} L</TableCell>
                            <TableCell className="font-bold text-success">${row.cost}</TableCell>
                            <TableCell>{row.odometer?.toLocaleString()} km</TableCell>
                            <TableCell className="text-xs font-semibold">{row.stationName}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* TAB 5: EXPENSE HISTORY */}
          {activeTab === 'expenses' && (
            <div className="animate-fadeIn">
              <Card title="Asset Operations Expenses" subtitle="Financial entries mapping to this asset" bodyClassName="p-0">
                {expenses.length === 0 ? (
                  <div className="p-8 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">No expense items logged yet</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHeadCell>Expense ID</TableHeadCell>
                          <TableHeadCell>Category</TableHeadCell>
                          <TableHeadCell>Amount</TableHeadCell>
                          <TableHeadCell>Date</TableHeadCell>
                          <TableHeadCell>Description</TableHeadCell>
                          <TableHeadCell>Status</TableHeadCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expenses.map(row => (
                          <TableRow key={row.id}>
                            <TableCell className="font-bold text-info">{row.id}</TableCell>
                            <TableCell className="font-bold text-text-main">{row.category}</TableCell>
                            <TableCell className="font-bold text-success">${row.amount}</TableCell>
                            <TableCell className="text-text-secondary">{row.date}</TableCell>
                            <TableCell className="text-xs">{row.description}</TableCell>
                            <TableCell><Badge status={row.status === 'Approved' ? 'Completed' : 'Pending'} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        type="danger"
        title="Archive Vehicle Asset"
        message="Are you sure you want to delete/archive this vehicle asset from active operations? This updates active logistics statuses."
        confirmText="Confirm Archive"
        isLoading={isDeleting}
      />
    </PageContainer>
  );
};

export default VehicleDetails;
export { VehicleDetails };
