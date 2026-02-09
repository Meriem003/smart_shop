import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useForm } from '../../hooks';
import { validatePromoCode } from '../../utils/validators';
import InputField from './InputField';
import { Button } from '../common';

const PromoCodeForm = ({ initialData, onSubmit, loading = false }) => {
  const validate = useCallback((values) => {
    const errors = {};

    if (!values.code || values.code.trim() === '') {
      errors.code = 'Le code est requis';
    } else if (!validatePromoCode(values.code)) {
      errors.code = 'Le format doit être PROMO-XXXX (4 caractères alphanumériques)';
    }

    if (!values.pourcentageRemise && values.pourcentageRemise !== 0) {
      errors.pourcentageRemise = 'Le pourcentage de remise est requis';
    } else if (Number(values.pourcentageRemise) < 1 || Number(values.pourcentageRemise) > 100) {
      errors.pourcentageRemise = 'Le pourcentage doit être entre 1 et 100';
    }

    return errors;
  }, []);

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useForm(
    {
      code: initialData?.code || '',
      pourcentageRemise: initialData?.pourcentageRemise || '',
      usageUnique: initialData?.usageUnique !== undefined ? initialData.usageUnique : true,
    },
    onSubmit,
    validate
  );

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Code promo"
        name="code"
        value={values.code}
        onChange={handleChange}
        error={errors.code}
        required
        placeholder="PROMO-XXXX"
        disabled={loading || isSubmitting}
      />

      <InputField
        label="Pourcentage de remise (%)"
        name="pourcentageRemise"
        type="number"
        value={values.pourcentageRemise}
        onChange={handleChange}
        error={errors.pourcentageRemise}
        required
        placeholder="10"
        min="1"
        max="100"
        disabled={loading || isSubmitting}
      />

      <div className="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          id="usageUnique"
          name="usageUnique"
          checked={values.usageUnique}
          onChange={(e) => {
            handleChange('usageUnique', e.target.checked);
          }}
          disabled={loading || isSubmitting}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="usageUnique" className="text-sm text-gray-700">
          Usage unique (ne peut être utilisé qu'une seule fois)
        </label>
      </div>

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

PromoCodeForm.propTypes = {
  initialData: PropTypes.shape({
    code: PropTypes.string,
    pourcentageRemise: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    usageUnique: PropTypes.bool,
  }),
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default PromoCodeForm;
