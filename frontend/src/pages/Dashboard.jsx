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

    // Fetch Orders on Mount
    useEffect(() => {
        fetchOrders();
    });

    const fetchOrders = async () => {
        try {
            // Calls the endpoint I built earlier: ShopOwnerOrderListView
            const response = await api.get("orders/manage/");
            const data = response.data;
            setOrders(data);
            calculateStats(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate Dashboard Stats on Frontend
    const calculateStats = (data) => {
        const totalOrders = data.length;

        const pending = data.filter(
            (o) => o.status === "PENDING" || o.status === "PREPARING"
        ).length;

        const revenue = data.reduce(
            (acc, curr) => acc + Number(curr.total_price),
            0
        );

        setStats({ totalOrders, pending, revenue });
    };

    // Handle Status Updates
    const updateStatus = async (orderId, newStatus) => {
        try {
        // Optimistic UI Update (Update UI before waiting for server)
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

        // Call Backend
        await api.patch(`orders/manage/${orderId}/`, { status: newStatus });
        
        // Refresh stats after update
        // We re-fetch to ensure data consistency or re-calculate based on new state
        fetchOrders(); 

        } catch (error) {
        console.error("Update failed", error);
        // Revert if failed (optional complexity for later)
        alert("Failed to update status");
        }
    };

    if (loading) {
        return <div className="loading">Loading Dashboard...</div>;
    }

return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
            <h1>Shop Command Center</h1>
            <p>Manage your orders and menu efficiently.</p>
        </div>
        <button className="btn-primary" onClick={fetchOrders}>Refresh Data 🔄</button>
      </div>

      {/* Stats Cards Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-number">{stats.totalOrders}</p>
          <span className="stat-trend">↗ All time</span>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p className="stat-number">{stats.pending}</p>
          <span className="stat-trend warning">Needs Attention</span>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">${stats.revenue.toFixed(2)}</p>
          <span className="stat-trend success">↗ Earnings</span>
        </div>
      </div>

      {/* Orders Table Section */}
      <div className="table-container">
        <div className="table-header">
            <h2>Recent Orders</h2>
        </div>
        
        <div className="table-wrapper">
            <table className="orders-table">
            <thead>
                <tr>
                <th>Order ID</th>
                <th>Time</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {orders.length > 0 ? (
                    orders.map((order) => (
                    <tr key={order.id}>
                        <td className="order-id">#{order.id}</td>
                        <td className="order-date">{new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                        <td>{order.student_name || "Student"}</td>
                        <td>
                            <div className="item-list">
                                {order.items && order.items.map((item, idx) => (
                                    <span key={idx}>{item.quantity}x {item.menu_item_name}</span>
                                ))}
                            </div>
                        </td>
                        <td className="order-total">${order.total_price}</td>
                        <td>
                            <span className={`status-badge ${order.status.toLowerCase()}`}>
                                {order.status}
                            </span>
                        </td>
                        <td>
                            <div className="action-buttons">
                                {order.status === "PENDING" && (
                                    <button 
                                        className="btn-action ready"
                                        onClick={() => updateStatus(order.id, "READY")}
                                    >
                                        Mark Ready
                                    </button>
                                )}
                                {order.status === "READY" && (
                                    <button 
                                        className="btn-action complete"
                                        onClick={() => updateStatus(order.id, "COMPLETED")}
                                    >
                                        Complete
                                    </button>
                                )}
                                {order.status === "COMPLETED" && (
                                    <span className="text-muted">Done</span>
                                )}
                            </div>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" style={{textAlign: "center", padding: "2rem"}}>
                            No orders found. Time to relax! ☕
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;