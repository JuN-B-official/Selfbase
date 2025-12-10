import { urlRegex } from 'components/interfaces/Auth/Auth.constants'
import { describe, it, expect } from 'vitest'

describe('Auth.constants: urlRegex', () => {
  it('should match valid URLs', () => {
    const validUrls = [
      'http://domain.com',
      'https://selfbase.io',
      'https://new-domain-vercel.com',
      'www.test-domain.com',
      'exp://exp.host/some-app',
      'exp://exp.host/some-app?release-channel=default',
      'https://selfbase.com/dashboard',
      'http://localhost:3000',
      'https://selfbase.com?name=test',
      'https://selfbase.com?name=test&description=hello&page=2',
      'https://selfbase*.com',
      'https://selfbase.com/*',
      'https://new-*-domain.com/*',
      'https://new-*-domain.com/*/*/*',
      'https://sub-*-domain.new-*-domain.com/*/*/*',
    ]

    validUrls.forEach((url) => {
      expect(urlRegex().test(url)).toBe(true)
    })
  })

  it('should not match invalid URLs', () => {
    const invalidUrls = ['selfbase', 'mailto:test@gmail.com', 'hello world.com', 'email@domain.com']

    const failingInvalidUrls = invalidUrls.filter((url) => urlRegex().test(url))
    if (failingInvalidUrls.length > 0) {
      console.log('Failing invalid URLs:', failingInvalidUrls)
    }

    invalidUrls.forEach((url) => {
      expect(urlRegex().test(url)).toBe(false)
    })
  })

  it('should not match simple domain URLs when excludeSimpleDomains is true', () => {
    const simpleDomainUrl = 'smtp-pulse.com'
    expect(urlRegex({ excludeSimpleDomains: true }).test(simpleDomainUrl)).toBe(false)
  })

  it('should match simple domain URLs when excludeSimpleDomains is false', () => {
    const simpleDomainUrl = 'smtp-pulse.com'
    expect(urlRegex({ excludeSimpleDomains: false }).test(simpleDomainUrl)).toBe(true)
  })
})
