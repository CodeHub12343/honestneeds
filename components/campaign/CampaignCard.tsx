'use client'

import Link from 'next/link'
import Image from 'next/image'
import styled from 'styled-components'
import { useState } from 'react'
import { TrendingUp, Share2, Users, Hand, MapPin, Map, Globe, Zap, Copy, Check } from 'lucide-react'
import { Campaign } from '@/api/services/campaignService'
import { normalizeImageUrl } from '@/utils/imageUtils'
import Button from '@/components/ui/Button'
import { ShareWizard } from './ShareWizard'

interface CampaignCardProps {
  campaign: Campaign
  onDonate?: (campaignId: string) => void
  onShare?: (campaignId: string) => void
}

// Styled Components
const CardContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`

const ImageContainer = styled.div`
  position: relative;
  height: 12rem;
  background-color: #e5e7eb;
  overflow: hidden;
`

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, rgba(99, 102, 241, 0.1), rgba(118, 75, 162, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
`

const PlaceholderText = styled.span`
  color: #9ca3af;
  font-size: 0.875rem;
`

const BadgesContainer = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const BaseBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`

const ScopeBadge = styled(BaseBadge)<{ $scope: string }>`
  background-color: ${(props) => {
    switch (props.$scope) {
      case 'local':
        return '#dbeafe'
      case 'regional':
        return '#dcfce7'
      case 'national':
        return '#f3e8ff'
      case 'global':
        return '#fed7aa'
      default:
        return '#f3f4f6'
    }
  }};
  color: ${(props) => {
    switch (props.$scope) {
      case 'local':
        return '#1d4ed8'
      case 'regional':
        return '#15803d'
      case 'national':
        return '#6b21a8'
      case 'global':
        return '#b45309'
      default:
        return '#374151'
    }
  }};
`

const TrendingBadge = styled(BaseBadge)`
  background-color: #fed7aa;
  color: #b45309;
`

const CompletedBadge = styled(BaseBadge)`
  background-color: #dcfce7;
  color: #15803d;
`

const ShareToEarnBadge = styled(BaseBadge)`
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #0c4a6e;
  font-weight: 600;
  border: 1px solid #93c5fd;
`

const BoostBadge = styled(BaseBadge)<{ $tier: string }>`
  background-color: ${(props) => {
    switch (props.$tier) {
      case 'basic':
        return '#dbeafe'
      case 'pro':
        return '#e9d5ff'
      case 'premium':
        return '#fef3c7'
      default:
        return '#f3f4f6'
    }
  }};
  color: ${(props) => {
    switch (props.$tier) {
      case 'basic':
        return '#0c4a6e'
      case 'pro':
        return '#6b21a8'
      case 'premium':
        return '#b45309'
      default:
        return '#374151'
    }
  }};
  font-weight: 600;
  border: 1px solid ${(props) => {
    switch (props.$tier) {
      case 'basic':
        return '#93c5fd'
      case 'pro':
        return '#d8b4fe'
      case 'premium':
        return '#fde047'
      default:
        return '#d1d5db'
    }
  }};
  background: ${(props) => {
    switch (props.$tier) {
      case 'premium':
        return 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)'
      case 'pro':
        return 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)'
      case 'basic':
        return 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
      default:
        return '#f3f4f6'
    }
  }};
`

const ContentSection = styled.div`
  padding: 1rem;
`

const TitleCreatorSection = styled.div`
  margin-bottom: 0.75rem;
`

const CampaignTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  transition: color 0.2s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  &:hover {
    color: #6366f1;
  }
`

const CreatorLink = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
  transition: color 0.2s ease;
  margin-top: 0.25rem;

  &:hover {
    color: #6366f1;
  }
`

const ProgressSection = styled.div`
  margin-bottom: 0.75rem;
`

const ProgressLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
`

const ProgressLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: #4b5563;
`

const ProgressPercent = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: #111827;
`

const ProgressBar = styled.div`
  width: 100%;
  background-color: #e5e7eb;
  border-radius: 9999px;
  height: 0.5rem;
  overflow: hidden;
`

const ProgressBarFill = styled.div<{ $percentage: number }>`
  background: linear-gradient(to right, #6366f1, #764ba2);
  border-radius: 9999px;
  height: 100%;
  width: ${(props) => props.$percentage}%;
  transition: width 0.3s ease;
`

const ProgressValuesRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.25rem;
`

const ProgressValue = styled.span`
  font-size: 0.75rem;
  color: #4b5563;
`

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;

  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const MetricCard = styled.div`
  background-color: #f9fafb;
  border-radius: 0.25rem;
  padding: 0.5rem;
`

const MetricLabel = styled.div`
  font-size: 0.75rem;
  color: #4b5563;
`

const MetricValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
`

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`

const ActionButton = styled(Button)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
`

const ViewDetailsLink = styled(Link)`
  display: block;
  text-align: center;
  font-size: 0.75rem;
  color: #6366f1;
  text-decoration: none;
  margin-top: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: #4f46e5;
    text-decoration: underline;
  }
`

export function CampaignCard({
  campaign,
  onDonate,
  onShare,
}: CampaignCardProps) {
  const [isShareWizardOpen, setIsShareWizardOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShareLink = () => {
    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/campaigns/${campaign.id}`
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Compute goal amount from goals array or use fallback
  const goalAmount = campaign.goals?.length > 0 
    ? campaign.goals[0].target_amount 
    : 0

  // Use total_donation_amount from backend (in cents)
  const raisedAmount = campaign.total_donation_amount || 0

  const progressPercent = goalAmount > 0
    ? Math.min((raisedAmount / goalAmount) * 100, 100)
    : 0

  const goalInDollars = (goalAmount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  const raisedInDollars = (raisedAmount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  const getScopeIcon = () => {
    switch (campaign.geographicScope) {
      case 'local':
        return <MapPin size={14} />
      case 'regional':
        return <Map size={14} />
      case 'national':
        return <Globe size={14} />
      case 'global':
        return <Zap size={14} />
      default:
        return null
    }
  }

  const getScopeLabel = () => {
    if (!campaign.geographicScope) return ''
    const label = campaign.geographicScope.charAt(0).toUpperCase() + campaign.geographicScope.slice(1)
    return label
  }

  const getBoostTierLabel = () => {
    const tier = campaign.current_boost_tier || 'basic'
    return tier.charAt(0).toUpperCase() + tier.slice(1)
  }

  const getBoostTierEmoji = () => {
    switch (campaign.current_boost_tier) {
      case 'basic':
        return '⚡'
      case 'pro':
        return '🚀'
      case 'premium':
        return '👑'
      default:
        return '⭐'
    }
  }

  return (
    <CardContainer>
      {/* Image Container */}
      <ImageContainer>
        {campaign.image_url || campaign.image?.url ? (
          <Image
            src={normalizeImageUrl(campaign.image_url || campaign.image?.url) || '/placeholder-campaign.png'}
            alt={campaign.image?.alt || campaign.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <ImagePlaceholder>
            <PlaceholderText>No image</PlaceholderText>
          </ImagePlaceholder>
        )}

        {/* Status Badge */}
        <BadgesContainer>
          {campaign.is_boosted && (
            <BoostBadge $tier={campaign.current_boost_tier || 'basic'}>
              {getBoostTierEmoji()}
              {getBoostTierLabel()} Boosted
            </BoostBadge>
          )}
          {campaign.campaign_type === 'sharing' && (
            <ShareToEarnBadge>
              💰 Share to Earn
            </ShareToEarnBadge>
          )}
          {campaign.geographicScope && (
            <ScopeBadge $scope={campaign.geographicScope}>
              {getScopeIcon()}
              {getScopeLabel()}
            </ScopeBadge>
          )}
          {campaign.trending && (
            <TrendingBadge>
              <TrendingUp size={14} />
              Trending
            </TrendingBadge>
          )}
          {campaign.status === 'completed' && (
            <CompletedBadge>
              <span>✓</span>
              Completed
            </CompletedBadge>
          )}
        </BadgesContainer>
      </ImageContainer>

      {/* Content */}
      <ContentSection>
        {/* Title & Creator */}
        <TitleCreatorSection>
          <Link href={`/campaigns/${campaign.id}`}>
            <CampaignTitle>
              {campaign.title}
            </CampaignTitle>
          </Link>
          <Link href={`/creator/${campaign.creator_id}`}>
            <CreatorLink>
              by {campaign.creator_name}
            </CreatorLink>
          </Link>
        </TitleCreatorSection>

        {/* Progress Bar */}
        <ProgressSection>
          <ProgressLabelRow>
            <ProgressLabel>Progress</ProgressLabel>
            <ProgressPercent>
              {progressPercent.toFixed(0)}%
            </ProgressPercent>
          </ProgressLabelRow>
          <ProgressBar>
            <ProgressBarFill $percentage={progressPercent} />
          </ProgressBar>
          <ProgressValuesRow>
            <ProgressValue>{raisedInDollars}</ProgressValue>
            <ProgressValue>of {goalInDollars}</ProgressValue>
          </ProgressValuesRow>
        </ProgressSection>

        {/* Metrics */}
        <MetricsGrid>
          {campaign.campaign_type === 'fundraising' && (
            <MetricCard>
              <MetricLabel>Total Donation</MetricLabel>
              <MetricValue>
                {campaign.total_donation_amount 
                  ? `$${(campaign.total_donation_amount / 100).toFixed(0)}` 
                  : '$0'}
              </MetricValue>
            </MetricCard>
          )}
          {campaign.campaign_type === 'sharing' && (
            <MetricCard>
              <MetricLabel>Shares</MetricLabel>
              <MetricValue>
                {(campaign.share_count || 0).toLocaleString()}
              </MetricValue>
            </MetricCard>
          )}
          <MetricCard>
            <MetricLabel>Supporters</MetricLabel>
            <MetricValue>
              {(campaign.total_donors || 0).toLocaleString()}
            </MetricValue>
          </MetricCard>
        </MetricsGrid>

        {/* Actions */}
        <ActionsContainer>
          {campaign.campaign_type === 'sharing' ? (
            <>
              <ActionButton
                onClick={() => setIsShareWizardOpen(true)}
                variant="primary"
                size="sm"
              >
                💰 Share to Earn
              </ActionButton>
              <ActionButton
                onClick={handleShareLink}
                variant="outline"
                size="sm"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </ActionButton>
            </>
          ) : (
            <>
              <ActionButton
                onClick={() => onDonate?.(campaign.id)}
                variant="primary"
                size="sm"
              >
                <Hand size={16} />
                Donate
              </ActionButton>
              <ActionButton
                onClick={() => onShare?.(campaign.id)}
                variant="outline"
                size="sm"
              >
                <Share2 size={16} />
                Share
              </ActionButton>
            </>
          )}
        </ActionsContainer>

        {/* View Details Link */}
        <ViewDetailsLink href={`/campaigns/${campaign.id}`}>
          View details →
        </ViewDetailsLink>
      </ContentSection>

      {/* Share Wizard Modal */}
      <ShareWizard
        isOpen={isShareWizardOpen}
        onClose={() => setIsShareWizardOpen(false)}
        campaignId={campaign.id}
        campaignTitle={campaign.title}
        campaignDescription={campaign.description || campaign.full_description}
        creator_name={campaign.creator_name}
        share_config={campaign.share_config}
      />
    </CardContainer>
  )
}
