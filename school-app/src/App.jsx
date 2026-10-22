import { useState } from 'react'
import './App.css'
import LayoutBase from './layouts/layoutBase';
import Students from './modules/students/pages';
import Teachers from './modules/teachers/pages';
import Dashboard from './modules/dashboard/pages';
import { Route, Routes } from 'react-router-dom';
import StudenDetailsPage from './modules/students/pages/StudenDetailsPage';

function App() {


  return (


    <Routes>
      {/* La ruta padre "/" usa el Layout */}
      <Route path="/" element={<LayoutBase />}>
        {/* Ruta índice: lo que se ve en "/" (Dashboard) */}
        <Route index element={<Dashboard />} />

        {/* Rutas hijas */}
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<StudenDetailsPage />} />
        <Route path="teachers" element={<Teachers />} />
      </Route>
    </Routes>


  )
}

export default App
