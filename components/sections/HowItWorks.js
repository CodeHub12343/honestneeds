'use client';

import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiEdit3, FiShare2, FiHeart, FiArrowRight } from 'react-icons/fi';
import Container, { Section } from '../ui/Container';
import Button from '../ui/Button';

const StepsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme?.spacing?.xl || '24px'};

  @media (min-width: ${({ theme }) => theme?.breakpoints?.tablet || '1024px'}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StepCard = styled(motion.div)`
  background-color: ${({ theme }) => theme?.colors?.surface || '#FFFFFF'};
  border-radius: ${({ theme }) => theme?.radii?.large || '20px'};
  padding: ${({ theme }) => theme?.spacing?.xl || '24px'};
  box-shadow: ${({ theme }) => theme?.shadows?.elevation2 || '0 6px 18px rgba(15, 23, 42, 0.08)'};
  text-align: center;
  position: relative;
  transition: all ${({ theme }) => theme?.transitions?.normal || '200ms cubic-bezier(0.2, 0.9, 0.2, 1)'};

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${({ theme }) => theme?.shadows?.elevation3 || '0 18px 50px rgba(15, 23, 42, 0.12)'};
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -${({ theme }) => theme?.spacing?.xl || '24px'};
    width: ${({ theme }) => theme?.spacing?.xl || '24px'};
    height: 2px;
    background: linear-gradient(90deg, ${({ theme }) => theme?.colors?.border || '#E2E8F0'} 0%, transparent 100%);
    display: none;

    @media (min-width: ${({ theme }) => theme?.breakpoints?.tablet || '1024px'}) {
      display: block;
    }
  }

  &:last-child::after {
    display: none;
  }
`;

const StepNumber = styled.div`
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme?.colors?.primary || '#6366F1'} 0%, ${({ theme }) => theme?.colors?.secondary || '#F43F5E'} 100%);
  color: white;
  font-family: ${({ theme }) => theme?.typography?.headingFont || 'Poppins, sans-serif'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.bold || '700'};
  font-size: ${({ theme }) => theme?.typography?.sizes?.small?.size || '14px'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${({ theme, color }) => {
    switch (color) {
      case 'primary': return 'rgba(244, 63, 94, 0.1)';
      case 'secondary': return 'rgba(99, 102, 241, 0.1)';
      case 'accent': return 'rgba(245, 158, 11, 0.15)';
      default: return theme?.colors?.bg || '#F8FAFC';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme?.spacing?.lg || '16px'};

  svg {
    width: 36px;
    height: 36px;
    color: ${({ theme, color }) => {
      switch (color) {
        case 'primary': return theme?.colors?.primary || '#6366F1';
        case 'secondary': return theme?.colors?.secondary || '#F43F5E';
        case 'accent': return theme?.colors?.accentDark || '#D97706';
        default: return theme?.colors?.muted || '#64748B';
      }
    }};
  }
`;

const StepTitle = styled.h3`
  font-size: ${({ theme }) => theme?.typography?.sizes?.h4?.size || '20px'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.bold || '700'};
  color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
  margin-bottom: ${({ theme }) => theme?.spacing?.sm || '8px'};
`;

const StepDescription = styled.p`
  font-size: ${({ theme }) => theme?.typography?.sizes?.body?.size || '16px'};
  color: ${({ theme }) => theme?.colors?.muted || '#64748B'};
  line-height: 1.6;
  margin-bottom: 0;
`;

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

const CTAWrap = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme?.spacing?.['3xl'] || '40px'};
`;

const steps = [
  {
    number: 1,
    icon: FiEdit3,
    color: 'primary',
    title: 'Create a Campaign',
    description: 'Tell your story, set your need, and add your preferred payment methods. It takes just 5 minutes.',
  },
  {
    number: 2,
    icon: FiShare2,
    color: 'secondary',
    title: 'Share & Get Support',
    description: 'Share on social media or by message. People who care will send support directly to you.',
  },
  {
    number: 3,
    icon: FiHeart,
    color: 'accent',
    title: 'Reward & Thank',
    description: 'Offer thank-you rewards or paid shares to top supporters who help spread the word.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.2, 0.9, 0.2, 1],
    },
  },
};

export default function HowItWorks() {
  const router = useRouter();

  const handleStartCampaign = () => {
    router.push('/login');
  };

  return (
    <Section id="how-it-works">
      <Container>
        <SectionHeader>
          <SectionTitle>How HonestNeed Works</SectionTitle>
          <SectionSubtitle>
            Three simple steps to get the help you need from your community
          </SectionSubtitle>
        </SectionHeader>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <StepsGrid>
            {steps.map((step) => (
              <StepCard key={step.number} variants={itemVariants}>
                <StepNumber>{step.number}</StepNumber>
                <StepIcon color={step.color}>
                  <step.icon />
                </StepIcon>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </StepCard>
            ))}
          </StepsGrid>
        </motion.div>

        <CTAWrap>
          <Button size="large" icon={FiArrowRight} onClick={handleStartCampaign}>
            Start Your Campaign
          </Button>
        </CTAWrap>
      </Container>
    </Section>
  );
}
