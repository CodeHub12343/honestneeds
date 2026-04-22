'use client'

import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Trash2, Plus, AlertCircle } from 'lucide-react'
import { PAYMENT_METHOD_TYPES, CRYPTO_TYPES } from '@/utils/validationSchemas'

interface PaymentMethod {
  type: string
  username?: string
  email?: string
  cashtag?: string
  routingNumber?: string
  accountNumber?: string
  cryptoType?: string
  walletAddress?: string
  details?: string
}

interface PaymentMethodsManagerProps {
  methods: PaymentMethod[]
  onChange: (methods: PaymentMethod[]) => void
  maxMethods?: number
  error?: string
  helperText?: string
  title?: string
}

const Container = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;

  @media (max-width: 640px) {
    padding: 1rem;
  }
`

const Title = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
`

const HelperText = styled.p`
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
`

const ErrorBox = styled.div`
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: #dc2626;
  font-size: 0.875rem;

  svg {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
`

const MethodsList = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const MethodCard = styled.div`
  background-color: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
`

const MethodHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #0f172a;
  }
`

const RemoveButton = styled.button`
  background-color: #fee2e2;
  border: none;
  border-radius: 6px;
  color: #dc2626;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background-color: #fecaca;
  }

  &:focus-visible {
    outline: 2px solid #dc2626;
    outline-offset: 2px;
  }
`

const FormFieldGroup = styled.div`
  display: grid;
  gap: 0.75rem;
`

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #475569;
  }

  input,
  select,
  textarea {
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    font-family: inherit;
    font-size: 0.995rem;
    transition: border-color 0.2s ease;

    &:hover {
      border-color: #cbd5e1;
    }

    &:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    &::placeholder {
      color: #cbd5e1;
    }
  }

  textarea {
    resize: vertical;
    min-height: 80px;
    font-family: 'Courier New', monospace;
  }
`

const AddButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`

const AddButton = styled.button`
  background-color: #ede9fe;
  border: 2px dashed #a78bfa;
  border-radius: 8px;
  color: #6366f1;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #ddd6fe;
    border-color: #c4b5fd;
  }

  &:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const CountBadge = styled.span`
  font-size: 0.75rem;
  background-color: #6366f1;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
`

/**
 * PaymentMethodsManager
 * Production-ready component for managing creator payment methods
 * Supports: Venmo, PayPal, Cash App, Bank Transfer, Crypto, Other
 */
export const PaymentMethodsManager: React.FC<PaymentMethodsManagerProps> = ({
  methods = [],
  onChange,
  maxMethods = 6,
  error,
  helperText,
  title = 'Payment Methods',
}) => {
  const canAddMore = methods.length < maxMethods

  const handleAddMethod = useCallback(() => {
    if (canAddMore) {
      onChange([
        ...methods,
        {
          type: 'venmo',
          username: '',
        },
      ])
    }
  }, [methods, onChange, canAddMore])

  const handleRemoveMethod = useCallback(
    (index: number) => {
      onChange(methods.filter((_, i) => i !== index))
    },
    [methods, onChange]
  )

  const handleUpdateMethod = useCallback(
    (index: number, updates: Partial<PaymentMethod>) => {
      const updated = [...methods]
      updated[index] = { ...updated[index], ...updates }
      onChange(updated)
    },
    [methods, onChange]
  )

  const handleTypeChange = useCallback(
    (index: number, newType: string) => {
      const updated = [...methods]
      // Reset fields when changing type
      updated[index] = { type: newType }
      onChange(updated)
    },
    [methods, onChange]
  )

  return (
    <Container>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <Title>{title}</Title>
        {methods.length > 0 && <CountBadge>{methods.length} / {maxMethods}</CountBadge>}
      </div>

      {helperText && <HelperText>{helperText}</HelperText>}

      {error && (
        <ErrorBox>
          <AlertCircle size={18} />
          <span>{error}</span>
        </ErrorBox>
      )}

      {methods.length > 0 && (
        <MethodsList>
          {methods.map((method, index) => (
            <MethodCard key={index}>
              <MethodHeader>
                <select
                  value={method.type}
                  onChange={(e) => handleTypeChange(index, e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '6px',
                    fontWeight: 600,
                    minWidth: '150px',
                  }}
                >
                  {PAYMENT_METHOD_TYPES.map((mt) => (
                    <option key={mt.id} value={mt.id}>
                      {mt.name}
                    </option>
                  ))}
                </select>

                <RemoveButton
                  onClick={() => handleRemoveMethod(index)}
                  type="button"
                  title="Remove this payment method"
                >
                  <Trash2 size={16} />
                  Remove
                </RemoveButton>
              </MethodHeader>

              <PaymentMethodFields
                method={method}
                index={index}
                onUpdate={handleUpdateMethod}
              />
            </MethodCard>
          ))}
        </MethodsList>
      )}

      {canAddMore && (
        <AddButtonContainer>
          <AddButton
            onClick={handleAddMethod}
            type="button"
            title={`Add payment method (${methods.length} / ${maxMethods})`}
          >
            <Plus size={18} />
            Add Payment Method
          </AddButton>
        </AddButtonContainer>
      )}

      {!canAddMore && (
        <div style={{
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#64748b',
          padding: '1rem',
          backgroundColor: '#f0fdf4',
          borderRadius: '6px',
          border: '1px solid #dbeafe',
        }}>
          ✓ Maximum payment methods ({maxMethods}) reached
        </div>
      )}
    </Container>
  )
}

interface PaymentMethodFieldsProps {
  method: PaymentMethod
  index: number
  onUpdate: (index: number, updates: Partial<PaymentMethod>) => void
}

const PaymentMethodFields: React.FC<PaymentMethodFieldsProps> = ({
  method,
  index,
  onUpdate,
}) => {
  switch (method.type) {
    case 'venmo':
      return (
        <FormFieldGroup>
          <FormField>
            <label htmlFor={`venmo-username-${index}`}>Venmo Username</label>
            <input
              id={`venmo-username-${index}`}
              type="text"
              value={method.username || ''}
              onChange={(e) => onUpdate(index, { username: e.target.value })}
              placeholder="@username"
              pattern="^@?[a-zA-Z0-9_-]+$"
              title="Enter your Venmo username (e.g., @john_doe)"
            />
          </FormField>
        </FormFieldGroup>
      )

    case 'paypal':
      return (
        <FormFieldGroup>
          <FormField>
            <label htmlFor={`paypal-email-${index}`}>PayPal Email</label>
            <input
              id={`paypal-email-${index}`}
              type="email"
              value={method.email || ''}
              onChange={(e) => onUpdate(index, { email: e.target.value })}
              placeholder="your@email.com"
              title="Enter the email address associated with your PayPal account"
            />
          </FormField>
        </FormFieldGroup>
      )

    case 'cashapp':
      return (
        <FormFieldGroup>
          <FormField>
            <label htmlFor={`cashapp-cashtag-${index}`}>Cash App Username</label>
            <input
              id={`cashapp-cashtag-${index}`}
              type="text"
              value={method.cashtag || ''}
              onChange={(e) => onUpdate(index, { cashtag: e.target.value })}
              placeholder="$username"
              pattern="^\\$?[a-zA-Z0-9]+$"
              title="Enter your Cash App username (e.g., $myname)"
            />
          </FormField>
        </FormFieldGroup>
      )

    case 'bank':
      return (
        <FormFieldGroup>
          <FormField>
            <label htmlFor={`bank-routing-${index}`}>Routing Number</label>
            <input
              id={`bank-routing-${index}`}
              type="text"
              value={method.routingNumber || ''}
              onChange={(e) => onUpdate(index, { routingNumber: e.target.value })}
              placeholder="000000000"
              maxLength={9}
              pattern="^[0-9]{9}$"
              title="Enter your 9-digit bank routing number"
            />
          </FormField>

          <FormField>
            <label htmlFor={`bank-account-${index}`}>Account Number</label>
            <input
              id={`bank-account-${index}`}
              type="text"
              value={method.accountNumber || ''}
              onChange={(e) => onUpdate(index, { accountNumber: e.target.value })}
              placeholder="Your account number"
              title="Enter your bank account number"
            />
          </FormField>
        </FormFieldGroup>
      )

    case 'crypto':
      return (
        <FormFieldGroup>
          <FormField>
            <label htmlFor={`crypto-type-${index}`}>Cryptocurrency</label>
            <select
              id={`crypto-type-${index}`}
              value={method.cryptoType || ''}
              onChange={(e) => onUpdate(index, { cryptoType: e.target.value })}
            >
              <option value="">Select cryptocurrency...</option>
              {CRYPTO_TYPES.map((ct) => (
                <option key={ct.id} value={ct.id}>
                  {ct.name} ({ct.symbol})
                </option>
              ))}
            </select>
          </FormField>

          <FormField>
            <label htmlFor={`crypto-address-${index}`}>Wallet Address</label>
            <input
              id={`crypto-address-${index}`}
              type="text"
              value={method.walletAddress || ''}
              onChange={(e) => onUpdate(index, { walletAddress: e.target.value })}
              placeholder="Your wallet address"
              title="Enter your cryptocurrency wallet address"
            />
          </FormField>
        </FormFieldGroup>
      )

    case 'other':
      return (
        <FormFieldGroup>
          <FormField>
            <label htmlFor={`other-details-${index}`}>Payment Details</label>
            <textarea
              id={`other-details-${index}`}
              value={method.details || ''}
              onChange={(e) => onUpdate(index, { details: e.target.value })}
              placeholder="Describe how supporters should send you payment..."
              title="Provide clear instructions for this payment method"
            />
          </FormField>
        </FormFieldGroup>
      )

    default:
      return null
  }
}
