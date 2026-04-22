'use client'

import { useState } from 'react'
import styled from 'styled-components'
import { ChevronDown, X, MapPin, Map, Globe, Zap } from 'lucide-react'
import { CampaignFilters } from '@/store/filterStore'
import { GEOGRAPHIC_SCOPES } from '@/utils/validationSchemas'

interface FiltersSidebarProps {
  filters: CampaignFilters
  needTypes: Array<{ id: string; name: string; count: number }>
  onFiltersChange: (filters: CampaignFilters) => void
  onReset: () => void
  isOpen?: boolean
  onClose?: () => void
  mobile?: boolean
}

const NEED_TYPES_VISIBLE = 10

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`

const MobileTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
`

const CloseButton = styled.button`
  padding: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #111827;
  transition: color 0.2s ease;

  &:hover {
    color: #6366f1;
  }
`

const Section = styled.div`
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;

  &:last-of-type {
    border-bottom: none;
  }
`

const SectionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-weight: 600;
  color: #111827;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #6366f1;
  }
`

const ChevronIcon = styled(ChevronDown)<{ $expanded: boolean }>`
  transform: ${(props) => (props.$expanded ? 'rotate(0deg)' : 'rotate(-90deg)')};
  transition: transform 0.2s ease;
  flex-shrink: 0;
`

const SectionContent = styled.div`
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  transition: color 0.2s ease;

  &:hover {
    color: #6366f1;
  }

  input[type='checkbox'] {
    cursor: pointer;
    border-radius: 0.25rem;
    border: 1px solid #d1d5db;
  }
`

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  transition: color 0.2s ease;

  &:hover {
    color: #6366f1;
  }

  input[type='radio'] {
    cursor: pointer;
    border: 1px solid #d1d5db;
  }
`

const LabelText = styled.span`
  flex: 1;
`

const CountBadge = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`

const ShowMoreButton = styled.button`
  font-size: 0.875rem;
  color: #6366f1;
  background: none;
  border: none;
  cursor: pointer;
  margin-top: 0.5rem;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #4f46e5;
  }
`

const InputGroup = styled.div`
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const InputLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
`

const TextInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #111827;
  background-color: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &:disabled {
    background-color: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }
`

const RangeInput = styled.input`
  width: 100%;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const RadiusLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
`

const GoalRangeWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

const GoalInput = styled(TextInput)`
  flex: 1;
`

const RangeHelper = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
`

const ScopeOptionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const ScopeIcon = styled.div`
  display: flex;
  align-items: center;
  color: inherit;
`

const ResetButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #d1d5db;
  background-color: white;
  color: #374151;
  font-weight: 500;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f9fafb;
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`

const MobileOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 40;
  transform: ${(props) => (props.$isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s ease;
`

const MobileBackdrop = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
`

const MobileSidebar = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 20rem;
  background-color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  overflow-y: auto;
`

export function FiltersSidebar({
  filters,
  needTypes,
  onFiltersChange,
  onReset,
  isOpen = true,
  onClose,
  mobile = false,
}: FiltersSidebarProps) {
  const [expandedNeedMore, setExpandedNeedMore] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    needType: true,
    scope: false,
    location: true,
    goal: true,
    status: true,
    sort: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleNeedTypeToggle = (needTypeId: string) => {
    const updatedTypes = filters.needTypes.includes(needTypeId)
      ? filters.needTypes.filter((t) => t !== needTypeId)
      : [...filters.needTypes, needTypeId]

    onFiltersChange({ ...filters, needTypes: updatedTypes, page: 1 })
  }

  const handleLocationChange = (location: string) => {
    onFiltersChange({
      ...filters,
      location: location || undefined,
      page: 1,
    })
  }

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      locationRadius: parseInt(e.target.value) || undefined,
      page: 1,
    })
  }

  const handleGeographicScopeChange = (scope: string) => {
    onFiltersChange({
      ...filters,
      geographicScope:
        scope === 'all'
          ? ('all' as const)
          : (scope as 'local' | 'regional' | 'national' | 'global'),
      page: 1,
    })
  }

  const handleGoalRange = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      minGoal: min || undefined,
      maxGoal: max || undefined,
      page: 1,
    })
  }

  const handleStatusChange = (
    status: 'all' | 'active' | 'completed' | 'paused'
  ) => {
    onFiltersChange({ ...filters, status, page: 1 })
  }

  const handleSortChange = (
    sortBy: 'trending' | 'newest' | 'goalAsc' | 'goalDesc' | 'raised'
  ) => {
    onFiltersChange({ ...filters, sortBy, page: 1 })
  }

  // ✅ All filters removed - displaying empty container
  const content = (
    <Container>
      {/* Empty sidebar - no filters */}
    </Container>
  )

  if (mobile) {
    return (
      <MobileOverlay $isOpen={isOpen}>
        {/* Backdrop */}
        <MobileBackdrop onClick={onClose} />

        {/* Sidebar */}
        <MobileSidebar>
          {content}
        </MobileSidebar>
      </MobileOverlay>
    )
  }

  return <div>{content}</div>
}
