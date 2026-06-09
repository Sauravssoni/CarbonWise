import { useState } from 'react';
import { FootprintInput, CarbonResult } from '../types';
import { FootprintSchema } from '../lib/validation';
import { calculateFootprint } from '../lib/carbon-engine';
import TransportStep from './form/TransportStep';
import EnergyStep from './form/EnergyStep';
import FoodStep from './form/FoodStep';
import ConsumptionStep from './form/ConsumptionStep';
import GoalStep from './form/GoalStep';
import FormNavigation from './form/FormNavigation';
import { AlertCircle } from 'lucide-react';

interface FootprintFormProps {
  onSubmitSuccess: (input: FootprintInput, result: CarbonResult) => void;
  onCancel: () => void;
  initialData?: Partial<FootprintInput>;
}

const DEFAULT_FORM_DATA: FootprintInput = {
  commuteMode: 'Walk',
  distancePerDayKm: 10,
  carpool: false,
  flightsThisMonth: 0,
  electricityKwhMonthly: 120,
  acUsage: 'None',
  householdSize: 2,
  dietType: 'Vegetarian',
  foodWaste: 'Rare',
  eatingOutFrequency: 'Weekly',
  onlineOrdersMonthly: 2,
  clothingPurchasesMonthly: 0,
  recyclingHabit: 'Sometimes',
  reductionTarget: 10,
  preferredEffort: 'Balanced',
  optionalNote: '',
};

export default function FootprintForm({ onSubmitSuccess, onCancel, initialData }: FootprintFormProps) {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FootprintInput>({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  });
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleFieldChange = (updates: Partial<FootprintInput>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setErrorMessages([]); // clear error
  };

  const nextStep = () => {
    // Perform light validation for current step to keep flows solid
    if (step === 1) {
      if (formData.distancePerDayKm < 0 || formData.distancePerDayKm > 1000) {
        setErrorMessages(['Commute distance per day must be between 0 and 1000 km.']);
        return;
      }
    }
    if (step === 2) {
      if (formData.householdSize < 1 || formData.householdSize > 20) {
        setErrorMessages(['Household size must be between 1 and 20 occupancy members.']);
        return;
      }
      if (formData.electricityKwhMonthly < 0 || formData.electricityKwhMonthly > 50000) {
        setErrorMessages(['Electricity usage must be between 0 and 50,000 kWh.']);
        return;
      }
    }
    
    setErrorMessages([]);
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setErrorMessages([]);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setErrorMessages([]);

    // Full Zod validation
    const parsed = FootprintSchema.safeParse(formData);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
      setErrorMessages(messages);
      setIsSubmitting(false);
      return;
    }

    try {
      const inputData = parsed.data as FootprintInput;
      const resultObj = calculateFootprint(inputData);
      onSubmitSuccess(inputData, resultObj);
    } catch (err) {
      setErrorMessages(['An unexpected math error occurred calculating footprint.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm animate-fade-in">
      {/* Step Header */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full mb-8 relative overflow-hidden flex">
        <div
          className="bg-emerald-600 h-full transition-all duration-300"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>

      {/* Render Steps */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        {step === 1 && <TransportStep data={formData} onChange={handleFieldChange} />}
        {step === 2 && <EnergyStep data={formData} onChange={handleFieldChange} />}
        {step === 3 && <FoodStep data={formData} onChange={handleFieldChange} />}
        {step === 4 && <ConsumptionStep data={formData} onChange={handleFieldChange} />}
        {step === 5 && <GoalStep data={formData} onChange={handleFieldChange} />}

        {/* Validation Errors */}
        {errorMessages.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-150 rounded-2xl text-red-800 text-xs flex gap-3 mt-4" role="alert" aria-live="polite">
            <AlertCircle className="w-4 h-4 text-red-650 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold uppercase tracking-wider">Correct the following metrics inputs:</div>
              <ul className="list-disc pl-4 mt-1.5 space-y-1 font-mono">
                {errorMessages.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Navigation bar */}
        <FormNavigation
          currentStep={step}
          totalSteps={5}
          onBack={prevStep}
          onNext={nextStep}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
}
