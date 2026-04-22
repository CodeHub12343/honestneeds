'use client'

import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { usePrayerMetrics } from '@/api/hooks/usePrayers'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { COLORS, SPACING, BORDER_RADIUS, TRANSITIONS, TYPOGRAPHY } from '@/styles/tokens'

interface PrayerMeterProps {
  campaignId: string
  goal?: number
  showBreakdown?: boolean
  className?: string
  animated?: boolean
}

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`

const Container = styled.div`
  width: 100%;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${SPACING.MD};

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${SPACING.SM};
  }
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.SM};
`

const Title = styled.h3`
  font-weight: 600;
  color: ${COLORS.TEXT_PRIMARY};
  font-size: ${TYPOGRAPHY.SIZE_BASE};
`

const Count = styled.div`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  font-weight: 500;
  color: ${COLORS.TEXT_SECONDARY};
`

const CountValue = styled.span`
  color: ${COLORS.PRIMARY};
  font-weight: 700;
`

const ProgressBarContainer = styled.div`
  width: 100%;
  background-color: ${COLORS.BACKGROUND_SECONDARY};
  border-radius: ${BORDER_RADIUS.FULL};
  height: 12px;
  overflow: hidden;
  margin-bottom: ${SPACING.SM};
`

interface ProgressBarProps {
  $progress: number
  $animated: boolean
  $isGoalReached: boolean
}

const ProgressBar = styled.div<ProgressBarProps>`
  height: 100%;
  background: linear-gradient(to right, #a855f7, #9333ea);
  transition: ${TRANSITIONS.BASE};
  width: ${(props) => props.$progress}%;
  ${(props) =>
    props.$animated &&
    css`
      animation: none;
    `}
  ${(props) =>
    props.$isGoalReached &&
    css`
      animation: ${pulse} 2s ease-in-out infinite;
    `}
`

const GoalStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${SPACING.LG};
  font-size: ${TYPOGRAPHY.SIZE_XS};
`

const GoalReachedBadge = styled.div`
  font-weight: 600;
  color: #16a34a;
  display: flex;
  align-items: center;
  gap: ${SPACING.XS};
`

const Breakdown = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${SPACING.SM};
  padding-top: ${SPACING.MD};
  border-top: 1px solid ${COLORS.BORDER};

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const BreakdownItem = styled.div`
  text-align: center;
`

const BreakdownEmoji = styled.div`
  font-size: 1.5rem;
  margin-bottom: ${SPACING.XS};
`

const BreakdownValue = styled.div`
  font-size: ${TYPOGRAPHY.SIZE_XS};
  font-weight: 500;
  color: ${COLORS.TEXT_PRIMARY};
  margin-bottom: 2px;
`

const BreakdownLabel = styled.div`
  font-size: ${TYPOGRAPHY.SIZE_XS};
  color: ${COLORS.TEXT_SECONDARY};
`

const TodayCount = styled.div`
  margin-top: ${SPACING.MD};
  padding: ${SPACING.SM};
  background-color: rgba(168, 85, 247, 0.1);
  border-radius: ${BORDER_RADIUS.MD};
  font-size: ${TYPOGRAPHY.SIZE_XS};
  color: #9333ea;
`

/**
 * PrayerMeter Component
 * Displays prayer progress towards a goal with visual meter
 * Shows breakdown by prayer type if enabled
 */
const PrayerMeter: React.FC<PrayerMeterProps> = ({
  campaignId,
  goal = 100,
  showBreakdown = true,
  className = '',
  animated = true,
}) => {
  const { data: metrics, isLoading, error } = usePrayerMetrics(campaignId)

  if (isLoading) {
    return (
      <Container className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: SPACING.MD }}>
        <LoadingSpinner size="sm" />
      </Container>
    )
  }

  if (error || !metrics) {
    return null
  }

  const progress = Math.min((metrics.total_prayers / goal) * 100, 100)
  const isGoalReached = metrics.total_prayers >= goal

  return (
    <Container className={className}>
      {/* Header */}
      <Header>
        <HeaderLeft>
          <span style={{ fontSize: '1.5rem' }}>🙏</span>
          <Title>Prayer Support</Title>
        </HeaderLeft>
        <Count>
          <CountValue>{metrics.total_prayers}</CountValue>
          {' / '}
          <span>{goal}</span>
        </Count>
      </Header>

      {/* Progress Bar */}
      <ProgressBarContainer>
        <ProgressBar $progress={progress} $animated={animated} $isGoalReached={isGoalReached} />
      </ProgressBarContainer>

      {/* Goal Status */}
      <GoalStatus>
        <div>{progress.toFixed(0)}% of goal</div>
        {isGoalReached && (
          <GoalReachedBadge>
            <span>✅</span> Goal reached!
          </GoalReachedBadge>
        )}
      </GoalStatus>

      {/* Breakdown by Type */}
      {showBreakdown && metrics.breakdown && (
        <Breakdown>
          <BreakdownItem>
            <BreakdownEmoji>👆</BreakdownEmoji>
            <BreakdownValue>{metrics.breakdown.tap}</BreakdownValue>
            <BreakdownLabel>Taps</BreakdownLabel>
          </BreakdownItem>

          <BreakdownItem>
            <BreakdownEmoji>✍️</BreakdownEmoji>
            <BreakdownValue>{metrics.breakdown.text}</BreakdownValue>
            <BreakdownLabel>Texts</BreakdownLabel>
          </BreakdownItem>

          <BreakdownItem>
            <BreakdownEmoji>🎙️</BreakdownEmoji>
            <BreakdownValue>{metrics.breakdown.voice}</BreakdownValue>
            <BreakdownLabel>Voice</BreakdownLabel>
          </BreakdownItem>

          <BreakdownItem>
            <BreakdownEmoji>🎥</BreakdownEmoji>
            <BreakdownValue>{metrics.breakdown.video}</BreakdownValue>
            <BreakdownLabel>Videos</BreakdownLabel>
          </BreakdownItem>
        </Breakdown>
      )}

      {/* Today's Count */}
      {metrics.prayers_today > 0 && (
        <TodayCount>
          <span style={{ fontWeight: 'bold' }}>{metrics.prayers_today}</span>
          {' '}
          prayer{metrics.prayers_today !== 1 ? 's' : ''} received today ✨
        </TodayCount>
      )}
    </Container>
  )
}

export { PrayerMeter }
