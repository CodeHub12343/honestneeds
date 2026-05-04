'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';
import Button from '../ui/Button';

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba(247, 251, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#E2E8F0'};
`;

const HeaderContainer = styled.div`
  max-width: 1360px;
  margin: 0 auto;
  padding: ${({ theme }) => theme?.spacing?.md || '12px'} ${({ theme }) => theme?.spacing?.lg || '16px'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme?.spacing?.xl || '24px'};

  @media (min-width: ${({ theme }) => theme?.breakpoints?.tablet || '1024px'}) {
    padding: ${({ theme }) => theme?.spacing?.md || '12px'} ${({ theme }) => theme?.spacing?.xl || '24px'};
  }
`;

const Logo = styled.a`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.sm || '8px'};
  text-decoration: none;

  img {
    display: block;
    height: 40px;
    width: auto;
  }
`;

const Nav = styled.nav`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.xl || '24px'};

  @media (min-width: ${({ theme }) => theme?.breakpoints?.tablet || '1024px'}) {
    display: flex;
  }
`;

const NavLink = styled.a`
  font-size: ${({ theme }) => theme?.typography?.sizes?.body?.size || '16px'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.medium || '500'};
  color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
  text-decoration: none;
  transition: color ${({ theme }) => theme?.transitions?.fast || '100ms ease'};

  &:hover {
    color: ${({ theme }) => theme?.colors?.primary || '#6366F1'};
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.md || '12px'};
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme?.radii?.pill || '9999px'};
  background-color: transparent;
  color: ${({ theme }) => theme?.colors?.muted || '#64748B'};
  transition: all ${({ theme }) => theme?.transitions?.fast || '100ms ease'};

  &:hover {
    background-color: ${({ theme }) => theme?.colors?.bg || '#F8FAFC'};
    color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
  }

  @media (min-width: ${({ theme }) => theme?.breakpoints?.tablet || '1024px'}) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme?.radii?.pill || '9999px'};
  background-color: transparent;
  color: ${({ theme }) => theme?.colors?.text || '#0F172A'};

  @media (min-width: ${({ theme }) => theme?.breakpoints?.tablet || '1024px'}) {
    display: none;
  }
`;

const DesktopCTA = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme?.breakpoints?.tablet || '1024px'}) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme?.colors?.surface || '#FFFFFF'};
  z-index: 200;
  padding: ${({ theme }) => theme?.spacing?.xl || '24px'};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme?.spacing?.xl || '24px'};

  @media (min-width: ${({ theme }) => theme?.breakpoints?.tablet || '1024px'}) {
    display: none;
  }
`;

const MobileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MobileNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme?.spacing?.lg || '16px'};
`;

const MobileNavLink = styled.a`
  font-size: ${({ theme }) => theme?.typography?.sizes?.h3?.size || '24px'};
  font-weight: ${({ theme }) => theme?.typography?.weights?.semibold || '600'};
  color: ${({ theme }) => theme?.colors?.text || '#0F172A'};
  text-decoration: none;
  padding: ${({ theme }) => theme?.spacing?.md || '12px'} 0;
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#E2E8F0'};
`;

const MobileCTA = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme?.spacing?.md || '12px'};
`;

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Browse', href: '#campaigns' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <>
      <HeaderWrapper>
        <HeaderContainer>
          <Logo href="/">
            <img src="/1000019752.png" alt="HonestNeed" />
          </Logo>

          <Nav>
            {navLinks.map((link) => (
              <NavLink key={link.label} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </Nav>

          <Actions>
            <SearchButton aria-label="Search">
              <FiSearch size={20} />
            </SearchButton>
            <DesktopCTA>
              <Button size="small">Start a Campaign</Button>
            </DesktopCTA>
            <MobileMenuButton 
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu size={24} />
            </MobileMenuButton>
          </Actions>
        </HeaderContainer>
      </HeaderWrapper>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <MobileMenuHeader>
              <Logo href="/">
                <img src="/1000019752.png" alt="HonestNeed" />
              </Logo>
              <MobileMenuButton 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <FiX size={24} />
              </MobileMenuButton>
            </MobileMenuHeader>

            <MobileNav>
              {navLinks.map((link) => (
                <MobileNavLink 
                  key={link.label} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </MobileNavLink>
              ))}
            </MobileNav>

            <MobileCTA>
              <Button size="large">Start a Campaign — $19.99</Button>
              <Button variant="secondary" size="large">Browse Needs</Button>
            </MobileCTA>
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
}
