import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/Login/Login";
import Dashboard from './components/Dashboard/Dashboard';
import TeachersTable from './components/Teachers/TeachersTable';
import PupilsTable from './components/Pupils/PupilsTable';
import SubjectsTable from './components/Subjects/SubjectsTable';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace={true} />}
        ></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="teachers" replace />} />
          <Route path='teachers' element={<TeachersTable />} />
          <Route path='pupils' element={<PupilsTable />} />
          <Route path='subjects' element={<SubjectsTable />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

