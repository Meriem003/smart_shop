import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MainLayout, PageHeader } from '../../components/layout';
import { Table, Pagination, Loading, Alert, Button } from '../../components/common';
import { SelectField } from '../../components/forms';
import { orderService, customerService } from '../../services';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { ORDER_STATUS } from '../../utils/constants';

const OrdersPage = () => {
  const navigate = useNavigate();
  
  // États
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;
  
  // Filtres
  const [statusFilter, setStatusFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');

  // Charger les clients pour le filtre
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await customerService.getAll({ size: 100 });
        setCustomers(data.content || data);
      } catch {
        console.error('Erreur lors du chargement des clients');
      }
    };
    loadCustomers();
  }, []);

  // Charger les commandes
  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        size: pageSize,
      };
      
      if (statusFilter) {
        params.status = statusFilter;
      }
      if (customerFilter) {
        params.customerId = customerFilter;
      }
      
      const data = await orderService.getAll(params);
      setOrders(data.content || data);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || (data.content || data).length);
    } catch {
      setError('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, customerFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Reset page quand les filtres changent
  useEffect(() => {
    setCurrentPage(0);
  }, [statusFilter, customerFilter]);

  // Navigation vers les détails
  const handleRowClick = (order) => {
    navigate(`/orders/${order.id}`);
  };

  // Options de statut pour le filtre
  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: ORDER_STATUS.PENDING, label: 'En attente' },
    { value: ORDER_STATUS.CONFIRMED, label: 'Confirmée' },
    { value: ORDER_STATUS.CANCELED, label: 'Annulée' },
    { value: ORDER_STATUS.REJECTED, label: 'Rejetée' },
  ];

  // Options de clients pour le filtre
  const customerOptions = [
    { value: '', label: 'Tous les clients' },
    ...customers.map((c) => ({
      value: c.id,
      label: `${c.prenom} ${c.nom}`,
    })),
  ];

  // Badge de statut
  const getStatusBadge = (status) => {
    const statusStyles = {
      [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
      [ORDER_STATUS.CONFIRMED]: 'bg-green-100 text-green-800',
      [ORDER_STATUS.CANCELED]: 'bg-red-100 text-red-800',
      [ORDER_STATUS.REJECTED]: 'bg-gray-100 text-gray-800',
    };

    const statusLabels = {
      [ORDER_STATUS.PENDING]: 'En attente',
      [ORDER_STATUS.CONFIRMED]: 'Confirmée',
      [ORDER_STATUS.CANCELED]: 'Annulée',
      [ORDER_STATUS.REJECTED]: 'Rejetée',
    };

    const style = statusStyles[status] || 'bg-gray-100 text-gray-800';
    const label = statusLabels[status] || status;

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${style}`}>
        {label}
      </span>
    );
  };

  // Colonnes du tableau
  const columns = [
    {
      key: 'id',
      label: 'N° Commande',
      render: (value) => <span className="font-medium">#{value}</span>,
    },
    {
      key: 'client',
      label: 'Client',
      render: (_, row) => {
        const client = row.client || row.customer;
        return client ? `${client.prenom} ${client.nom}` : '-';
      },
    },
    {
      key: 'dateCommande',
      label: 'Date',
      render: (value) => formatDateTime(value),
    },
    {
      key: 'totalTTC',
      label: 'Total TTC',
      render: (value) => (
        <span className="font-medium">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (value) => getStatusBadge(value),
    },
    {
      key: 'montantRestant',
      label: 'Restant à payer',
      render: (value = 0) => (
        <span className={value > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Link
          to={`/orders/${row.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          Voir
        </Link>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Gestion des commandes"
        subtitle={`${totalElements} commande${totalElements > 1 ? 's' : ''} au total`}
        action={
          <Button onClick={() => navigate('/orders/new')}>
            Nouvelle commande
          </Button>
        }
      />

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Filtrer par statut"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
          />
          <SelectField
            label="Filtrer par client"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            options={customerOptions}
          />
        </div>
      </div>

      {/* Messages */}
      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Tableau */}
      {loading && <Loading message="Chargement des commandes..." />}
      
      {!loading && orders.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">Aucune commande trouvée</p>
          <Button onClick={() => navigate('/orders/new')}>
            Créer une commande
          </Button>
        </div>
      )}
      
      {!loading && orders.length > 0 && (
        <>
          <Table
            columns={columns}
            data={orders}
            onRowClick={handleRowClick}
            rowClassName="cursor-pointer hover:bg-gray-50"
          />

          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
};

export default OrdersPage;