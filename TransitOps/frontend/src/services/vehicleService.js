import { mockVehicles } from '../data/vehicles';

let vehicles = [...mockVehicles];

export const vehicleService = {
  // Returns all non-archived active vehicles
  getAll: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(vehicles.filter(v => !v.archived));
      }, 400);
    });
  },

  // Returns all soft-archived/retired vehicles
  getArchived: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(vehicles.filter(v => v.archived));
      }, 300);
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const item = vehicles.find((v) => v.id === id);
        if (item) resolve({ ...item });
        else reject(new Error("Vehicle not found"));
      }, 250);
    });
  },

  create: (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const nextId = `V${String(vehicles.length + 1).padStart(3, '0')}`;
        const newVehicle = {
          id: nextId,
          archived: false,
          odometer: Number(data.odometer) || 0,
          fuelLevel: Number(data.fuelLevel) || 100,
          status: 'Available',
          ...data
        };
        vehicles.push(newVehicle);
        resolve({ ...newVehicle });
      }, 400);
    });
  },

  update: (id, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = vehicles.findIndex((v) => v.id === id);
        if (index !== -1) {
          vehicles[index] = { ...vehicles[index], ...data };
          resolve({ ...vehicles[index] });
        } else {
          reject(new Error("Vehicle not found"));
        }
      }, 400);
    });
  },

  // Soft-archive toggle
  delete: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = vehicles.findIndex((v) => v.id === id);
        if (index !== -1) {
          vehicles[index] = {
            ...vehicles[index],
            archived: true,
            status: 'Retired'
          };
          resolve({ success: true, id });
        } else {
          reject(new Error("Vehicle not found"));
        }
      }, 300);
    });
  },

  // Restore archived asset
  restore: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = vehicles.findIndex((v) => v.id === id);
        if (index !== -1) {
          vehicles[index] = {
            ...vehicles[index],
            archived: false,
            status: 'Available'
          };
          resolve({ success: true, id });
        } else {
          reject(new Error("Vehicle not found"));
        }
      }, 300);
    });
  }
};

export default vehicleService;
