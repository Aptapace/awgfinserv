import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignInPage from './Components/SigninpageComponent';
import HomePageComponent from './Components/HomePageComponent';
import ProfileSettings from './Components/ProfileComponent';
import Withdrawn from './Components/HistoryComponent.js';
import PlansDisplay from './Components/PlansComponent';
import PlanDetailPage from './Components/PlanDetailsComponent';
import { CalculationProvider } from './Components/CalculatorContext';
import PaymentsPageComponent from './Components/PaymentspageComponent';
import FinalPaymentPage from './Components/FinalPaymentComponent.js';
import InvestedPlans from './Components/InvestmentsComponent.js';
import ReinvestScreen from './Components/WalletsComponent.js';
const App = () => {
  return (
    <CalculationProvider>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/home" element={<HomePageComponent />}>
          <Route path="investementplans" element={<InvestedPlans />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="withdrawn" element={<Withdrawn />} />  
          <Route path='plandisplay' element={<PlansDisplay/>}/>
          <Route path='plandetails' element={<PlanDetailPage/>}/>
          <Route path='paymentspage'element={<PaymentsPageComponent/>}/>
          <Route path='finalpayment' element={<FinalPaymentPage/>}/> 
          <Route path='wallets' element={<ReinvestScreen/>}/> 
        </Route>
      </Routes>
    </CalculationProvider>
  );
};

export default App;
