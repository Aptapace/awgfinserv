import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignInPage from './Components/SigninpageComponent';
import HomePageComponent from './Components/HomePageComponent';
import Dashboard from './Components/DashboardComponent';
import CurrentPlansComponent from './Components/PlansComponents/CurrentPlansComponent';
import AddPlansComponent from './Components/PlansComponents/AddPlansComponent';
import DeletePlansComponent from './Components/PlansComponents/Deleteplanscomponent';
import InvestmentsComponent from './Components/InvestmentsComponent';
import MonthlyReturns from './Components/MonthlyreturnsComponent';
import AddBankcomponent from './Components/AddBankComponent';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route path="/home" element={<HomePageComponent />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="plans/current" element={<CurrentPlansComponent />} />
        <Route path="plans/add" element={<AddPlansComponent />} />
        <Route path="plans/delete" element={<DeletePlansComponent />} />
        <Route path="investments" element={<InvestmentsComponent />} />
        <Route path="monthlyreturns" element={<MonthlyReturns />} />
        <Route path="AddBank" element={<AddBankcomponent />} />
      </Route>
    </Routes>
  );
};

export default App;
