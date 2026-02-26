import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the Grand Inauguration title', () => {
    render(<App />)
    expect(screen.getByText(/Grand Inauguration/i)).toBeInTheDocument()
  })

  it('renders the Launch Now button initially', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /Launch Now/i })).toBeInTheDocument()
  })
})
