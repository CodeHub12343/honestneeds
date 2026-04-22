'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiShare2, FiDollarSign, FiUsers, FiInfo, FiArrowRight } from 'react-icons/fi';
import Container, { Section } from '../ui/Container';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme?.spacing?.['3xl'] || '40px'};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme?.typography?.sizes?.h2?.size || '32px'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.bold || '700'};
  color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '12px'};
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme?.typography?.sizes?.body?.size || '16px'};
  color: ${({ theme }) => theme?.colors?.muted || '#64748B'};
  max-width: 600px;
  margin: 0 auto;
`;

const CalculatorCard = styled(motion.div)`
  background-color: ${({ theme }) => theme?.colors?.surface || '#FFFFFF'};
  border-radius: ${({ theme }) => theme?.radii?.large || '20px'};
  padding: ${({ theme }) => theme?.spacing?.['2xl'] || '32px'};
  box-shadow: ${({ theme }) => theme?.shadows?.elevation2 || '0 4px 12px rgba(0,0,0,0.1)'};
  max-width: 600px;
  margin: 0 auto ${({ theme }) => theme?.spacing?.['2xl'] || '32px'};
`;

const CalculatorTitle = styled.h3`
  font-size: ${({ theme }) => theme?.typography?.sizes?.h4?.size || '20px'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.semibold || '600'};
  color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '16px'};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.sm || '8px'};

  svg {
    color: ${({ theme }) => theme?.colors?.primary || '#6366F1'};
  }
`;

const SliderContainer = styled.div`
  margin-bottom: ${({ theme }) => theme?.spacing?.xl || '24px'};
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme?.spacing?.sm || '8px'};
`;

const SliderLabelText = styled.span`
  font-size: ${({ theme }) => theme?.typography?.sizes?.body?.size || '16px'};
  color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
`;

const SliderValue = styled.span`
  font-family: ${({ theme }) => theme?.typography?.headingFont || 'Poppins, sans-serif'};
  font-size: ${({ theme }) => theme?.typography?.sizes?.h4?.size || '20px'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.bold || '700'};
  color: ${({ theme }) => theme?.colors?.primary || '#6366F1'};
`;

const StyledSlider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: ${({ theme }) => theme?.radii?.pill || '9999px'};
  background: ${({ theme }) => theme?.colors?.bg || '#F8FAFC'};
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${({ theme }) => theme?.colors?.primary || '#6366F1'};
    cursor: pointer;
    box-shadow: ${({ theme }) => theme?.shadows?.elevation2 || '0 4px 12px rgba(0,0,0,0.1)'};
    transition: transform ${({ theme }) => theme?.transitions?.fast || '100ms ease'};

    &:hover {
      transform: scale(1.1);
    }
  }

  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${({ theme }) => theme?.colors?.primary || '#6366F1'};
    cursor: pointer;
    border: none;
    box-shadow: ${({ theme }) => theme?.shadows?.elevation2 || '0 4px 12px rgba(0,0,0,0.1)'};
  }
`;

const ResultBox = styled.div`
  background-color: ${({ theme }) => theme?.colors?.bg || '#F8FAFC'};
  border-radius: ${({ theme }) => theme?.radii?.medium || '12px'};
  padding: ${({ theme }) => theme?.spacing?.lg || '16px'};
  margin-top: ${({ theme }) => theme?.spacing?.lg || '16px'};
`;

const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme?.spacing?.sm || '8px'} 0;
  border-bottom: 1px dashed ${({ theme }) => theme?.colors?.border || '#E2E8F0'};

  &:last-child {
    border-bottom: none;
    padding-top: ${({ theme }) => theme?.spacing?.md || '12px'};
    margin-top: ${({ theme }) => theme?.spacing?.sm || '8px'};
  }
`;

const ResultLabel = styled.span`
  font-size: ${({ theme }) => theme?.typography?.sizes?.body?.size || '16px'};
  color: ${({ theme }) => theme?.colors?.muted || '#64748B'};
`;

const ResultValue = styled.span`
  font-family: ${({ theme }) => theme?.typography?.headingFont || 'Poppins, sans-serif'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.semibold || '600'};
  color: ${({ theme }) => theme?.colors?.text || '#0F172A'};

  ${({ highlight, theme }) => highlight && `
    color: ${theme?.colors?.primary || '#6366F1'};
    font-size: ${theme?.typography?.sizes?.h4?.size || '20px'};
  `}
`;

const InfoBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme?.spacing?.md || '12px'};
  padding: ${({ theme }) => theme?.spacing?.md || '12px'};
  background-color: rgba(245, 158, 11, 0.1);
  border-radius: ${({ theme }) => theme?.radii?.medium || '12px'};
  margin-top: ${({ theme }) => theme?.spacing?.lg || '16px'};

  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme?.colors?.accentDark || '#D97706'};
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const InfoText = styled.p`
  font-size: ${({ theme }) => theme?.typography?.sizes?.small?.size || '14px'};
  color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
  margin-bottom: 0;
  line-height: 1.5;
`;

const CTAWrap = styled.div`
  text-align: center;
`;

const StepsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme?.spacing?.xl || '24px'};
  margin-top: ${({ theme }) => theme?.spacing?.['3xl'] || '40px'};

  @media (min-width: ${({ theme }) => theme?.breakpoints?.tablet || '1024px'}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StepCard = styled(motion.div)`
  text-align: center;
`;

const StepNumber = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme?.colors?.primary || '#6366F1'} 0%, ${({ theme }) => theme?.colors?.secondary || '#F43F5E'} 100%);
  color: white;
  font-family: ${({ theme }) => theme?.typography?.headingFont || 'Poppins, sans-serif'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.bold || '700'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme?.spacing?.md || '12px'};
`;

const StepTitle = styled.h4`
  font-size: ${({ theme }) => theme?.typography?.sizes?.h4?.size || '20px'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.semibold || '600'};
  color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
  margin-bottom: ${({ theme }) => theme?.spacing?.sm || '8px'};
`;

const StepDescription = styled.p`
  font-size: ${({ theme }) => theme?.typography?.sizes?.small?.size || '14px'};
  color: ${({ theme }) => theme?.colors?.muted || '#64748B'};
  line-height: 1.6;
  margin-bottom: 0;
`;

const steps = [
  {
    number: 1,
    title: 'Set Your Budget',
    description: 'Choose how much you want to allocate for share rewards when creating your campaign.',
  },
  {
    number: 2,
    title: 'People Share',
    description: 'Supporters share your campaign with their network to help you reach more people.',
  },
  {
    number: 3,
    title: 'Earn Rewards',
    description: 'When a donation comes through a share, the sharer earns credits from your budget.',
  },
];

export default function ShareRewards() {
  const [shareBudget, setShareBudget] = useState(100);
  const platformFee = shareBudget * 0.20;
  const availableForSharers = shareBudget - platformFee;
  const estimatedShares = Math.floor(availableForSharers / 5);

  return (
    <Section>
      <Container>
        <SectionHeader>
          <SectionTitle>Share & Rewards</SectionTitle>
          <SectionSubtitle>
            Reward people who help spread the word about your campaign
          </SectionSubtitle>
        </SectionHeader>

        <CalculatorCard
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <CalculatorTitle>
            <FiDollarSign />
            Reward Calculator
          </CalculatorTitle>

          <SliderContainer>
            <SliderLabel>
              <SliderLabelText>Share Budget</SliderLabelText>
              <SliderValue>${shareBudget}</SliderValue>
            </SliderLabel>
            <StyledSlider
              type="range"
              min="20"
              max="500"
              step="10"
              value={shareBudget}
              onChange={(e) => setShareBudget(Number(e.target.value))}
            />
          </SliderContainer>

          <ResultBox>
            <ResultRow>
              <ResultLabel>Share Budget</ResultLabel>
              <ResultValue>${shareBudget.toFixed(2)}</ResultValue>
            </ResultRow>
            <ResultRow>
              <ResultLabel>Platform Fee (20%)</ResultLabel>
              <ResultValue>-${platformFee.toFixed(2)}</ResultValue>
            </ResultRow>
            <ResultRow>
              <ResultLabel>Available for Sharers</ResultLabel>
              <ResultValue highlight>${availableForSharers.toFixed(2)}</ResultValue>
            </ResultRow>
            <ResultRow>
              <ResultLabel>Est. Shares at $5 each</ResultLabel>
              <ResultValue highlight>{estimatedShares} shares</ResultValue>
            </ResultRow>
          </ResultBox>

          <InfoBox>
            <FiInfo />
            <InfoText>
              After your share budget runs out, people can still share your campaign for free. 
              The honor system ensures fair distribution of rewards.
            </InfoText>
          </InfoBox>
        </CalculatorCard>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <StepsGrid>
            {steps.map((step, index) => (
              <StepCard
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <StepNumber>{step.number}</StepNumber>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </StepCard>
            ))}
          </StepsGrid>
        </motion.div>

        <CTAWrap style={{ marginTop: '48px' }}>
          <Button variant="secondary" icon={FiArrowRight}>
            How to Set Share Rewards
          </Button>
        </CTAWrap>
      </Container>
    </Section>
  );
}
