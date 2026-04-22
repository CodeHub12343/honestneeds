'use client'

import styled from 'styled-components'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Eye, EyeOff, Loader, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { loginSchema, type LoginFormData } from '@/utils/validationSchemas'
import { useLogin } from '@/api/hooks/useAuth'

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 2rem 1rem;
  position: relative;

  @media (min-width: 640px) {
    padding: 2rem 1.5rem;
  }
`

const BackgroundAccent = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
`

const BackgroundBlob1 = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 24rem;
  height: 24rem;
  background-color: rgba(59, 130, 246, 0.05);
  border-radius: 9999px;
  filter: blur(3rem);
  opacity: 0.4;
  transform: translateY(-50%) translateX(50%);
`

const BackgroundBlob2 = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 20rem;
  height: 20rem;
  background-color: #dbeafe;
  border-radius: 9999px;
  filter: blur(3rem);
  opacity: 0.2;
  transform: translateY(50%) translateX(-25%);
`

const MainContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 28rem;
  z-index: 1;
`

const HeaderSection = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  animation: fadeIn 0.5s ease-out;

  @media (min-width: 640px) {
    margin-bottom: 2.5rem;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const LogoWrapper = styled.div`
  margin-bottom: 1rem;
  display: inline-block;
  padding: 0.625rem;
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: 0.5rem;
`

const LogoCircle = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: linear-gradient(to bottom right, #3b82f6, rgba(59, 130, 246, 0.7));
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    color: white;
    font-weight: bold;
    font-size: 0.875rem;
  }
`

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;

  @media (min-width: 640px) {
    font-size: 2.25rem;
  }
`

const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  font-weight: 500;
`

const CardContainer = styled.div`
  animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (min-width: 640px) {
    gap: 1.5rem;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ForgotLink = styled(Link)`
  font-size: 0.75rem;
  font-weight: 600;
  color: #3b82f6;
  transition: color 200ms;

  &:hover {
    color: #1e40af;
  }
`

const InputWrapper = styled.div`
  position: relative;
`

const InputField = styled.input<{ $hasError: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid;
  border-radius: 0.5rem;
  transition: all 200ms;
  color: #111827;
  font-weight: 500;
  font-size: 1rem;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
  }

  ${props =>
    props.$hasError
      ? `
        border-color: #fca5a5;
        background-color: rgba(254, 202, 202, 0.3);

        &:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1);
        }
      `
      : `
        border-color: #e5e7eb;
        background-color: rgba(249, 250, 251, 0.4);

        &:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        &:hover {
          border-color: #d1d5db;
        }
      `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const PasswordInput = styled(InputField)`
  padding-right: 3rem;
`

const TogglePasswordButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 200ms;

  &:hover {
    color: #374151;
  }

  &:disabled {
    opacity: 0.4;
  }
`

const ErrorMessage = styled.p`
  font-size: 0.875rem;
  color: #dc2626;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`

const Divider = styled.div`
  position: relative;
  margin: 1.75rem 0;
`

const DividerLine = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;

  div {
    width: 100%;
    border-top: 1px solid #e5e7eb;
  }
`

const DividerText = styled.div`
  position: relative;
  display: flex;
  justify-content: center;

  span {
    padding: 0 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    background-color: white;
  }
`

const SocialNotice = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.75rem;
`

const FooterSection = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  animation: fadeIn 0.5s ease-out 0.1s both;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const FooterText = styled.p`
  font-size: 1rem;
  color: #4b5563;
`

const SignupLink = styled(Link)`
  font-weight: 600;
  color: #3b82f6;
  transition: color 200ms;

  &:hover {
    color: #1e40af;
  }
`

const SupportLink = styled(Link)`
  display: block;
  margin-top: 1.25rem;
  font-size: 0.75rem;
  color: #6b7280;
  transition: color 200ms;
  text-align: center;

  &:hover {
    color: #374151;
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: login, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  const email = watch('email')
  const password = watch('password')
  const hasErrors = Object.keys(errors).length > 0

  const onSubmit = (data: LoginFormData) => {
    login({
      email: data.email,
      password: data.password,
      staySignedIn: false,
    })
  }

  return (
    <Container>
      <BackgroundAccent>
        <BackgroundBlob1 />
        <BackgroundBlob2 />
      </BackgroundAccent>

      <MainContainer>
        <HeaderSection>
          <LogoWrapper>
            <LogoCircle>
              <span>H</span>
            </LogoCircle>
          </LogoWrapper>
          <Title>Welcome Back</Title>
          <Subtitle>Sign in to continue to HonestNeed</Subtitle>
        </HeaderSection>

        <CardContainer>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <InputWrapper>
                <InputField
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  disabled={isPending}
                  $hasError={!!errors.email}
                  {...register('email')}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </InputWrapper>
              {errors.email && (
                <ErrorMessage id="email-error">
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  {errors.email.message}
                </ErrorMessage>
              )}
            </FormGroup>

            {/* Password Field */}
            <FormGroup>
              <LabelRow>
                <Label htmlFor="password">Password</Label>
                <ForgotLink href="/forgot-password">Forgot?</ForgotLink>
              </LabelRow>
              <InputWrapper>
                <PasswordInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  disabled={isPending}
                  $hasError={!!errors.password}
                  {...register('password')}
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <TogglePasswordButton
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isPending}
                  tabIndex={0}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </TogglePasswordButton>
              </InputWrapper>
              {errors.password && (
                <ErrorMessage id="password-error">
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  {errors.password.message}
                </ErrorMessage>
              )}
            </FormGroup>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isPending || !email || !password || hasErrors}
              style={{ marginTop: '2rem', width: '100%' }}
            >
              {isPending ? (
                <ButtonWrapper>
                  <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Signing in...</span>
                </ButtonWrapper>
              ) : (
                'Sign In'
              )}
            </Button>
          </Form>

          <Divider>
            <DividerLine>
              <div />
            </DividerLine>
            <DividerText>
              <span>OR</span>
            </DividerText>
          </Divider>

          <SocialNotice>Social login coming soon</SocialNotice>
        </CardContainer>

        <FooterSection>
          <FooterText>
            Don't have an account?{' '}
            <SignupLink href="/register">Create one</SignupLink>
          </FooterText>
        </FooterSection>

        <SupportLink href="/contact">Need help? Contact support</SupportLink>
      </MainContainer>
    </Container>
  )
}