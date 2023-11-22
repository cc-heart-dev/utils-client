import { copyFormData } from '@/lib/formData'


describe('formData module', () => {
  test('copy formData', () => {
    const formData = new FormData()
    formData.set('name', 'test')
    const newFormData = copyFormData(formData)

    expect(newFormData).not.toBe(formData)
    expect(newFormData.get('name')).toBe('test')
  })
})