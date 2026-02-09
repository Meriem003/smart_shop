import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout, PageHeader } from '../../components/layout';
import { Table, Pagination, Loading, Alert, Button } from '../../components/common';
import { SelectField } from '../../components/forms';
import { paymentService } from '../../services';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  PAYMENT_TYPES,
  PAYMENT_TYPE_LABELS,
  PAYMENT_STATUS,
  PAYMENT_STATUS_LABELS,
} from '../../utils/constants';

const PaymentsPage = () => {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        size: pageSize,
      };

      if (typeFilter) {
        params.type = typeFilter;
      }
      if (statusFilter) {
        params.status = statusFilter;
      }

      const data = await paymentService.getAll(params);
      setPayments(data.content || data);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || (data.content || data).length);
    } catch {
      setError('Erreur lors du chargement des paiements');
    } finally {
      setLoading(false);
    }
  }, [currentPage, typeFilter, statusFilter]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  useEffect(() => {
    setCurrentPage(0);
  }, [typeFilter, statusFilter]);

  const typeOptions = [
    { value: '', label: 'Tous les types' },
    { value: PAYMENT_TYPES.ESPECES, label: PAYMENT_TYPE_LABELS[PAYMENT_TYPES.ESPECES] },
    { value: PAYMENT_TYPES.CHEQUE, label: PAYMENT_TYPE_LABELS[PAYMENT_TYPES.CHEQUE] },
    { value: PAYMENT_TYPES.VIREMENT, label: PAYMENT_TYPE_LABELS[PAYMENT_TYPES.VIREMENT] },
  ];

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: PAYMENT_STATUS.EN_ATTENTE, label: PAYMENT_STATUS_LABELS[PAYMENT_STATUS.EN_ATTENTE] },
    { value: PAYMENT_STATUS.ENCAISSE, label: PAYMENT_STATUS_LABELS[PAYMENT_STATUS.ENCAISSE] },
    { value: PAYMENT_STATUS.REJETE, label: PAYMENT_STATUS_LABELS[PAYMENT_STATUS.REJETE] },
  ];

  // Badge de type
  const getTypeBadge = (type) => {
    const typeStyles = {
      [PAYMENT_TYPES.ESPECES]: 'bg-green-100 text-green-800',
      [PAYMENT_TYPES.CHEQUE]: 'bg-yellow-100 text-yellow-800',
      [PAYMENT_TYPES.VIREMENT]: 'bg-purple-100 text-purple-800',
    };
    const style = typeStyles[type] || 'bg-gray-100 text-gray-800';
    const label = PAYMENT_TYPE_LABELS[type] || type;

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${style}`}>
        {label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      [PAYMENT_STATUS.EN_ATTENTE]: 'bg-yellow-100 text-yellow-800',
      [PAYMENT_STATUS.ENCAISSE]: 'bg-green-100 text-green-800',
      [PAYMENT_STATUS.REJETE]: 'bg-red-100 text-red-800',
    };
    const style = statusStyles[status] || 'bg-gray-100 text-gray-800';
    const label = PAYMENT_STATUS_LABELS[status] || status;

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${style}`}>
        {label}
      </span>
    );
  };

  const getReference = (payment) => {
    if (payment.typePaiement === PAYMENT_TYPES.CHEQUE) {
      return payment.numeroCheque || '-';
    }
    if (payment.typePaiement === PAYMENT_TYPES.VIREMENT) {
      return payment.referenceVirement || '-';
    }
    return '-';
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (value) => <span className="font-medium">#{value}</span>,
    },
    {
      key: 'commande',
      label: 'Commande',
      render: (_, row) => {
        const orderId = row.commande?.id || row.orderId;
        return orderId ? (
          <Link
            to={`/orders/${orderId}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            #{orderId}
          </Link>
        ) : (
          '-'
        );
      },
    },
    {
      key: 'client',
      label: 'Client',
      render: (_, row) => {
        const client = row.commande?.client || row.client;
        return client ? `${client.prenom} ${client.nom}` : '-';
      },
    },
    {
      key: 'datePaiement',
      label: 'Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'typePaiement',
      label: 'Type',
      render: (value) => getTypeBadge(value),
    },
    {
      key: 'montant',
      label: 'Montant',
      render: (value) => (
        <span className="font-medium text-green-600">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (value) => getStatusBadge(value),
    },
    {
      key: 'reference',
      label: 'Référence',
      render: (_, row) => getReference(row),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Historique des paiements"
        subtitle={`${totalElements} paiement${totalElements > 1 ? 's' : ''} au total`}
        action={
          <Button onClick={() => navigate('/payments/new')}>
            Nouveau paiement
          </Button>
        }
      />

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Filtrer par type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={typeOptions}
          />
          <SelectField
            label="Filtrer par statut"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
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
      {loading && <Loading message="Chargement des paiements..." />}

      {!loading && payments.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">Aucun paiement trouvé</p>
          <Button onClick={() => navigate('/payments/new')}>
            Enregistrer un paiement
          </Button>
        </div>
      )}

      {!loading && payments.length > 0 && (
        <>
          <Table columns={columns} data={payments} />

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

export default PaymentsPage;
