'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  Heart,
  Zap,
  Target,
  TrendingUp,
  MessageSquare,
  Share2,
  CheckCircle,
  Clock,
} from 'lucide-react'

interface Activity {
  id: string
  type: 'donation' | 'campaign_created' | 'campaign_activated' | 'goal_reached' | 'milestone' | 'comment' | 'share'
  title: string
  description: string
  timestamp: string
  campaignId?: string
  campaignTitle?: string
  amount?: number
  icon?: React.ReactNode
}

interface ActivityFeedProps {
  activities: Activity[]
  onActivityClick?: (activity: Activity) => void
  limit?: number
  isLoading?: boolean
}

const FeedContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const FeedHeader = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 20px 0;
`

const Timeline = styled.div`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 19px;
    top: 30px;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, #3b82f6, #e5e7eb);
  }
`

const ActivityItem = styled.div<{ isNew?: boolean }>`
  position: relative;
  padding-left: 56px;
  padding-bottom: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  padding-right: 12px;
  margin-left: -12px;
  margin-right: -12px;

  &:hover {
    background-color: #f9fafb;
  }

  &:last-child {
    padding-bottom: 0;
  }

  ${(props) =>
    props.isNew &&
    `
    border-left: 3px solid #3b82f6;
    background-color: #eff6ff;
  `}
`

const IconContainer = styled.div<{ bgColor: string }>`
  position: absolute;
  left: 0;
  top: 0;
  width: 40px;
  height: 40px;
  background: ${(props) => props.bgColor};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const ActivityContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ActivityTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`

const ActivityDescription = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
`

const ActivityMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  gap: 12px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const Timestamp = styled.span`
  font-size: 12px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 4px;
`

const CampaignTag = styled.span`
  font-size: 12px;
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
`

const AmountBadge = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #10b981;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
`

const EmptyIcon = styled.div`
  font-size: 32px;
  margin-bottom: 12px;
`

const SkeletonItem = styled.div`
  padding-left: 56px;
  padding-bottom: 24px;
  display: flex;
  gap: 12px;

  &::before {
    content: '';
    width: 40px;
    height: 40px;
    background: #e5e7eb;
    border-radius: 50%;
    flex-shrink: 0;
    position: absolute;
    left: 0;
    top: 0;
  }
`

const SkeletonContent = styled.div`
  flex: 1;

  & > div {
    height: 12px;
    background: #e5e7eb;
    border-radius: 4px;
    margin-bottom: 8px;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`

const getActivityIcon = (type: string): { icon: React.ReactNode; bgColor: string } => {
  switch (type) {
    case 'donation':
      return { icon: <Heart size={20} />, bgColor: '#ef4444' }
    case 'campaign_created':
      return { icon: <Zap size={20} />, bgColor: '#f59e0b' }
    case 'campaign_activated':
      return { icon: <TrendingUp size={20} />, bgColor: '#10b981' }
    case 'goal_reached':
      return { icon: <Target size={20} />, bgColor: '#8b5cf6' }
    case 'milestone':
      return { icon: <CheckCircle size={20} />, bgColor: '#06b6d4' }
    case 'comment':
      return { icon: <MessageSquare size={20} />, bgColor: '#3b82f6' }
    case 'share':
      return { icon: <Share2 size={20} />, bgColor: '#ec4899' }
    default:
      return { icon: <Clock size={20} />, bgColor: '#9ca3af' }
  }
}

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  onActivityClick,
  limit = 10,
  isLoading = false,
}) => {
  const [displayActivities, setDisplayActivities] = useState<Activity[]>([])

  useEffect(() => {
    setDisplayActivities(activities.slice(0, limit))
  }, [activities, limit])

  if (isLoading) {
    return (
      <FeedContainer>
        <FeedHeader>Recent Activity</FeedHeader>
        <Timeline>
          {[1, 2, 3].map((i) => (
            <SkeletonItem key={i}>
              <SkeletonContent>
                <div style={{ width: '60%' }} />
                <div style={{ width: '40%' }} />
              </SkeletonContent>
            </SkeletonItem>
          ))}
        </Timeline>
      </FeedContainer>
    )
  }

  if (displayActivities.length === 0) {
    return (
      <FeedContainer>
        <FeedHeader>Recent Activity</FeedHeader>
        <EmptyState>
          <EmptyIcon>📭</EmptyIcon>
          <p>No activity yet. Start a campaign to see updates!</p>
        </EmptyState>
      </FeedContainer>
    )
  }

  return (
    <FeedContainer>
      <FeedHeader>Recent Activity</FeedHeader>
      <Timeline>
        {displayActivities.map((activity, index) => {
          const { icon, bgColor } = getActivityIcon(activity.type)
          const isNew = index === 0

          return (
            <ActivityItem
              key={activity.id}
              isNew={isNew}
              onClick={() => onActivityClick?.(activity)}
            >
              <IconContainer $bgColor={bgColor}>{icon}</IconContainer>
              <ActivityContent>
                <ActivityTitle>{activity.title}</ActivityTitle>
                <ActivityDescription>{activity.description}</ActivityDescription>
                <ActivityMeta>
                  <Timestamp>
                    <Clock size={12} />
                    {formatTime(activity.timestamp)}
                  </Timestamp>
                  {activity.amount && <AmountBadge>+${activity.amount.toFixed(2)}</AmountBadge>}
                  {activity.campaignTitle && <CampaignTag>{activity.campaignTitle}</CampaignTag>}
                </ActivityMeta>
              </ActivityContent>
            </ActivityItem>
          )
        })}
      </Timeline>
    </FeedContainer>
  )
}

export default ActivityFeed
