import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import Dashboard from '../pages/Dashboard';

// Vehicles Module Pages
import FleetDashboard from '../pages/Vehicles/FleetDashboard';
import VehiclesRegistry from '../pages/Vehicles/VehiclesRegistry';
import AddVehicle from '../pages/Vehicles/AddVehicle';
import VehicleDetails from '../pages/Vehicles/VehicleDetails';
import EditVehicle from '../pages/Vehicles/EditVehicle';
import VehicleDocuments from '../pages/Vehicles/VehicleDocuments';
import VehicleTimeline from '../pages/Vehicles/VehicleTimeline';
import ArchivedVehicles from '../pages/Vehicles/ArchivedVehicles';

// Other Pages
import Drivers from '../pages/Drivers';
import AddDriver from '../pages/Drivers/AddDriver';
import Trips from '../pages/Trips';
import DispatchTrip from '../pages/Trips/DispatchTrip';
import Maintenance from '../pages/Maintenance';
import FuelLogs from '../pages/FuelLogs';
import Expenses from '../pages/Expenses';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'vehicles',
        children: [
          { index: true, element: <FleetDashboard /> },
          { path: 'registry', element: <VehiclesRegistry /> },
          { path: 'add', element: <AddVehicle /> },
          { path: ':id', element: <VehicleDetails /> },
          { path: ':id/edit', element: <EditVehicle /> },
          { path: ':id/documents', element: <VehicleDocuments /> },
          { path: ':id/timeline', element: <VehicleTimeline /> },
          { path: 'archived', element: <ArchivedVehicles /> }
        ]
      },
      {
        path: 'drivers',
        children: [
          { index: true, element: <Drivers /> },
          { path: 'add', element: <AddDriver /> }
        ]
      },
      {
        path: 'trips',
        children: [
          { index: true, element: <Trips /> },
          { path: 'dispatch', element: <DispatchTrip /> }
        ]
      },
      {
        path: 'maintenance',
        element: <Maintenance />
      },
      {
        path: 'fuel',
        element: <FuelLogs />
      },
      {
        path: 'expenses',
        element: <Expenses />
      },
      {
        path: 'reports',
        element: <Reports />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />
      }
    ]
  }
]);
export default router;
