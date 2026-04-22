'use client';

import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiShare2, FiHeart, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';
import Container, { Section, Grid } from '../ui/Container';
import Button from '../ui/Button';
import Tag from '../ui/Tag';
import Avatar from '../ui/Avatar';
import { Card, CardContent } from '../ui/Card';

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme?.spacing?.md || '12px'};
  margin-bottom: ${({ theme }) => theme?.spacing?.['2xl'] || '32px'};

  @media (min-width: ${({ theme }) => theme?.breakpoints?.tablet || '1024px'}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
`;

const SectionTitleGroup = styled.div``

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme?.typography?.sizes?.h2?.size || '32px'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.bold || '700'};
  color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
  margin-bottom: ${({ theme }) => theme?.spacing?.sm || '8px'};
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme?.typography?.sizes?.body?.size || '16px'};
  color: ${({ theme }) => theme?.colors?.muted || '#64748B'};
`;

const CampaignGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme?.spacing?.xl || '24px'};

  @media (min-width: ${({ theme }) => theme?.breakpoints?.mobile || '640px'}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme?.breakpoints?.tablet || '1024px'}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CampaignCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CardThumbnail = styled.div`
  width: 100%;
  aspect-ratio: 16/10;
  background: url('${({ image }) => image}') center/cover no-repeat;
  position: relative;
`;

const CardBadge = styled.div`
  position: absolute;
  top: ${({ theme }) => theme?.spacing?.md || '12px'};
  left: ${({ theme }) => theme?.spacing?.md || '12px'};
`;

const CardBody = styled(CardContent)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.sm || '8px'};
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '12px'};
`;

const CardTitle = styled.h4`
  font-size: ${({ theme }) => theme?.typography?.sizes?.h4?.size || '18px'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.semibold || '600'};
  color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
  margin-bottom: ${({ theme }) => theme?.spacing?.sm || '8px'};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme?.spacing?.sm || '8px'};
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '12px'};
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.xs || '4px'};
  font-size: ${({ theme }) => theme?.typography?.sizes?.small?.size || '14px'};
  color: ${({ theme }) => theme?.colors?.muted || '#64748B'};

  svg {
    width: 14px;
    height: 14px;
  }
`;

const RewardTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.xs || '4px'};
  padding: ${({ theme }) => theme?.spacing?.xs || '4px'} ${({ theme }) => theme?.spacing?.sm || '8px'};
  background-color: ${({ theme }) => (theme?.colors?.accentLight || '#FCD34D')}30;
  border-radius: ${({ theme }) => theme?.radii?.small || '6px'};
  font-size: ${({ theme }) => theme?.typography?.sizes?.xs?.size || '12px'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.medium || '500'};
  color: ${({ theme }) => theme?.colors?.accentDark || '#D97706'};
  margin-top: auto;
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '12px'};

  svg {
    width: 12px;
    height: 12px;
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme?.spacing?.sm || '8px'};
`;

const ViewAllButton = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme?.spacing?.['3xl'] || '48px'};
`;

const campaigns = [
  {
    id: 1,
    title: 'Fix my car to get to work',
    location: 'Modesto, CA',
    time: '2 days old',
    reward: '$5 reward per share',
    image: '/campaign-car.jpg',
    creator: 'Maria S.',
    boosted: false,
  },
  {
    id: 2,
    title: 'Medical bills for surgery recovery',
    location: 'Sacramento, CA',
    time: '5 hours ago',
    reward: '$10 reward per share',
    image: '/campaign-medical.jpg',
    creator: 'James T.',
    boosted: true,
  },
  {
    id: 3,
    title: 'School supplies for my classroom',
    location: 'Fresno, CA',
    time: '1 day ago',
    reward: 'Thank you card',
    image: '/campaign-school.jpg',
    creator: 'Sarah L.',
    boosted: false,
  },
  {
    id: 4,
    title: 'Rent help after job loss',
    location: 'Stockton, CA',
    time: '3 days ago',
    reward: '$8 reward per share',
    image: '/campaign-rent.jpg',
    creator: 'David M.',
    boosted: false,
  },
  {
    id: 5,
    title: 'New wheelchair for my mom',
    location: 'San Jose, CA',
    time: '12 hours ago',
    reward: '$15 reward per share',
    image: '/campaign-park.jpg',
    creator: 'Lisa K.',
    boosted: true,
  },
  {
    id: 6,
    title: 'Pet surgery for my dog',
    location: 'Oakland, CA',
    time: '4 days ago',
    reward: 'Pet photo update',
    image: '/campaign-moving.jpg',
    creator: 'Tom R.',
    boosted: false,
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

export default function CampaignFeed() {
  const router = useRouter();

  const handleSupportCampaign = () => {
    router.push('/login');
  };

  const handleShareCampaign = () => {
    router.push('/login');
  };

  const handleViewAllCampaigns = () => {
    router.push('/login');
  };

  return (
    <Section id="campaigns">
      <Container>
        <SectionHeader>
          <SectionTitleGroup>
            <SectionTitle>Active Campaigns</SectionTitle>
            <SectionSubtitle>
              Browse needs from people in your community
            </SectionSubtitle>
          </SectionTitleGroup>
        </SectionHeader>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <CampaignGrid>
            {campaigns.map((campaign) => (
              <motion.div key={campaign.id} variants={itemVariants}>
                <CampaignCard hoverable boosted={campaign.boosted}>
                  <CardThumbnail image={campaign.image}>
                    <CardBadge>
                      {campaign.boosted && (
                        <Tag variant="accent" size="small">Boosted</Tag>
                      )}
                    </CardBadge>
                  </CardThumbnail>
                  <CardBody>
                    <CardHeader>
                      <Avatar name={campaign.creator} size="small" />
                      <MetaItem>
                        <FiMapPin />
                        {campaign.location}
                      </MetaItem>
                    </CardHeader>
                    <CardTitle>{campaign.title}</CardTitle>
                    <CardMeta>
                      <MetaItem>
                        <FiClock />
                        {campaign.time}
                      </MetaItem>
                    </CardMeta>
                    <RewardTag>
                      <FiHeart />
                      {campaign.reward}
                    </RewardTag>
                    <CardActions>
                      <Button size="small" icon={FiHeart} onClick={handleSupportCampaign}>
                        Support
                      </Button>
                      <Button variant="secondary" size="small" icon={FiShare2} onClick={handleShareCampaign}>
                        Share
                      </Button>
                    </CardActions>
                  </CardBody>
                </CampaignCard>
              </motion.div>
            ))}
          </CampaignGrid>
        </motion.div>

        <ViewAllButton>
          <Button variant="secondary" icon={FiArrowRight} onClick={handleViewAllCampaigns}>
            View All Campaigns
          </Button>
        </ViewAllButton>
      </Container>
    </Section>
  );
}
