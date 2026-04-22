'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { Zap, Check } from 'lucide-react'
import { BoostTierCard } from '@/components/boost'
import { BOOST_TIERS } from '@/utils/boostValidationSchemas'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 1rem;

  h2 {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    font-size: 1.75rem;
    color: #0f172a;
    margin: 0 0 0.5rem;
    font-weight: 700;
  }

  p {
    color: #64748b;
    font-size: 1rem;
    margin: 0;
  }
`

const TiersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const SkipSection = styled.div`
  display: flex;
  justify-content: center;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  border-top: 2px dashed #cbd5e1;
`

const SkipButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 0.95rem;
  text-decoration: underline;
  padding: 0;
  transition: color 0.2s;

  &:hover {
    color: #475569;
  }
`

const InfoBox = styled.div`
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 0.75rem;
`

const InfoIcon = styled(Zap)`
  color: #3b82f6;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
`

const InfoText = styled.p`
  margin: 0;
  color: #0369a1;
  font-size: 0.9rem;
  line-height: 1.5;

  strong {
    font-weight: 600;
  }
`

const SelectedSummary = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`

const SummaryTitle = styled.h3`
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const SummaryContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
`

const SummaryLabel = styled.span`
  color: #64748b;
  font-size: 0.9rem;
`

const SummaryValue = styled.span`
  color: #0f172a;
  font-weight: 600;
  font-size: 1rem;
`

interface Step5BoostSelectionProps {
  selectedTier: string | null
  onTierSelect: (tier: string) => void
  onSkip: () => void
}

export const Step5BoostSelection: React.FC<Step5BoostSelectionProps> = ({
  selectedTier,
  onTierSelect,
  onSkip,
}) => {
  const selectedTierData = selectedTier ? BOOST_TIERS[selectedTier as keyof typeof BOOST_TIERS] : null

  return (
    <Container>
      <Header>
        <h2>
          <Zap size={28} />
          Boost Your Campaign Visibility
        </h2>
        <p>Help your campaign reach more supporters with optional visibility boost</p>
      </Header>

      <InfoBox>
        <InfoIcon />
        <InfoText>
          <strong>How it works:</strong> Boosted campaigns appear more frequently in the supporter feed.
          Higher visibility = more supporters. You can always boost later!
        </InfoText>
      </InfoBox>

      <TiersGrid>
        {(Object.keys(BOOST_TIERS) as Array<keyof typeof BOOST_TIERS>).map((tier) => (
          <BoostTierCard
            key={tier}
            tier={tier}
            isSelected={selectedTier === tier}
            onSelect={() => onTierSelect(tier)}
          />
        ))}
      </TiersGrid>

      {selectedTierData && (
        <SelectedSummary>
          <SummaryTitle>
            <Check size={18} style={{ color: '#10b981' }} />
            Summary: {selectedTierData.name}
          </SummaryTitle>
          <SummaryContent>
            <SummaryItem>
              <SummaryLabel>Price</SummaryLabel>
              <SummaryValue>${selectedTierData.price.toFixed(2)}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Visibility Multiplier</SummaryLabel>
              <SummaryValue>{selectedTierData.visibility_weight}x</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Duration</SummaryLabel>
              <SummaryValue>{selectedTierData.duration_days} days</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Status</SummaryLabel>
              <SummaryValue style={{ color: '#10b981' }}>✓ Ready</SummaryValue>
            </SummaryItem>
          </SummaryContent>
        </SelectedSummary>
      )}

      <SkipSection>
        <SkipButton onClick={onSkip}>
          Not interested? Skip boost and go straight to publishing →
        </SkipButton>
      </SkipSection>
    </Container>
  )
}

export default Step5BoostSelection
