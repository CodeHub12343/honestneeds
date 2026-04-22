'use client'

import React, { useState, forwardRef, useImperativeHandle } from 'react'
import styled from 'styled-components'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import CampaignPreview from './CampaignPreview'

const ReviewContainer = styled.div`
  display: grid;
  gap: 2rem;
`

const ReviewSection = styled.div`
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: #F8FAFC;
`

const SectionTitle = styled.h3`
  margin: 0 0 1rem;
  color: #0F172A;
  font-size: 1.125rem;
  font-weight: 600;
`

const ReviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const ReviewItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const ReviewLabel = styled.span`
  font-size: 0.875rem;
  color: #64748B;
  font-weight: 500;
`

const ReviewValue = styled.span`
  font-size: 1rem;
  color: #0F172A;
  font-weight: 600;
  word-break: break-word;
`

const ImagePreviewContainer = styled.div`
  border-radius: 8px;
  overflow: hidden;
  max-width: 400px;
  background-color: #E2E8F0;
`

const ImagePreview = styled.img`
  width: 100%;
  height: auto;
  display: block;
`

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #E2E8F0;
  border-radius: 8px;
  background-color: #FFFFFF;

  input {
    width: 1.25rem;
    height: 1.25rem;
    margin-top: 0.25rem;
    cursor: pointer;
    accent-color: #6366F1;
  }

  label {
    cursor: pointer;
    flex: 1;
  }
`

const WarningBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background-color: #FEF3C7;
  border: 1px solid #FCD34D;
  border-radius: 8px;
  color: #92400E;
`

const TabContainer = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid #E2E8F0;
  margin-bottom: 2rem;
`

const TabButton = styled.button<{ active: boolean }>`
  padding: 1rem 1.5rem;
  border: none;
  background-color: transparent;
  color: ${props => props.active ? '#6366F1' : '#64748B'};
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;

  &:hover {
    color: #6366F1;
  }

  ${props => props.active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #6366F1;
    }
  `}
`

const PreviewLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const DetailsPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  svg {
    flex-shrink: 0;
    margin-top: 0.25rem;
  }
`

export interface Step4ReviewHandle {
  handleNextAction: () => boolean
}

interface Step4ReviewProps {
  formData: any
  campaignType: 'fundraising' | 'sharing'
  termsAccepted: boolean
  onTermsChange: (accepted: boolean) => void
}

const Step4ReviewContent = React.forwardRef<Step4ReviewHandle, Step4ReviewProps>(
  (props, ref) => {
    const { formData, campaignType, termsAccepted, onTermsChange } = props
    const [viewMode, setViewMode] = useState<'details' | 'preview'>('preview')

    useImperativeHandle(
      ref,
      () => ({
        handleNextAction: () => {
          if (viewMode === 'preview') {
            setViewMode('details')
            return false
          }
          return true
        },
      }),
      [viewMode]
    )

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
    }

    return (
      <ReviewContainer>
      {/* Tab Navigation */}
      <TabContainer>
        <TabButton
          active={viewMode === 'preview'}
          onClick={() => setViewMode('preview')}
        >
          👁️ Preview as Supporter
        </TabButton>
        <TabButton
          active={viewMode === 'details'}
          onClick={() => setViewMode('details')}
        >
          📋 Campaign Details
        </TabButton>
      </TabContainer>

      {/* Preview Mode */}
      {viewMode === 'preview' && (
        <div style={{ marginBottom: '2rem' }}>
          <PreviewLayout>
            <CampaignPreview
              data={formData}
              imagePreview={formData.imagePreview}
              imageFile={formData.imageFile}
            />
            <DetailsPanel>
              <ReviewSection>
                <SectionTitle style={{ marginTop: 0 }}>About This Preview</SectionTitle>
                <div style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6 }}>
                  <p>This is how your campaign will appear to supporters and donors.</p>
                  <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
                    <li>📊 Progress metrics start at 0 (will update as supporters engage)</li>
                    <li>🎯 {campaignType === 'fundraising' ? 'Goal shown with fundraising progress bar' : 'Sharing rewards and platform details displayed'}</li>
                    <li>🔔 Supporters can follow, donate/share, and receive updates</li>
                    <li>✅ Your campaign undergoes review before going live (24-48 hours)</li>
                  </ul>
                </div>
              </ReviewSection>
            </DetailsPanel>
          </PreviewLayout>
        </div>
      )}

      {/* Details Mode */}
      {viewMode === 'details' && (
        <>
          {/* Campaign Preview */}
          <ReviewSection>
            <SectionTitle>Campaign Preview</SectionTitle>
            <ReviewGrid>
              <ReviewItem>
                <ReviewLabel>Title</ReviewLabel>
                <ReviewValue>{formData.title}</ReviewValue>
              </ReviewItem>
              <ReviewItem>
                <ReviewLabel>Category</ReviewLabel>
                <ReviewValue>{formData.category}</ReviewValue>
              </ReviewItem>
              <ReviewItem>
                <ReviewLabel>Location</ReviewLabel>
                <ReviewValue>{formData.location || 'Not specified'}</ReviewValue>
              </ReviewItem>
              <ReviewItem>
                <ReviewLabel>Campaign Type</ReviewLabel>
                <ReviewValue>
                  {campaignType === 'fundraising' ? 'Fundraising' : 'Sharing'}
                </ReviewValue>
              </ReviewItem>
            </ReviewGrid>

            <ReviewItem style={{ marginTop: '1rem' }}>
              <ReviewLabel>Description</ReviewLabel>
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  border: '1px solid #E2E8F0',
                  marginTop: '0.5rem',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {formData.description}
              </div>
            </ReviewItem>

            {formData.imagePreview && (
              <ReviewItem style={{ marginTop: '1rem' }}>
                <ReviewLabel>Campaign Image</ReviewLabel>
                <ImagePreviewContainer style={{ marginTop: '0.5rem' }}>
                  <ImagePreview src={formData.imagePreview} alt="Campaign preview" />
                </ImagePreviewContainer>
              </ReviewItem>
            )}
          </ReviewSection>

          {/* Campaign-Specific Details */}
          {campaignType === 'fundraising' ? (
            <ReviewSection>
              <SectionTitle>Fundraising Details</SectionTitle>
              <ReviewGrid>
                <ReviewItem>
                  <ReviewLabel>Goal Amount</ReviewLabel>
                  <ReviewValue>
                    {formatCurrency(formData.fundraisingData.goalAmount || 0)}
                  </ReviewValue>
                </ReviewItem>
                <ReviewItem>
                  <ReviewLabel>Campaign Duration</ReviewLabel>
                  <ReviewValue>{formData.fundraisingData.duration || 0} days</ReviewValue>
                </ReviewItem>
                <ReviewItem>
                  <ReviewLabel>Number of Payment Methods</ReviewLabel>
                  <ReviewValue>
                    {(formData.fundraisingData.paymentMethods || []).length}
                  </ReviewValue>
                </ReviewItem>
                <ReviewItem>
                  <ReviewLabel>Tags</ReviewLabel>
                  <ReviewValue>
                    {(formData.fundraisingData.tags || []).length > 0
                      ? (formData.fundraisingData.tags || []).join(', ')
                      : 'None'}
                  </ReviewValue>
                </ReviewItem>
              </ReviewGrid>
            </ReviewSection>
          ) : (
            <ReviewSection>
              <SectionTitle>Sharing Details</SectionTitle>
              <ReviewGrid>
                <ReviewItem>
                  <ReviewLabel>Total Budget</ReviewLabel>
                  <ReviewValue>
                    {formatCurrency(formData.sharingData.budget || 0)}
                  </ReviewValue>
                </ReviewItem>
                <ReviewItem>
                  <ReviewLabel>Reward Per Share</ReviewLabel>
                  <ReviewValue>
                    {formatCurrency(formData.sharingData.rewardPerShare || 0)}
                  </ReviewValue>
                </ReviewItem>
                <ReviewItem>
                  <ReviewLabel>Number of Platforms</ReviewLabel>
                  <ReviewValue>{(formData.sharingData.platforms || []).length}</ReviewValue>
                </ReviewItem>
                <ReviewItem>
                  <ReviewLabel>Max Shares</ReviewLabel>
                  <ReviewValue>
                    {formData.sharingData.maxShares ? formData.sharingData.maxShares : 'Unlimited'}
                  </ReviewValue>
                </ReviewItem>
              </ReviewGrid>

              {(formData.sharingData.platforms || []).length > 0 && (
                <ReviewItem style={{ marginTop: '1rem' }}>
                  <ReviewLabel>Platforms</ReviewLabel>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {(formData.sharingData.platforms || []).map((platform: string) => (
                      <span
                        key={platform}
                        style={{
                          display: 'inline-block',
                          padding: '0.5rem 1rem',
                          backgroundColor: '#DDD6FE',
                          color: '#6366F1',
                          borderRadius: '20px',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                        }}
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </ReviewItem>
              )}
            </ReviewSection>
          )}

          {/* Terms & Confirmation */}
          <ReviewSection>
            <WarningBox>
              <AlertCircle size={20} />
              <div>
                <strong>Campaign Review</strong>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem' }}>
                  Your campaign will be reviewed by our team before going live. This typically takes
                  24-48 hours.
                </p>
              </div>
            </WarningBox>

            <CheckboxContainer style={{ marginTop: '1rem' }}>
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => onTermsChange(e.target.checked)}
                aria-label="Accept terms and conditions"
              />
              <label htmlFor="terms">
                I agree to the{' '}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#6366F1', textDecoration: 'underline' }}
                >
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#6366F1', textDecoration: 'underline' }}
                >
                  Privacy Policy
                </a>
                . I declare that the information provided is accurate and truthful.
              </label>
            </CheckboxContainer>

            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
              <div style={{ fontSize: '0.875rem', color: '#64748B' }}>
                Once published, your campaign will be visible to supporters and available for
                donations/shares.
              </div>
            </div>
          </ReviewSection>
        </>
      )}
    </ReviewContainer>
    )
  }
)

Step4ReviewContent.displayName = 'Step4ReviewContent'

export const Step4Review = Step4ReviewContent
