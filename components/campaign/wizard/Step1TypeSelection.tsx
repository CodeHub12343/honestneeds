'use client'

import React from 'react'
import styled from 'styled-components'
import { CategoryBrowser } from './CategoryBrowser'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const HeaderSection = styled.div`
  margin-bottom: 1rem;
`

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 0.5rem 0;
`

const Subtitle = styled.p`
  color: #64748B;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
`

const HelperText = styled.p`
  color: #94A3B8;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-style: italic;
`

interface Step1TypeSelectionProps {
  selectedCategory: string | null
  onCategorySelect: (categoryId: string, categoryName: string) => void
  onCategoryClear?: () => void
}

export const Step1TypeSelection: React.FC<Step1TypeSelectionProps> = ({
  selectedCategory,
  onCategorySelect,
  onCategoryClear,
}) => {
  return (
    <Container role="region" aria-label="Category selection">
      <HeaderSection>
        <Title>What do you need help with?</Title>
        <Subtitle>Select a category that best describes your campaign or initiative.</Subtitle>
        <HelperText>
          Choose from 100+ categories organized by area. You can search to find exactly what you need.
        </HelperText>
      </HeaderSection>

      <CategoryBrowser
        selectedCategory={selectedCategory}
        onSelectCategory={onCategorySelect}
        onClear={onCategoryClear}
      />
    </Container>
  )
}
