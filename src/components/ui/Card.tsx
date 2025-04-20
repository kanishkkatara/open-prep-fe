import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  className, 
  children, 
  onClick,
  hoverable = false,
}) => {
  return (
    <div 
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden',
        hoverable && 'transition-all duration-200 hover:shadow-md',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ className, children }) => {
  return (
    <div className={cn('p-5 border-b border-gray-200', className)}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ className, children }) => {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h3>
  );
};

interface CardDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ className, children }) => {
  return (
    <p className={cn('text-sm text-gray-500 mt-1', className)}>
      {children}
    </p>
  );
};

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ className, children }) => {
  return (
    <div className={cn('p-5', className)}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ className, children }) => {
  return (
    <div className={cn('p-5 bg-gray-50 border-t border-gray-200', className)}>
      {children}
    </div>
  );
};