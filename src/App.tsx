/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Splash from './screens/Splash';
import Login from './screens/Login';
import Register from './screens/Register';
import VerifyOTP from './screens/VerifyOTP';
import Dashboard from './screens/Dashboard';
import HarvestLog from './screens/HarvestLog';
import AddHarvest from './screens/AddHarvest';
import HoneyGrading from './screens/HoneyGrading';
import Profile from './screens/Profile';
import OfflineMode from './screens/OfflineMode';
import Reports from './screens/Reports';
import Error404 from './screens/Error404';
import Error500 from './screens/Error500';
import NoConnection from './screens/NoConnection';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/harvest-log" element={<HarvestLog />} />
        <Route path="/add-harvest" element={<AddHarvest />} />
        <Route path="/grading" element={<HoneyGrading />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/offline" element={<OfflineMode />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/error-404" element={<Error404 />} />
        <Route path="/error-500" element={<Error500 />} />
        <Route path="/no-connection" element={<NoConnection />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

