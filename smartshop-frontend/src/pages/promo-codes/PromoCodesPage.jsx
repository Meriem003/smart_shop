import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout, PageHeader } from '../../components/layout';
import { Table, Pagination, Loading, Alert, Button, ConfirmDialog } from '../../components/common';
import { promoCodeService } from '../../services';
import { formatDate } from '../../utils/formatters';

const PromoCodesPage = () => {
  const navigate = useNavigate();

  // États
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // Suppression
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Charger les codes promo
  const loadPromoCodes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await promoCodeService.getAll({
        page: currentPage,
        size: pageSize,
      });
      setPromoCodes(data.content || data);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || (data.content || data).length);
    } catch {
      setError('Erreur lors du chargement des codes promo');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadPromoCodes();
  }, [loadPromoCodes]);

  // Vérifier si un code est actif
  const isCodeActive = (promo) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateDebut = new Date(promo.dateDebut);
    const dateFin = new Date(promo.dateFin);
    return today >= dateDebut && today <= dateFin;
  };

  // Badge de statut
  const getStatusBadge = (promo) => {
    const active = isCodeActive(promo);
    if (active) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Actif
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
        Expiré
      </span>
    );
  };

  // Supprimer un code
  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleteLoading(true);
    try {
      await promoCodeService.delete(deleteId);
      setSuccessMessage('Code promo supprimé avec succès');
      setDeleteId(null);
      loadPromoCodes();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
      setDeleteId(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Effacer le message de succès après 5 secondes
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Colonnes du tableau
  const columns = [
    {
      key: 'code',
      label: 'Code',
      render: (value) => (
        <span className="font-mono font-medium text-blue-600">{value}</span>
      ),
    },
    {
      key: 'dateDebut',
      label: 'Date début',
      render: (value) => formatDate(value),
    },
    {
      key: 'dateFin',
      label: 'Date fin',
      render: (value) => formatDate(value),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (_, row) => getStatusBadge(row),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          type="button"
          onClick={() => setDeleteId(row.id)}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Supprimer
        </button>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Codes promotionnels"
        subtitle={`${totalElements} code${totalElements > 1 ? 's' : ''} promo au total`}
        action={
          <Button onClick={() => navigate('/promo-codes/new')}>
            Nouveau code promo
          </Button>
        }
      />

      {/* Messages */}
      {successMessage && (
        <Alert type="success" className="mb-4" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert type="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tableau */}
      {loading && <Loading message="Chargement des codes promo..." />}

      {!loading && promoCodes.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">Aucun code promo trouvé</p>
          <Button onClick={() => navigate('/promo-codes/new')}>
            Créer un code promo
          </Button>
        </div>
      )}

      {!loading && promoCodes.length > 0 && (
        <>
          <Table columns={columns} data={promoCodes} />

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

      {/* Dialog de confirmation de suppression */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer le code promo"
        message="Êtes-vous sûr de vouloir supprimer ce code promo ? Cette action est irréversible."
        confirmText="Supprimer"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </MainLayout>
  );
};

export default PromoCodesPage;
