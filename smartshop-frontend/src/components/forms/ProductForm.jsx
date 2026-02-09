import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useForm } from '../../hooks';
import InputField from './InputField';
import { Button } from '../common';

const ProductForm = ({ initialData, onSubmit, loading = false }) => {
  const validate = useCallback((values) => {
    const errors = {};

    if (!values.nom || values.nom.trim() === '') {
      errors.nom = 'Le nom est requis';
    } else if (values.nom.length < 2) {
      errors.nom = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!values.prix && values.prix !== 0) {
      errors.prix = 'Le prix est requis';
    } else if (Number(values.prix) <= 0) {
      errors.prix = 'Le prix doit être supérieur à 0';
    }

    if (!values.stock && values.stock !== 0) {
      errors.stock = 'Le stock est requis';
    } else if (Number(values.stock) < 0) {
      errors.stock = 'Le stock ne peut pas être négatif';
    } else if (!Number.isInteger(Number(values.stock))) {
      errors.stock = 'Le stock doit être un nombre entier';
    }

    return errors;
  }, []); // Mémorisation de la fonction validate

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useForm(
    {
      nom: initialData?.nom || '',
      prix: initialData?.prixUnitaire || initialData?.prix || '',
      stock: initialData?.stockDisponible || initialData?.stock || '',
    },
    onSubmit,
    validate
  );

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Nom du produit"
        name="nom"
        value={values.nom}
        onChange={handleChange}
        error={errors.nom}
        required
        placeholder="Nom du produit"
        disabled={loading || isSubmitting}
      />

      <InputField
        label="Prix (DH)"
        name="prix"
        type="number"
        value={values.prix}
        onChange={handleChange}
        error={errors.prix}
        required
        placeholder="0.00"
        disabled={loading || isSubmitting}
      />

      <InputField
        label="Stock"
        name="stock"
        type="number"
        value={values.stock}
        onChange={handleChange}
        error={errors.stock}
        required
        placeholder="0"
        disabled={loading || isSubmitting}
      />

      <div className="flex justify-end gap-3 mt-6">
        <Button
          type="submit"
          variant="primary"
          loading={loading || isSubmitting}
        >
          {initialData ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

ProductForm.propTypes = {
  initialData: PropTypes.shape({
    nom: PropTypes.string,
    prix: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    prixUnitaire: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stockDisponible: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default ProductForm;
