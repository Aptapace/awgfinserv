import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTachometerAlt } from 'react-icons/fa';
import './planscomponent.css';

export default function CurrentPlansComponent() {
  const hosturl = 'http://localhost:5000';
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${hosturl}/plans`);
        const plansData = response.data.map(plan => ({
          id: plan.planID,
          type: plan.name.split(' ')[0],
          minInvestment: plan.minAmount,
          roi: plan.interestRate,
          duration: plan.numberOfMonths
        }));
        setPlans(plansData);
      } catch (error) {
        console.error('Error retrieving plans:', error.message);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div style={{
      height: '550px', 
      overflowY: 'auto', 
      overflowX: 'hidden',
      width: '102%' 
    }}>
    <div className="background-container">
      <div className="heading-container">
        <div className="icon-container">
          <FaTachometerAlt className="icon" />
        </div>
        <h5 className="heading">Current Plans</h5>
      </div>

      <div className="currentplans-container">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Plan ID</th>
              <th>Plan Name</th>
              <th>Min Investment (INR)</th>
              <th>ROI</th>
              <th>Min Duration</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, index) => (
              <tr key={plan.id}>
                <td>{index + 1}</td>
                <td>{plan.id}</td>
                <td>{plan.type}</td>
                <td>{plan.minInvestment}</td>
                <td>{plan.roi}</td>
                <td>{plan.duration} months</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>

  );
}
