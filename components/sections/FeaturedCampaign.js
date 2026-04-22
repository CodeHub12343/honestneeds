'use client';

import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiShare2, FiHeart, FiMapPin, FiClock, FiTrendingUp } from 'react-icons/fi';
import Container, { Section } from '../ui/Container';
import Button from '../ui/Button';
import Tag from '../ui/Tag';
import ProgressBar from '../ui/ProgressBar';
import Avatar from '../ui/Avatar';

const FeaturedGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme?.spacing?.['2xl'] || '32px'};
  align-items: center;

  @media (min-width: ${({ theme }) => theme?.breakpoints?.tablet || '1024px'}) {
    grid-template-columns: 1.2fr 1fr;
  }
`;

const ImageContainer = styled(motion.div)`
  position: relative;
  border-radius: ${({ theme }) => theme?.radii?.large || '20px'};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme?.shadows?.elevation3 || '0 18px 50px rgba(15, 23, 42, 0.12)'};
`;

const CampaignImage = styled.div`
  width: 100%;
  aspect-ratio: 16/10;
  background: url('/campaign-shelter.jpg') center/cover no-repeat;
  position: relative;
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${({ theme }) => theme?.spacing?.xl || '24px'};
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
`;

const BoostedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.xs || '4px'};
  padding: ${({ theme }) => theme?.spacing?.xs || '4px'} ${({ theme }) => theme?.spacing?.md || '12px'};
  background-color: ${({ theme }) => theme?.colors?.accent || '#F59E0B'};
  color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
  font-size: ${({ theme }) => theme?.typography?.sizes?.small?.size || '14px'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.semibold || '600'};
  border-radius: ${({ theme }) => theme?.radii?.pill || '9999px'};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ContentContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme?.spacing?.lg || '16px'};
`;

const CampaignHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.md || '12px'};
`;

const CampaignMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme?.spacing?.md || '12px'};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.xs || '4px'};
  font-size: ${({ theme }) => theme?.typography?.sizes?.small?.size || '14px'};
  color: ${({ theme }) => theme?.colors?.muted || '#64748B'};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const CampaignTitle = styled.h3`
  font-size: ${({ theme }) => theme?.typography?.sizes?.h2?.size || '32px'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.bold || '700'};
  color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
  line-height: 1.3;
`;

const CampaignStory = styled.p`
  font-size: ${({ theme }) => theme?.typography?.sizes?.body?.size || '16px'};
  color: ${({ theme }) => theme?.colors?.muted || '#64748B'};
  line-height: 1.7;
`;

const ProgressSection = styled.div`
  background-color: ${({ theme }) => theme?.colors?.bg || '#F8FAFC'};
  border-radius: ${({ theme }) => theme?.radii?.medium || '12px'};
  padding: ${({ theme }) => theme?.spacing?.lg || '16px'};
`;

const ProgressStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme?.spacing?.md || '12px'};
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-family: ${({ theme }) => theme?.typography?.headingFont || 'Poppins, sans-serif'};
  font-size: ${({ theme }) => theme?.typography?.sizes?.h4?.size || '20px'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.bold || '700'};
  color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme?.typography?.sizes?.xs?.size || '12px'};
  color: ${({ theme }) => theme?.colors?.muted || '#64748B'};
`;

const ActionRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme?.spacing?.md || '12px'};
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.sm || '8px'};
  font-size: ${({ theme }) => theme?.typography?.sizes?.small?.size || '14px'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.semibold || '600'};
  color: ${({ theme }) => theme?.colors?.primary || '#6366F1'};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '12px'};

  svg {
    width: 18px;
    height: 18px;
  }
`;

export default function FeaturedCampaign() {
  const router = useRouter();

  const handleSupport = () => {
    router.push('/login');
  };

  const handleShare = () => {
    router.push('/login');
  };

  return (
    <Section $bgColor="bg">
      <Container>
        <SectionLabel>
          <FiTrendingUp />
          Featured Campaign
        </SectionLabel>

        <FeaturedGrid>
          <ImageContainer
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <CampaignImage>
              <ImageOverlay>
                <BoostedBadge>
                  <FiTrendingUp />
                  Boosted
                </BoostedBadge>
              </ImageOverlay>
            </CampaignImage>
          </ImageContainer>

          <ContentContainer
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CampaignHeader>
              <Avatar src="/avatar-lisa.jpg" name="Westside Youth" size="large" />
              <div>
                <Tag variant="accent" size="small" icon={FiTrendingUp}>Boosted</Tag>
              </div>
            </CampaignHeader>

            <CampaignTitle>
              Help the Westside Youth Shelter
            </CampaignTitle>

            <CampaignMeta>
              <MetaItem>
                <FiMapPin />
                Modesto, CA
              </MetaItem>
              <MetaItem>
                <FiClock />
                3 days left
              </MetaItem>
            </CampaignMeta>

            <CampaignStory>
              Urgent shelter funding for winter supplies. We&apos;re raising funds to provide warm clothing, 
              blankets, and hot meals for homeless youth in our community. Every dollar goes directly 
              to those who need it most.
            </CampaignStory>

            <ProgressSection>
              <ProgressBar progress={72} label="of $5,000 goal" />
              <ProgressStats>
                <Stat>
                  <StatValue>$3,600</StatValue>
                  <StatLabel>Raised</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>48</StatValue>
                  <StatLabel>Supporters</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>3 days</StatValue>
                  <StatLabel>Remaining</StatLabel>
                </Stat>
              </ProgressStats>
            </ProgressSection>

            <ActionRow>
              <Button icon={FiHeart} onClick={handleSupport}>
                Support
              </Button>
              <Button variant="secondary" icon={FiShare2} onClick={handleShare}>
                Share
              </Button>
            </ActionRow>
          </ContentContainer>
        </FeaturedGrid>
      </Container>
    </Section>
  );
}
