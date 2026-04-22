'use client'

import styled from 'styled-components'
import { CampaignCard } from './CampaignCard'
import { Campaign } from '@/api/services/campaignService'

interface CampaignGridProps {
  campaigns: Campaign[]
  isLoading?: boolean
  onDonate?: (campaignId: string) => void
  onShare?: (campaignId: string) => void
}

// Styled Components
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const SkeletonCardWrapper = styled.div`
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`

const SkeletonImageBlock = styled.div`
  background-color: #e5e7eb;
  border-radius: 0.5rem;
  height: 12rem;
  margin-bottom: 1rem;
`

const SkeletonContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const SkeletonLine = styled.div<{ $height: string; $width?: string }>`
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  height: ${(props) => props.$height};
  width: ${(props) => props.$width || '100%'};
`

const SkeletonButtonRow = styled.div`
  display: flex;
  gap: 0.5rem;
`

const SkeletonButton = styled.div`
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  height: 2.5rem;
  flex: 1;
`

const EmptyStateContainer = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 0;
`

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`

const EmptyStateDescription = styled.p`
  color: #4b5563;
  margin-bottom: 1.5rem;
`

const ResetButton = styled.button`
  color: #6366f1;
  background: none;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #4f46e5;
  }

  &:focus {
    outline: none;
    text-decoration: underline;
  }
`

export function CampaignGrid({
  campaigns,
  isLoading,
  onDonate,
  onShare,
}: CampaignGridProps) {
  if (isLoading) {
    return (
      <GridContainer>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCardWrapper key={i}>
            <SkeletonImageBlock />
            <SkeletonContentWrapper>
              <SkeletonLine $height="1rem" $width="75%" />
              <SkeletonLine $height="0.75rem" $width="50%" />
              <SkeletonLine $height="0.5rem" $width="100%" />
              <SkeletonButtonRow>
                <SkeletonButton />
                <SkeletonButton />
              </SkeletonButtonRow>
            </SkeletonContentWrapper>
          </SkeletonCardWrapper>
        ))}
      </GridContainer>
    )
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <GridContainer>
        <EmptyStateContainer>
          <EmptyStateTitle>No campaigns found</EmptyStateTitle>
          <EmptyStateDescription>
            Try adjusting your filters or search criteria
          </EmptyStateDescription>
          <ResetButton onClick={() => window.location.reload()}>
            Reset filters & try again
          </ResetButton>
        </EmptyStateContainer>
      </GridContainer>
    )
  }

  return (
    <GridContainer>
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onDonate={onDonate}
          onShare={onShare}
        />
      ))}
    </GridContainer>
  )
}
