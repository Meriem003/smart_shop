import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout';
import { Card, Button, Alert, Loading, ConfirmDialog } from '../../components/common';
import { productService } from '../../services';
import { formatCurrency } from '../../utils/formatters';

const StockStatus = ({ stock }) => {
  const getStatus = () => {
    if (stock === 0) return { label: 'Rupture de stock', color: 'text-red-600 bg-red-100' };
    if (stock < 5) return { label: 'Stock critique', color: 'text-red-600 bg-red-100' };
    if (stock < 10) return { label: 'Stock faible', color: 'text-orange-600 bg-orange-100' };
    return { label: 'En stock', color: 'text-green-600 bg-green-100' };
  };

  const status = getStatus();

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
      {status.label}
    </span>
  );
};

StockStatus.propTypes = {
  stock: PropTypes.number.isRequired,
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getById(id);
      setProduct(data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du produit');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await productService.delete(id);
      navigate('/products', {
        state: { success: `Produit "${product.nom}" supprimé avec succès` }
      });
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
      setDeleteDialog(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Loading size="large" text="Chargement du produit..." />
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="p-6">
        <Alert type="error">{error}</Alert>
        <div className="mt-4">
          <Link to="/products">
            <Button variant="secondary">Retour à la liste</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title={product?.nom || 'Détails du produit'}
        actions={
          <div className="flex gap-3">
            <Link to="/products">
              <Button variant="secondary">Retour</Button>
            </Link>
            <Link to={`/products/${id}/edit`}>
              <Button variant="primary">Modifier</Button>
            </Link>
            <Button variant="danger" onClick={() => setDeleteDialog(true)}>
              Supprimer
            </Button>
          </div>
        }
      />

      {error && (
        <Alert type="error" onClose={() => setError(null)} className="mb-4">
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations principales */}
        <Card title="Informations du produit">
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nom</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">{product?.nom}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Prix HT</dt>
              <dd className="mt-1 text-2xl font-bold text-blue-600">
                {formatCurrency(product?.prixUnitaire)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Identifiant</dt>
              <dd className="mt-1 text-gray-900">#{product?.id}</dd>
            </div>
          </dl>
        </Card>

        {/* Stock */}
        <Card title="État du stock">
          <div className="text-center py-4">
            <p className="text-5xl font-bold text-gray-900 mb-4">{product?.stockDisponible}</p>
            <p className="text-gray-500 mb-4">unités disponibles</p>
            <StockStatus stock={product?.stockDisponible} />
          </div>
        </Card>
      </div>

      {/* Dialog de confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog}
        title="Supprimer le produit"
        message={`Êtes-vous sûr de vouloir supprimer "${product?.nom}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog(false)}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
};

export default ProductDetailPage;
