import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Undo2 } from 'lucide-react';

// Import Reusable Design System components
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Table, { TableHeader, TableBody, TableRow, TableCell, TableHeadCell } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import showToast from '../../components/ui/Toast';

// Import Mock Services
import { vehicleService } from '../../services/vehicleService';

const ArchivedVehicles = () => {
  const navigate = useNavigate();

  // Data states
  const [archivedList, setArchivedList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRestoring, setIsRestoring] = useState(false);

  const fetchArchived = async () => {
    setIsLoading(true);
    try {
      const data = await vehicleService.getArchived();
      setArchivedList(data);
    } catch (err) {
      showToast.error("Failed to load archived vehicles.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArchived();
  }, []);

  const handleRestore = async (id) => {
    setIsRestoring(true);
    try {
      await vehicleService.restore(id);
      showToast.success("Vehicle restored to active registry.");
      fetchArchived(); // Refresh archived list
    } catch (err) {
      showToast.error("Failed to restore vehicle asset.");
    } finally {
      setIsRestoring(false);
    }
  };

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
        title="Archived & Retired Vehicles"
        subtitle="Review decomissioned assets or restore them back to the active fleet"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={ArrowLeft}
              onClick={() => navigate('/vehicles/registry')}
              className="text-xs"
            >
              Registry Table
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={RefreshCw}
              onClick={fetchArchived}
              className="text-xs"
            >
              Refresh
            </Button>
          </div>
        }
      />

      <Card title="Archived Assets Folder" subtitle="Decommissioned vehicle records" bodyClassName="p-0">
        {archivedList.length === 0 ? (
          <div className="p-8 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">No archived vehicles found</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHeadCell>Reg Plate</TableHeadCell>
                  <TableHeadCell>Vehicle Name</TableHeadCell>
                  <TableHeadCell>Type</TableHeadCell>
                  <TableHeadCell>VIN</TableHeadCell>
                  <TableHeadCell>Purchase Cost</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>Actions</TableHeadCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archivedList.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-bold text-text-main">{row.plateNumber}</TableCell>
                    <TableCell className="font-bold text-text-main">{row.make} {row.model}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell className="font-mono text-xs text-text-secondary">{row.vin}</TableCell>
                    <TableCell>${row.purchaseCost?.toLocaleString()}</TableCell>
                    <TableCell><Badge status={row.status} /></TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={Undo2}
                        onClick={() => handleRestore(row.id)}
                        disabled={isRestoring}
                        className="text-[10px] py-1 px-2.5 rounded font-bold hover:text-success border-transparent"
                      >
                        Restore Asset
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </PageContainer>
  );
};

export default ArchivedVehicles;
export { ArchivedVehicles };
