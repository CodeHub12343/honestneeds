'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiDollarSign, FiTool, FiBox, FiHeart, FiUsers, FiAward } from 'react-icons/fi';
import Container, { Section } from '../ui/Container';

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
`;

const NeedTypeGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme?.spacing?.lg || '16px'};

  @media (min-width: ${({ theme }) => theme?.breakpoints?.mobile || '768px'}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme?.breakpoints?.tablet || '1024px'}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const NeedTypeCard = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme?.spacing?.lg || '16px'};
  padding: ${({ theme }) => theme?.spacing?.lg || '16px'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#E2E8F0'};
  border-radius: ${({ theme }) => theme?.radii?.medium || '12px'};
  background-color: ${({ theme }) => theme?.colors?.surface || '#FFFFFF'};
  transition: all ${({ theme }) => theme?.transitions?.normal || '200ms ease'};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366F1'};
    box-shadow: ${({ theme }) => theme?.shadows?.elevation2 || '0 4px 12px rgba(0,0,0,0.1)'};
    transform: translateY(-4px);
  }
`;

const IconContainer = styled.div`
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme?.radii?.medium || '12px'};
  background-color: ${({ $bgColor }) => $bgColor || '#FCE2E6'};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 28px;
    height: 28px;
    color: ${({ $iconColor }) => $iconColor || '#E11D48'};
  }
`;

const NeedTypeContent = styled.div`
  flex: 1;
`;

const NeedTypeTitle = styled.h3`
  font-size: ${({ theme }) => theme?.typography?.sizes?.h4?.size || '18px'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.semibold || '600'};
  color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
  margin-bottom: ${({ theme }) => theme?.spacing?.xs || '4px'};
`;

const NeedTypeDescription = styled.p`
  font-size: ${({ theme }) => theme?.typography?.sizes?.small?.size || '14px'};
  color: ${({ theme }) => theme?.colors?.muted || '#64748B'};
`;

const needTypes = [
  {
    id: 1,
    title: 'Money',
    description: 'Rent, medical & bills',
    icon: FiDollarSign,
    bgColor: '#FCE2E6',
    iconColor: '#E11D48',
  },
  {
    id: 2,
    title: 'Services',
    description: 'Moving, repairs, tutoring',
    icon: FiTool,
    bgColor: '#FCE2E6',
    iconColor: '#E11D48',
  },
  {
    id: 3,
    title: 'Items',
    description: 'Food, clothing, furniture',
    icon: FiBox,
    bgColor: '#FCE2E6',
    iconColor: '#E11D48',
  },
  {
    id: 4,
    title: 'Health',
    description: 'Medical care & meds',
    icon: FiHeart,
    bgColor: '#FCE2E6',
    iconColor: '#E11D48',
  },
  {
    id: 5,
    title: 'Community',
    description: 'Volunteers & events',
    icon: FiUsers,
    bgColor: '#FCE2E6',
    iconColor: '#E11D48',
  },
  {
    id: 6,
    title: 'Education',
    description: 'School supplies & tuition',
    icon: FiAward,
    bgColor: '#FCE2E6',
    iconColor: '#E11D48',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.2, 0.9, 0.2, 1],
    },
  },
};

export default function BrowseByNeedType() {
  return (
    <Section $bgColor="surface">
      <Container>
        <SectionHeader>
          <SectionTitle>Browse by Need Type</SectionTitle>
          <SectionSubtitle>
            Find campaigns that match what you care about most.
          </SectionSubtitle>
        </SectionHeader>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <NeedTypeGrid>
            {needTypes.map((need) => {
              const IconComponent = need.icon;
              return (
                <NeedTypeCard key={need.id} variants={itemVariants}>
                  <IconContainer $bgColor={need.bgColor} $iconColor={need.iconColor}>
                    <IconComponent />
                  </IconContainer>
                  <NeedTypeContent>
                    <NeedTypeTitle>{need.title}</NeedTypeTitle>
                    <NeedTypeDescription>{need.description}</NeedTypeDescription>
                  </NeedTypeContent>
                </NeedTypeCard>
              );
            })}
          </NeedTypeGrid>
        </motion.div>
      </Container>
    </Section>
  );
}
