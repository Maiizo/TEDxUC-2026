export function generateRegNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Generate 8 random uppercase alphanumeric characters
  const randomChars = Math.random().toString(36).substring(2, 10).toUpperCase();
  
  return `TDX-${year}${month}${day}-${randomChars}`;
}
