'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { useCampaignPrayers, useReportPrayer, useDeletePrayer } from '@/api/hooks/usePrayers'
import { Prayer } from '@/api/services/prayerService'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { COLORS, SPACING, BORDER_RADIUS, TRANSITIONS, TYPOGRAPHY } from '@/styles/tokens'

interface PrayerActivityFeedProps {
  campaignId: string
  maxItems?: number
  className?: string
  showReportButton?: boolean
  showDeleteButton?: boolean
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.MD};
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${SPACING.LG};
`

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${SPACING.LG};

  p {
    color: #dc2626;
    font-size: ${TYPOGRAPHY.SIZE_SM};
  }
`

const EmptyContainer = styled.div`
  text-align: center;
  padding: ${SPACING.LG};

  p {
    color: ${COLORS.TEXT_SECONDARY};
    font-size: ${TYPOGRAPHY.SIZE_SM};
  }
`

const PrayersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.SM};
`

const PrayerCard = styled.div`
  padding: ${SPACING.MD};
  background-color: ${COLORS.SURFACE};
  border-radius: ${BORDER_RADIUS.MD};
  border: 1px solid ${COLORS.BORDER};
  transition: ${TRANSITIONS.BASE};

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${SPACING.SM};
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.SM};
`

const PrayerEmoji = styled.span`
  font-size: 1.25rem;
`

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const SupporterName = styled.p`
  font-weight: 500;
  color: ${COLORS.TEXT_PRIMARY};
  margin: 0;
`

const PrayerTime = styled.p`
  font-size: ${TYPOGRAPHY.SIZE_XS};
  color: ${COLORS.TEXT_SECONDARY};
  margin: 0;
`

const StatusBadge = styled.span<{ $status?: string; $flagged?: boolean }>`
  padding: 4px 8px;
  font-size: ${TYPOGRAPHY.SIZE_XS};
  font-weight: 500;
  border-radius: ${BORDER_RADIUS.SM};
  
  ${(props) => {
    if (props.$flagged) {
      return `
        background-color: rgba(239, 68, 68, 0.1);
        color: #ef4444;
      `
    }
    if (props.$status === 'pending') {
      return `
        background-color: rgba(234, 179, 8, 0.1);
        color: #eab308;
      `
    }
    return ''
  }}
`

const CardContent = styled.div`
  margin-bottom: ${SPACING.SM};
`

const TextContent = styled.p`
  color: ${COLORS.TEXT_PRIMARY};
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const MediaElement = styled.div`
  width: 100%;
  margin-bottom: ${SPACING.SM};

  audio,
  video {
    width: 100%;
    border-radius: ${BORDER_RADIUS.MD};
  }

  video {
    max-height: 200px;
  }
`

const TapPrayerText = styled.p`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: ${COLORS.TEXT_SECONDARY};
  margin: 0;
`

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${SPACING.SM};
  border-top: 1px solid ${COLORS.BORDER};
`

const ReportCount = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.XS};
  font-size: ${TYPOGRAPHY.SIZE_XS};
  color: ${COLORS.TEXT_SECONDARY};
`

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.SM};
`

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${SPACING.MD};
  border-top: 1px solid ${COLORS.BORDER};
`

const PaginationInfo = styled.div`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: ${COLORS.TEXT_SECONDARY};
`

const ReportModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.MD};
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.SM};
`

const Label = styled.label`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  font-weight: 500;
  color: ${COLORS.TEXT_PRIMARY};
`

const Select = styled.select`
  padding: ${SPACING.SM} ${SPACING.MD};
  border: 1px solid ${COLORS.BORDER};
  border-radius: ${BORDER_RADIUS.MD};
  background-color: ${COLORS.SURFACE};
  color: ${COLORS.TEXT_PRIMARY};
  font-family: ${TYPOGRAPHY.FONT_BODY};
  font-size: ${TYPOGRAPHY.SIZE_SM};
  transition: ${TRANSITIONS.BASE};

  &:focus {
    outline: none;
    ring: 2px;
    ring-color: ${COLORS.PRIMARY};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: ${SPACING.SM};
`

/**
 * PrayerActivityFeed Component
 * Displays prayers in a paginated feed with reporting and deletion
 */
const PrayerActivityFeed: React.FC<PrayerActivityFeedProps> = ({
  campaignId,
  maxItems = 20,
  className = '',
  showReportButton = true,
  showDeleteButton = false,
}) => {
  const [page, setPage] = useState(1)
  const [reportingPrayerId, setReportingPrayerId] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState('')

  const { data, isLoading, error } = useCampaignPrayers(
    campaignId,
    page,
    maxItems
  )
  const { mutate: reportPrayer, isPending: isReporting } = useReportPrayer()
  const { mutate: deletePrayer, isPending: isDeleting } = useDeletePrayer()

  if (isLoading) {
    return (
      <LoadingContainer className={className}>
        <LoadingSpinner size="md" />
      </LoadingContainer>
    )
  }

  if (error) {
    return (
      <ErrorContainer className={className}>
        <p>Failed to load prayers. Please try again later.</p>
      </ErrorContainer>
    )
  }

  if (!data?.prayers || data.prayers.length === 0) {
    return (
      <EmptyContainer className={className}>
        <p>No prayers yet. Be the first to send one! 🙏</p>
      </EmptyContainer>
    )
  }

  const handleReport = (prayerId: string) => {
    if (!reportReason.trim()) return

    reportPrayer({
      prayerId,
      reason: reportReason,
    })

    setReportingPrayerId(null)
    setReportReason('')
  }

  const handleDelete = (prayerId: string) => {
    if (window.confirm('Are you sure you want to delete this prayer?')) {
      deletePrayer(prayerId)
    }
  }

  return (
    <Container className={className}>
      {/* Prayers List */}
      <PrayersList>
        {data.prayers.map((prayer: Prayer) => (
          <PrayerCard key={prayer._id}>
            {/* Header */}
            <CardHeader>
              <HeaderLeft>
                <PrayerEmoji>
                  {prayer.type === 'tap' && '👆'}
                  {prayer.type === 'text' && '✍️'}
                  {prayer.type === 'voice' && '🎙️'}
                  {prayer.type === 'video' && '🎥'}
                </PrayerEmoji>
                <HeaderInfo>
                  <SupporterName>
                    {prayer.is_anonymous ? 'Anonymous' : prayer.supporter_name || 'Prayer Supporter'}
                  </SupporterName>
                  <PrayerTime>
                    {new Date(prayer.created_at).toLocaleDateString()}{' '}
                    {new Date(prayer.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </PrayerTime>
                </HeaderInfo>
              </HeaderLeft>

              {/* Status Badges */}
              {prayer.status === 'pending' && (
                <StatusBadge $status="pending">Pending</StatusBadge>
              )}
              {prayer.is_flagged && (
                <StatusBadge $flagged>Flagged</StatusBadge>
              )}
            </CardHeader>

            {/* Content */}
            <CardContent>
              {prayer.type === 'text' && prayer.content && (
                <TextContent>{prayer.content}</TextContent>
              )}

              {prayer.type === 'voice' && prayer.audio_url && (
                <MediaElement>
                  <audio src={prayer.audio_url} controls />
                </MediaElement>
              )}

              {prayer.type === 'video' && prayer.video_url && (
                <MediaElement>
                  <video src={prayer.video_url} controls />
                </MediaElement>
              )}

              {prayer.type === 'tap' && (
                <TapPrayerText>✨ Sent a quick prayer of support</TapPrayerText>
              )}
            </CardContent>

            {/* Footer Actions */}
            <CardFooter>
              <ReportCount>
                {prayer.report_count > 0 && (
                  <>
                    <span>🚩</span>
                    <span>{prayer.report_count}</span>
                  </>
                )}
              </ReportCount>

              <ActionButtons>
                {showReportButton && (
                  <Button
                    onClick={() => setReportingPrayerId(prayer._id)}
                    variant="secondary"
                    size="sm"
                  >
                    🚩 Report
                  </Button>
                )}

                {showDeleteButton && (
                  <Button
                    onClick={() => handleDelete(prayer._id)}
                    disabled={isDeleting}
                    variant="secondary"
                    size="sm"
                  >
                    ✕ Delete
                  </Button>
                )}
              </ActionButtons>
            </CardFooter>
          </PrayerCard>
        ))}
      </PrayersList>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <Pagination>
          <Button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            variant="secondary"
            size="sm"
          >
            ← Previous
          </Button>

          <PaginationInfo>
            Page {data.page} of {data.totalPages}
          </PaginationInfo>

          <Button
            onClick={() => setPage(Math.min(data.totalPages, page + 1))}
            disabled={page === data.totalPages}
            variant="secondary"
            size="sm"
          >
            Next →
          </Button>
        </Pagination>
      )}

      {/* Report Modal */}
      <Modal
        isOpen={!!reportingPrayerId}
        onClose={() => {
          setReportingPrayerId(null)
          setReportReason('')
        }}
        title="Report Prayer"
        size="sm"
      >
        <ReportModalContent>
          <FormGroup>
            <Label htmlFor="report-reason">Reason for report</Label>
            <Select
              id="report-reason"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              disabled={isReporting}
            >
              <option value="">Select a reason...</option>
              <option value="inappropriate_content">Inappropriate content</option>
              <option value="harassment">Harassment or abuse</option>
              <option value="spam">Spam</option>
              <option value="other">Other</option>
            </Select>
          </FormGroup>

          <ButtonGroup>
            <Button
              onClick={() => {
                setReportingPrayerId(null)
                setReportReason('')
              }}
              variant="secondary"
              disabled={isReporting}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => reportingPrayerId && handleReport(reportingPrayerId)}
              variant="primary"
              disabled={!reportReason.trim() || isReporting}
              style={{ flex: 1 }}
            >
              {isReporting ? 'Reporting...' : 'Report'}
            </Button>
          </ButtonGroup>
        </ReportModalContent>
      </Modal>
    </Container>
  )
}

export { PrayerActivityFeed }
