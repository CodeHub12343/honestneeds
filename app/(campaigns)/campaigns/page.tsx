'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import { useCampaigns, useNeedTypes } from '@/api/hooks/useCampaigns'
import { useFilterStore } from '@/store/filterStore'
import { CampaignGrid } from '@/components/campaign/CampaignGrid'
import { SearchBar } from '@/components/campaign/SearchBar'
import { FiltersSidebar } from '@/components/campaign/FiltersSidebar'
import Button from '@/components/ui/Button'

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
`

const Header = styled.div`
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
`

const HeaderContent = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.5rem;

  @media (min-width: 640px) {
    padding: 1.5rem 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 1.5rem 2rem;
  }
`

const HeaderTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`

const HeaderDescription = styled.p`
  color: #4b5563;
`

const MainContent = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1rem;

  @media (min-width: 640px) {
    padding: 2rem 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 2rem 2rem;
  }
`

const SearchContainer = styled.div`
  margin-bottom: 2rem;
`

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr; /* Full width - no sidebar */
  }
`

const SidebarContainer = styled.div`
  display: none; /* ✅ Filters removed - sidebar hidden */

  @media (min-width: 1024px) {
    display: block;
  }
`

const SidebarSticky = styled.div`
  position: sticky;
  top: 5rem;
`

const ContentColumn = styled.div`
  @media (min-width: 1024px) {
    grid-column: span 1;
  }
`

const MobileFilterToggle = styled.div`
  display: none; /* ✅ Filters removed - toggle hidden */
  margin-bottom: 1.5rem;

  @media (min-width: 1024px) {
    display: none;
  }
`

const MobileFiltersContainer = styled.div<{ $isOpen: boolean }>`
  display: none; /* ✅ Filters removed - container hidden */
  margin-bottom: 2rem;
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px -1px rgba(0, 0, 0, 0.1);

  @media (min-width: 1024px) {
    display: none;
  }
`

const ResultsInfo = styled.div`
  margin-bottom: 1.5rem;
`

const ResultsText = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
`

const PaginationContainer = styled.div`
  margin-top: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`

const MobileFilterButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`

export default function CampaignBrowsePage() {
  const router = useRouter()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const { filters, setSearchQuery, setNeedTypes, setLocation, setGoalRange, setStatus, setSortBy, setPage, resetFilters } = useFilterStore()
  
  // Default to 'active' status if not set or is 'all'
  useEffect(() => {
    console.log('🎯 [Campaigns Page] MOUNTED - Initial load', {
      timestamp: new Date().toISOString(),
      currentStatus: filters.status,
      filters,
    })
    
    if (!filters.status || filters.status === 'all') {
      console.log('📋 [Campaigns Page] Setting default status filter to "active" (exclude drafts)', {
        currentStatus: filters.status,
      })
      setStatus('active') // Only show active campaigns by default
    }
  }, [setStatus])

  // Log filter changes
  useEffect(() => {
    console.log('🔄 [Campaigns Page] FILTERS CHANGED', {
      page: filters.page,
      limit: filters.limit,
      status: filters.status,
      searchQuery: filters.searchQuery,
      needTypes: filters.needTypes,
      location: filters.location,
      geographicScope: filters.geographicScope,
    })
  }, [filters])

  const { data: campaignData, isLoading } = useCampaigns(
    filters.page,
    filters.limit,
    filters
  )
  const { data: needTypesData } = useNeedTypes()

  // Log API response
  useEffect(() => {
    if (campaignData) {
      console.log('✅ [Campaigns Page] API RESPONSE RECEIVED', {
        total: campaignData.total,
        campaignCount: campaignData.campaigns?.length || 0,
        page: campaignData.page,
        totalPages: campaignData.totalPages,
        campaigns: campaignData.campaigns?.map(c => ({
          id: c.id || c._id,
          title: c.title,
          status: c.status,
          created_at: c.created_at,
        })),
      })
    } else if (isLoading) {
      console.log('⏳ [Campaigns Page] LOADING campaigns...', { filters })
    }
  }, [campaignData, isLoading])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [setSearchQuery])

  const handleDonate = useCallback((campaignId: string) => {
    router.push(`/campaigns/${campaignId}/donate`)
  }, [router])

  const handleShare = useCallback((campaignId: string) => {
    // Copy share link to clipboard
    const shareUrl = `${window.location.origin}/campaigns/${campaignId}`
    navigator.clipboard.writeText(shareUrl).then(() => {
      // Show success toast
      toast.success('Link copied to clipboard!', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }).catch((err) => {
      // Show error toast if copy fails
      console.error('Failed to copy to clipboard:', err)
      toast.error('Failed to copy link to clipboard', {
        position: 'bottom-right',
        autoClose: 3000,
      })
    })
  }, [])

  const campaigns = campaignData?.campaigns || []
  const totalPages = campaignData?.totalPages || 1
  const needTypes = needTypesData || []

  return (
    <PageContainer>
      {/* Header */}
      <Header>
        <HeaderContent>
          <HeaderTitle>Explore Campaigns</HeaderTitle>
          <HeaderDescription>
            Discover campaigns making a difference in our community
          </HeaderDescription>
        </HeaderContent>
      </Header>

      {/* Main Content */}
      <MainContent>
        {/* Search Bar */}
        <SearchContainer>
          <SearchBar onSearch={handleSearch} />
        </SearchContainer>

        <LayoutGrid>
          {/* Sidebar - Desktop */}
          <SidebarContainer>
            <SidebarSticky>
              <FiltersSidebar
                filters={filters}
                needTypes={needTypes}
                onFiltersChange={(updatedFilters) => {
                  // Apply all filter changes
                  if (
                    updatedFilters.needTypes &&
                    JSON.stringify(updatedFilters.needTypes) !==
                      JSON.stringify(filters.needTypes)
                  ) {
                    setNeedTypes(updatedFilters.needTypes)
                  }
                  if (
                    updatedFilters.location !== filters.location ||
                    updatedFilters.locationRadius !== filters.locationRadius
                  ) {
                    setLocation(updatedFilters.location || '', updatedFilters.locationRadius || 0)
                  }
                  if (
                    updatedFilters.minGoal !== filters.minGoal ||
                    updatedFilters.maxGoal !== filters.maxGoal
                  ) {
                    setGoalRange(
                      updatedFilters.minGoal || 0,
                      updatedFilters.maxGoal || 9999999 * 100
                    )
                  }
                  if (updatedFilters.status !== filters.status) {
                    setStatus(updatedFilters.status)
                  }
                  if (updatedFilters.sortBy !== filters.sortBy) {
                    setSortBy(updatedFilters.sortBy)
                  }
                }}
                onReset={resetFilters}
              />
            </SidebarSticky>
          </SidebarContainer>

          {/* Main Content */}
          <ContentColumn>
            {/* Mobile Filter Toggle */}
            <MobileFilterToggle>
              <MobileFilterButtonWrapper>
                <Button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  variant="outline"
                  size="md"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  {mobileFiltersOpen ? <X size={20} /> : <Menu size={20} />}
                  {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </MobileFilterButtonWrapper>
            </MobileFilterToggle>

            {/* Mobile Filters Sidebar */}
            <MobileFiltersContainer $isOpen={mobileFiltersOpen}>
              <FiltersSidebar
                filters={filters}
                needTypes={needTypes}
                onFiltersChange={(updatedFilters) => {
                  if (
                    updatedFilters.needTypes &&
                    JSON.stringify(updatedFilters.needTypes) !==
                      JSON.stringify(filters.needTypes)
                  ) {
                    setNeedTypes(updatedFilters.needTypes)
                  }
                  if (
                    updatedFilters.location !== filters.location ||
                    updatedFilters.locationRadius !== filters.locationRadius
                  ) {
                    setLocation(updatedFilters.location || '', updatedFilters.locationRadius || 0)
                  }
                  if (
                    updatedFilters.minGoal !== filters.minGoal ||
                    updatedFilters.maxGoal !== filters.maxGoal
                  ) {
                    setGoalRange(
                      updatedFilters.minGoal || 0,
                      updatedFilters.maxGoal || 9999999 * 100
                    )
                  }
                  if (updatedFilters.status !== filters.status) {
                    setStatus(updatedFilters.status)
                  }
                  if (updatedFilters.sortBy !== filters.sortBy) {
                    setSortBy(updatedFilters.sortBy)
                  }
                }}
                onReset={() => {
                  resetFilters()
                  setMobileFiltersOpen(false)
                }}
                mobile
                isOpen={mobileFiltersOpen}
                onClose={() => setMobileFiltersOpen(false)}
              />
            </MobileFiltersContainer>

            {/* Results Info */}
            <ResultsInfo>
              <ResultsText>
                Showing {campaigns.length > 0 ? (filters.page - 1) * filters.limit + 1 : 0}-
                {Math.min(filters.page * filters.limit, campaignData?.total || 0)} of{' '}
                {campaignData?.total || 0} campaigns
              </ResultsText>
            </ResultsInfo>

            {/* Campaign Grid */}
            <CampaignGrid
              campaigns={campaigns}
              isLoading={isLoading}
              onDonate={handleDonate}
              onShare={handleShare}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <PaginationContainer>
                <Button
                  onClick={() => setPage(Math.max(1, filters.page - 1))}
                  disabled={filters.page === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum =
                    filters.page > 3
                      ? filters.page - 2 + i
                      : i + 1
                  if (pageNum > totalPages) return null
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      variant={pageNum === filters.page ? 'primary' : 'outline'}
                      size="sm"
                    >
                      {pageNum}
                    </Button>
                  )
                })}

                <Button
                  onClick={() => setPage(Math.min(totalPages, filters.page + 1))}
                  disabled={filters.page === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </PaginationContainer>
            )}
          </ContentColumn>
        </LayoutGrid>
      </MainContent>
    </PageContainer>
  )
}
