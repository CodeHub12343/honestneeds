'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { COLORS, SPACING } from '@/styles/tokens'
import { Button } from '@/components/Button'
import { CampaignPrayerConfig } from '@/utils/prayerValidationSchemas'

interface Step5PrayerConfigurationProps {
  currentData?: Partial<CampaignPrayerConfig>
  onNext: (prayerConfig: Partial<CampaignPrayerConfig>) => void
  isLoading?: boolean
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING[8]};
`

const Header = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`

const EnableSection = styled.div`
  background: #f3e8ff;
  border: 1px solid #ddd6fe;
  border-radius: 8px;
  padding: ${SPACING[6]};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Step5PrayerConfiguration: React.FC<Step5PrayerConfigurationProps> = ({
  currentData = {},
  onNext,
  isLoading = false,
}) => {
  const [enabled, setEnabled] = useState(currentData?.enabled ?? false)
  const [title, setTitle] = useState(currentData?.title ?? 'Prayer Support')
  const [description, setDescription] = useState(currentData?.description ?? 'Join us in prayer for this campaign')
  const [prayerGoal, setPrayerGoal] = useState(currentData?.prayer_goal ?? 100)
  const [allowTextPrayers, setAllowTextPrayers] = useState(
    currentData?.settings?.allow_text_prayers ?? true
  )
  const [allowVoicePrayers, setAllowVoicePrayers] = useState(
    currentData?.settings?.allow_voice_prayers ?? true
  )
  const [allowVideoPrayers, setAllowVideoPrayers] = useState(
    currentData?.settings?.allow_video_prayers ?? true
  )
  const [prayersPublic, setPrayersPublic] = useState(
    currentData?.settings?.prayers_public ?? true
  )
  const [showPrayerCount, setShowPrayerCount] = useState(
    currentData?.settings?.show_prayer_count ?? true
  )
  const [anonymousPrayers, setAnonymousPrayers] = useState(
    currentData?.settings?.anonymous_prayers ?? true
  )
  const [requireApproval, setRequireApproval] = useState(
    currentData?.settings?.require_approval ?? false
  )

  const handleNext = () => {
    const config: Partial<CampaignPrayerConfig> = {
      enabled,
      title: enabled ? title : undefined,
      description: enabled ? description : undefined,
      prayer_goal: enabled ? prayerGoal : undefined,
      settings: {
        allow_text_prayers: allowTextPrayers,
        allow_voice_prayers: allowVoicePrayers,
        allow_video_prayers: allowVideoPrayers,
        prayers_public: prayersPublic,
        show_prayer_count: showPrayerCount,
        anonymous_prayers: anonymousPrayers,
        require_approval: requireApproval,
      },
    }
    onNext(config)
  }

  return (
    <Container>
      <Header>🙏 Prayer Support</Header>

      <EnableSection>
        <div>
          <strong>Enable Prayer Support</strong>
          <p>Allow supporters to send prayers</p>
        </div>
        <label>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            disabled={isLoading}
          />
        </label>
      </EnableSection>

      {enabled && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label htmlFor="prayer-title">Prayer Title</label>
            <input
              id="prayer-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              maxLength={100}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label htmlFor="prayer-description">Prayer Description</label>
            <textarea
              id="prayer-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              maxLength={500}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '80px' }}
            />
          </div>

          <div>
            <label htmlFor="prayer-goal">Prayer Goal (number of prayers)</label>
            <input
              id="prayer-goal"
              type="number"
              value={prayerGoal}
              onChange={(e) => setPrayerGoal(Math.max(1, parseInt(e.target.value) || 100))}
              disabled={isLoading}
              min={1}
              max={10000}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ borderTop: '1px solid #ddd', paddingTop: '12px', marginTop: '12px' }}>
            <strong>Prayer Types Allowed:</strong>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <input
                type="checkbox"
                checked={allowTextPrayers}
                onChange={(e) => setAllowTextPrayers(e.target.checked)}
                disabled={isLoading}
              />
              Allow Text Prayers
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <input
                type="checkbox"
                checked={allowVoicePrayers}
                onChange={(e) => setAllowVoicePrayers(e.target.checked)}
                disabled={isLoading}
              />
              Allow Voice Prayers
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <input
                type="checkbox"
                checked={allowVideoPrayers}
                onChange={(e) => setAllowVideoPrayers(e.target.checked)}
                disabled={isLoading}
              />
              Allow Video Prayers
            </label>
          </div>

          <div style={{ borderTop: '1px solid #ddd', paddingTop: '12px', marginTop: '12px' }}>
            <strong>Prayer Settings:</strong>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <input
                type="checkbox"
                checked={prayersPublic}
                onChange={(e) => setPrayersPublic(e.target.checked)}
                disabled={isLoading}
              />
              Prayers are Public (visible to all)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <input
                type="checkbox"
                checked={showPrayerCount}
                onChange={(e) => setShowPrayerCount(e.target.checked)}
                disabled={isLoading}
              />
              Show Prayer Count
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <input
                type="checkbox"
                checked={anonymousPrayers}
                onChange={(e) => setAnonymousPrayers(e.target.checked)}
                disabled={isLoading}
              />
              Allow Anonymous Prayers
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <input
                type="checkbox"
                checked={requireApproval}
                onChange={(e) => setRequireApproval(e.target.checked)}
                disabled={isLoading}
              />
              Require Prayer Approval Before Publishing
            </label>
          </div>
        </div>
      )}

      <Button onClick={handleNext} disabled={isLoading} variant="primary">
        {isLoading ? 'Saving...' : 'Continue'}
      </Button>
    </Container>
  )
}

export default Step5PrayerConfiguration
