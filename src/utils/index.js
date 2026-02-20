/**
 * Utils barrel export
 *
 * Import any utility from a single entry point:
 *   import { formatDate, performGlobalSearch, QUERY_KEYS } from '@/utils'
 *
 * Individual files can still be imported directly when preferred.
 */

// Formatting helpers
export * from "./formatting";

// Data loaders (async, Supabase-backed)
export * from "./dataLoader";
export * from "./topicLoader";

// Search
export * from "./globalSearch";

// Content translation
export * from "./translateContent";

// Icon mapping
export * from "./iconMapper";

// App constants (query keys, storage keys, pagination, etc.)
export * from "./constants";

// Import utilities (admin-only — not re-exported to keep bundle size down)
// import { importStaticTopics } from "@/utils/importStaticTopics";
// import { importStaticData }   from "@/utils/importStaticData";
