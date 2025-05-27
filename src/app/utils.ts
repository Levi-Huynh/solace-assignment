export function formatPhone(phoneNumber: number): string {
  // Remove non-digit characters
  const cleaned = phoneNumber.toString().replace(/\D/g, "");

  // Format the phone number (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  // If the format is not matched, return the cleaned number
  return cleaned;
}
