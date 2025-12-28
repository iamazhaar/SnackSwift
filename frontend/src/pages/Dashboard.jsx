import { useState, useEffect } from 'react';
import api from '../services/api';
import './Dashboard.css';



const Dashboard = () => {

    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        totalOrders: 0,
        pending: 0,
        revenue: 0,
    });
    const [loading, setLoading] = useState(true);

    if (loading) {
        return <div className="loading">Loading Dashboard...</div>;
    }

    return (
        <div className='dashboard-container'>
            <h1>Dashboard</h1>
            <p>Orders: { orders.length }</p>
        </div>
    );
}

export default Dashboard;