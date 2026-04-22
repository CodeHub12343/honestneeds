'use client'

import styled from 'styled-components'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Eye, EyeOff, Loader, AlertCircle, CheckCircle2, Lock } from 'lucide-react'
import Button from '@/components/ui/Button'
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter'
import { registerSchema, type RegisterFormData } from '@/utils/validationSchemas'
import { useRegister, useCheckEmailExists } from '@/api/hooks/useAuth'

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;

  @media (min-width: 640px) {
    padding: 2rem;
  }
`

const BackgroundAccent = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  display: none;
`

const BackgroundBlob = styled.div<{ $variant: number }>`
  position: absolute;
  border-radius: 9999px;
  filter: blur(3rem);
  opacity: ${props => (props.$variant === 1 ? 0.15 : 0.1)};
  animation: float${props => props.$variant} 20s infinite ease-in-out;
  display: none;

  ${props => {
    if (props.$variant === 1) {
      return `
        top: -10%;
        right: -5%;
        width: 400px;
        height: 400px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      `
    }
    return `
      bottom: -10%;
      left: -5%;
      width: 350px;
      height: 350px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    `
  }}

  @keyframes float1 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(30px, -30px); }
  }

  @keyframes float2 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-20px, 20px); }
  }

  @media (max-width: 640px) {
    ${props => {
      if (props.$variant === 1) {
        return `width: 250px; height: 250px;`
      }
      return `width: 200px; height: 200px;`
    }}
  }
`

const MainContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 480px;
  z-index: 1;
`

const HeaderSection = styled.div`
  margin-bottom: 2.5rem;
  text-align: center;
  animation: slideDown 0.6s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (min-width: 640px) {
    margin-bottom: 3rem;
  }
`

const LogoWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.3);
  margin-bottom: 1.5rem;

  svg {
    width: 28px;
    height: 28px;
    color: white;
  }
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;

  @media (min-width: 640px) {
    font-size: 2.25rem;
  }
`

const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  font-weight: 500;
  line-height: 1.5;
`

const FormCard = styled.div`
  animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const FormSection = styled.div<{ $step: number }>`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  animation: fadeIn 0.6s ease-out ${props => 0.1 * props.$step}s both;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  &:not(:last-child) {
    padding-bottom: 1.75rem;
    border-bottom: 1px solid #e5e7eb;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  letter-spacing: 0.3px;
`

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`

const InputField = styled.input<{ $hasError: boolean; $isSuccessful?: boolean }>`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #f9fafb;
  min-height: 48px;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    background-color: #ffffff;
  }

  ${props => {
    if (props.$hasError) {
      return `
        border-color: #ef4444;
        background-color: rgba(254, 242, 242, 0.5);

        &:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
          background-color: #ffffff;
        }
      `
    }
    if (props.$isSuccessful) {
      return `
        border-color: #10b981;
        background-color: rgba(240, 253, 250, 0.5);

        &:focus {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
          background-color: #ffffff;
        }
      `
    }
    return `
      border-color: #e5e7eb;

      &:hover {
        border-color: #d1d5db;
        background-color: #f3f4f6;
      }

      &:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        background-color: #ffffff;
      }
    `
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f3f4f6;
  }
`

const PasswordInputField = styled(InputField)`
  padding-right: 3rem;
`

const VisibilityToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms;

  &:hover {
    color: #111827;
  }

  &:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
    border-radius: 4px;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

const HelpText = styled.p<{ $type: 'error' | 'success' | 'info' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.813rem;
  font-weight: 500;
  margin-top: 0.25rem;

  ${props => {
    switch (props.$type) {
      case 'error':
        return `color: #dc2626;`
      case 'success':
        return `color: #059669;`
      case 'info':
        return `color: #6b7280;`
    }
  }}

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.75rem;
  margin: -0.75rem;
  border-radius: 0.5rem;
  transition: background-color 150ms;

  &:hover {
    background-color: #f3f4f6;
  }

  input[type='checkbox'] {
    width: 20px;
    height: 20px;
    min-width: 20px;
    margin-top: 0.125rem;
    cursor: pointer;
    accent-color: #667eea;
    border-radius: 4px;

    &:focus {
      outline: 2px solid #667eea;
      outline-offset: 2px;
    }
  }
`

const TermsText = styled.span`
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;

  a {
    color: #667eea;
    font-weight: 600;
    text-decoration: none;
    transition: color 200ms;

    &:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    &:focus {
      outline: 2px solid #667eea;
      outline-offset: 2px;
      border-radius: 2px;
    }
  }
`

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: 1.5rem;
  font-weight: 600;
  transition: all 200ms;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(102, 126, 234, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const Divider = styled.div`
  position: relative;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #e5e7eb;
  }

  span {
    color: #9ca3af;
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
`

const FooterSection = styled.div`
  margin-top: 1.75rem;
  text-align: center;

  p {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.5;
  }

  a {
    color: #667eea;
    font-weight: 600;
    text-decoration: none;
    transition: color 200ms;

    &:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    &:focus {
      outline: 2px solid #667eea;
      outline-offset: 2px;
      border-radius: 2px;
    }
  }
`

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1));
  border-radius: 0.75rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
  margin-top: 1.5rem;
  font-size: 0.8125rem;
  color: #047857;
  font-weight: 500;

  svg {
    width: 16px;
    height: 16px;
  }
`

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [emailError, setEmailError] = useState<string>('')
  const [emailSuccessful, setEmailSuccessful] = useState(false)

  const { mutate: register, isPending } = useRegister()
  const { mutate: checkEmail, isPending: isCheckingEmail } = useCheckEmailExists()

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  })

  const email = watch('email')
  const displayName = watch('displayName')
  const password = watch('password')
  const confirmPassword = watch('confirmPassword')
  const acceptTerms = watch('acceptTerms')

  const handleEmailBlur = async () => {
    if (!email) {
      setEmailError('')
      setEmailSuccessful(false)
      return
    }

    const result = await trigger('email')
    if (!result) {
      setEmailError('')
      setEmailSuccessful(false)
      return
    }

    checkEmail(
      { email },
      {
        onSuccess: (exists) => {
          if (exists) {
            setEmailError('This email is already registered. Please sign in instead.')
            setEmailSuccessful(false)
          } else {
            setEmailError('')
            setEmailSuccessful(true)
          }
        },
      }
    )
  }

  const onSubmit = (data: RegisterFormData) => {
    if (emailError) return

    register({
      email: data.email,
      displayName: data.displayName,
      password: data.password,
    })
  }

  const isFormValid =
    email &&
    displayName &&
    password &&
    confirmPassword &&
    acceptTerms &&
    !emailError &&
    !errors.email &&
    !errors.displayName &&
    !errors.password &&
    !errors.confirmPassword &&
    !errors.acceptTerms

  return (
    <Container suppressHydrationWarning>
      <BackgroundAccent>
        <BackgroundBlob $variant={1} />
        <BackgroundBlob $variant={2} />
      </BackgroundAccent>

      <MainContainer>
        <HeaderSection>
          <LogoWrapper>
            <Lock />
          </LogoWrapper>
          <Title>Create Account</Title>
          <Subtitle>Join HonestNeed and start making a difference</Subtitle>
        </HeaderSection>

        <FormCard>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Identity Section */}
            <FormSection $step={0}>
              {/* Email Field */}
              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <InputWrapper>
                  <InputField
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    disabled={isPending}
                    $hasError={!!(errors.email || emailError)}
                    $isSuccessful={emailSuccessful && !errors.email && !emailError}
                    {...registerField('email', { onBlur: handleEmailBlur })}
                    aria-invalid={errors.email || emailError ? 'true' : 'false'}
                    aria-describedby={errors.email || emailError ? 'email-error' : undefined}
                  />
                </InputWrapper>
                {errors.email && (
                  <HelpText id="email-error" $type="error">
                    <AlertCircle />
                    {errors.email.message}
                  </HelpText>
                )}
                {emailError && !errors.email && (
                  <HelpText id="email-error" $type="error">
                    <AlertCircle />
                    {emailError}
                  </HelpText>
                )}
                {isCheckingEmail && !errors.email && !emailError && (
                  <HelpText $type="info">
                    <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Checking availability...
                  </HelpText>
                )}
                {emailSuccessful && !errors.email && !emailError && (
                  <HelpText $type="success">
                    <CheckCircle2 />
                    Email available
                  </HelpText>
                )}
              </FormGroup>

              {/* Display Name Field */}
              <FormGroup>
                <Label htmlFor="displayName">Display Name</Label>
                <InputWrapper>
                  <InputField
                    id="displayName"
                    type="text"
                    placeholder="Your name"
                    disabled={isPending}
                    $hasError={!!errors.displayName}
                    {...registerField('displayName')}
                    aria-invalid={errors.displayName ? 'true' : 'false'}
                    aria-describedby={errors.displayName ? 'displayName-error' : undefined}
                  />
                </InputWrapper>
                {errors.displayName && (
                  <HelpText id="displayName-error" $type="error">
                    <AlertCircle />
                    {errors.displayName.message}
                  </HelpText>
                )}
              </FormGroup>
            </FormSection>

            {/* Security Section */}
            <FormSection $step={1}>
              {/* Password Field */}
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <InputWrapper>
                  <PasswordInputField
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    disabled={isPending}
                    $hasError={!!errors.password}
                    {...registerField('password')}
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <VisibilityToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    disabled={isPending}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </VisibilityToggle>
                </InputWrapper>
                {errors.password && (
                  <HelpText id="password-error" $type="error">
                    <AlertCircle />
                    {errors.password.message}
                  </HelpText>
                )}
                {password && <PasswordStrengthMeter password={password} />}
              </FormGroup>

              {/* Confirm Password Field */}
              <FormGroup>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <InputWrapper>
                  <PasswordInputField
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    disabled={isPending}
                    $hasError={!!errors.confirmPassword}
                    {...registerField('confirmPassword')}
                    aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                    aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                  />
                  <VisibilityToggle
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    disabled={isPending}
                  >
                    {showConfirm ? <EyeOff /> : <Eye />}
                  </VisibilityToggle>
                </InputWrapper>
                {errors.confirmPassword && (
                  <HelpText id="confirmPassword-error" $type="error">
                    <AlertCircle />
                    {errors.confirmPassword.message}
                  </HelpText>
                )}
              </FormGroup>
            </FormSection>

            {/* Terms Section */}
            <FormSection $step={2}>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  {...registerField('acceptTerms')}
                  disabled={isPending}
                  aria-invalid={errors.acceptTerms ? 'true' : 'false'}
                  aria-describedby={errors.acceptTerms ? 'terms-error' : undefined}
                />
                <TermsText>
                  I agree to the{' '}
                  <Link href="/terms">Terms of Service</Link> and{' '}
                  <Link href="/privacy">Privacy Policy</Link>
                </TermsText>
              </CheckboxLabel>
              {errors.acceptTerms && (
                <HelpText id="terms-error" $type="error">
                  <AlertCircle />
                  {errors.acceptTerms.message}
                </HelpText>
              )}
            </FormSection>

            {/* Submit Button */}
            <SubmitButton
              type="submit"
              variant="primary"
              size="md"
              disabled={isPending || !isFormValid}
            >
              {isPending ? (
                <ButtonContent>
                  <Loader size={18} />
                  <span>Creating account...</span>
                </ButtonContent>
              ) : (
                'Create Account'
              )}
            </SubmitButton>

            {/* Security Badge */}
            <SecurityBadge>
              <Lock />
              Your data is encrypted and secure
            </SecurityBadge>
          </form>
        </FormCard>

        {/* Sign In Link */}
        <FooterSection>
          <p>
            Already have an account?{' '}
            <Link href="/login">Sign in here</Link>
          </p>
        </FooterSection>

        {/* Help Link */}
        <FooterSection style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
          <p>
            Questions?{' '}
            <Link href="/contact">Contact our support team</Link>
          </p>
        </FooterSection>
      </MainContainer>
    </Container>
  )
}