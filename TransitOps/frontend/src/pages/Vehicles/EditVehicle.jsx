import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

// Import Reusable Design System components
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import DatePicker from '../../components/ui/DatePicker';
import Form, { FormGrid, FormField } from '../../components/ui/Form';
import ImageUpload from '../../components/ui/ImageUpload';
import showToast from '../../components/ui/Toast';
import Loader from '../../components/ui/Loader';

// Import Mock Services
import { vehicleService } from '../../services/vehicleService';

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Loaders and data states
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [existingPlates, setExistingPlates] = useState([]);
  const [existingVins, setExistingVins] = useState([]);

  // Fetch target vehicle and other active plates/vins
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [target, all] = await Promise.all([
          vehicleService.getById(id),
          vehicleService.getAll()
        ]);
        setFormData(target);
        // Exclude current vehicle in checks
        setExistingPlates(
          all
            .filter(v => v.id !== id)
            .map(v => v.plateNumber.toLowerCase().trim())
        );
        setExistingVins(
          all
            .filter(v => v.id !== id)
            .map(v => v.vin?.toLowerCase().trim())
            .filter(Boolean)
        );
      } catch (err) {
        showToast.error("Could not locate vehicle asset.");
        navigate('/vehicles/registry');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const plate = formData.plateNumber.trim().toLowerCase();
    const vinStr = formData.vin.trim().toLowerCase();

    // 1. Uniqueness check against other vehicles
    if (!formData.plateNumber.trim()) {
      errors.plateNumber = "Registration plate number is mandatory.";
    } else if (existingPlates.includes(plate)) {
      errors.plateNumber = "Business Rule Violation: Registration number must be unique!";
    }

    if (!formData.vin.trim()) {
      errors.vin = "VIN number is mandatory.";
    } else if (existingVins.includes(vinStr)) {
      errors.vin = "Business Rule Violation: VIN must be unique!";
    }

    if (!formData.make.trim()) errors.make = "Manufacturer brand is mandatory.";
    if (!formData.model.trim()) errors.model = "Vehicle model code is mandatory.";

    // 2. Capacity positive check
    const capNum = Number(formData.carrierCap);
    if (!formData.carrierCap) {
      errors.carrierCap = "Tonnage capacity is required.";
    } else if (isNaN(capNum) || capNum <= 0) {
      errors.carrierCap = "Business Rule Violation: Carrier capacity must be a positive number!";
    }

    // 3. Purchase Cost positive
    const costNum = Number(formData.purchaseCost);
    if (!formData.purchaseCost) {
      errors.purchaseCost = "Purchase cost is required.";
    } else if (isNaN(costNum) || costNum <= 0) {
      errors.purchaseCost = "Cost must be a positive amount.";
    }

    // 4. Odometer positive
    const odoNum = Number(formData.odometer);
    if (!formData.odometer) {
      errors.odometer = "Odometer mileage is required.";
    } else if (isNaN(odoNum) || odoNum < 0) {
      errors.odometer = "Odometer mileage must be positive.";
    }

    // 5. Year validation
    const yearNum = Number(formData.year);
    const maxYear = new Date().getFullYear() + 1;
    if (!formData.year) {
      errors.year = "Manufacturing year is required.";
    } else if (isNaN(yearNum) || yearNum < 1960 || yearNum > maxYear) {
      errors.year = `Enter a valid manufacturing year between 1960 and ${maxYear}.`;
    }

    // 6. Purchase Date cannot be future
    if (!formData.purchaseDate) {
      errors.purchaseDate = "Purchase date is required.";
    } else {
      const pDate = new Date(formData.purchaseDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (pDate > today) {
        errors.purchaseDate = "Business Rule Violation: Purchase date cannot be in the future!";
      }
    }

    // 7. Compliance dates validation
    if (!formData.insuranceExpiry) errors.insuranceExpiry = "Insurance expiry date is required.";
    if (!formData.fitnessExpiry) errors.fitnessExpiry = "Fitness safety expiry date is required.";
    if (!formData.pucExpiry) errors.pucExpiry = "PUC emission expiry date is required.";

    if (!formData.insuranceNumber.trim()) errors.insuranceNumber = "Insurance policy number is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast.error("Form validation failed. Please check business rules constraints.");
      return;
    }

    setIsSaving(true);
    try {
      await vehicleService.update(id, formData);
      showToast.success("Vehicle parameters updated successfully.");
      navigate(`/vehicles/${id}`);
    } catch (err) {
      showToast.error("Could not update vehicle registry.");
    } finally {
      setIsSaving(false);
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
    <PageContainer>
      
      {/* Header back navigation */}
      <PageHeader
        title={`Edit Vehicle Asset: ${formData.plateNumber}`}
        subtitle={`Update configuration and parameters for ${formData.make} ${formData.model}`}
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={ArrowLeft}
            onClick={() => navigate(`/vehicles/${id}`)}
            className="text-xs"
          >
            Back to Details
          </Button>
        }
      />

      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form parameters fields */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Asset Primary Parameters" subtitle="Specify identifiers, brand name, types, and capacities">
              <FormGrid cols={2}>
                <FormField>
                  <Input
                    label="Registration Plate Number"
                    name="plateNumber"
                    value={formData.plateNumber}
                    onChange={handleChange}
                    error={formErrors.plateNumber}
                    required
                  />
                </FormField>
                <FormField>
                  <Input
                    label="VIN (Vehicle Identification Number)"
                    name="vin"
                    value={formData.vin}
                    onChange={handleChange}
                    error={formErrors.vin}
                    required
                  />
                </FormField>
                <FormField>
                  <Select
                    label="Vehicle Type"
                    value={formData.type}
                    onChange={(val) => handleSelectChange('type', val)}
                    options={[
                      { value: 'Heavy Truck', label: 'Heavy Truck (Semi/Trailer)' },
                      { value: 'Box Truck', label: 'Box Truck (Medium Cargo)' },
                      { value: 'Light Cargo', label: 'Light Cargo (Van/Pickup)' }
                    ]}
                  />
                </FormField>
                <FormField>
                  <Input
                    label="Manufacturer Brand"
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    error={formErrors.make}
                    required
                  />
                </FormField>
                <FormField>
                  <Input
                    label="Model Code"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    error={formErrors.model}
                    required
                  />
                </FormField>
                <FormField>
                  <Input
                    label="Manufacturing Year"
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleChange}
                    error={formErrors.year}
                    required
                  />
                </FormField>
                <FormField>
                  <Input
                    label="Tonnage Capacity (Tons)"
                    name="carrierCap"
                    type="number"
                    value={formData.carrierCap}
                    onChange={handleChange}
                    error={formErrors.carrierCap}
                    required
                  />
                </FormField>
              </FormGrid>
            </Card>

            <Card title="Acquisitions & Mileage" subtitle="Odometer, purchase dates, costs, and fueling parameters">
              <FormGrid cols={2}>
                <FormField>
                  <Input
                    label="Purchase Price ($)"
                    name="purchaseCost"
                    type="number"
                    value={formData.purchaseCost}
                    onChange={handleChange}
                    error={formErrors.purchaseCost}
                    isCurrency
                    required
                  />
                </FormField>
                <FormField>
                  <DatePicker
                    label="Acquisition/Purchase Date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    error={formErrors.purchaseDate}
                    required
                  />
                </FormField>
                <FormField>
                  <Input
                    label="Current Odometer (km)"
                    name="odometer"
                    type="number"
                    value={formData.odometer}
                    onChange={handleChange}
                    error={formErrors.odometer}
                    required
                  />
                </FormField>
                <FormField>
                  <Select
                    label="Fuel Type"
                    value={formData.fuelType}
                    onChange={(val) => handleSelectChange('fuelType', val)}
                    options={[
                      { value: 'Diesel', label: 'Diesel' },
                      { value: 'Gasoline', label: 'Gasoline' }
                    ]}
                  />
                </FormField>
              </FormGrid>
            </Card>

            <Card title="Insurance & Certifications Compliance" subtitle="Ensure vehicle registration safety bounds">
              <FormGrid cols={2}>
                <FormField>
                  <Input
                    label="Insurance Policy Number"
                    name="insuranceNumber"
                    value={formData.insuranceNumber}
                    onChange={handleChange}
                    error={formErrors.insuranceNumber}
                    required
                  />
                </FormField>
                <FormField>
                  <DatePicker
                    label="Insurance Expiry Date"
                    name="insuranceExpiry"
                    value={formData.insuranceExpiry}
                    onChange={handleChange}
                    error={formErrors.insuranceExpiry}
                    required
                  />
                </FormField>
                <FormField>
                  <DatePicker
                    label="Fitness Certificate Expiry"
                    name="fitnessExpiry"
                    value={formData.fitnessExpiry}
                    onChange={handleChange}
                    error={formErrors.fitnessExpiry}
                    required
                  />
                </FormField>
                <FormField>
                  <DatePicker
                    label="PUC Emission Expiry Date"
                    name="pucExpiry"
                    value={formData.pucExpiry}
                    onChange={handleChange}
                    error={formErrors.pucExpiry}
                    required
                  />
                </FormField>
              </FormGrid>
            </Card>
          </div>

          {/* Side Panels */}
          <div className="space-y-6">
            <Card title="Vehicle Photo" subtitle="Provide vehicle display image">
              <ImageUpload
                onImageSelect={(file) => console.log('File picked: ', file)}
                className="py-4"
              />
            </Card>

            <Card title="Operating Region & Notes" subtitle="Assign area tags and logs notes">
              <div className="space-y-4">
                <FormField>
                  <Select
                    label="Operating Region"
                    value={formData.region}
                    onChange={(val) => handleSelectChange('region', val)}
                    options={[
                      { value: 'North Region', label: 'North Region' },
                      { value: 'South Region', label: 'South Region' },
                      { value: 'East Region', label: 'East Region' },
                      { value: 'West Region', label: 'West Region' }
                    ]}
                  />
                </FormField>
                <FormField>
                  <Select
                    label="Asset Status State"
                    value={formData.status}
                    onChange={(val) => handleSelectChange('status', val)}
                    options={[
                      { value: 'Available', label: 'Available' },
                      { value: 'On Trip', label: 'On Trip (Dispatch active)' },
                      { value: 'Maintenance', label: 'Maintenance (Repair bay)' },
                      { value: 'Retired', label: 'Retired (Retired asset)' }
                    ]}
                  />
                </FormField>
                <FormField>
                  <Textarea
                    label="Operational Notes"
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    rows={3}
                  />
                </FormField>
              </div>
            </Card>

            {/* Save trigger panel */}
            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/vehicles/${id}`)}
                disabled={isSaving}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                isLoading={isSaving}
                leftIcon={Save}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </PageContainer>
  );
};

export default EditVehicle;
export { EditVehicle };
