import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout';
import { Table, Pagination, Button, Alert, ConfirmDialog, Loading } from '../../components/common';
import { InputField } from '../../components/forms';
import { productService } from '../../services';
import { formatCurrency } from '../../utils/formatters';
import { debounce } from '../../utils/helpers';

const StockBadge = ({ stock }) => {
  const getStockClass = () => {
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (stock < 10) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStockClass()}`}>
      {stock}
    </span>
  );
};

StockBadge.propTypes = {
  stock: PropTypes.number.isRequired,
};

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });
  const [deleting, setDeleting] = useState(false);

  const pageSize = 10;

  const fetchProducts = useCallback(async (searchTerm = '', pageNumber = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getAll({
        page: pageNumber,
        size: pageSize,
        search: searchTerm,
      });

      setProducts(response.content || response || []);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce pour la recherche
  const debouncedSearch = useCallback(
    debounce((term) => {
      setPage(0);
      fetchProducts(term, 0);
    }, 300),
    [fetchProducts]
  );

  useEffect(() => {
    fetchProducts(search, page);
  }, [page]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDelete = (product) => {
    setDeleteDialog({ open: true, product });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.product) return;

    try {
      setDeleting(true);
      await productService.delete(deleteDialog.product.id);
      setSuccess(`Produit "${deleteDialog.product.nom}" supprimé avec succès`);
      setDeleteDialog({ open: false, product: null });
      fetchProducts(search, page);
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'nom',
      label: 'Nom',
      render: (value) => <span className="font-medium text-gray-900">{value}</span>,
    },
    {
      key: 'prixUnitaire',
      label: 'Prix HT',
      render: (value) => formatCurrency(value),
    },
    {
      key: 'stockDisponible',
      label: 'Stock',
      render: (value) => <StockBadge stock={value} />,
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
              navigate(`/products/${row.id}/edit`);
            }}
          >
            Modifier
          </Button>
          <Button
            variant="danger"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
          >
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Gestion des produits"
        subtitle={`${totalElements} produit${totalElements > 1 ? 's' : ''} au total`}
        actions={
          <Link to="/products/new">
            <Button variant="primary">Nouveau produit</Button>
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
          placeholder="Rechercher par nom..."
          className="mb-0 max-w-md"
        />
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <Loading size="medium" text="Chargement des produits..." />
        ) : (
          <>
            <Table
              columns={columns}
              data={products}
              onRowClick={(row) => navigate(`/products/${row.id}`)}
              emptyMessage="Aucun produit trouvé"
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

      {/* Dialog de confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        title="Supprimer le produit"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteDialog.product?.nom}" ?`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ open: false, product: null })}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
};

export default ProductsPage;
