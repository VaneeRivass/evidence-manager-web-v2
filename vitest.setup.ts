// Adds the DOM matchers (toBeInTheDocument, toHaveAttribute, ...) to Vitest.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Unmount between tests, so one test's DOM does not leak into the next.
afterEach(() => {
  cleanup()
})
