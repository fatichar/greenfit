import affiliateProductsData from "../../data/affiliateProducts.json";
import type { AffiliateProduct } from "./types";

const amazonHostPattern = /(^|\.)amazon\./i;

export const affiliateProducts = affiliateProductsData as AffiliateProduct[];

export function getAmazonAssociatesTag() {
  return process.env.NEXT_PUBLIC_AMAZON_ASSOCIATES_TAG?.trim() || undefined;
}

export function isAmazonUrl(url: string) {
  try {
    return amazonHostPattern.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

export function withAmazonAssociatesTag(url: string, tag = getAmazonAssociatesTag()) {
  if (!isAmazonUrl(url) || !tag) {
    return url;
  }

  const affiliateUrl = new URL(url);
  affiliateUrl.searchParams.set("tag", tag);
  return affiliateUrl.toString();
}

export function hasExpectedAmazonAssociatesTag(url: string, tag = getAmazonAssociatesTag()) {
  if (!isAmazonUrl(url)) {
    return false;
  }

  if (!tag) {
    return true;
  }

  return new URL(url).searchParams.get("tag") === tag;
}

export function getAffiliateProductsByTags(tags: string[], limit = 3) {
  const normalizedTags = new Set(tags.map((tag) => tag.toLowerCase()));

  return affiliateProducts
    .filter((product) => product.tags.some((tag) => normalizedTags.has(tag.toLowerCase())))
    .slice(0, limit);
}
