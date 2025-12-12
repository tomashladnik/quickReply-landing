/**
 * Generate a unique short code for result URLs
 * Format: 8 character alphanumeric code (uppercase)
 */
export function generateShortCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

/**
 * Generate a unique short code that doesn't exist in the database
 * Includes fallback for when database check fails
 */
export async function generateUniqueShortCode(): Promise<string> {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    let shortCode: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      shortCode = generateShortCode();
      attempts++;
      
      try {
        // Check if this code already exists using a simpler query
        const existing = await prisma.$queryRaw<{ count: bigint }[]>`
          SELECT COUNT(*) as count FROM multiuse_scans_demo WHERE "shortCode" = ${shortCode}
        `;
        
        // Convert BigInt to number for comparison
        const count = Number(existing[0].count);
        
        if (count === 0) {
          console.log(`Generated unique short code: ${shortCode} after ${attempts} attempts`);
          return shortCode;
        }
        
        console.log(`Short code ${shortCode} already exists, trying again...`);
        
      } catch (dbError) {
        console.error('Database check failed, using generated code anyway:', dbError);
        // If database check fails, just return the generated code
        // This ensures registration doesn't fail due to DB issues
        return shortCode;
      }
      
      if (attempts >= maxAttempts) {
        console.error('Failed to generate unique short code after maximum attempts');
        // Return the last generated code as fallback
        return shortCode;
      }
    } while (attempts < maxAttempts);
    
    return shortCode;
  } catch (error) {
    console.error('Short code generation completely failed, using timestamp-based fallback:', error);
    // Ultimate fallback: use timestamp + random
    const timestamp = Date.now().toString(36).slice(-4).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return timestamp + random;
  }
}