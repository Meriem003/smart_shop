import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout';
import { Table, Pagination, Button, Alert, Loading } from '../../components/common';
import { InputField } from '../../components/forms';
import { customerService } from '../../services';
import { formatCurrency } from '../../utils/formatters';
import { LOYALTY_TIERS, LOYALTY_TIER_LABELS } from '../../utils/constants';
import { debounce } from '../../utils/helpers';

const LoyaltyBadge = ({ level }) => {
  const badgeColors = {
    [LOYALTY_TIERS.BASIC]: 'bg-gray-100 text-gray-800',
    [LOYALTY_TIERS.SILVER]: 'bg-slate-200 text-slate-800',
    [LOYALTY_TIERS.GOLD]: 'bg-yellow-100 text-yellow-800',
    [LOYALTY_TIERS.PLATINUM]: 'bg-purple-100 text-purple-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeColors[level] || badgeColors[LOYALTY_TIERS.BASIC]}`}>
      {LOYALTY_TIER_LABELS[level] || level}
    </span>
  );
};

LoyaltyBadge.propTypes = {
  level: PropTypes.string.isRequired,
};

const CustomersPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const pageSize = 10;

  const fetchCustomers = useCallback(async (searchTerm = '', pageNumber = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerService.getAll({
        page: pageNumber,
        size: pageSize,
        search: searchTerm,
      });

      setCustomers(response.content || response || []);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((term) => {
      setPage(0);
      fetchCustomers(term, 0);
    }, 300),
    [fetchCustomers]
  );

  useEffect(() => {
    fetchCustomers(search, page);
  }, [page]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const columns = [
    {
      key: 'nom',
      label: 'Nom',
      render: (value) => <span className="font-medium text-gray-900">{value}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      key: 'niveauFidelite',
      label: 'Niveau fidélité',
      render: (value) => <LoyaltyBadge level={value} />,
    },
    {
      key: 'totalCommandes',
      label: 'Commandes',
      render: (value) => value || 0,
    },
    {
      key: 'totalDepense',
      label: 'Total dépensé',
      render: (value) => formatCurrency(value || 0),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/customers/${row.id}/edit`);
            }}
          >
            Modifier
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Gestion des clients"
        subtitle={`${totalElements} client${totalElements > 1 ? 's' : ''} au total`}
        actions={
          <Link to="/customers/new">
            <Button variant="primary">Nouveau client</Button>
          </Link>
        }
      />

      {/* Messages */}
      {error && (
        <Alert type="error" onClose={() => setError(null)} className="mb-4">
          {error}
        </Alert>
      )}
      {success && (
        <Alert type="success" onClose={() => setSuccess(null)} className="mb-4">
          {success}
        </Alert>
      )}

      {/* Recherche */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <InputField
          name="search"
          value={search}
          onChange={handleSearchChange}
          placeholder="Rechercher par nom ou email..."
          className="mb-0 max-w-md"
        />
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <Loading size="medium" text="Chargement des clients..." />
        ) : (
          <>
            <Table
              columns={columns}
              data={customers}
              onRowClick={(row) => navigate(`/customers/${row.id}`)}
              emptyMessage="Aucun client trouvé"
            />
            {totalPages > 1 && (
              <div className="p-4 border-t">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
