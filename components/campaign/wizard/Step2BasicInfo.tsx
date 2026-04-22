'use client'

import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Upload, X, MapPin, Map, Globe, Zap } from 'lucide-react'
import { CAMPAIGN_CATEGORIES, GEOGRAPHIC_SCOPES } from '@/utils/validationSchemas'

const FormGrid = styled.div`
  display: grid;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const DropZone = styled.div<{ isDragActive: boolean }>`
  border: 2px dashed ${(props) => (props.isDragActive ? '#6366F1' : '#CBD5E1')};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  background-color: ${(props) => (props.isDragActive ? '#EEF2FF' : '#F8FAFC')};
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  &:hover {
    border-color: #6366F1;
    background-color: #EEF2FF;
  }

  &:focus-within {
    outline: 2px solid #6366F1;
    outline-offset: 2px;
  }

  input {
    display: none;
  }
`

const ImagePreviewContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #F1F5F9;
`

const ImagePreview = styled.img`
  width: 100%;
  height: auto;
  display: block;
  max-height: 300px;
  object-fit: cover;
`

const RemoveImageButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 4px;
  color: white;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }

  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }
`

const CharCount = styled.span<{ isWarning: boolean }>`
  font-size: 0.75rem;
  color: ${(props) => (props.isWarning ? '#F59E0B' : '#64748B')};
`

const ScopeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const ScopeButton = styled.button<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid ${(props) => (props.isSelected ? '#6366F1' : '#E2E8F0')};
  border-radius: 8px;
  background-color: ${(props) => (props.isSelected ? '#F0F4FF' : '#F8FAFC')};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: ${(props) => (props.isSelected ? '600' : '500')};
  color: ${(props) => (props.isSelected ? '#4F46E5' : '#0F172A')};

  &:hover {
    border-color: #6366F1;
    background-color: #F0F4FF;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`

const ScopeDescription = styled.p`
  font-size: 0.75rem;
  color: #64748B;
  text-align: center;
  margin: 0;
`

interface Step2BasicInfoProps {
  formData: {
    title: string
    description: string
    category: string
    location: string
    geographicScope: string | null
    scopeDescription: string
    imagePreview: string | null
  }
  errors: Record<string, string>
  onChange: (field: string, value: any) => void
  onImageSelect: (file: File | null, preview: string | null) => void
}

export const Step2BasicInfo: React.FC<Step2BasicInfoProps> = ({
  formData,
  errors,
  onChange,
  onImageSelect,
}) => {
  const [isDragActive, setIsDragActive] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      processImageFile(files[0])
    }
  }, [])

  const processImageFile = (file: File) => {
    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      console.error('File too large')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      console.error('Invalid file type')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      onImageSelect(file, e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }

  const handleRemoveImage = () => {
    onImageSelect(null, null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const titleLength = formData.title.length
  const descriptionLength = formData.description.length

  return (
    <FormGrid>
      {/* Campaign Title */}
      <div>
        <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', color: '#111827' }} htmlFor="campaign-title">
          Campaign Title <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input
            id="campaign-title"
            type="text"
            value={formData.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Give your campaign a compelling title..."
            maxLength={200}
            style={{
              padding: '0.75rem',
              border: `2px solid ${errors.title ? '#EF4444' : '#E2E8F0'}`,
              borderRadius: '6px',
              fontFamily: 'inherit',
            }}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? `title-error` : undefined}
          />
          <CharCount isWarning={titleLength > 150}>
            {titleLength}/200 characters
          </CharCount>
          {errors.title && <div id="title-error" style={{ fontSize: '0.875rem', color: '#EF4444' }}>{errors.title}</div>}
        </div>
      </div>

      {/* Campaign Description */}
      <div>
        <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', color: '#111827' }} htmlFor="campaign-description">
          Campaign Description <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <textarea
            id="campaign-description"
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Tell your story. What is your campaign about? Why do you need support?..."
            maxLength={2000}
            rows={6}
            style={{
              padding: '0.75rem',
              border: `2px solid ${errors.description ? '#EF4444' : '#E2E8F0'}`,
              borderRadius: '6px',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? `description-error` : undefined}
          />
          <CharCount isWarning={descriptionLength > 1800}>
            {descriptionLength}/2000 characters
          </CharCount>
          {errors.description && <div id="description-error" style={{ fontSize: '0.875rem', color: '#EF4444' }}>{errors.description}</div>}
        </div>
      </div>

      <FormRow>
        {/* Category */}
        <div>
          <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', color: '#111827' }} htmlFor="campaign-category">
            Category <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <select
            id="campaign-category"
            value={formData.category}
            onChange={(e) => onChange('category', e.target.value)}
            style={{
              padding: '0.75rem',
              border: `2px solid ${errors.category ? '#EF4444' : '#E2E8F0'}`,
              borderRadius: '6px',
              fontFamily: 'inherit',
              width: '100%',
            }}
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? `category-error` : undefined}
          >
            <option value="">Select a category...</option>
            {CAMPAIGN_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <div id="category-error" style={{ fontSize: '0.875rem', color: '#EF4444', marginTop: '0.25rem' }}>{errors.category}</div>}
        </div>

        {/* Location */}
        <div>
          <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', color: '#111827' }} htmlFor="campaign-location">
            Location (Optional)
          </label>
          <input
            id="campaign-location"
            type="text"
            value={formData.location}
            onChange={(e) => onChange('location', e.target.value)}
            placeholder="City, State or Zip code"
            style={{
              padding: '0.75rem',
              border: `2px solid ${errors.location ? '#EF4444' : '#E2E8F0'}`,
              borderRadius: '6px',
              fontFamily: 'inherit',
              width: '100%',
            }}
            aria-invalid={!!errors.location}
            aria-describedby={errors.location ? `location-error` : undefined}
          />
          {errors.location && <div id="location-error" style={{ fontSize: '0.875rem', color: '#EF4444', marginTop: '0.25rem' }}>{errors.location}</div>}
        </div>
      </FormRow>

      {/* Geographic Scope */}
      <div>
        <label style={{ fontWeight: '600', marginBottom: '0.75rem', display: 'block', color: '#111827' }}>
          Geographic Scope (Optional)
        </label>
        <ScopeGrid>
          {GEOGRAPHIC_SCOPES.map((scope) => (
            <ScopeButton
              key={scope.id}
              isSelected={formData.geographicScope === scope.id}
              onClick={() => onChange('geographicScope', scope.id)}
              type="button"
              title={scope.description}
            >
              {scope.id === 'local' && <MapPin size={20} />}
              {scope.id === 'regional' && <Map size={20} />}
              {scope.id === 'national' && <Globe size={20} />}
              {scope.id === 'global' && <Zap size={20} />}
              <span>{scope.label}</span>
              <ScopeDescription>{scope.description}</ScopeDescription>
            </ScopeButton>
          ))}
        </ScopeGrid>
        {errors.geographicScope && <div style={{ fontSize: '0.875rem', color: '#EF4444', marginTop: '0.5rem' }}>{errors.geographicScope}</div>}
      </div>

      {/* Scope Details */}
      <div>
        <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', color: '#111827' }} htmlFor="scope-description">
          Scope Details (Optional)
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <textarea
            id="scope-description"
            value={formData.scopeDescription}
            onChange={(e) => onChange('scopeDescription', e.target.value)}
            placeholder="E.g., 'Serving downtown Brooklyn and surrounding neighborhoods' or 'Available nationwide, starting with East Coast'"
            maxLength={200}
            rows={3}
            disabled={!formData.geographicScope}
            style={{
              padding: '0.75rem',
              border: `2px solid ${errors.scopeDescription ? '#EF4444' : '#E2E8F0'}`,
              borderRadius: '6px',
              fontFamily: 'inherit',
              resize: 'vertical',
              opacity: formData.geographicScope ? 1 : 0.6,
            }}
            aria-invalid={!!errors.scopeDescription}
            aria-describedby={errors.scopeDescription ? `scopeDescription-error` : undefined}
          />
          <CharCount isWarning={formData.scopeDescription.length > 180}>
            {formData.scopeDescription.length}/200 characters
          </CharCount>
          {errors.scopeDescription && <div id="scopeDescription-error" style={{ fontSize: '0.875rem', color: '#EF4444' }}>{errors.scopeDescription}</div>}
        </div>
      </div>

      <ImageUploadContainer>
        <label style={{ fontWeight: '600', color: '#0F172A' }}>
          Campaign Image (Optional)
        </label>
        {!formData.imagePreview ? (
          <DropZone
            isDragActive={isDragActive}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="region"
            aria-label="Image upload area"
          >
            <Upload size={24} color="#64748B" />
            <div>
              <p style={{ margin: '0 0 0.5rem', fontWeight: '500', color: '#0F172A' }}>
                Drag and drop your image here
              </p>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B' }}>
                or click to select (Max 10MB, JPEG/PNG/WebP)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              aria-label="Upload campaign image"
            />
          </DropZone>
        ) : (
          <ImagePreviewContainer>
            <ImagePreview src={formData.imagePreview} alt="Campaign preview" />
            <RemoveImageButton
              onClick={handleRemoveImage}
              aria-label="Remove image"
              type="button"
            >
              <X size={16} />
            </RemoveImageButton>
          </ImagePreviewContainer>
        )}
      </ImageUploadContainer>
    </FormGrid>
  )
}
