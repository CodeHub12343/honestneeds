'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { AlertCircle, Loader, CheckCircle2 } from 'lucide-react'
import { useCreateCheckoutSession, useGetSessionStatus } from '@/api/hooks/useBoosts'
import { BOOST_TIERS } from '@/utils/boostValidationSchemas'
import { Button } from '@/components/Button'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const Header = styled.div`
  text-align: center;

  h2 {
    font-size: 1.5rem;
    color: #0f172a;
    margin: 0 0 0.5rem;
    font-weight: 700;
  }

  p {
    color: #64748b;
    font-size: 0.95rem;
    margin: 0;
  }
`

const PaymentCard = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
`

const PaymentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`

const PaymentLabel = styled.span`
  color: #64748b;
  font-size: 0.95rem;
`

const PaymentValue = styled.span`
  color: #0f172a;
  font-weight: 600;
  font-size: 1rem;
`

const TotalRow = styled(PaymentRow)`
  padding-top: 1rem;
  margin-top: 1rem;
  padding-bottom: 1rem;
  border-top: 2px solid #cbd5e1;

  ${PaymentLabel} {
    font-weight: 700;
    font-size: 1.1rem;
  }

  ${PaymentValue} {
    font-size: 1.25rem;
    color: #3b82f6;
  }
`

const InfoBox = styled.div`
  background-color: #dbeafe;
  border-left: 4px solid #3b82f6;
  border-radius: 4px;
  padding: 1rem;
  color: #1e40af;
  font-size: 0.9rem;
  display: flex;
  gap: 0.75rem;

  svg {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    margin-top: 2px;
  }

  p {
    margin: 0;
    line-height: 1.5;
  }
`

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`

const ProcessingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background-color: #f0fdf4;
  border-radius: 8px;
  color: #166534;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const SuccessMessage = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 8px;
  color: #166534;

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-top: 2px;
  }

  p {
    margin: 0;
    line-height: 1.5;
  }
`

interface Step6BoostPaymentProps {
  campaignId: string
  campaignTitle: string
  boostTier: string
  onSuccess: () => void
  onCancel: () => void
  isProcessing?: boolean
}

export const Step6BoostPayment: React.FC<Step6BoostPaymentProps> = ({
  campaignId,
  campaignTitle,
  boostTier,
  onSuccess,
  onCancel,
  isProcessing = false,
}) => {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isInitiating, setIsInitiating] = useState(false)

  const createCheckoutMutation = useCreateCheckoutSession()
  const { data: sessionStatus } = useGetSessionStatus(sessionId)

  const tierData = BOOST_TIERS[boostTier as keyof typeof BOOST_TIERS]

  // Monitor session status for payment completion
  useEffect(() => {
    if (sessionStatus?.payment_status === 'paid') {
      // Payment successful
      setTimeout(() => {
        onSuccess()
      }, 1500)
    }
  }, [sessionStatus, onSuccess])

  const handleInitiateCheckout = async () => {
    if (!tierData || tierData.price === 0) {
      // Free tier
      onSuccess()
      return
    }

    setIsInitiating(true)

    try {
      const result = await createCheckoutMutation.mutateAsync({
        campaign_id: campaignId,
        tier: boostTier,
      })

      if (result.checkout_url) {
        setSessionId(result.checkout_session_id)
        // Redirect to Stripe checkout
        window.location.href = result.checkout_url
      } else {
        // Free tier
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error)
      setIsInitiating(false)
    }
  }

  if (!tierData) {
    return <div>Invalid boost tier</div>
  }

  return (
    <Container>
      <Header>
        <h2>Confirm Boost Purchase</h2>
        <p>Campaign: {campaignTitle}</p>
      </Header>

      <PaymentCard>
        <PaymentRow>
          <PaymentLabel>Boost Tier</PaymentLabel>
          <PaymentValue>{tierData.name}</PaymentValue>
        </PaymentRow>

        <PaymentRow>
          <PaymentLabel>Visibility Multiplier</PaymentLabel>
          <PaymentValue>{tierData.visibility_weight}x</PaymentValue>
        </PaymentRow>

        <PaymentRow>
          <PaymentLabel>Duration</PaymentLabel>
          <PaymentValue>{tierData.duration_days} days</PaymentValue>
        </PaymentRow>

        <TotalRow>
          <PaymentLabel>Total Cost</PaymentLabel>
          <PaymentValue>${tierData.price.toFixed(2)}</PaymentValue>
        </TotalRow>
      </PaymentCard>

      <InfoBox>
        <AlertCircle />
        <p>
          You'll be redirected to our secure payment processor (Stripe). After payment, your boost will
          activate immediately and your campaign will be published.
        </p>
      </InfoBox>

      {sessionStatus?.payment_status === 'paid' && (
        <SuccessMessage>
          <CheckCircle2 />
          <p>
            <strong>Payment successful!</strong> Your boost is active and campaign is publishing...
          </p>
        </SuccessMessage>
      )}

      {isInitiating || isProcessing || sessionId ? (
        <ProcessingSpinner>
          <Loader />
          <span>Processing payment...</span>
        </ProcessingSpinner>
      ) : (
        <ActionButtonsContainer>
          <Button variant="outline" onClick={onCancel} disabled={isInitiating || isProcessing}>
            Back
          </Button>
          <Button
            variant="primary"
            onClick={handleInitiateCheckout}
            disabled={isInitiating || isProcessing}
          >
            {tierData.price === 0 ? 'Continue with Free Boost' : `Pay $${tierData.price.toFixed(2)}`}
          </Button>
        </ActionButtonsContainer>
      )}
    </Container>
  )
}

export default Step6BoostPayment
