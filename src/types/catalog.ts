export interface Category {
  id: string; slug: string; name: string; parentId?: string; image?: string; status: string; sortOrder: number;
}
export interface ProductVariant { id: string; variantType: string; value: string; priceAdjustment: number; inventory: number; sku?: string }
export interface CareGuide { watering: string; sunlight: string; temperature: string; humidity: string; commonIssues?: string; videoUrl?: string }
export interface Product {
  id: string; slug: string; name: string; description?: string; basePrice: number; salePrice?: number;
  saleEndDate?: string; effectivePrice: number; type: string; inventory: number; featured: boolean;
  pinnedUntil?: string; categoryId: string; categoryName: string; status: string; images: string[];
  size?: string; soil?: string; moss?: string; driftwood?: string; accessories?: string;
  setupStatus?: string; careLevel?: string; chatTags: string[]; shortConsultNote?: string;
  rating?: number; reviewCount: number; voteCount: number; userVoted: boolean;
  variants: ProductVariant[]; careGuide?: CareGuide; createdAt: string; updatedAt: string;
}
export interface ProductPage { products: Product[]; page: number; limit: number; total: number; totalPages: number }
export interface ExploreData { featured: Product[]; pinned: Product[]; topVoted: Product[]; newArrivals: Product[] }
