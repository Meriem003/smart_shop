import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, Table, Loading, Alert } from '../components/common';
import { customerService, productService, orderService } from '../services';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../utils/constants';

const LOW_STOCK_THRESHOLD = 10;
const CRITICAL_STOCK_THRESHOLD = 5;
const REFRESH_INTERVAL = 30000;

const StatCard = ({ title, value, icon, color, loading }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
      <div className={`${colorClasses[color]} p-3 rounded-lg mr-4`}>
        <span className="text-white text-2xl">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {loading ? (
          <div className="h-8 w-20 bg-gray-200 animate-pulse rounded mt-1" />
        ) : (
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['blue', 'green', 'orange', 'purple']).isRequired,
  loading: PropTypes.bool,
};

const StatusBadge = ({ status }) => {
  const statusColors = {
    [ORDER_STATUS.PENDING]: 'bg-orange-100 text-orange-800',
    [ORDER_STATUS.CONFIRMED]: 'bg-green-100 text-green-800',
    [ORDER_STATUS.CANCELED]: 'bg-red-100 text-red-800',
    [ORDER_STATUS.REJECTED]: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {ORDER_STATUS_LABELS[status] || status}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

const StockIndicator = ({ stock }) => {
  const isCritical = stock < CRITICAL_STOCK_THRESHOLD;
  const isLow = stock < LOW_STOCK_THRESHOLD;

  const getStockColorClass = () => {
    if (isCritical) return 'text-red-600';
    if (isLow) return 'text-orange-600';
    return 'text-gray-900';
  };

  return (
    <span className={`font-medium ${getStockColorClass()}`}>
      {stock}
      {isCritical && (
        <span className="ml-2 text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full">
          Critique
        </span>
      )}
    </span>
  );
};

StockIndicator.propTypes = {
  stock: PropTypes.number.isRequired,
};

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    monthlyRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);

      // Récupérer les données en parallèle
      const [customersRes, productsRes, pendingOrdersRes, allOrdersRes, lowStockRes] = await Promise.all([
        customerService.getAll({ page: 0, size: 1 }),
        productService.getAll({ page: 0, size: 1 }),
        orderService.getAll({ page: 0, size: 1, status: ORDER_STATUS.PENDING }),
        orderService.getAll({ page: 0, size: 100, status: ORDER_STATUS.CONFIRMED }),
        productService.getAll({ page: 0, size: 100 }),
      ]);

      // Récupérer les dernières commandes
      const recentOrdersRes = await orderService.getAll({ page: 0, size: 5 });

      // Calculer le CA du mois
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const confirmedOrders = allOrdersRes.content || allOrdersRes || [];
      const monthlyRevenue = confirmedOrders
        .filter((order) => {
          const orderDate = new Date(order.date || order.dateCommande);
          return orderDate >= startOfMonth;
        })
        .reduce((total, order) => total + (order.totalTTC || order.total || 0), 0);

      // Filtrer les produits en faible stock
      const allProducts = lowStockRes.content || lowStockRes || [];
      const lowStock = allProducts
        .filter((product) => product.stock < LOW_STOCK_THRESHOLD)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5);

      setStats({
        totalCustomers: customersRes.totalElements || (customersRes.content?.length ?? 0),
        totalProducts: productsRes.totalElements || (productsRes.content?.length ?? 0),
        pendingOrders: pendingOrdersRes.totalElements || (pendingOrdersRes.content?.length ?? 0),
        monthlyRevenue,
      });

      setRecentOrders(recentOrdersRes.content || recentOrdersRes || []);
      setLowStockProducts(lowStock);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du tableau de bord');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    // Rafraîchissement automatique toutes les 30 secondes
    const interval = setInterval(fetchDashboardData, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const orderColumns = [
    { key: 'id', label: 'ID', render: (value) => `#${value}` },
    { key: 'client', label: 'Client', render: (_, row) => row.client?.nom || row.clientNom || '-' },
    { key: 'date', label: 'Date', render: (value, row) => formatDate(value || row.dateCommande) },
    { key: 'totalTTC', label: 'Total TTC', render: (value, row) => formatCurrency(value || row.total) },
    { key: 'statut', label: 'Statut', render: (value) => <StatusBadge status={value} /> },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <Loading size="large" text="Chargement du tableau de bord..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Titre */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Tableau de bord - SmartShop Administration
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Vue d&apos;ensemble de l&apos;activité • Actualisation automatique
        </p>
      </div>

      {/* Erreur */}
      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Section Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clients"
          value={stats.totalCustomers}
          icon="👥"
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Total Produits"
          value={stats.totalProducts}
          icon="📦"
          color="green"
          loading={loading}
        />
        <StatCard
          title="Commandes en attente"
          value={stats.pendingOrders}
          icon="⏳"
          color="orange"
          loading={loading}
        />
        <StatCard
          title="CA du mois"
          value={formatCurrency(stats.monthlyRevenue)}
          icon="💰"
          color="purple"
          loading={loading}
        />
      </div>

      {/* Section Activités récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dernières commandes */}
        <Card
          title="Dernières commandes"
          footer={
            <Link
              to="/orders"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Voir toutes les commandes →
            </Link>
          }
        >
          <Table
            columns={orderColumns}
            data={recentOrders}
            emptyMessage="Aucune commande récente"
          />
        </Card>

        {/* Produits en faible stock */}
        <Card
          title="Produits en faible stock"
          footer={
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Voir tous les produits →
            </Link>
          }
        >
          {lowStockProducts.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl">✅</span>
              <p className="mt-2 text-gray-500">Tous les stocks sont suffisants</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {lowStockProducts.map((product) => (
                <li key={product.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{product.nom}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(product.prix)}</p>
                  </div>
                  <StockIndicator stock={product.stock} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
