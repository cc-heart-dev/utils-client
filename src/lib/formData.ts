/**
 * Copies all entries from the input FormData object into a new FormData object.
 *
 * @param formData - The FormData object to be copied.
 * @returns A new FormData object containing all entries from the input FormData object.
 */
export function copyFormData(formData: FormData) {
  const newFormData = new FormData()
  for (const [key, value] of formData.entries()) {
    newFormData.append(key, value)
  }
  return newFormData
}