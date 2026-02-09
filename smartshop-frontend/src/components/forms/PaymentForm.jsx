import { useState } from 'react';
import PropTypes from 'prop-types';
import { PAYMENT_TYPES, PAYMENT_TYPE_LABELS, CASH_PAYMENT_LIMIT } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { paymentService } from '../../services';
import InputField from './InputField';
import SelectField from './SelectField';
import { Button, Alert } from '../common';

const PaymentForm = ({
  orderId,
  remainingAmount = 0,
  onSuccess,
  onCancel,
}) => {
  const [typePaiement, setTypePaiement] = useState('');
  const [montant, setMontant] = useState(remainingAmount.toString());
  const [datePaiement, setDatePaiement] = useState(new Date().toISOString().split('T')[0]);
  
  const [numeroCheque, setNumeroCheque] = useState('');
  const [banqueCheque, setBanqueCheque] = useState('');
  const [dateEcheance, setDateEcheance] = useState('');
  
  const [referenceVirement, setReferenceVirement] = useState('');
  const [banqueVirement, setBanqueVirement] = useState('');
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const paymentTypeOptions = [
    { value: '', label: 'Sélectionner un type' },
    { value: PAYMENT_TYPES.ESPECES, label: PAYMENT_TYPE_LABELS[PAYMENT_TYPES.ESPECES] },
    { value: PAYMENT_TYPES.CHEQUE, label: PAYMENT_TYPE_LABELS[PAYMENT_TYPES.CHEQUE] },
    { value: PAYMENT_TYPES.VIREMENT, label: PAYMENT_TYPE_LABELS[PAYMENT_TYPES.VIREMENT] },
  ];

  const validateEspeces = (newErrors) => {
    const montantNum = Number(montant);
    if (montantNum > CASH_PAYMENT_LIMIT) {
      newErrors.montant = `Le paiement en espèces est limité à ${formatCurrency(CASH_PAYMENT_LIMIT)}`;
    }
  };

  const validateCheque = (newErrors) => {
    if (!numeroCheque.trim()) {
      newErrors.numeroCheque = 'Le numéro de chèque est requis';
    }
    if (!banqueCheque.trim()) {
      newErrors.banqueCheque = 'La banque est requise';
    }
    if (dateEcheance) {
      const echeance = new Date(dateEcheance);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (echeance <= today) {
        newErrors.dateEcheance = "La date d'échéance doit être dans le futur";
      }
    } else {
      newErrors.dateEcheance = "La date d'échéance est requise";
    }
  };

  const validateVirement = (newErrors) => {
    if (!referenceVirement.trim()) {
      newErrors.referenceVirement = 'La référence du virement est requise';
    }
    if (!banqueVirement.trim()) {
      newErrors.banqueVirement = 'La banque est requise';
    }
  };

  const typeValidators = {
    [PAYMENT_TYPES.ESPECES]: validateEspeces,
    [PAYMENT_TYPES.CHEQUE]: validateCheque,
    [PAYMENT_TYPES.VIREMENT]: validateVirement,
  };

  const validate = () => {
    const newErrors = {};

    if (!typePaiement) {
      newErrors.typePaiement = 'Veuillez sélectionner un type de paiement';
    }

    const montantNum = Number(montant);
    if (!montant || montantNum <= 0) {
      newErrors.montant = 'Le montant doit être supérieur à 0';
    } else if (montantNum > remainingAmount) {
      newErrors.montant = `Le montant ne peut pas dépasser ${formatCurrency(remainingAmount)}`;
    }

    if (!datePaiement) {
      newErrors.datePaiement = 'La date de paiement est requise';
    }

    const validator = typeValidators[typePaiement];
    if (validator) {
      validator(newErrors);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const baseData = {
        orderId,
        montant: Number(montant),
        datePaiement,
      };

      if (typePaiement === PAYMENT_TYPES.ESPECES) {
        await paymentService.createEspeces(baseData);
      } else if (typePaiement === PAYMENT_TYPES.CHEQUE) {
        await paymentService.createCheque({
          ...baseData,
          numeroCheque,
          banque: banqueCheque,
          dateEcheance,
        });
      } else if (typePaiement === PAYMENT_TYPES.VIREMENT) {
        await paymentService.createVirement({
          ...baseData,
          referenceVirement,
          banque: banqueVirement,
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de l'enregistrement du paiement"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeChange = (e) => {
    setTypePaiement(e.target.value);
    setErrors({});
    setSubmitError(null);
    setNumeroCheque('');
    setBanqueCheque('');
    setDateEcheance('');
    setReferenceVirement('');
    setBanqueVirement('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-600">Montant restant à payer :</p>
        <p className="text-2xl font-bold text-blue-800">
          {formatCurrency(remainingAmount)}
        </p>
      </div>

      {submitError && (
        <Alert type="error" onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      <SelectField
        label="Type de paiement"
        value={typePaiement}
        onChange={handleTypeChange}
        options={paymentTypeOptions}
        error={errors.typePaiement}
        required
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Montant"
          type="number"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
          error={errors.montant}
          required
          min="0.01"
          max={remainingAmount}
          step="0.01"
          disabled={isSubmitting}
        />
        <InputField
          label="Date de paiement"
          type="date"
          value={datePaiement}
          onChange={(e) => setDatePaiement(e.target.value)}
          error={errors.datePaiement}
          required
          disabled={isSubmitting}
        />
      </div>

      {typePaiement === PAYMENT_TYPES.ESPECES && Number(montant) > CASH_PAYMENT_LIMIT && (
        <Alert type="warning">
          Le paiement en espèces est limité à {formatCurrency(CASH_PAYMENT_LIMIT)} (limite légale).
        </Alert>
      )}

      {typePaiement === PAYMENT_TYPES.CHEQUE && (
        <div className="space-y-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-medium text-yellow-800">Informations du chèque</h4>
          <InputField
            label="Numéro de chèque"
            value={numeroCheque}
            onChange={(e) => setNumeroCheque(e.target.value)}
            error={errors.numeroCheque}
            required
            placeholder="Ex: 1234567"
            disabled={isSubmitting}
          />
          <InputField
            label="Banque"
            value={banqueCheque}
            onChange={(e) => setBanqueCheque(e.target.value)}
            error={errors.banqueCheque}
            required
            placeholder="Nom de la banque"
            disabled={isSubmitting}
          />
          <InputField
            label="Date d'échéance"
            type="date"
            value={dateEcheance}
            onChange={(e) => setDateEcheance(e.target.value)}
            error={errors.dateEcheance}
            required
            min={new Date().toISOString().split('T')[0]}
            disabled={isSubmitting}
          />
        </div>
      )}

      {typePaiement === PAYMENT_TYPES.VIREMENT && (
        <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-medium text-purple-800">Informations du virement</h4>
          <InputField
            label="Référence du virement"
            value={referenceVirement}
            onChange={(e) => setReferenceVirement(e.target.value)}
            error={errors.referenceVirement}
            required
            placeholder="Ex: VIR-2024-001"
            disabled={isSubmitting}
          />
          <InputField
            label="Banque"
            value={banqueVirement}
            onChange={(e) => setBanqueVirement(e.target.value)}
            error={errors.banqueVirement}
            required
            placeholder="Nom de la banque"
            disabled={isSubmitting}
          />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={!typePaiement || !montant}
        >
          Enregistrer le paiement
        </Button>
      </div>
    </form>
  );
};

PaymentForm.propTypes = {
  orderId: PropTypes.number.isRequired,
  remainingAmount: PropTypes.number,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

export default PaymentForm;
