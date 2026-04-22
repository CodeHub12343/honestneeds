import React from 'react'
import { Metadata } from 'next'
import styled from 'styled-components'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { CampaignWizard } from '@/components/campaign/wizard/CampaignWizard'

export const metadata: Metadata = {
  title: 'Create Campaign - HonestNeed',
  description: 'Create a new fundraising or sharing campaign on HonestNeed',
}

// Styled Components
const PageContainer = styled.div`
  padding-top: 2rem;
  padding-bottom: 3rem;
  min-height: 100vh;
  background-color: #f8fafc;
`

export default function CreateCampaignPage() {
  return (
    <ProtectedRoute allowedRoles={['creator']}>
      <PageContainer>
        <CampaignWizard draftExists={true} />
      </PageContainer>
    </ProtectedRoute>
  )
}
