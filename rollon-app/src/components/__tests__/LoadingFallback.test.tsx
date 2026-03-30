import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingFallback } from '../common/LoadingFallback';

describe('LoadingFallback Component', () => {
    it('renders learning experience text', () => {
        render(<LoadingFallback />);
        expect(screen.getByText(/Loading experience.../i)).toBeInTheDocument();
    });
});
