'use client'

import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Share2,
  Hand,
  Flag,
  Calendar,
  Users,
  TrendingUp,
  RefreshCw,
  Copy,
  Check,
  Briefcase,
} from 'lucide-react'
import { toast } from 'react-toastify'
import {
  useCampaign,
  useCampaignAnalytics,
  useRelatedCampaigns,
  useRecordShare,
} from '@/api/hooks/useCampaigns'
import { normalizeImageUrl } from '@/utils/imageUtils'
import { ProgressBar } from '@/components/campaign/ProgressBar'
import { MultiMeterDisplay, createMeterData } from '@/components/campaign/MultiMeterDisplay'
import { CampaignCard } from '@/components/campaign/CampaignCard'
import { CampaignUpdates } from '@/components/campaign/CampaignUpdates'
import { OfferHelpModal } from '@/components/donation/OfferHelpModal'
import { VolunteerOffers } from '@/components/creator/VolunteerOffers'
import { QRCodeDisplay } from '@/components/campaign/QRCodeDisplay'
import { FlyerDownload } from '@/components/campaign/FlyerDownload'
import { PaymentDirectory } from '@/components/campaign/PaymentDirectory'
import { ShareWizard } from '@/components/campaign/ShareWizard'
import { ShareInfoSection } from '@/components/campaign/ShareInfoSection'
import { ReferralClickTracker } from '@/components/campaign/ReferralClickTracker'
import { PrayButton } from '@/components/campaign/PrayButton'
import { PrayerActivityFeed } from '@/components/campaign/PrayerActivityFeed'
import { PrayerMeter } from '@/components/campaign/PrayerMeter'
import PrayerModal from '@/components/campaign/PrayerModal'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: visible;
`

const HeroSection = styled.div`
  position: relative;
  height: 16rem;
  background-color: #d1d5db;
  overflow: hidden;

  @media (min-width: 480px) {
    height: 20rem;
  }

  @media (min-width: 640px) {
    height: 28rem;
  }

  @media (min-width: 1024px) {
    height: 32rem;
  }
`

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.2) 100%
  );
`

const HeroContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
`

const HeroGradient = styled.div`
  width: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4));
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 380px) {
    padding: 0.75rem;
  }

  @media (min-width: 480px) {
    padding: 1.5rem;
  }

  @media (min-width: 640px) {
    padding: 2rem;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 0.5rem;
    line-height: 1.2;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    word-wrap: break-word;
    hyphens: auto;
    overflow-wrap: break-word;
    word-break: break-word;

    @media (max-width: 380px) {
      font-size: 1.25rem;
      margin-bottom: 0.375rem;
    }

    @media (min-width: 480px) {
      font-size: 1.875rem;
    }

    @media (min-width: 640px) {
      font-size: 2.5rem;
    }
  }

  p {
    color: #e5e7eb;
    font-size: 0.875rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    word-break: break-word;
    overflow-wrap: break-word;

    @media (max-width: 380px) {
      font-size: 0.75rem;
    }

    @media (min-width: 640px) {
      font-size: 1rem;
    }
  }

  a {
    color: white;
    font-weight: 600;
    text-decoration: none;
    transition: color 200ms;
    word-break: break-word;

    &:hover {
      color: #f3f4f6;
    }
  }
`

const MainContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem 0.75rem;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: visible;

  @media (max-width: 360px) {
    padding: 1rem 0.5rem;
  }

  @media (min-width: 480px) {
    padding: 2rem 0.875rem;
  }

  @media (min-width: 640px) {
    padding: 2.5rem 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 3rem 2rem;
  }
`

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;
  align-items: start;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 380px) {
    gap: 1rem;
  }

  @media (min-width: 640px) {
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
    gap: 2.5rem;
  }
`

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 380px) {
    gap: 1rem;
  }

  @media (min-width: 480px) {
    gap: 1.625rem;
  }

  @media (min-width: 640px) {
    gap: 1.875rem;
  }

  @media (min-width: 1024px) {
    gap: 2rem;
  }
`

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 380px) {
    gap: 1rem;
  }

  @media (min-width: 640px) {
    gap: 1.625rem;
  }

  @media (min-width: 1024px) {
    gap: 1.75rem;
  }
`

const Card = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  transition: box-shadow 200ms ease;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: visible;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 380px) {
    padding: 0.75rem;
    border-radius: 0.375rem;
  }

  @media (min-width: 480px) {
    padding: 1.5rem;
  }

  @media (min-width: 640px) {
    padding: 2rem;
    box-shadow: 0 1px 2px -1px rgba(0, 0, 0, 0.1), 0 1px 3px -1px rgba(0, 0, 0, 0.1);
  }

  &:hover {
    @media (min-width: 640px) {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 1rem;
    letter-spacing: -0.5px;
    word-break: break-word;

    @media (max-width: 380px) {
      font-size: 1.1rem;
      margin-bottom: 0.75rem;
    }

    @media (min-width: 640px) {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }
  }

  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.75rem;
    letter-spacing: -0.25px;
    word-break: break-word;

    @media (max-width: 380px) {
      font-size: 0.95rem;
      margin-bottom: 0.5rem;
    }

    @media (min-width: 640px) {
      font-size: 1.125rem;
      margin-bottom: 1rem;
    }
  }
`

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.875rem;
  margin-top: 1.75rem;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 380px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  @media (min-width: 480px) {
    gap: 1rem;
    margin-top: 2rem;
  }

  @media (min-width: 640px) {
    gap: 1.125rem;
    margin-top: 2.25rem;
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
    gap: 1.25rem;
  }
`

const MetricCard = styled.div`
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 0.5rem;
  padding: 0.875rem;
  text-align: center;
  border: 1px solid #e5e7eb;
  transition: all 200ms ease;
  overflow-x: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 380px) {
    padding: 0.75rem;
  }

  @media (min-width: 640px) {
    padding: 1.125rem;
  }

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  p:first-child {
    font-size: 0.7rem;
    color: #6b7280;
    margin-bottom: 0.375rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    word-break: break-word;

    @media (max-width: 380px) {
      font-size: 0.65rem;
      margin-bottom: 0.25rem;
    }

    @media (min-width: 640px) {
      font-size: 0.8rem;
      margin-bottom: 0.5rem;
    }
  }

  p:last-child {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    line-height: 1;
    word-break: break-word;
    overflow-wrap: break-word;

    @media (max-width: 380px) {
      font-size: 1rem;
    }

    @media (min-width: 640px) {
      font-size: 1.625rem;
    }
  }
`

const DescriptionContent = styled.div`
  color: #374151;
  line-height: 1.7;
  font-size: 0.875rem;
  letter-spacing: 0.3px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 380px) {
    font-size: 0.8rem;
    line-height: 1.6;
    letter-spacing: 0.2px;
  }

  @media (min-width: 640px) {
    font-size: 0.95rem;
    line-height: 1.75;
    letter-spacing: 0.2px;
  }

  p {
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: break-word;
    margin-bottom: 1rem;

    @media (max-width: 380px) {
      margin-bottom: 0.75rem;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`

const CTAButtonsContainer = styled(Card)`
  position: sticky;
  top: 0.5rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 380px) {
    gap: 0.375rem;
    padding: 0.75rem;
    top: 0.25rem;
  }

  @media (min-width: 480px) {
    gap: 0.625rem;
    padding: 1.25rem;
    top: 1rem;
  }

  @media (min-width: 640px) {
    top: 1.5rem;
    gap: 0.75rem;
    padding: 1.5rem;
  }

  @media (min-width: 1024px) {
    top: 5rem;
    box-shadow: 0 1px 2px -1px rgba(0, 0, 0, 0.1), 0 1px 3px -1px rgba(0, 0, 0, 0.1);
  }

  button {
    min-height: 44px;
    word-break: break-word;
    overflow-wrap: break-word;
    
    @media (max-width: 380px) {
      min-height: 40px;
      font-size: 0.875rem;
      padding: 0.5rem;
    }

    @media (min-width: 640px) {
      min-height: 48px;
    }
  }
`

const ShareButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  background-color: #f9fafb;
  padding: 0.625rem;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;

  @media (max-width: 380px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.375rem;
    padding: 0.5rem;
  }

  @media (min-width: 480px) {
    gap: 0.625rem;
    padding: 0.75rem;
  }
`

const ShareButton = styled.button`
  padding: 0.6rem;
  min-height: 40px;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  cursor: pointer;
  transition: all 200ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  font-feature-settings: 'tnum';
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  @media (max-width: 380px) {
    padding: 0.5rem;
    min-height: 36px;
    font-size: 0.65rem;
  }

  @media (min-width: 640px) {
    padding: 0.75rem;
    min-height: 44px;
    font-size: 0.875rem;
  }

  &:hover {
    background-color: #f3f4f6;
    border-color: #9ca3af;
  }

  &:active {
    background-color: #e5e7eb;
  }

  &:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }
`

const ReportButton = styled.button`
  width: 100%;
  padding: 0.6rem 0.75rem;
  min-height: 40px;
  font-size: 0.75rem;
  color: #dc2626;
  background-color: white;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 200ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  font-weight: 500;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 380px) {
    padding: 0.5rem 0.5rem;
    min-height: 36px;
    font-size: 0.65rem;
    gap: 0.25rem;
  }

  @media (min-width: 640px) {
    padding: 0.6rem 1rem;
    min-height: 44px;
    font-size: 0.875rem;
    gap: 0.5rem;
  }

  &:hover {
    background-color: #fef2f2;
    border-color: #f87171;
  }

  &:active {
    background-color: #fee2e2;
  }

  &:focus {
    outline: 2px solid #dc2626;
    outline-offset: 2px;
  }
`

const CampaignDetailsCard = styled(Card)`
  div {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    margin-bottom: 0.875rem;
    padding-bottom: 0.875rem;
    border-bottom: 1px solid #f3f4f6;
    min-width: 0;
    flex-wrap: wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
    box-sizing: border-box;

    @media (max-width: 380px) {
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      padding-bottom: 0.75rem;
    }

    @media (min-width: 640px) {
      gap: 0.75rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
    }

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    svg {
      color: #6b7280;
      flex-shrink: 0;
      margin-top: 0.125rem;
      width: 16px;
      height: 16px;
      transition: color 200ms ease;

      @media (max-width: 380px) {
        width: 14px;
        height: 14px;
      }

      @media (min-width: 640px) {
        width: 18px;
        height: 18px;
      }
    }

    > div {
      display: flex;
      flex-direction: column;
      gap: 0;
      flex: 1;
      min-width: 0;
      box-sizing: border-box;

      p:first-child {
        font-size: 0.7rem;
        color: #9ca3af;
        margin-bottom: 0.25rem;
        font-weight: 500;
        letter-spacing: 0.3px;
        text-transform: uppercase;
        word-break: break-word;

        @media (max-width: 380px) {
          font-size: 0.65rem;
          margin-bottom: 0.15rem;
        }

        @media (min-width: 640px) {
          font-size: 0.75rem;
          margin-bottom: 0.375rem;
        }
      }

      p:last-child {
        font-size: 0.85rem;
        font-weight: 500;
        color: #111827;
        text-transform: capitalize;
        line-height: 1.4;
        word-break: break-word;
        overflow-wrap: break-word;

        @media (max-width: 380px) {
          font-size: 0.8rem;
        }

        @media (min-width: 640px) {
          font-size: 0.95rem;
        }
      }
    }
  }
`

const TagsContainer = styled.div`
  padding-top: 0.75rem;
  margin-top: 0.75rem;
  border-top: 2px solid #f3f4f6;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 380px) {
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }

  @media (min-width: 640px) {
    padding-top: 1rem;
    margin-top: 1rem;
    border-top-width: 1px;
  }

  p {
    font-size: 0.7rem;
    color: #9ca3af;
    margin-bottom: 0.5rem;
    font-weight: 500;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    word-break: break-word;

    @media (max-width: 380px) {
      font-size: 0.65rem;
      margin-bottom: 0.375rem;
    }

    @media (min-width: 640px) {
      font-size: 0.75rem;
      margin-bottom: 0.75rem;
    }
  }
`

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 380px) {
    gap: 0.375rem;
  }

  @media (min-width: 640px) {
    gap: 0.625rem;
  }
`

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #0c4a6e;
  padding: 0.3rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid #7dd3fc;
  transition: all 200ms ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  word-break: break-word;

  @media (max-width: 380px) {
    padding: 0.25rem 0.5rem;
    font-size: 0.65rem;
  }

  @media (min-width: 640px) {
    padding: 0.35rem 0.875rem;
    font-size: 0.8rem;
  }

  &:hover {
    background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
    border-color: #38bdf8;
  }
`

const LastUpdatedCard = styled.div`
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 0.5rem;
  padding: 0.875rem;
  text-align: center;
  font-size: 0.7rem;
  color: #4b5563;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid #d1d5db;
  transition: all 200ms ease;

  @media (min-width: 640px) {
    padding: 1rem;
    font-size: 0.8rem;
    gap: 0.625rem;
  }

  &:hover {
    background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
    border-color: #9ca3af;
  }

  svg {
    width: 0.8rem;
    height: 0.8rem;
    flex-shrink: 0;
    animation: spin 2s linear infinite;

    @media (min-width: 640px) {
      width: 0.95rem;
      height: 0.95rem;
    }
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

const RelatedCampaignsContainer = styled(Card)`
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  border: 1px solid #e5e7eb;
  width: 100%;
  box-sizing: border-box;

  h2 {
    margin-bottom: 1.25rem;
    position: relative;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f3f4f6;

    @media (min-width: 640px) {
      margin-bottom: 1.75rem;
      padding-bottom: 1.25rem;
      border-bottom-width: 1px;
    }
  }
`

const RelatedCampaignsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (min-width: 480px) {
    gap: 1.375rem;
  }

  @media (min-width: 640px) {
    gap: 1.5rem;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.75rem;
  }
`

const VolunteerSection = styled.div`
  border-top: 2px solid #e5e7eb;
  padding-top: 2rem;
  margin-top: 2rem;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 480px) {
    margin-left: 0;
    margin-right: 0;
    padding-left: 0;
    padding-right: 0;
    padding-top: 2.25rem;
    margin-top: 2.25rem;
  }

  @media (min-width: 640px) {
    padding-top: 2.5rem;
    margin-top: 2.5rem;
    border-top-width: 1px;
  }

  @media (min-width: 1024px) {
    padding-top: 3rem;
    margin-top: 3rem;
  }
`

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuthStore()
  const campaignId = params.id as string

  const [copied, setCopied] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [isOfferHelpOpen, setIsOfferHelpOpen] = useState(false)
  const [isShareWizardOpen, setIsShareWizardOpen] = useState(false)
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false)

  const { data: campaign, isLoading, error } = useCampaign(campaignId)
  const { data: analytics, refetch: refetchAnalytics } = useCampaignAnalytics(campaignId)
  const { data: relatedCampaigns } = useRelatedCampaigns(
    campaignId,
    campaign?.need_type || '',
    3
  )
  const { mutate: recordShare } = useRecordShare()

  // Check if current user is the campaign creator
  const isCreator = user && campaign && user.id === campaign.creator_id ? true : undefined

  // Handle boost payment success/cancellation
  useEffect(() => {
    const boostStatus = searchParams?.get('boost_status')
    if (boostStatus === 'success') {
      toast.success('🎉 Boost payment successful! Your campaign is now boosted!', {
        position: 'top-center',
        autoClose: 5000,
      })
      // Remove query param from URL
      window.history.replaceState({}, document.title, `/campaigns/${campaignId}`)
    } else if (boostStatus === 'cancelled') {
      toast.info('Boost payment was cancelled. Your campaign is still active.', {
        position: 'top-center',
        autoClose: 3000,
      })
      // Remove query param from URL
      window.history.replaceState({}, document.title, `/campaigns/${campaignId}`)
    }
  }, [searchParams, campaignId])

  // Update "last updated" time periodically
  useEffect(() => {
    if (analytics?.lastUpdated) {
      const updateTime = () => {
        const lastUpdate = new Date(analytics.lastUpdated)
        const now = new Date()
        const diffMs = now.getTime() - lastUpdate.getTime()
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins === 0) {
          setLastUpdated('just now')
        } else if (diffMins < 60) {
          setLastUpdated(`${diffMins}m ago`)
        } else if (diffMins < 1440) {
          const hours = Math.floor(diffMins / 60)
          setLastUpdated(`${hours}h ago`)
        } else {
          const days = Math.floor(diffMins / 1440)
          setLastUpdated(`${days}d ago`)
        }
      }

      updateTime()
      const interval = setInterval(updateTime, 60000) // Update every minute
      return () => clearInterval(interval)
    }
  }, [analytics?.lastUpdated])

  // Log campaign image details when campaign loads
  useEffect(() => {
    if (campaign) {
      console.log('📸 [CampaignDetailPage] Campaign loaded with image info', {
        campaignId: campaign.id,
        hasImageUrl: !!campaign.image_url,
        imageUrl: campaign.image_url,
        hasImageObject: !!campaign.image,
        imageObjectUrl: campaign.image?.url,
        normalizedUrl: normalizeImageUrl(campaign.image_url || campaign.image?.url),
      });
      
      // DEBUG: Log share_config details
      console.log('🔍 [CampaignDetailPage] Share Config Details:', {
        campaignId: campaign.id,
        campaignType: campaign.campaignType,
        hasShareConfig: !!campaign.share_config,
        share_config: campaign.share_config,
        share_channels: campaign.share_config?.share_channels,
        platforms: campaign.share_config?.platforms,
        share_config_keys: campaign.share_config ? Object.keys(campaign.share_config) : [],
        fullCampaignKeys: Object.keys(campaign),
      });
    }
  }, [campaign]);

  if (error) {
    return (
      <PageContainer>
        <MainContent>
          <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
              Campaign Not Found
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              The campaign you're looking for doesn't exist.
            </p>
            <Button as="link" href="/campaigns" variant="primary">
              Back to Campaigns
            </Button>
          </div>
        </MainContent>
      </PageContainer>
    )
  }

  if (isLoading || !campaign) {
    return (
      <PageContainer>
        <HeroSection style={{ opacity: 0.5 }} />
      </PageContainer>
    )
  }

  const handleShare = (channel: string) => {
    if (
      channel === 'facebook' ||
      channel === 'twitter' ||
      channel === 'linkedin' ||
      channel === 'email' ||
      channel === 'whatsapp' ||
      channel === 'link'
    ) {
      recordShare({ campaignId, channel })
    }
    
    // Build URL with UTM parameters for tracking
    const baseUrl = `${window.location.origin}/campaigns/${campaignId}`
    const utmParams = new URLSearchParams({
      utm_source: channel || 'direct',
      utm_medium: 'share',
      utm_campaign: campaignId,
      utm_content: campaign.title || 'campaign',
    })
    const shareUrl = `${baseUrl}?${utmParams.toString()}`
    const plainShareUrl = baseUrl // No UTM params for share dialogs (they add their own)

    if (channel === 'copy') {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Link copied to clipboard with tracking!')
    } else if (channel === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          `Check out this campaign: ${campaign.title}`
        )}&url=${encodeURIComponent(plainShareUrl)}`,
        '_blank'
      )
    } else if (channel === 'facebook') {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(plainShareUrl)}`,
        '_blank'
      )
    } else if (channel === 'email') {
      window.open(
        `mailto:?subject=${encodeURIComponent(campaign.title)}&body=${encodeURIComponent(
          shareUrl
        )}`
      )
    }
  }

  const handleDonate = () => {
    if (!user) {
      // User not logged in - redirect to login with redirect back
      toast.info('Please log in to donate')
      router.push(`/login?redirect=/campaigns/${campaignId}/donate`)
    } else {
      // User logged in - proceed to donation flow
      router.push(`/campaigns/${campaignId}/donate`)
    }
  }

  const goalAmount = campaign.goal_amount || 0
  const goalInDollars = goalAmount > 0 ? (goalAmount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  }) : '$0.00'

  return (
    <PageContainer>
      {/* Track referral clicks when campaign loads with ?ref= parameter */}
      <ReferralClickTracker campaignId={campaignId} />

      {/* Hero Section */}
      <HeroSection>
        {campaign.image_url || campaign.image?.url ? (
          <Image
            src={normalizeImageUrl(campaign.image_url || campaign.image?.url) || '/placeholder-campaign.png'}
            alt={campaign.image?.alt || campaign.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
            onLoadingComplete={() => {
              console.log('✅ [CampaignDetailPage] Hero image loaded successfully', {
                src: normalizeImageUrl(campaign.image_url || campaign.image?.url),
              });
            }}
            onError={(error) => {
              console.error('❌ [CampaignDetailPage] Hero image failed to load', {
                src: normalizeImageUrl(campaign.image_url || campaign.image?.url),
                error: error,
              });
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
          }} />
        )}

        <HeroOverlay />

        <HeroContent>
          <HeroGradient>
            <h1>{campaign.title}</h1>
            <p>
              by{' '}
              <Link href={`/creator/${campaign.creator_id}`}>
                {campaign.creator_name || 'Creator'}
              </Link>
            </p>
          </HeroGradient>
        </HeroContent>
      </HeroSection>

      {/* Main Content */}
      <MainContent>
        <GridLayout>
          {/* Main Column */}
          <MainColumn>
            {/* Progress Section - Only the progress bar for fundraising campaigns */}
            <Card>
              {campaign?.campaign_type === 'fundraising' && (
                <>
                  <h2>Campaign Progress</h2>

                  {/* Multi-Meter Display or Fallback to Single Meter */}
                  {(() => {
                    const meters = []

                    if (campaign && campaign.goal_amount > 0) {
                      meters.push(
                        createMeterData(
                          'money',
                          campaign.raised_amount || 0,
                          campaign.goal_amount
                        )
                      )
                    }

                    if (analytics) {
                      const helpingHandsGoal =
                        (campaign as any)?.helpingHandsGoal || 50
                      const helpingHandsCurrent = (analytics as any)?.helpingHandsCount || 0

                      if (helpingHandsCurrent > 0 || (campaign as any)?.selectedMeters?.includes('helping_hands')) {
                        meters.push(
                          createMeterData(
                            'helping_hands',
                            helpingHandsCurrent,
                            helpingHandsGoal
                          )
                        )
                      }

                      const customersGoal = (campaign as any)?.customersGoal || 100
                      const customersCurrent = (analytics as any)?.customersCount || 0

                      if (customersCurrent > 0 || (campaign as any)?.selectedMeters?.includes('customers')) {
                        meters.push(
                          createMeterData('customers', customersCurrent, customersGoal)
                        )
                      }
                    }

                    if (meters.length > 1) {
                      return <MultiMeterDisplay meters={meters} />
                    } else if (meters.length === 1 && campaign.goal_amount > 0) {
                      return (
                        <ProgressBar
                          current={campaign.raised_amount || 0}
                          goal={campaign.goal_amount}
                          size="lg"
                          showPercentage={true}
                          showValues={true}
                        />
                      )
                    }
                    return null
                  })()}
                </>
              )}

              {/* Metrics Grid - Show for both fundraising and sharing campaigns */}
              <MetricsGrid>
                {campaign.campaign_type === 'fundraising' && (
                  <MetricCard>
                    <p>Avg Donation</p>
                    <p>${((campaign.average_donation || 0) / 100).toFixed(0)}</p>
                  </MetricCard>
                )}
                {campaign.campaign_type === 'sharing' && (
                  <MetricCard>
                    <p>Shares</p>
                    <p>{(campaign.share_count || 0).toLocaleString()}</p>
                  </MetricCard>
                )}
                <MetricCard>
                  <p>Total Supporters</p>
                  <p>{(campaign.total_donors || 0).toLocaleString()}</p>
                </MetricCard>
              </MetricsGrid>

              {/* Days Left Metric */}
              <MetricsGrid style={{ marginTop: '1rem', gridTemplateColumns: 'repeat(1, 1fr)' }}>
                <MetricCard>
                  <p>Days Left</p>
                  <p>
                    {campaign.status === 'completed'
                      ? 'Ended'
                      : campaign.end_date
                      ? Math.max(0, Math.ceil(
                          (new Date(campaign.end_date).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        ))
                      : 'N/A'}
                  </p>
                </MetricCard>
              </MetricsGrid>
            </Card>

            {/* Share to Earn Info Section - Only for sharing campaigns */}
            {campaign?.campaign_type === 'sharing' && (
              <ShareInfoSection share_config={campaign?.share_config} />
            )}

            {/* Description Section */}
            <Card>
              <h2>About This Campaign</h2>
              <DescriptionContent>
                <p>{campaign.description || campaign.full_description || 'No description available'}</p>
              </DescriptionContent>
            </Card>

            {/* Progress Updates Section */}
            <Card>
              <CampaignUpdates campaignId={campaignId} isCreator={isCreator} />
            </Card>

            {/* Prayer Support Section - For all campaigns */}
            {campaign && (
              <>
                <Card>
                  <PrayerMeter campaignId={campaignId} goalPrayers={100} showBreakdown={false} />
                </Card>

                <Card>
                  <PrayerActivityFeed campaignId={campaignId} page={1} limit={10} />
                </Card>
              </>
            )}

            {/* QR Code Section */}
            <QRCodeDisplay
              campaignId={campaignId}
              campaignTitle={campaign.title}
              size={256}
            />

            {/* Flyer Download Section */}
            <FlyerDownload
              campaignId={campaignId}
              campaignTitle={campaign.title}
              campaignDescription={campaign.description || campaign.full_description?.substring(0, 150)}
              creatorName={campaign.creator_name || 'Creator'}
              category={campaign.need_type || campaign.category || 'Campaign'}
            />

            {/* Payment Directory - Only for fundraising campaigns */}
            {campaign.campaign_type === 'fundraising' && campaign.payment_methods && campaign.payment_methods.length > 0 && (
              <PaymentDirectory
                paymentMethods={campaign.payment_methods}
                creatorName={campaign.creator_name || 'Creator'}
              />
            )}

            {/* Related Campaigns */}
            {relatedCampaigns && relatedCampaigns.length > 0 && (
              <RelatedCampaignsContainer>
                <h2>Similar Campaigns</h2>
                <RelatedCampaignsGrid>
                  {relatedCampaigns.map((relatedCampaign) => (
                    <CampaignCard
                      key={relatedCampaign.id}
                      campaign={relatedCampaign}
                      onDonate={handleDonate}
                      onShare={(id) => handleShare('twitter')}
                    />
                  ))}
                </RelatedCampaignsGrid>
              </RelatedCampaignsContainer>
            )}
          </MainColumn>

          {/* Sidebar */}
          <Sidebar>
            {/* CTA Buttons */}
            <CTAButtonsContainer>
              {/* Check if this is a sharing campaign */}
              {campaign?.campaign_type === 'sharing' ? (
                // Share to Earn Flow
                <>
                  <Button
                    onClick={() => setIsShareWizardOpen(true)}
                    variant="primary"
                    size="lg"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    💰 Share to Earn
                  </Button>

                  <Button
                    onClick={() => handleShare('copy')}
                    variant="outline"
                    size="lg"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Button>

                  <Button
                    onClick={() => setIsOfferHelpOpen(true)}
                    variant="secondary"
                    size="lg"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <Briefcase size={20} />
                    Offer Help
                  </Button>

                  {/* Share Buttons */}
                  <ShareButtonsGrid>
                    <ShareButton
                      onClick={() => handleShare('twitter')}
                      title="Share on Twitter"
                    >
                      <span>𝕏</span>
                    </ShareButton>
                    <ShareButton
                      onClick={() => handleShare('facebook')}
                      title="Share on Facebook"
                    >
                      <span>fb</span>
                    </ShareButton>
                    <ShareButton
                      onClick={() => handleShare('email')}
                      title="Share via Email"
                    >
                      <span>✉️</span>
                    </ShareButton>
                  </ShareButtonsGrid>

                  {/* Campaign Budget Info for Sharing */}
                  {campaign?.share_config && (
                    <div style={{
                      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                      border: '1px solid #93c5fd',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      fontSize: '0.875rem',
                      color: '#0c4a6e',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontWeight: '700', marginBottom: '0.5rem' }}>
                        💵 ${(campaign.share_config.amount_per_share || 50) / 100} per share
                      </div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                        Budget: ${(campaign.share_config.total_budget || 0) / 100}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // Traditional Donate Flow
                <>
                  <Button
                    onClick={handleDonate}
                    variant="primary"
                    size="lg"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    {user ? (
                      <>
                        <Hand size={20} />
                        💰 Donate Now
                      </>
                    ) : (
                      <>
                        🔐 Log in to Donate
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => setIsOfferHelpOpen(true)}
                    variant="secondary"
                    size="lg"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <Briefcase size={20} />
                    Offer Help
                  </Button>

                  <Button
                    onClick={() => setIsPrayerModalOpen(true)}
                    variant="secondary"
                    size="lg"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    🙏 Pray for Campaign
                  </Button>

                  <Button
                    onClick={() => handleShare('copy')}
                    variant="outline"
                    size="lg"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Button>

                  {/* Share Buttons */}
                  <ShareButtonsGrid>
                    <ShareButton
                      onClick={() => handleShare('twitter')}
                      title="Share on Twitter"
                    >
                      <span>𝕏</span>
                    </ShareButton>
                    <ShareButton
                      onClick={() => handleShare('facebook')}
                      title="Share on Facebook"
                    >
                      <span>fb</span>
                    </ShareButton>
                    <ShareButton
                      onClick={() => handleShare('email')}
                      title="Share via Email"
                    >
                      <span>✉️</span>
                    </ShareButton>
                  </ShareButtonsGrid>
                </>
              )}

              {/* Report Button */}
              <ReportButton>
                <Flag size={16} />
                Report Campaign
              </ReportButton>
            </CTAButtonsContainer>

            {/* Campaign Info */}
            <CampaignDetailsCard>
              <h3>Campaign Details</h3>

              <div>
                <Calendar size={18} />
                <div>
                  <p>Ends on</p>
                  <p>
                    {campaign.end_date
                      ? new Date(campaign.end_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <Users size={18} />
                <div>
                  <p>Category</p>
                  <p>{campaign.need_type || campaign.category || 'N/A'}</p>
                </div>
              </div>

              <div>
                <TrendingUp size={18} />
                <div>
                  <p>Goal Amount</p>
                  <p>{goalInDollars && goalInDollars !== 'NaN' ? goalInDollars : 'N/A'}</p>
                </div>
              </div>

              {/* Tags */}
              {campaign.tags && campaign.tags.length > 0 && (
                <TagsContainer>
                  <p>Tags</p>
                  <TagsWrapper>
                    {campaign.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </TagsWrapper>
                </TagsContainer>
              )}
            </CampaignDetailsCard>

            {/* Last Updated */}
            {lastUpdated && (
              <LastUpdatedCard>
                <RefreshCw />
                Updated {lastUpdated}
              </LastUpdatedCard>
            )}
          </Sidebar>
        </GridLayout>

        {/* Volunteer Offers Section (for creators viewing their campaign) */}
        <VolunteerSection>
          <VolunteerOffers campaignId={campaignId} expandedView={true} />
        </VolunteerSection>
      </MainContent>

      {/* Offer Help Modal */}
      <OfferHelpModal
        isOpen={isOfferHelpOpen}
        onClose={() => setIsOfferHelpOpen(false)}
        campaignId={campaignId}
        campaignTitle={campaign?.title || 'Campaign'}
      />

      {/* Share Wizard Modal */}
      <ShareWizard
        isOpen={isShareWizardOpen}
        onClose={() => setIsShareWizardOpen(false)}
        campaignId={campaignId}
        campaignTitle={campaign?.title || 'Campaign'}
        campaignDescription={campaign?.description || campaign?.full_description}
        creator_name={campaign?.creator_name}
        share_config={campaign?.share_config}
      />

      {/* Prayer Modal */}
      <PrayerModal
        isOpen={isPrayerModalOpen}
        onClose={() => setIsPrayerModalOpen(false)}
        campaignId={campaignId}
        campaignTitle={campaign?.title || 'Campaign'}
      />
    </PageContainer>
  )
}
