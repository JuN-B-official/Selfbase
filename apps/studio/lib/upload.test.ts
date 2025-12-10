import { describe, it, expect, vi, beforeEach } from 'vitest'

import { createClient } from '@selfbase/selfbase-js'
import { uploadAttachment } from './upload'

vi.mock('@selfbase/selfbase-js', () => ({
  createClient: vi.fn(),
}))

describe('uploadAttachment', () => {
  const mockUpload = vi.fn()
  const mockGetPublicUrl = vi.fn()

  const mockStorage = {
    from: vi.fn(() => ({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl,
    })),
  }

  const mockSelfbaseClient = {
    storage: mockStorage,
  }

  const mockFile = new File(['test'], 'test.png', { type: 'image/png' })

  beforeEach(() => {
    vi.clearAllMocks()
      ; (createClient as any).mockReturnValue(mockSelfbaseClient)
  })

  it('uploads file and returns public URL when getUrl is true', async () => {
    mockUpload.mockResolvedValue({ data: { path: 'folder/test.png' }, error: null })
    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: 'https://cdn.selfbase.io/folder/test.png' },
    })

    const url = await uploadAttachment('bucket', 'test.png', mockFile, true)

    expect(createClient).toHaveBeenCalled()
    expect(mockUpload).toHaveBeenCalledWith('test.png', mockFile, { cacheControl: '3600' })
    expect(mockGetPublicUrl).toHaveBeenCalledWith('folder/test.png')
    expect(url).toBe('https://cdn.selfbase.io/folder/test.png')
  })

  it('returns undefined if upload succeeds but getUrl is false', async () => {
    mockUpload.mockResolvedValue({ data: { path: 'folder/test.png' }, error: null })

    const result = await uploadAttachment('bucket', 'test.png', mockFile, false)
    expect(result).toBeUndefined()
  })

  it('returns undefined and logs if upload fails', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
    mockUpload.mockResolvedValue({ data: null, error: { message: 'Upload failed' } })

    const result = await uploadAttachment('bucket', 'test.png', mockFile)
    expect(result).toBeUndefined()
    expect(errorSpy).toHaveBeenCalledWith('Failed to upload:', { message: 'Upload failed' })

    errorSpy.mockRestore()
  })

  it('returns undefined if getPublicUrl returns no data', async () => {
    mockUpload.mockResolvedValue({ data: { path: 'folder/test.png' }, error: null })
    mockGetPublicUrl.mockReturnValue({ data: null })

    const result = await uploadAttachment('bucket', 'test.png', mockFile, true)
    expect(result).toBeUndefined()
  })
})
