import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Check, AlertTriangle, Trash2 } from 'lucide-react';

// Import Reusable Design System components
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import FileUpload from '../../components/ui/FileUpload';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import showToast from '../../components/ui/Toast';

// Import Mock Services
import { vehicleService } from '../../services/vehicleService';

const VehicleDocuments = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Component states
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [attachmentsList, setAttachmentsList] = useState([]);

  const fetchVehicle = async () => {
    setIsLoading(true);
    try {
      const data = await vehicleService.getById(id);
      setVehicle(data);
      // Map initial default document objects
      setAttachmentsList([
        {
          key: 'registration',
          name: 'Registration Certificate.pdf',
          type: 'Registration',
          expiry: data.registrationExpiry,
          size: '1.2 MB',
          uploaded: true
        },
        {
          key: 'insurance',
          name: 'Insurance Policy Declaration.pdf',
          type: 'Insurance',
          expiry: data.insuranceExpiry,
          size: '850 KB',
          uploaded: true
        },
        {
          key: 'fitness',
          name: 'Safety Fitness Certificate.pdf',
          type: 'Fitness Certificate',
          expiry: data.fitnessExpiry,
          size: '420 KB',
          uploaded: true
        },
        {
          key: 'puc',
          name: 'Pollution Under Control (PUC).pdf',
          type: 'PUC Certificate',
          expiry: data.pucExpiry,
          size: '310 KB',
          uploaded: true
        }
      ]);
    } catch (err) {
      showToast.error("Failed to load document index.");
      navigate(`/vehicles/${id}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  // Handle uploading files and update visual states
  const handleUploadComplete = (file) => {
    if (!file) return;
    
    showToast.success(`Uploaded ${file.name} successfully.`);
    // Simulate adding to grid list
    const newDoc = {
      key: `custom-${Date.now()}`,
      name: file.name,
      type: 'Additional Document',
      expiry: 'No Expiry',
      size: `${(file.size / 1024).toFixed(1)} KB`,
      uploaded: true
    };
    setAttachmentsList(prev => [...prev, newDoc]);
  };

  const handleRemove = (key, name) => {
    setAttachmentsList(prev => prev.filter(d => d.key !== key));
    showToast.success(`Removed document ${name}.`);
  };

  // Mock download trigger
  const handleDownload = (name) => {
    showToast.success(`Downloading ${name}...`);
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
        title={`Documents: ${vehicle.plateNumber}`}
        subtitle={`Compliance certificates, PUC checks and Insurance policy files for ${vehicle.make} ${vehicle.model}`}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left lists: Document list cards */}
        <div className="lg:col-span-2 space-y-4">
          <Card title="Compliance Certificates Index" subtitle="Regulatory and safety filings log">
            <div className="space-y-4">
              {attachmentsList.map((doc) => {
                const isExpired = doc.expiry !== 'No Expiry' && new Date(doc.expiry) < new Date();
                
                return (
                  <div
                    key={doc.key}
                    className={`
                      p-4 bg-hover/10 border rounded-xl flex flex-col sm:flex-row justify-between gap-4 transition-all hover:border-hover
                      ${isExpired ? 'border-danger/30 bg-danger/5' : 'border-border'}
                    `}
                  >
                    <div className="flex gap-3 items-start">
                      <div className="p-2.5 bg-hover rounded-lg text-text-secondary">
                        <FileText size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-bold text-text-main leading-tight">{doc.name}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-wider font-semibold text-text-secondary">
                          <span>Category: <strong className="text-text-main">{doc.type}</strong></span>
                          <span>Size: {doc.size}</span>
                        </div>
                        {doc.expiry !== 'No Expiry' && (
                          <div className="flex items-center gap-1.5 text-xs font-semibold">
                            <span className="text-text-secondary">Expires:</span>
                            <span className={isExpired ? 'text-danger font-bold' : 'text-text-main'}>
                              {doc.expiry}
                            </span>
                            {isExpired && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-danger/10 text-danger rounded text-[9px] font-bold uppercase tracking-wider">
                                <AlertTriangle size={10} /> Expired
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col justify-end gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={Download}
                        onClick={() => handleDownload(doc.name)}
                        className="text-[11px] h-8"
                      >
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={Trash2}
                        onClick={() => handleRemove(doc.key, doc.name)}
                        className="text-[11px] h-8 hover:text-danger border-transparent"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
              {attachmentsList.length === 0 && (
                <div className="p-8 text-center text-xs font-semibold text-text-secondary">No documents uploaded.</div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Upload Panel */}
        <div className="space-y-6">
          <Card title="Upload Document Attachment" subtitle="Upload PUC, registration, or policy pdf revisions">
            <FileUpload
              onFileSelect={handleUploadComplete}
              accept=".pdf,.png,.jpg,.jpeg"
              maxSizeMB={5}
            />
          </Card>

          <Card title="Compliance Checklist Check" subtitle="Documentation legal validation">
            <div className="space-y-3.5">
              <div className="flex gap-2.5 items-center text-xs font-semibold text-text-main">
                <Check size={16} className="text-success" />
                <span>Registration Certificate Verified</span>
              </div>
              <div className="flex gap-2.5 items-center text-xs font-semibold text-text-main">
                <Check size={16} className="text-success" />
                <span>Standard Road Insurance policy uploaded</span>
              </div>
              <div className="flex gap-2.5 items-center text-xs font-semibold text-text-main">
                <AlertTriangle size={16} className="text-warning" />
                <span>Pollution check and fitness require annual renewal review</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default VehicleDocuments;
export { VehicleDocuments };
