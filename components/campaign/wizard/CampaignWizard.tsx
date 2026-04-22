'use client'

import React, { useCallback, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { useWizardStore } from '@/store/wizardStore'
import { useCreateCampaign } from '@/api/hooks/useCampaigns'
import { toast } from 'react-toastify'
import { Step1TypeSelection } from './Step1TypeSelection'
import { Step1aTypeSelection } from './Step1aTypeSelection'
import { Step2BasicInfo } from './Step2BasicInfo'
import { Step3GoalsBudget } from './Step3GoalsBudget'
import { Step4Review, type Step4ReviewHandle } from './Step4Review'
import Step5PrayerConfiguration from './Step5PrayerConfiguration'
import { Step5BoostSelection } from './Step5BoostSelection'
import { Step6BoostPayment } from './Step6BoostPayment'
import { StepIndicator, WizardActions } from './WizardSteps'
import { fundraisingCampaignSchema, sharingCampaignSchema } from '@/utils/validationSchemas'

const WizardContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 640px) {
    padding: 1rem;
  }
`

const WizardContent = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 640px) {
    padding: 1rem;
    border-radius: 8px;
  }
`

const WizardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const DraftNotification = styled.div`
  padding: 1rem;
  background-color: #DBEAFE;
  border-left: 4px solid #3B82F6;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  color: #1E40AF;
  font-size: 0.875rem;

  button {
    background: none;
    border: none;
    color: #1E40AF;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    font-weight: 600;

    &:hover {
      text-decoration-line: underline;
    }
  }
`

const STEP_LABELS = [
  'Category',
  'Campaign Type',
  'Basic Information',
  'Goals & Budget',
  'Prayer Support',
  'Boost Campaign',
  'Payment & Confirmation',
]

interface CampaignWizardProps {
  draftExists?: boolean
}

export const CampaignWizard: React.FC<CampaignWizardProps> = ({ draftExists = false }) => {
  const router = useRouter()
  const {
    currentStep,
    formData,
    errors,
    isSubmitting,
    draftSaved,
    setCurrentStep,
    updateFormData,
    setImage,
    setFundraisingData,
    setSharingData,
    setPrayerConfig,
    setBoostData,
    setErrors,
    setIsSubmitting,
    saveDraft,
    loadDraft,
    clearDraft,
    resetWizard,
    getDraftExists,
  } = useWizardStore()

  // Ref for Step4Review to handle tab switching on next button
  const step4ReviewRef = useRef<Step4ReviewHandle>(null)

  const createCampaignMutation = useCreateCampaign()
  const [termsAccepted, setTermsAccepted] = React.useState(false)
  const [campaignCreated, setCampaignCreated] = React.useState<any>(null)

  // Validate current step
  const validateStep = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!formData.category) {
        newErrors.category = 'Please select a category'
      }
    } else if (currentStep === 2) {
      if (!formData.campaignType) {
        newErrors.campaignType = 'Please select a campaign type'
      }
    } else if (currentStep === 3) {
      if (!formData.title.trim() || formData.title.length < 5) {
        newErrors.title = 'Title must be at least 5 characters'
      }
      if (!formData.description.trim() || formData.description.length < 20) {
        newErrors.description = 'Description must be at least 20 characters'
      }
    } else if (currentStep === 4) {
      if (formData.campaignType === 'fundraising') {
        const fd = formData.fundraisingData
        if (!fd.goalAmount || fd.goalAmount < 1) {
          newErrors.goalAmount = 'Goal amount must be at least $1'
        }
        if (!fd.duration || fd.duration < 7 || fd.duration > 90) {
          newErrors.duration = 'Duration must be between 7 and 90 days'
        }
        if (!fd.paymentMethods || fd.paymentMethods.length === 0) {
          newErrors.paymentMethods = 'Add at least one payment method'
        }
      } else if (formData.campaignType === 'sharing') {
        const sd = formData.sharingData
        console.log('[CampaignWizard] Validating sharing campaign:', {
          meterType: sd.meterType,
          budget: sd.budget,
          rewardPerShare: sd.rewardPerShare,
          platforms: sd.platforms,
          fullSharingData: sd
        })
        if (!sd.meterType) {
          newErrors.meterType = 'Select a sharing meter type'
        }
        if (!sd.budget || sd.budget < 10) {
          newErrors.budget = 'Budget must be at least $10'
        }
        if (!sd.rewardPerShare || sd.rewardPerShare < 0.1) {
          newErrors.rewardPerShare = 'Reward per share must be at least $0.10'
        }
        if (!sd.platforms || sd.platforms.length === 0) {
          newErrors.platforms = 'Select at least one platform'
        }
      }
    } else if (currentStep === 5) {
      // Prayer configuration - no validation required (optional)
      // Prayer support is optional
    } else if (currentStep === 6) {
      if (!termsAccepted) {
        newErrors.terms = 'You must accept the terms and conditions'
      }
    } else if (currentStep === 7) {
      // Boost selection - no validation required (can skip boost)
      // This is optional
    } else if (currentStep === 8) {
      // Boost payment - handled by payment component
      // No validation needed here
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [currentStep, formData, termsAccepted, setErrors])

  // Define handleSubmit BEFORE handleNext since handleNext calls it
  const handleSubmit = useCallback(async () => {
    if (!validateStep()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare campaign data - pass nested structure to service
      const campaignData: any = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        campaignType: formData.campaignType,
      }

      // Pass the nested fundraising/sharing data as-is (don't flatten)
      if (formData.campaignType === 'fundraising') {
        campaignData.fundraisingData = formData.fundraisingData
      } else {
        campaignData.sharingData = formData.sharingData
      }

      // Include prayer configuration if enabled
      if (formData.prayerConfig.enabled) {
        campaignData.prayerConfig = formData.prayerConfig
        console.log('✅ CampaignWizard: Prayer config added to campaignData', {
          prayerConfig: formData.prayerConfig,
          enabled: formData.prayerConfig.enabled,
        })
      } else {
        console.log('📋 CampaignWizard: Prayer config not enabled, skipping', {
          prayerConfig: formData.prayerConfig,
          enabled: formData.prayerConfig?.enabled,
        })
      }

      // Submit via mutation
      const result = await createCampaignMutation.mutateAsync({
        data: campaignData,
        imageFile: formData.image || undefined,
      })

      // Store created campaign for boost step
      setCampaignCreated(result)

      // If no boost selected or free boost, go directly to success
      if (!formData.boostData.selectedTier || formData.boostData.selectedTier === 'free') {
        // Clear draft and reset wizard
        clearDraft()
        resetWizard()

        // Show success and redirect
        toast.success('Campaign created successfully!')
        router.push(`/campaigns/${result.id}`)
      } else {
        // Move to boost payment step (step 8)
        setCurrentStep(8)
        setIsSubmitting(false)
      }
    } catch (error: any) {
      console.error('Campaign creation failed:', error)
      const message = error.response?.data?.message || 'Failed to create campaign'
      toast.error(message)
      setIsSubmitting(false)
    }
  }, [
    validateStep,
    formData,
    createCampaignMutation,
    router,
    setIsSubmitting,
    clearDraft,
    resetWizard,
    setCurrentStep,
  ])

  const handleNext = useCallback(() => {
    if (validateStep()) {
      // Special handling for Step 6 (Review with tabs)
      if (currentStep === 6) {
        // Check with Step4Review if we should proceed or switch tabs
        if (step4ReviewRef.current?.handleNextAction?.()) {
          // Only proceed if on details view
          saveDraft()
          setCurrentStep(currentStep + 1)
        }
        // If false, the ref will have switched to details tab
        return
      }
      
      // Special handling for Step 7 (Boost Selection)
      if (currentStep === 7) {
        // Always call handleSubmit which will:
        // - Create the campaign
        // - If free/skip: redirect to campaign page
        // - If paid: go to step 8 with campaignCreated set
        handleSubmit()
      } else {
        // Normal navigation for other steps
        const maxSteps = currentStep === 6 && formData.boostData.selectedTier && formData.boostData.selectedTier !== 'free' ? 8 : 7
        
        if (currentStep < maxSteps) {
          saveDraft()
          setCurrentStep(currentStep + 1)
        }
      }
    }
  }, [currentStep, validateStep, saveDraft, setCurrentStep, formData, handleSubmit])

  const handleInputChange = useCallback((field: string, value: any) => {
    console.log('[CampaignWizard] handleInputChange called:', { field, value, currentFormData: formData })
    
    // Clear errors for the field being edited
    const newErrors = { ...errors }
    delete newErrors[field]
    if (field === 'sharingData') {
      delete newErrors.meterType
      delete newErrors.budget
      delete newErrors.rewardPerShare
      delete newErrors.platforms
      // Merge sharingData properly to preserve all properties
      const mergedSharingData = { ...formData.sharingData, ...value }
      console.log('[CampaignWizard] Merged sharingData:', mergedSharingData)
      setErrors(newErrors)
      setSharingData(mergedSharingData)
    } else if (field === 'fundraisingData') {
      delete newErrors.goalAmount
      delete newErrors.duration
      delete newErrors.paymentMethods
      // Merge fundraisingData properly to preserve all properties
      const mergedFundraisingData = { ...formData.fundraisingData, ...value }
      console.log('[CampaignWizard] Merged fundraisingData:', mergedFundraisingData)
      setErrors(newErrors)
      setFundraisingData(mergedFundraisingData)
    } else {
      console.log('[CampaignWizard] Regular field update:', { field, value })
      setErrors(newErrors)
      updateFormData({ [field]: value })
    }
  }, [errors, setErrors, updateFormData, setFundraisingData, setSharingData, formData])

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep, setCurrentStep])

  const handleLoadDraft = useCallback(() => {
    if (loadDraft()) {
      toast.info('Draft loaded successfully')
    }
  }, [loadDraft])

  const handleDiscardDraft = useCallback(() => {
    if (confirm('Are you sure you want to discard your draft?')) {
      clearDraft()
      resetWizard()
      toast.info('Draft discarded')
    }
  }, [clearDraft, resetWizard])

  const handleBoostPaymentSuccess = useCallback(() => {
    // Clear draft and reset wizard
    clearDraft()
    resetWizard()

    // Show success and redirect
    if (campaignCreated?.id) {
      toast.success('Campaign created and boost activated!')
      router.push(`/campaigns/${campaignCreated.id}`)
    } else {
      toast.error('Campaign ID not found. Please try again.')
    }
  }, [clearDraft, resetWizard, router, campaignCreated])

  const handleBoostSkip = useCallback(() => {
    // User skipped boost, just proceed to publish
    setBoostData({ selectedTier: null, skipBoost: true })
    setCurrentStep(currentStep + 1)
  }, [setBoostData, setCurrentStep, currentStep])

  const canProceed = useMemo(() => {
    // Always allow proceeding - validation will show errors if needed
    return true
  }, [])

  return (
    <WizardContainer>
      <WizardContent>
        {/* Draft Notification */}
        {draftExists && getDraftExists() && currentStep === 1 && (
          <DraftNotification>
            <p style={{ margin: 0, marginBottom: '0.75rem' }}>
              You have a saved draft of a campaign.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleLoadDraft}>Load Draft</button>
              <button onClick={handleDiscardDraft}>Discard</button>
            </div>
          </DraftNotification>
        )}

        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={formData.boostData.selectedTier && formData.boostData.selectedTier !== 'free' ? 7 : 6}
          stepLabels={STEP_LABELS}
        />

        {/* Step Content */}
        {currentStep === 1 && (
          <Step1TypeSelection
            selectedCategory={formData.category}
            onCategorySelect={(categoryId, categoryName) => handleInputChange('category', categoryId)}
            onCategoryClear={() => handleInputChange('category', '')}
          />
        )}

        {currentStep === 2 && (
          <Step1aTypeSelection
            selectedType={formData.campaignType}
            onTypeSelect={(type) => handleInputChange('campaignType', type)}
          />
        )}

        {currentStep === 3 && (
          <Step2BasicInfo
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
            onImageSelect={setImage}
          />
        )}

        {currentStep === 4 && formData.campaignType && (
          <Step3GoalsBudget
            campaignType={formData.campaignType}
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
        )}

        {currentStep === 5 && (
          <Step5PrayerConfiguration
            currentData={formData.prayerConfig}
            onNext={(config) => {
              setPrayerConfig(config)
              saveDraft()
              setCurrentStep(6)
            }}
            isLoading={isSubmitting}
          />
        )}

        {currentStep === 6 && (
          <Step4Review
            ref={step4ReviewRef}
            formData={formData}
            campaignType={formData.campaignType!}
            termsAccepted={termsAccepted}
            onTermsChange={setTermsAccepted}
          />
        )}

        {currentStep === 7 && (
          <Step5BoostSelection
            selectedTier={formData.boostData.selectedTier}
            onTierSelect={(tier) => {
              setBoostData({ selectedTier: tier as any })
              // Just update the selection - don't auto-advance
            }}
            onSkip={handleBoostSkip}
          />
        )}

        {currentStep === 8 && campaignCreated && (
          <Step6BoostPayment
            campaignId={campaignCreated.id}
            campaignTitle={campaignCreated.title}
            boostTier={formData.boostData.selectedTier || 'free'}
            onSuccess={handleBoostPaymentSuccess}
            onCancel={() => {
              // User cancelled boost payment
              clearDraft()
              resetWizard()
              router.push(`/campaigns/${campaignCreated.id}`)
            }}
            isProcessing={isSubmitting}
          />
        )}

        {/* Actions */}
        <WizardActions
          currentStep={currentStep}
          totalSteps={formData.boostData.selectedTier && formData.boostData.selectedTier !== 'free' ? 8 : 7}
          onBack={handleBack}
          onNext={handleNext}
          onSubmit={currentStep === 8 ? handleBoostPaymentSuccess : undefined}
          isLoading={isSubmitting || createCampaignMutation.isPending}
          canProceed={canProceed}
        />
      </WizardContent>
    </WizardContainer>
  )
}
