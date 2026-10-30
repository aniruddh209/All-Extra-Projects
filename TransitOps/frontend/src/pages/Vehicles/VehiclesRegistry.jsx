import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, ArrowLeft, Download, RefreshCw, AlertTriangle } from 'lucide-react';

// Import Reusable Design System components
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import showToast from '../../components/ui/Toast';

// Import Mock Services
import { vehicleService } from '../../services/vehicleService';
import { tripService } from '../../services/tripService';
import { driverService } from '../../services/driverService';

const VehiclesRegistry = () => {
  const navigate = useNavigate();

  // Data states
  const [vehiclesList, setVehiclesList] = useState([]);
  const [tripsList, setTripsList] = useState([]);
  const [driversList, setDriversList] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRegistryData = async () => {
    setIsLoading(true);
    try {
      const [vRes, tRes, dRes] = await Promise.all([
        vehicleService.getAll(),
        tripService.getAll(),
        driverService.getAll()
      ]);
      setVehiclesList(vRes);
      setTripsList(tRes);
      setDriversList(dRes);
    } catch (err) {
      showToast.error("Failed to load vehicle listings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistryData();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);

    // Business Rule Check: Cannot archive a vehicle on active trip
    const activeTrip = tripsList.find(
      t => t.vehicleId === deleteTargetId && t.status === 'Active'
    );
    if (activeTrip) {
      showToast.error("Business Rule Violation: Cannot delete/archive a vehicle while it is assigned to an Active Trip!");
      setIsDeleting(false);
      setDeleteTargetId(null);
      return;
    }

    try {
      await vehicleService.delete(deleteTargetId);
      showToast.success("Vehicle archived successfully.");
      fetchRegistryData(); // Reload active
    } catch (err) {
      showToast.error("Could not delete vehicle.");
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  // Connected Mappings for logical consistency
  const mappedVehicles = useMemo(() => {
    return vehiclesList.map(vehicle => {
      // Find current active trip
      const activeTrip = tripsList.find(
        t => t.vehicleId === vehicle.id && t.status === 'Active'
      );
      // Find current driver
      const activeDriver = activeTrip
        ? driversList.find(d => d.id === activeTrip.driverId)
        : null;

      // Warnings flags
      const isInsExpired = new Date(vehicle.insuranceExpiry) < new Date();
      const isFitExpired = new Date(vehicle.fitnessExpiry) < new Date();
      const isPucExpired = new Date(vehicle.pucExpiry) < new Date();
      const isMaintDue = vehicle.odometer >= 200000;

      return {
        ...vehicle,
        driverName: activeDriver ? activeDriver.name : 'None',
        tripCode: activeTrip ? activeTrip.id : 'None',
        isInsExpired,
        isFitExpired,
        isPucExpired,
        isMaintDue
      };
    });
  }, [vehiclesList, tripsList, driversList]);

  // Export CSV
  const handleExportCSV = () => {
    if (mappedVehicles.length === 0) return;
    
    const headers = [
      'Registration Number', 'Vehicle Name', 'Type', 'Manufacturer', 'Model',
      'Capacity (Tons)', 'Driver', 'Trip', 'Fuel Level', 'Odometer (km)', 
      'Insurance Expiry', 'Fitness Expiry', 'PUC Expiry', 'Status'
    ];
    
    const rows = mappedVehicles.map(v => [
      v.plateNumber,
      `"${v.make} ${v.model}"`,
      v.type,
      v.make,
      v.model,
      v.carrierCap,
      `"${v.driverName}"`,
      v.tripCode,
      `${v.fuelLevel}%`,
      v.odometer,
      v.insuranceExpiry,
      v.fitnessExpiry,
      v.pucExpiry,
      v.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transitops_vehicles_registry.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast.success("CSV registry exported successfully.");
  };

  // Reusable Columns Definition for DataTable
  const columns = [
    {
      key: 'plateNumber',
      label: 'Reg Number',
      sortable: true,
      render: (val, row) => (
        <span className="font-bold text-info hover:underline cursor-pointer" onClick={() => navigate(`/vehicles/${row.id}`)}>
          {val}
        </span>
      )
    },
    {
      key: 'name',
      label: 'Vehicle Name',
      sortable: true,
      render: (_, row) => <span className="font-bold text-text-main">{row.make} {row.model}</span>
    },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'make', label: 'Manufacturer', sortable: true },
    { key: 'model', label: 'Model', sortable: true },
    {
      key: 'carrierCap',
      label: 'Capacity',
      sortable: true,
      render: (val) => <span>{val} Tons</span>
    },
    {
      key: 'driverName',
      label: 'Current Driver',
      render: (val) => <span className="text-text-secondary">{val}</span>
    },
    {
      key: 'tripCode',
      label: 'Current Trip',
      render: (val) => val !== 'None' ? <span className="text-info font-bold">{val}</span> : <span className="text-text-secondary">None</span>
    },
    {
      key: 'fuelLevel',
      label: 'Fuel Level',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-1.5 min-w-[70px]">
          <div className="w-10 bg-hover rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${val < 30 ? 'bg-danger' : val < 70 ? 'bg-warning' : 'bg-success'}`}
              style={{ width: `${val}%` }}
            />
          </div>
          <span className="text-xs font-semibold">{val}%</span>
        </div>
      )
    },
    {
      key: 'odometer',
      label: 'Odometer',
      sortable: true,
      render: (val) => <span>{Number(val).toLocaleString()} km</span>
    },
    {
      key: 'insuranceExpiry',
      label: 'Insurance Expiry',
      sortable: true,
      render: (val, row) => (
        <span className={row.isInsExpired ? 'text-danger font-bold' : ''}>{val}</span>
      )
    },
    { key: 'lastServiceDate', label: 'Last Service' },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-1.5">
          <Badge status={val} />
          {(row.isInsExpired || row.isFitExpired || row.isPucExpired || row.isMaintDue) && (
            <AlertTriangle
              size={14}
              className="text-warning animate-pulse"
              title={`Compliance warnings: ${
                [
                  row.isInsExpired && 'Insurance Expired',
                  row.isFitExpired && 'Fitness Expired',
                  row.isPucExpired && 'PUC Expired',
                  row.isMaintDue && 'Odometer Service Overdue'
                ].filter(Boolean).join(', ')
              }`}
            />
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            leftIcon={Eye}
            onClick={() => navigate(`/vehicles/${row.id}`)}
            className="p-1.5"
            title="View Details"
          />
          <Button
            variant="outline"
            size="sm"
            leftIcon={Edit}
            onClick={() => navigate(`/vehicles/${row.id}/edit`)}
            className="p-1.5"
            title="Edit Asset"
          />
          <Button
            variant="outline"
            size="sm"
            leftIcon={Trash2}
            onClick={() => setDeleteTargetId(row.id)}
            className="p-1.5 hover:text-danger"
            title="Archive Asset"
          />
        </div>
      )
    }
  ];

  // Filters setup: Status, Vehicle Type, Fuel Type, Region, Manufacturer
  const filterConfigs = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'Available', label: 'Available' },
        { value: 'On Trip', label: 'On Trip' },
        { value: 'Maintenance', label: 'Maintenance' },
        { value: 'Retired', label: 'Retired' }
      ]
    },
    {
      key: 'type',
      label: 'Vehicle Type',
      options: [
        { value: 'Heavy Truck', label: 'Heavy Truck' },
        { value: 'Box Truck', label: 'Box Truck' },
        { value: 'Light Cargo', label: 'Light Cargo' }
      ]
    },
    {
      key: 'fuelType',
      label: 'Fuel Type',
      options: [
        { value: 'Diesel', label: 'Diesel' },
        { value: 'Gasoline', label: 'Gasoline' }
      ]
    },
    {
      key: 'region',
      label: 'Region',
      options: [
        { value: 'North Region', label: 'North Region' },
        { value: 'South Region', label: 'South Region' },
        { value: 'East Region', label: 'East Region' },
        { value: 'West Region', label: 'West Region' }
      ]
    },
    {
      key: 'make',
      label: 'Manufacturer',
      options: [
        { value: 'Volvo', label: 'Volvo' },
        { value: 'Mercedes-Benz', label: 'Mercedes-Benz' },
        { value: 'Scania', label: 'Scania' },
        { value: 'Isuzu', label: 'Isuzu' },
        { value: 'Ford', label: 'Ford' }
      ]
    }
  ];

  const sortFields = [
    { value: 'plateNumber', label: 'Registration' },
    { value: 'carrierCap', label: 'Capacity' },
    { value: 'year', label: 'Purchase Year' },
    { value: 'fuelLevel', label: 'Fuel Level' },
    { value: 'odometer', label: 'Odometer' },
    { value: 'insuranceExpiry', label: 'Insurance' }
  ];

  const renderBulkActions = (ids, clearSelection) => (
    <Button
      variant="danger"
      size="sm"
      onClick={() => {
        alert(`Dispatched Bulk Action for: ${ids.join(', ')}`);
        clearSelection();
      }}
    >
      Cancel Selection
    </Button>
  );

  return (
    <PageContainer>
      
      {/* Header */}
      <PageHeader
        title="Vehicle Registry Inventory"
        subtitle="Manage fleet database, track compliance warnings and print report indices"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={ArrowLeft}
              onClick={() => navigate('/vehicles')}
              className="text-xs"
            >
              Back to Fleet Dashboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={Download}
              onClick={handleExportCSV}
              className="text-xs"
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={RefreshCw}
              onClick={fetchRegistryData}
              className="text-xs"
            >
              Refresh
            </Button>
          </div>
        }
      />

      {/* Grid Table Container */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={mappedVehicles}
          isLoading={isLoading}
          filterConfigs={filterConfigs}
          sortFields={sortFields}
          searchPlaceholder="Search plate, manufacturer, models, VIN or driver..."
          bulkActions={renderBulkActions}
        />
      </div>

      {/* Archive Modal Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
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

export default VehiclesRegistry;
export { VehiclesRegistry };
