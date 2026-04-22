'use client'

import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { DollarSign, Users, TrendingUp, Target } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { DashboardProvider, useDashboardContext } from './context/DashboardContext'
import { useDashboardData } from './hooks/useDashboardData'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import {
  usePauseCampaign,
  useUnpauseCampaign,
  useDeleteCampaign,
} from '@/api/hooks/useCampaigns'
import {
  useBatchPauseCampaigns,
  useBatchCompleteCampaigns,
  useBatchDeleteCampaigns,
} from '@/api/hooks/useBatchCampaigns'
import { DashboardHeader } from './components/DashboardHeader'
import { KPICardsGrid } from './components/KPICard'
import { CampaignCardSelectable } from './components/CampaignCardSelectable'
import { PerformanceChart } from './components/PerformanceChart'
import { ActivityFeed } from './components/ActivityFeed'
import { ComparisonView } from './components/ComparisonView'
import { HealthScore } from './components/HealthScore'
import { BatchOperations } from './components/BatchOperations'
import { SmartConfirmation, useUndoableAction } from './components/SmartConfirmation'
import { useToast } from '@/hooks/useToast'
// Phase 4: Real-Time & Notifications
import { NotificationPreferencesProvider, useNotificationPreferences } from './context/NotificationPreferencesContext'
import { useWebSocketNotifications, NotificationData } from './hooks/useWebSocketNotifications'
import { NotificationStack } from './components/NotificationBanner'
import NotificationPreferencesModal from './components/NotificationPreferencesModal'
import { browserNotificationsService } from './services/BrowserNotificationsService'
import { soundAlertsService } from './services/SoundAlertsService'

/**
 * Unified Creator Dashboard
 * Consolidated view of all campaigns with stats, filters, and actions
 */

// Type definitions for mock data
interface ActivityRecord {
  id: string
  type: 'donation' | 'campaign_activated' | 'campaign_created'
  title: string
  description: string
  timestamp: string
  campaignTitle: string
  amount?: number
}

interface TimeSeriesDataPoint {
  date: string
  revenue: number
  donorCount: number
}

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100vh;
  background: #f8fafc;

  @media (max-width: 768px) {
    padding: 16px;
  }
`

const ErrorContainer = styled.div`
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 16px;
  color: #dc2626;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: 18px;
  }
`

const SectionDivider = styled.div`
  height: 1px;
  background: linear-gradient(to right, transparent, #d1d5db, transparent);
  margin: 40px 0;
`

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 32px 0 20px 0;
`

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

/**
 * Inner Dashboard Content Component
 * Uses context for shared state
 * PHASE 3: Includes batch operations, keyboard shortcuts, context menus, smart confirmations
 * PHASE 4: Includes real-time notifications, WebSocket integration, notification preferences
 */
function DashboardContent() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { showToast } = useToast()
  const { preferences } = useNotificationPreferences()

  // Dashboard context
  const { filters, updateFilter } = useDashboardContext()

  // Phase 4: Notifications
  const { notifications, unreadCount, isConnected, clearNotification } =
    useWebSocketNotifications(user?.id)
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false)
  const [notificationStack, setNotificationStack] = useState<NotificationData[]>([])

  // Phase 3: Selection & Batch Operations state
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Smart confirmation state
  const { lastAction, undo, dismiss } = useUndoableAction()

  // Local state
  const [searchQuery, setSearchQuery] = useState('')
  const [showError, setShowError] = useState(false)
  const [selectedCampaignForHealth] = useState<string | null>(null)
  const [mockActivities, setMockActivities] = useState<ActivityRecord[]>([])
  const [mockTimeSeriesData, setMockTimeSeriesData] = useState<TimeSeriesDataPoint[]>([])

  // Initialize services and browser notifications
  useEffect(() => {
    if (!user?.id) return

    // Initialize sound alerts service
    soundAlertsService.initialize({
      volume: preferences?.soundSettings?.volume ? preferences.soundSettings.volume * 100 : 80,
      soundType: preferences?.soundSettings?.soundType || 'bell',
      muted: !preferences?.soundEnabled,
    })

    // Initialize browser notifications (request permission)
    if (preferences?.browserNotificationsEnabled) {
      browserNotificationsService.initialize().catch((error) => {
        console.warn('Browser notifications not available:', error)
      })
    }

    console.log('✅ Phase 4 services initialized', {
      sound: !preferences?.soundEnabled ? 'muted' : 'enabled',
      browserNotifications: preferences?.browserNotificationsEnabled ? 'enabled' : 'disabled',
    })
  }, [user?.id, preferences])

  // Phase 4: Handle new notifications from WebSocket
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0]
      // Generate deterministic ID if missing (use timestamp as fallback)
      const notificationId = latestNotification.id || `notif-${Date.now()}-${notifications.length}`

      // Update notification stack with proper typing
      setNotificationStack((prev) => [
        {
          ...latestNotification,
          id: notificationId,
        },
        ...prev,
      ].slice(0, 5))

      // Play sound if enabled
      if (preferences?.soundEnabled) {
        soundAlertsService.playSound({ soundType: preferences?.soundSettings?.soundType || 'bell' })
      }

      // Show browser notification if enabled
      if (preferences?.browserNotificationsEnabled) {
        browserNotificationsService.sendNotification(latestNotification.title, {
          body: latestNotification.description,
          tag: latestNotification.eventType,
        })
      }

      // Show toast for urgent notifications
      if (latestNotification.severity === 'danger' || latestNotification.severity === 'warning') {
        showToast({
          type: latestNotification.severity === 'danger' ? 'error' : 'warning',
          message: latestNotification.title,
        })
      }
    }
  }, [notifications, preferences, showToast])

  // Data hooks
  const { campaigns, stats, totalCount, isLoading, error, refetch } = useDashboardData(
    filters.status,
    1,
    searchQuery
  )

  // Action mutations
  const { mutate: pauseCampaign } = usePauseCampaign()
  const { mutate: resumeCampaign } = useUnpauseCampaign()
  const { mutate: deleteCampaign } = useDeleteCampaign()

  // Phase 3: Batch operation mutations
  const { mutate: batchPause, isPending: isBatchPausePending } = useBatchPauseCampaigns()
  const { mutate: batchComplete, isPending: isBatchCompletePending } = useBatchCompleteCampaigns()
  const { mutate: batchDelete, isPending: isBatchDeletePending } = useBatchDeleteCampaigns()

  // Load saved views from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dashboardSavedViews')
      if (saved) {
        const parsed = JSON.parse(saved)
        setSavedViews(parsed)
      }
    } catch (err) {
      console.error('Error loading saved views:', err)
    }
    // Dependency array empty - only run once on mount
  }, [])

  // Generate mock data (Phase 2) - moved to effect to avoid impure functions in render
  useEffect(() => {
    // Generate mock performance data for active/completed campaigns
    const perfData = campaigns
      .filter((c) => c.status === 'active' || c.status === 'completed')
      .slice(0, 1)
      .flatMap((campaign) => {
        const data = []
        const baseDate = new Date()
        for (let i = 29; i >= 0; i--) {
          const date = new Date(baseDate)
          date.setDate(date.getDate() - i)
          const dateStr = date.toISOString().split('T')[0]
          const dailyRevenue = Math.random() * (campaign.goal / 30)
          data.push({
            date: dateStr,
            revenue: campaign.raised * ((29 - i) / 30) + dailyRevenue,
            donorCount: Math.floor((campaign.donor_count || 0) * ((29 - i) / 30)),
          })
        }
        return data
      })
    // Set mock data in a single update
    setMockTimeSeriesData(perfData)
  }, [campaigns])

  // Memoize activities to prevent infinite loops in ActivityFeed
  const memoizedActivities = useMemo(() => {
    const activities = campaigns.slice(0, 5).map((c, i) => {
      const typeMap: Record<number, 'donation' | 'campaign_activated' | 'campaign_created'> = {
        0: 'donation',
        1: 'campaign_activated',
      }
      const type = typeMap[i] || 'campaign_created'
      const titleMap: Record<typeof type, string> = {
        donation: 'New Donation',
        campaign_activated: 'Campaign Activated',
        campaign_created: 'Campaign Created',
      }
      const descriptionMap: Record<typeof type, (title: string) => string> = {
        donation: (title: string) => `${title} received a donation`,
        campaign_activated: (title: string) => `${title} is now live`,
        campaign_created: (title: string) => `${title} was created`,
      }
      
      return {
        id: `activity-${i}`,
        type,
        title: titleMap[type],
        description: descriptionMap[type](c.title),
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        campaignTitle: c.title,
        amount: i === 0 ? Math.random() * 500 : undefined,
      }
    })
    return activities
  }, [campaigns])

  useEffect(() => {
    setMockActivities(memoizedActivities)
  }, [memoizedActivities])

  // Phase 3: Keyboard shortcuts
  useKeyboardShortcuts(
    [
      {
        key: 'e',
        handler: () => {
          if (selectedIds.length === 1) {
            const campaign = campaigns.find((c) => c._id === selectedIds[0])
            if (campaign && campaign.status === 'draft') {
              router.push(`/dashboard/campaigns/${selectedIds[0]}/edit`)
            }
          }
        },
        description: 'Edit selected campaign (draft only)',
      },
      {
        key: 'p',
        handler: () => {
          if (selectedIds.length === 1) {
            const campaign = campaigns.find((c) => c._id === selectedIds[0])
            if (campaign && campaign.status === 'active') {
              handlePause(selectedIds[0])
            }
          }
        },
        description: 'Pause selected campaign',
      },
      {
        key: 'Escape',
        handler: () => {
          setSelectedIds([])
        },
        description: 'Clear selection',
      },
    ],
    !isLoading
  )

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // Handle pause campaign
  const handlePause = (campaignId: string) => {
    pauseCampaign(campaignId, {
      onSuccess: () => {
        showToast({ type: 'success', message: 'Campaign paused successfully' })
        refetch()
      },
      onError: () => {
        showToast({ type: 'error', message: 'Failed to pause campaign' })
      },
    })
  }

  // Handle resume campaign
  const handleResume = (campaignId: string) => {
    resumeCampaign(campaignId, {
      onSuccess: () => {
        showToast({ type: 'success', message: 'Campaign resumed successfully' })
        refetch()
      },
      onError: () => {
        showToast({ type: 'error', message: 'Failed to resume campaign' })
      },
    })
  }

  // Handle delete campaign
  const handleDelete = (campaignId: string) => {
    if (window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      deleteCampaign(campaignId, {
        onSuccess: () => {
          showToast({ type: 'success', message: 'Campaign deleted successfully' })
          refetch()
        },
        onError: () => {
          showToast({ type: 'error', message: 'Failed to delete campaign' })
        },
      })
    }
  }

  // Phase 3: Handle batch pause
  const handleBatchPause = (ids: string[]) => {
    batchPause(ids, {
      onSuccess: () => {
        showToast({ type: 'success', message: `${ids.length} campaigns paused successfully` })
        setSelectedIds([])
        refetch()
      },
      onError: () => {
        showToast({ type: 'error', message: 'Failed to pause campaigns' })
      },
    })
  }

  // Phase 3: Handle batch complete
  const handleBatchComplete = (ids: string[]) => {
    batchComplete(ids, {
      onSuccess: () => {
        showToast({ type: 'success', message: `${ids.length} campaigns completed successfully` })
        setSelectedIds([])
        refetch()
      },
      onError: () => {
        showToast({ type: 'error', message: 'Failed to complete campaigns' })
      },
    })
  }

  // Phase 3: Handle batch delete
  const handleBatchDelete = (ids: string[]) => {
    if (!window.confirm(`Delete ${ids.length} campaigns? This cannot be undone.`)) return
    batchDelete(ids, {
      onSuccess: () => {
        showToast({ type: 'success', message: `${ids.length} campaigns deleted successfully` })
        setSelectedIds([])
        refetch()
      },
      onError: () => {
        showToast({ type: 'error', message: 'Failed to delete campaigns' })
      },
    })
  }

  // Phase 3: Handle selection toggle
  const toggleSelection = (campaignId: string) => {
    setSelectedIds((prev) =>
      prev.includes(campaignId) ? prev.filter((id) => id !== campaignId) : [...prev, campaignId]
    )
  }

  // Phase 3: Clear selection
  const handleClearSelection = () => {
    setSelectedIds([])
  }

  // Handle view campaign
  const handleView = (campaignId: string) => {
    router.push(`/campaigns/${campaignId}`)
  }

  // Phase 3: Handle selection toggle
  const campaignsForComparison = campaigns.map((c) => ({
    id: c._id,
    title: c.title,
    raised: c.raised || 0,
    goal: c.goal || 0,
    donors: c.donor_count || 0,
    status: c.status,
    created_at: c.created_at,
  }))

  // Get selected campaign for health score
  const selectedCampaign = campaigns.find((c) => c._id === selectedCampaignForHealth) || campaigns[0]

  // Prepare KPI cards
  const kpiCards = [
    {
      title: 'Total Raised',
      value: `$${((stats.totalRaised || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarSign size={20} />,
      color: 'success' as const,
      trend: {
        direction: 'up' as const,
        percentage: 18,
        period: '30 days',
      },
      comparison: {
        label: 'All Campaigns',
        value: `${stats.totalCampaigns} total`,
      },
    },
    {
      title: 'Active Campaigns',
      value: stats.totalActiveCampaigns,
      icon: <TrendingUp size={20} />,
      color: 'primary' as const,
      comparison: {
        label: 'Total',
        value: `${stats.totalCampaigns} campaigns`,
      },
    },
    {
      title: 'Total Supporters',
      value: stats.totalDonors.toLocaleString(),
      icon: <Users size={20} />,
      color: 'primary' as const,
      trend: {
        direction: 'up' as const,
        percentage: 32,
        period: 'vs last month',
      },
    },
    {
      title: 'Success Rate',
      value: `${Math.round(stats.successRate)}%`,
      icon: <Target size={20} />,
      color: 'success' as const,
      comparison: {
        label: 'Completed',
        value:
          stats.totalCampaigns > 0
            ? `${Math.round((campaigns.filter((c) => c.status === 'completed').length / campaigns.length) * 100)}%`
            : 'N/A',
      },
    },
  ]

  if (!user) {
    return null
  }

  return (
    <>
      {/* Phase 4: Notification Stack - Real-time notifications */}
      <NotificationStack
        notifications={notificationStack.filter((notif) => notif.id).map((notif) => ({
          id: notif.id || '', // Already guaranteed by effect to have id
          title: notif.title,
          description: notif.description,
          severity: notif.severity,
        }))}
        onDismiss={clearNotification}
      />

      {/* Phase 4: Notification Preferences Modal */}
      <NotificationPreferencesModal isOpen={isPreferencesModalOpen} onClose={() => setIsPreferencesModalOpen(false)} />

      <PageContainer>
        {error && !showError && (
          <ErrorContainer>
            <span>Failed to load dashboard data. Please try again.</span>
            <button onClick={() => setShowError(false)}>×</button>
          </ErrorContainer>
        )}

        {/* Phase 4: Connection Status Indicator */}
        {!isConnected && (
          <ErrorContainer style={{ background: '#fef3c7', borderColor: '#fcd34d', color: '#92400e' }}>
            <span>⚠️ Real-time notifications are disconnected</span>
            <button onClick={() => window.location.reload()}>Reconnect</button>
          </ErrorContainer>
        )}

      <DashboardHeader
        title="Dashboard"
        subtitle="Manage and grow your campaigns"
        searchValue={searchQuery}
        onSearchChange={handleSearch}
        campaignCount={totalCount}
        unreadCount={unreadCount}
        onNotificationsClick={() => setIsPreferencesModalOpen(true)}
      />

      {/* Quick Actions */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap',
      }}>
      </div>

      {/* KPI Cards */}
      <KPICardsGrid cards={kpiCards} isLoading={isLoading} />

      {/* Phase 2: Visualization & Analytics */}

      {/* Performance Analytics */}
      <SectionTitle>Performance Analytics</SectionTitle>
      {mockTimeSeriesData.length > 0 ? (
        <PerformanceChart
          data={mockTimeSeriesData}
          goal={campaigns[0]?.goal}
          chartType="area"
        />
      ) : (
        <p style={{ color: '#9ca3af' }}>Activate a campaign to see performance data</p>
      )}

      <SectionDivider />

      {/* Recent Activity & Health Score */}
      <SectionTitle>Campaign Insights</SectionTitle>
      <TwoColumnGrid>
        <ActivityFeed activities={mockActivities} limit={5} isLoading={isLoading} />
        {selectedCampaign && (
          <HealthScore
            campaign={{
              raised: selectedCampaign.raised || 0,
              goal: selectedCampaign.goal || 0,
              donor_count: selectedCampaign.donor_count || 0,
              status: selectedCampaign.status,
              created_at: selectedCampaign.created_at,
              updated_at: selectedCampaign.updated_at,
            }}
            showBreakdown={true}
            size="medium"
          />
        )}
      </TwoColumnGrid>

      <SectionDivider />

      {/* Campaign Comparison */}
      <SectionTitle>Campaign Performance Comparison</SectionTitle>
      <ComparisonView
        campaigns={campaignsForComparison}
        onSelectCampaign={handleView}
        selectedIds={selectedCampaignForHealth ? [selectedCampaignForHealth] : []}
      />

      <SectionDivider />

      {/* Campaigns Grid with Phase 3: Batch Operations, Context Menu, Quick Actions */}
      <SectionTitle>
        All Campaigns {selectedIds.length > 0 && `(${selectedIds.length} selected)`}
      </SectionTitle>

      {/* Phase 3: Batch Operations Bar */}
      <BatchOperations
        selectedCount={selectedIds.length}
        selectedIds={selectedIds}
        onPause={handleBatchPause}
        onComplete={handleBatchComplete}
        onDelete={handleBatchDelete}
        onClearSelection={handleClearSelection}
        isLoading={isBatchPausePending || isBatchCompletePending || isBatchDeletePending}
      />

      {/* Responsive Campaign Grid with Selectable Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
          marginBottom: '40px',
        }}
      >
        {isLoading ? (
          // Skeleton loaders
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: '#f3f4f6',
                borderRadius: '12px',
                height: '240px',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
          ))
        ) : campaigns.length === 0 ? (
          // Empty state
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '60px 20px',
              color: '#9ca3af',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <p>
              {searchQuery
                ? `No campaigns found matching "${searchQuery}"`
                : 'No campaigns found. Create your first campaign to get started!'}
            </p>
          </div>
        ) : (
          // Campaign cards
          campaigns.map((campaign) => (
            <div key={campaign._id} data-campaign-id={campaign._id}>
              <CampaignCardSelectable
                campaign={campaign}
                isSelected={selectedIds.includes(campaign._id)}
                onSelectChange={() => toggleSelection(campaign._id)}
                showCheckbox={true}
                variant="grid"
                onPause={() => handlePause(campaign._id)}
                onResume={() => handleResume(campaign._id)}
                onDelete={() => handleDelete(campaign._id)}
                onView={() => handleView(campaign._id)}
                onAnalytics={() => router.push(`/campaigns/${campaign._id}/analytics`)}
              />
            </div>
          ))
        )}
      </div>

      {/* Phase 3: Smart Confirmation Toast */}
      <SmartConfirmation
        action={lastAction}
        onUndo={undo}
        onDismiss={dismiss}
        undoTimeout={5000}
      />
      </PageContainer>
    </>
  )
}

/**
 * Main Dashboard Page
 * Wrapped with DashboardProvider and NotificationPreferencesProvider (Phase 4)
 */
export default function DashboardPage() {
  return (
    <NotificationPreferencesProvider>
      <DashboardProvider>
        <DashboardContent />
      </DashboardProvider>
    </NotificationPreferencesProvider>
  )
}
