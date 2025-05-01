import { type VariantProps } from 'class-variance-authority';
import { type buttonVariants } from '@/components/ui/Button';

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export interface BaseProps {
  className?: string;
}

export interface WithChildren {
  children: React.ReactNode;
}

export interface WithLoading {
  isLoading?: boolean;
}

export interface WithDisabled {
  disabled?: boolean;
}

export interface WithOnClick {
  onClick?: (event: React.MouseEvent) => void;
}

export interface WithOnChange {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface WithValue {
  value?: string | number;
}

export interface WithPlaceholder {
  placeholder?: string;
}

export interface WithLabel {
  label?: string;
}

export interface WithError {
  error?: string;
}

export interface WithHelperText {
  helperText?: string;
}

export interface WithRequired {
  required?: boolean;
}

export interface WithName {
  name: string;
}

export interface WithId {
  id: string;
}

export interface WithType {
  type?: string;
}

export interface WithSize {
  size?: 'sm' | 'md' | 'lg';
}

export interface WithVariant {
  variant?: string;
}

export interface WithIcon {
  icon?: React.ReactNode;
}

export interface WithLeftIcon {
  leftIcon?: React.ReactNode;
}

export interface WithRightIcon {
  rightIcon?: React.ReactNode;
}

export interface WithAsChild {
  asChild?: boolean;
}

export interface Post {
  id: string;
  content: string;
  created_at: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
} 