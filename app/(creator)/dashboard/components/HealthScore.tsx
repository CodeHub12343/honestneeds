'use client'

import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Activity, Heart, TrendingUp, Eye, Award } from 'lucide-react'
import { calculateHealthScore } from '../utils/dashboardCalculations'

interface HealthScoreComponentProps {
  campaign: {
    raised: number
    goal: number
    donor_count?: number
    status: string
    created_at: string
    updated_at: string
  }
  showBreakdown?: boolean
  size?: 'small' | 'medium' | 'large'
}

const ScoreContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const ScoreCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const ScoreCircle = styled.div<{ score: number; color: string; size: 'small' | 'medium' | 'large' }>`
  position: relative;
  width: ${(props) => {
    switch (props.size) {
      case 'small':
        return '120px'
      case 'large':
        return '200px'
      default:
        return '160px'
    }
  }};
  height: ${(props) => {
    switch (props.size) {
      case 'small':
        return '120px'
      case 'large':
        return '200px'
      default:
        return '160px'
    }
  }};
  border-radius: 50%;
  background: linear-gradient(135deg, ${(props) => props.color}12 0%, ${(props) => props.color}24 100%);
  border: 4px solid ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px ${(props) => props.color}20;
`

const ScoreNumber = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  font-size: ${(props) => {
    switch (props.size) {
      case 'small':
        return '36px'
      case 'large':
        return '64px'
      default:
        return '48px'
    }
  }};
  font-weight: 700;
  line-height: 1;
`

const ScoreLabel = styled.div`
  font-size: 14px;
  color: #9ca3af;
  margin-top: 4px;
`

const ScoreBadge = styled.div<{ level: string }>`
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin-top: 12px;
  background: ${(props) => {
    switch (props.level) {
      case 'excellent':
        return '#dcfce7'
      case 'good':
        return '#dbeafe'
      case 'fair':
        return '#fef3c7'
      case 'poor':
        return '#fee2e2'
      default:
        return '#f3f4f6'
    }
  }};
  color: ${(props) => {
    switch (props.level) {
      case 'excellent':
        return '#166534'
      case 'good':
        return '#1e40af'
      case 'fair':
        return '#92400e'
      case 'poor':
        return '#991b1b'
      default:
        return '#6b7280'
    }
  }};
`

const BreakdownContainer = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
`

const BreakdownTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
`

const FactorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const FactorCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }
`

const FactorIcon = styled.div`
  font-size: 20px;
  margin-bottom: 8px;
`

const FactorName = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const FactorScore = styled.p`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

const FactorMax = styled.p`
  font-size: 11px;
  color: #9ca3af;
  margin: 2px 0 0 0;
`

interface ScoreFactor {
  name: string
  icon: React.ReactNode
  weight: number // out of 100
  score: number // 0-100 contribution
}

export const HealthScore: React.FC<HealthScoreComponentProps> = ({
  campaign,
  showBreakdown = true,
  size = 'medium',
}) => {
  const healthData = useMemo(() => {
    return calculateHealthScore(campaign)
  }, [campaign])

  const factors: ScoreFactor[] = useMemo(() => {
    // Calculate individual factor scores
    const goalProgress = campaign.goal > 0 ? (campaign.raised / campaign.goal) * 100 : 0
    const progressScore = Math.min(goalProgress / 100, 1) * 30

    const engagementScore = Math.min((campaign.donor_count || 0) / 50, 1) * 20

    const daysSinceUpdate =
      (Date.now() - new Date(campaign.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    const activityScore = Math.max(0, 1 - daysSinceUpdate / 30) * 20

    const daysOld = (Date.now() - new Date(campaign.created_at).getTime()) / (1000 * 60 * 60 * 24)
    let ageScore = 0
    if (campaign.status === 'active' && daysOld <= 90) ageScore = 15
    else if (campaign.status === 'completed') ageScore = 15
    else if (campaign.status === 'draft') ageScore = 0
    else ageScore = 7.5

    const avgDonation =
      campaign.donor_count && campaign.donor_count > 0 ? campaign.raised / campaign.donor_count : 0
    const conversionScore = Math.min(avgDonation / 50, 1) * 15

    return [
      {
        name: 'Progress',
        icon: <TrendingUp size={20} />,
        weight: 30,
        score: progressScore,
      },
      {
        name: 'Engagement',
        icon: <Heart size={20} />,
        weight: 20,
        score: engagementScore,
      },
      {
        name: 'Activity',
        icon: <Activity size={20} />,
        weight: 20,
        score: activityScore,
      },
      {
        name: 'Status',
        icon: <Award size={20} />,
        weight: 15,
        score: ageScore,
      },
      {
        name: 'Conversion',
        icon: <Eye size={20} />,
        weight: 15,
        score: conversionScore,
      },
    ]
  }, [campaign])

  return (
    <ScoreContainer>
      <ScoreCard>
        <ScoreCircle score={healthData.score} color={healthData.color} size={size}>
          <div>
            <ScoreNumber size={size}>{healthData.score}</ScoreNumber>
            <ScoreLabel>/100</ScoreLabel>
          </div>
        </ScoreCircle>
        <ScoreBadge level={healthData.level}>{healthData.level.toUpperCase()}</ScoreBadge>

        {showBreakdown && (
          <BreakdownContainer>
            <BreakdownTitle>Score Breakdown</BreakdownTitle>
            <FactorGrid>
              {factors.map((factor) => (
                <FactorCard key={factor.name}>
                  <FactorIcon>{factor.icon}</FactorIcon>
                  <FactorName>{factor.name}</FactorName>
                  <FactorScore>{factor.score.toFixed(1)}</FactorScore>
                  <FactorMax>/ {factor.weight}</FactorMax>
                </FactorCard>
              ))}
            </FactorGrid>
          </BreakdownContainer>
        )}
      </ScoreCard>
    </ScoreContainer>
  )
}

export default HealthScore
