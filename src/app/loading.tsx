"use client"
import { Logo } from '@/components/Logo';
import { keyframes } from '@emotion/react'; // If you're using Emotion for styling

// ----------------------------------------------------------------------

export default function Loading() {
  return (
    <div style={loadingContainerStyle}>
      <div style={logoWrapperStyle}>
        <Logo style={logoStyle} />
      </div>
      <div style={loadingTextStyle}>Loading...</div>
    </div>
  );
}

// Define styles for loading screen container
const loadingContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f4f4f4',
};

// Define animation for logo (e.g., pulsing effect)
const pulseAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
`;

// Apply the animation to the logo
const logoWrapperStyle: React.CSSProperties = {
  animation: `${pulseAnimation} 2s infinite ease-in-out`,
};

const logoStyle: React.CSSProperties = {
  width: '150px',
  height: '50px',
};

// Style for the loading text
const loadingTextStyle: React.CSSProperties = {
  marginTop: '20px',
  fontSize: '18px',
  color: '#4CAF50',
  fontFamily: 'Arial, sans-serif',
};
