import { slugifyStr } from "./slugify";

/**
 * Generate a slug from content entry, preferring explicit slug, 
 * then falling back to title-based slug, then filename
 */
export function generateSlug(
  entry: { 
    id: string; 
    data: { 
      title: string; 
      slug?: string; 
      date?: Date;
    }; 
  },
  options: {
    includeDate?: boolean;
    dateFormat?: "full" | "short";
  } = {}
): string {
  const { includeDate = false, dateFormat = "full" } = options;
  
  // 1. Use explicit slug if provided
  if (entry.data.slug) {
    return entry.data.slug;
  }
  
  // 2. Generate from title
  let slug = slugifyStr(entry.data.title);
  
  // 3. Add date prefix if requested and available
  if (includeDate && entry.data.date) {
    const date = entry.data.date;
    let datePrefix: string;
    
    if (dateFormat === "full") {
      // Format: 2024-11-02
      datePrefix = date.toISOString().split('T')[0];
    } else {
      // Format: 2024-11
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      datePrefix = `${year}-${month}`;
    }
    
    slug = `${datePrefix}-${slug}`;
  }
  
  // 4. Fallback to filename if everything else fails
  if (!slug || slug.length === 0) {
    // Extract filename without extension from id
    const filename = entry.id.split('/').pop()?.replace(/\.[^/.]+$/, '') || entry.id;
    slug = slugifyStr(filename);
  }
  
  return slug;
}

/**
 * Generate URL-friendly slug specifically for devlog entries
 * Format: YYYY-MM-DD-title-slug
 */
export function generateDevLogSlug(entry: {
  id: string;
  data: {
    title: string;
    slug?: string;
    date: Date;
  };
}): string {
  return generateSlug(entry, { includeDate: true, dateFormat: "full" });
}

/**
 * Generate URL-friendly slug for posts
 * Can optionally include date based on site config
 */
export function generatePostSlug(entry: {
  id: string;
  data: {
    title: string;
    slug?: string;
    date?: Date;
  };
}, includeDatePrefix = false): string {
  return generateSlug(entry, { includeDate: includeDatePrefix, dateFormat: "full" });
}

/**
 * Generate URL-friendly slug for TIL entries
 * Format: category-title or just title if no category
 */
export function generateTILSlug(entry: {
  id: string;
  data: {
    title: string;
    slug?: string;
    category?: string;
  };
}): string {
  if (entry.data.slug) {
    return entry.data.slug;
  }
  
  let slug = slugifyStr(entry.data.title);
  
  if (entry.data.category) {
    const categorySlug = slugifyStr(entry.data.category);
    slug = `${categorySlug}-${slug}`;
  }
  
  return slug;
}