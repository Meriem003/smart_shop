import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout';
import { Card, Table, Button, Alert, Loading, Pagination } from '../../components/common';
import { customerService } from '../../services';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { LOYALTY_TIERS, LOYALTY_TIER_LABELS, ORDER_STATUS, ORDER_STATUS_LABELS } from '../../utils/constants';

const LoyaltyBadge = ({ level }) => {
  const badgeColors = {
    [LOYALTY_TIERS.BASIC]: 'bg-gray-100 text-gray-800',
    [LOYALTY_TIERS.SILVER]: 'bg-slate-200 text-slate-800',
    [LOYALTY_TIERS.GOLD]: 'bg-yellow-100 text-yellow-800',
    [LOYALTY_TIERS.PLATINUM]: 'bg-purple-100 text-purple-800',
  };

  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full ${badgeColors[level] || badgeColors[LOYALTY_TIERS.BASIC]}`}>
      {LOYALTY_TIER_LABELS[level] || level}
    </span>
  );
};

LoyaltyBadge.propTypes = {
  level: PropTypes.string.isRequired,
};

const OrderStatusBadge = ({ status }) => {
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

OrderStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 text-center">
    <div className="text-3xl mb-2">{icon}</div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500">{title}</p>
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string.isRequired,
};

const CustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderPage, setOrderPage] = useState(0);
  const [orderTotalPages, setOrderTotalPages] = useState(0);

  useEffect(() => {
    fetchCustomerData();
  }, [id]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [customerData, statsData, ordersData] = await Promise.all([
        customerService.getById(id),
        customerService.getStats(id).catch(() => null),
        customerService.getOrders(id).catch(() => []),
      ]);

      setCustomer(customerData);
      setStats(statsData);
      
      const ordersList = ordersData.content || ordersData || [];
      setOrders(ordersList);
      setOrderTotalPages(ordersData.totalPages || Math.ceil(ordersList.length / 5) || 1);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const orderColumns = [
    {
      key: 'id',
      label: 'ID',
      render: (value) => `#${value}`,
    },
    {
      key: 'date',
      label: 'Date',
      render: (value, row) => formatDate(value || row.dateCommande),
    },
    {
      key: 'totalTTC',
      label: 'Total TTC',
      render: (value, row) => formatCurrency(value || row.total),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (value) => <OrderStatusBadge status={value} />,
    },
  ];

  const paginatedOrders = orders.slice(orderPage * 5, (orderPage + 1) * 5);

  if (loading) {
    return (
      <div className="p-6">
        <Loading size="large" text="Chargement du client..." />
      </div>
    );
  }

  if (error && !customer) {
    return (
      <div className="p-6">
        <Alert type="error">{error}</Alert>
        <div className="mt-4">
          <Link to="/customers">
            <Button variant="secondary">Retour à la liste</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title={customer?.nom || 'Détails du client'}
        actions={
          <div className="flex gap-3">
            <Link to="/customers">
              <Button variant="secondary">Retour</Button>
            </Link>
            <Link to={`/customers/${id}/edit`}>
              <Button variant="primary">Modifier</Button>
            </Link>
          </div>
        }
      />

      {error && (
        <Alert type="error" onClose={() => setError(null)} className="mb-4">
          {error}
        </Alert>
      )}

      {/* Informations client */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Informations client" className="lg:col-span-1">
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nom</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">{customer?.nom}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-gray-900">{customer?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Niveau de fidélité</dt>
              <dd className="mt-2">
                <LoyaltyBadge level={customer?.niveauFidelite} />
              </dd>
            </div>
            {customer?.dateCreation && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Date de création</dt>
                <dd className="mt-1 text-gray-900">{formatDate(customer.dateCreation)}</dd>
              </div>
            )}
          </dl>
        </Card>

        {/* Statistiques */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <StatCard
            title="Commandes confirmées"
            value={stats?.nombreCommandes || stats?.totalCommandes || 0}
            icon="📦"
          />
          <StatCard
            title="Total dépensé"
            value={formatCurrency(stats?.montantTotal || stats?.totalDepense || 0)}
            icon="💰"
          />
          <StatCard
            title="Première commande"
            value={stats?.premiereCommande ? formatDate(stats.premiereCommande) : '-'}
            icon="📅"
          />
          <StatCard
            title="Dernière commande"
            value={stats?.derniereCommande ? formatDate(stats.derniereCommande) : '-'}
            icon="🕐"
          />
        </div>
      </div>

      {/* Historique des commandes */}
      <Card title="Historique des commandes">
        <Table
          columns={orderColumns}
          data={paginatedOrders}
          onRowClick={(row) => navigate(`/orders/${row.id}`)}
          emptyMessage="Aucune commande pour ce client"
        />
        {orderTotalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination
              currentPage={orderPage}
              totalPages={orderTotalPages}
              onPageChange={setOrderPage}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default CustomerDetailPage;
