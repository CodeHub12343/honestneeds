'use client'

import React from 'react'
import styled from 'styled-components'
import { Zap, Share2 } from 'lucide-react'

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`

const TypeCard = styled.button<{ isSelected: boolean }>`
  padding: 2rem;
  border: 2px solid ${(props) => (props.isSelected ? '#6366F1' : '#E2E8F0')};
  border-radius: 12px;
  background-color: ${(props) => (props.isSelected ? '#EEF2FF' : '#FFFFFF')};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;

  &:hover {
    border-color: #6366F1;
    background-color: #EEF2FF;
  }

  &:focus-visible {
    outline: 2px solid #6366F1;
    outline-offset: 2px;
  }
`

const IconWrapper = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 8px;
  background-color: ${(props) => (props.isSelected ? '#6366F1' : '#F1F5F9')};
  color: ${(props) => (props.isSelected ? 'white' : '#64748B')};
  transition: all 0.3s ease;
`

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #0F172A;
  margin: 0;
`

const Description = styled.p`
  font-size: 0.875rem;
  color: #64748B;
  line-height: 1.5;
  margin: 0;
`

interface Step1aTypeSelectionProps {
  selectedType: 'fundraising' | 'sharing' | null
  onTypeSelect: (type: 'fundraising' | 'sharing') => void
}

export const Step1aTypeSelection: React.FC<Step1aTypeSelectionProps> = ({
  selectedType,
  onTypeSelect,
}) => {
  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0F172A' }}>
        What type of campaign do you want to create?
      </h2>
      <p style={{ color: '#64748B', marginBottom: '2rem' }}>
        Choose between direct fundraising or share-based campaigns to engage supporters.
      </p>

      <Container role="group" aria-label="Campaign type selection">
        <TypeCard
          type="button"
          isSelected={selectedType === 'fundraising'}
          onClick={() => onTypeSelect('fundraising')}
          aria-pressed={selectedType === 'fundraising'}
        >
          <IconWrapper isSelected={selectedType === 'fundraising'}>
            <Zap size={24} />
          </IconWrapper>
          <Title>Fundraising Campaign</Title>
          <Description>
            Collect direct donations. Set a monetary goal and choose payment methods. Track money raised
            and donor information.
          </Description>
        </TypeCard>

        <TypeCard
          type="button"
          isSelected={selectedType === 'sharing'}
          onClick={() => onTypeSelect('sharing')}
          aria-pressed={selectedType === 'sharing'}
        >
          <IconWrapper isSelected={selectedType === 'sharing'}>
            <Share2 size={24} />
          </IconWrapper>
          <Title>Sharing Campaign</Title>
          <Description>
            Reward supporters for sharing. Allocate a budget and reward per share. Track viral spread
            across social platforms.
          </Description>
        </TypeCard>
      </Container>
    </div>
  )
}
