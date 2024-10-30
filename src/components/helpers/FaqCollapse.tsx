import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import { ReactNode } from 'react'; // Import ReactNode for type safety
import React from 'react';

interface FaqCollapseProps {
  title: string;
  open: boolean;
  onClick: () => void;
  children: ReactNode; // Use ReactNode for flexibility with children
}

export default function FaqCollapse({ title, open, onClick, children }: FaqCollapseProps) {
  return (
    <>
      <div 
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
        onClick={onClick}
      >
        <button style={{ marginRight: '10px' }}>{open ? '-' : '+'}</button>
        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{title}</h3>
      </div>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Divider />
        <p>{children}</p> 
      </Collapse>
    </>
  );
}
