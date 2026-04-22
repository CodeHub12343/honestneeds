'use client'

import React from 'react'
import styled from 'styled-components'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/Button'

const StepIndicatorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`

const StepItem = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 120px;

  &:not(:last-child)::after {
    content: '';
    height: 1px;
    flex: 1;
    background-color: ${(props) =>
      props.isCompleted || props.isActive ? '#6366F1' : '#E2E8F0'};
    margin-left: 0.75rem;
  }
`

const StepBadge = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  font-size: 0.875rem;
  font-weight: 600;
  flex-shrink: 0;

  background-color: ${(props) =>
    props.isActive ? '#6366F1' : props.isCompleted ? '#10B981' : '#E2E8F0'};
  color: ${(props) => (props.isActive || props.isCompleted ? 'white' : '#64748B')};
  border: 2px solid
    ${(props) =>
      props.isActive ? '#6366F1' : props.isCompleted ? '#10B981' : 'transparent'};
`

const StepLabel = styled.span<{ isActive: boolean }>`
  font-size: 0.875rem;
  font-weight: ${(props) => (props.isActive ? '600' : '500')};
  color: ${(props) => (props.isActive ? '#0F172A' : '#64748B')};

  @media (max-width: 640px) {
    display: none;
  }
`

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
}) => {
  return (
    <StepIndicatorContainer role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNumber = i + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return (
          <StepItem key={stepNumber} isActive={isActive} isCompleted={isCompleted}>
            <StepBadge isActive={isActive} isCompleted={isCompleted}>
              {isCompleted ? <Check size={16} /> : stepNumber}
            </StepBadge>
            <StepLabel isActive={isActive}>{stepLabels[i]}</StepLabel>
          </StepItem>
        )
      })}
    </StepIndicatorContainer>
  )
}

const WizardActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #E2E8F0;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }
`

interface WizardActionsProps {
  currentStep: number
  totalSteps: number
  onBack: () => void
  onNext: () => void
  onSubmit?: () => void
  isLoading?: boolean
  canProceed?: boolean
}

export const WizardActions: React.FC<WizardActionsProps> = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  isLoading = false,
  canProceed = true,
}) => {
  const isFirstStep = currentStep === 1

  return (
    <WizardActionsContainer>
      <Button
        variant="outline"
        onClick={onBack}
        disabled={isFirstStep || isLoading}
      >
        <ChevronLeft size={18} />
        Back
      </Button>

      <Button
        onClick={currentStep === 8 ? onSubmit : onNext}
        disabled={!canProceed || isLoading}
      >
        {isLoading ? (
          'Publishing...'
        ) : currentStep === 8 ? (
          'Publish Campaign'
        ) : (
          <>
            Next
            <ChevronRight size={18} />
          </>
        )}
      </Button>
    </WizardActionsContainer>
  )
}
