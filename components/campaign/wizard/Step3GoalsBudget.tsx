'use client'

import React from 'react'
import styled from 'styled-components'
import { PaymentMethodsManager } from '@/components/campaign/PaymentMethodsManager'
import { SHARING_PLATFORMS, PAYMENT_METHOD_TYPES, CRYPTO_TYPES } from '@/utils/validationSchemas'
import { Trash2 } from 'lucide-react'

const FormGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const InputWithSlider = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;

  input[type='range'] {
    flex: 1;
  }

  input[type='number'] {
    width: 120px;
  }
`

const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid #E2E8F0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #CBD5E1;
    background-color: #F8FAFC;
  }

  input {
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
    accent-color: #6366F1;
  }

  input:checked ~ div {
    color: #0F172A;
    font-weight: 600;
  }
`

const MeterCard = styled.div<{ selected?: boolean }>`
  border: 2px solid ${(props) => (props.selected ? '#6366F1' : '#E2E8F0')};
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) => (props.selected ? '#EEF2FF' : '#F8FAFC')};

  &:hover {
    border-color: #6366F1;
    background-color: #EEF2FF;
  }

  h4 {
    margin: 0 0 0.5rem 0;
    color: #0F172A;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #64748B;
    font-size: 0.875rem;
    line-height: 1.5;
  }
`

const MeterGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`



interface Step3GoalsBudgetProps {
  campaignType: 'fundraising' | 'sharing'
  formData: any
  errors: Record<string, string>
  onChange: (field: string, value: any) => void
}

const FundraisingStep: React.FC<any> = ({
  formData,
  errors,
  onChange,
  onAddPaymentMethod,
  onRemovePaymentMethod,
  onUpdatePaymentMethod,
}) => {
  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    console.log('[FundraisingStep] handleGoalChange:', { value, currentFundraisingData: formData.fundraisingData })
    // Update the fundraisingData object
    const fundraisingData = { ...formData.fundraisingData, goalAmount: value }
    console.log('[FundraisingStep] Updated fundraisingData:', fundraisingData)
    onChange('fundraisingData', fundraisingData)
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0
    console.log('[FundraisingStep] handleDurationChange:', { value, currentFundraisingData: formData.fundraisingData })
    // Update the fundraisingData object
    const fundraisingData = { ...formData.fundraisingData, duration: value }
    console.log('[FundraisingStep] Updated fundraisingData:', fundraisingData)
    onChange('fundraisingData', fundraisingData)
  }

  const handlePaymentMethodsChange = (methods: any[]) => {
    console.log('[FundraisingStep] handlePaymentMethodsChange:', { methods })
    // Update the fundraisingData object
    const fundraisingData = { ...formData.fundraisingData, paymentMethods: methods }
    onChange('fundraisingData', fundraisingData)
  }

  return (
    <FormGrid>
      <div>
        <h3 style={{ marginBottom: '1rem', color: '#0F172A' }}>Goal & Duration</h3>
        <FormRow>
          {/* Goal Amount */}
          <div>
            <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', color: '#111827' }}>
              Goal Amount <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <InputWithSlider>
              <input
                type="range"
                min="1"
                max="100000"
                value={formData.fundraisingData?.goalAmount || 0}
                onChange={handleGoalChange}
              />
              <input
                type="number"
                value={formData.fundraisingData?.goalAmount || ''}
                onChange={handleGoalChange}
                placeholder="$"
                min="1"
                max="100000"
                style={{
                  padding: '0.75rem',
                  border: `2px solid ${errors.goalAmount ? '#EF4444' : '#E2E8F0'}`,
                  borderRadius: '6px',
                  width: '120px',
                }}
                aria-invalid={!!errors.goalAmount}
                aria-describedby={errors.goalAmount ? `goalAmount-error` : undefined}
              />
            </InputWithSlider>
            <p style={{ color: '#64748B', marginTop: '0.5rem' }}>
              ${formData.fundraisingData?.goalAmount?.toLocaleString() || '0'}
            </p>
            {errors.goalAmount && <div id="goalAmount-error" style={{ fontSize: '0.875rem', color: '#EF4444', marginTop: '0.25rem' }}>{errors.goalAmount}</div>}
          </div>

          {/* Campaign Duration */}
          <div>
            <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', color: '#111827' }}>
              Campaign Duration (Days) <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="number"
              value={formData.fundraisingData?.duration || ''}
              onChange={handleDurationChange}
              min="7"
              max="90"
              placeholder="Days"
              style={{
                padding: '0.75rem',
                border: `2px solid ${errors.duration ? '#EF4444' : '#E2E8F0'}`,
                borderRadius: '6px',
                width: '100%',
              }}
              aria-invalid={!!errors.duration}
              aria-describedby={errors.duration ? `duration-error` : undefined}
            />
            <p style={{ color: '#64748B', marginTop: '0.5rem', fontSize: '0.875rem' }}>
              7 - 90 days
            </p>
            {errors.duration && <div id="duration-error" style={{ fontSize: '0.875rem', color: '#EF4444', marginTop: '0.25rem' }}>{errors.duration}</div>}
          </div>
        </FormRow>
      </div>

      <div>
        <PaymentMethodsManager
          methods={formData.fundraisingData?.paymentMethods || []}
          onChange={handlePaymentMethodsChange}
          maxMethods={6}
          error={errors.paymentMethods}
          helperText="Select at least 1 and up to 6 payment methods for supporters to donate"
          title="Payment Methods"
        />
      </div>
    </FormGrid>
  )
}

const SharingStep: React.FC<any> = ({ formData, errors, onChange }) => {
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    console.log('[SharingStep] handleBudgetChange:', { value, currentSharingData: formData.sharingData })
    // Update the sharingData object
    const sharingData = { ...formData.sharingData, budget: value }
    console.log('[SharingStep] Updated sharingData:', sharingData)
    onChange('sharingData', sharingData)
  }

  const handleRewardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    console.log('[SharingStep] handleRewardChange:', { value, currentSharingData: formData.sharingData })
    // Update the sharingData object
    const sharingData = { ...formData.sharingData, rewardPerShare: value }
    console.log('[SharingStep] Updated sharingData:', sharingData)
    onChange('sharingData', sharingData)
  }

  const togglePlatform = (platformId: string) => {
    const platforms = formData.sharingData?.platforms || []
    let newPlatforms: string[]
    if (platforms.includes(platformId)) {
      newPlatforms = platforms.filter((p: string) => p !== platformId)
    } else if (platforms.length < 8) {
      newPlatforms = [...platforms, platformId]
    } else {
      newPlatforms = platforms
    }
    console.log('[SharingStep] togglePlatform:', { platformId, newPlatforms })
    // Update the sharingData object
    const sharingData = { ...formData.sharingData, platforms: newPlatforms }
    onChange('sharingData', sharingData)
  }

  const METER_OPTIONS = [
    {
      id: 'impression_meter',
      name: 'Impression Meter',
      description: 'Pay per view or impression of your campaign content'
    },
    {
      id: 'engagement_meter',
      name: 'Engagement Meter',
      description: 'Pay when supporters interact with your campaign (likes, comments, shares)'
    },
    {
      id: 'conversion_meter',
      name: 'Conversion Meter',
      description: 'Pay only when supporters complete desired actions'
    },
    {
      id: 'custom_meter',
      name: 'Custom Meter',
      description: 'Define your own metrics and pay on custom events'
    },
  ]

  return (
    <FormGrid>
      <div>
        <h3 style={{ marginBottom: '1rem', color: '#0F172A' }}>Sharing Meter</h3>
        <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          Choose how you want to measure and reward supporter engagement
        </p>
        <MeterGridContainer>
          {METER_OPTIONS.map((meter) => (
            <MeterCard
              key={meter.id}
              selected={formData.sharingData?.meterType === meter.id}
              onClick={() => { 
                console.log('[SharingStep] Meter selected:', meter.id)
                const sharingData = { ...formData.sharingData, meterType: meter.id }
                console.log('[SharingStep] Updated sharingData with meter:', sharingData)
                onChange('sharingData', sharingData)
              }}
            >
              <h4>{meter.name}</h4>
              <p>{meter.description}</p>
            </MeterCard>
          ))}
        </MeterGridContainer>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem', color: '#0F172A' }}>Sharing Budget & Rewards</h3>
        <FormRow>
          {/* Total Budget */}
          <div>
            <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', color: '#111827' }}>
              Total Budget <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <InputWithSlider>
              <input
                type="range"
                min="10"
                max="1000000"
                value={formData.sharingData?.budget || 0}
                onChange={handleBudgetChange}
              />
              <input
                type="number"
                value={formData.sharingData?.budget || ''}
                onChange={handleBudgetChange}
                placeholder="$"
                min="10"
                max="1000000"
                style={{
                  padding: '0.75rem',
                  border: `2px solid ${errors.budget ? '#EF4444' : '#E2E8F0'}`,
                  borderRadius: '6px',
                  width: '120px',
                }}
                aria-invalid={!!errors.budget}
                aria-describedby={errors.budget ? `budget-error` : undefined}
              />
            </InputWithSlider>
            <p style={{ color: '#64748B', marginTop: '0.5rem' }}>
              ${formData.sharingData?.budget?.toLocaleString() || '0'}
            </p>
            {errors.budget && <div id="budget-error" style={{ fontSize: '0.875rem', color: '#EF4444', marginTop: '0.25rem' }}>{errors.budget}</div>}
          </div>

          {/* Reward Per Share */}
          <div>
            <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', color: '#111827' }}>
              Reward Per Share <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <InputWithSlider>
              <input
                type="range"
                min="0.1"
                max="100"
                step="0.1"
                value={formData.sharingData?.rewardPerShare || 0}
                onChange={handleRewardChange}
              />
              <input
                type="number"
                value={formData.sharingData?.rewardPerShare || ''}
                onChange={handleRewardChange}
                placeholder="$"
                min="0.1"
                max="100"
                step="0.1"
                style={{
                  padding: '0.75rem',
                  border: `2px solid ${errors.rewardPerShare ? '#EF4444' : '#E2E8F0'}`,
                  borderRadius: '6px',
                  width: '120px',
                }}
                aria-invalid={!!errors.rewardPerShare}
                aria-describedby={errors.rewardPerShare ? `rewardPerShare-error` : undefined}
              />
            </InputWithSlider>
            <p style={{ color: '#64748B', marginTop: '0.5rem' }}>
              ${formData.sharingData?.rewardPerShare?.toFixed(2) || '0.00'} per share
            </p>
            {errors.rewardPerShare && <div id="rewardPerShare-error" style={{ fontSize: '0.875rem', color: '#EF4444', marginTop: '0.25rem' }}>{errors.rewardPerShare}</div>}
          </div>
        </FormRow>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem', color: '#0F172A' }}>Sharing Platforms</h3>
        <p style={{ color: '#64748B', marginBottom: '1rem', fontSize: '0.875rem' }}>
          Select up to 8 platforms where supporters can share your campaign
        </p>
        <CheckboxGrid>
          {SHARING_PLATFORMS.map((platform) => (
            <CheckboxLabel key={platform.id}>
              <input
                type="checkbox"
                checked={(formData.sharingData?.platforms || []).includes(platform.id)}
                onChange={() => togglePlatform(platform.id)}
                disabled={(formData.sharingData?.platforms || []).length >= 8 && !(formData.sharingData?.platforms || []).includes(platform.id)}
              />
              <div>{platform.name}</div>
            </CheckboxLabel>
          ))}
        </CheckboxGrid>
      </div>
    </FormGrid>
  )
}

export const Step3GoalsBudget: React.FC<Step3GoalsBudgetProps> = ({
  campaignType,
  formData,
  errors,
  onChange,
}) => {
  console.log('[Step3GoalsBudget] Rendering with:', { campaignType, formData, errors })
  
  if (campaignType === 'fundraising') {
    return (
      <FundraisingStep
        formData={formData}
        errors={errors}
        onChange={onChange}
      />
    )
  }

  return (
    <SharingStep
      formData={formData}
      errors={errors}
      onChange={onChange}
    />
  )
}
