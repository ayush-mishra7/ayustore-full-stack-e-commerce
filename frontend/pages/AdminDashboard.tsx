import React from 'react';
import { Package, Users, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
         <span className="text-sm text-slate-500 dark:text-slate-400">Last updated: Just now</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: '$45,231', icon: <DollarSign size={24} />, color: 'bg-green-100 text-green-600' },
          { title: 'Total Orders', value: '356', icon: <ShoppingBag size={24} />, color: 'bg-blue-100 text-blue-600' },
          { title: 'Active Products', value: '86', icon: <Package size={24} />, color: 'bg-purple-100 text-purple-600' },
          { title: 'Registered Users', value: '2,405', icon: <Users size={24} />, color: 'bg-orange-100 text-orange-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.color} dark:bg-opacity-20`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Table Mockup */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Orders</h2>
          <button className="text-sm text-primary-600 font-medium hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {[
                { id: '#ORD-7752', user: 'Alex Morgan', status: 'Completed', amount: '$129.99', date: 'Oct 24, 2023' },
                { id: '#ORD-7751', user: 'Sarah Jones', status: 'Processing', amount: '$59.50', date: 'Oct 24, 2023' },
                { id: '#ORD-7750', user: 'Mike Chen', status: 'Shipped', amount: '$299.00', date: 'Oct 23, 2023' },
                { id: '#ORD-7749', user: 'Emily Davis', status: 'Pending', amount: '$85.20', date: 'Oct 23, 2023' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{row.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{row.user}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      row.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      row.status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      row.status === 'Shipped' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{row.amount}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

       {/* Quick Actions */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="flex items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-primary-500 hover:text-primary-600 transition-colors">
             <Plus className="mr-2" size={20} /> Add New Product
          </button>
          <button className="flex items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-primary-500 hover:text-primary-600 transition-colors">
             <TrendingUp className="mr-2" size={20} /> Generate Report
          </button>
          <button className="flex items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-primary-500 hover:text-primary-600 transition-colors">
             <Users className="mr-2" size={20} /> Manage Users
          </button>
       </div>
    </div>
  );
};

export default AdminDashboard;
import { Plus } from 'lucide-react';