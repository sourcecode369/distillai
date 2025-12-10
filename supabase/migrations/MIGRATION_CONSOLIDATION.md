# Migration File Consolidation Guide

## Overview

This document tracks the consolidation of migration files. Many migrations (011-033) were iterative fixes for the notifications table RLS policies. The final production-ready policy is in `033_notifications_final_production_policy.sql`.

## Migration Status

### Core Migrations (Keep)

- `001_initial_schema.sql` - Initial database schema (user_profiles, bookmarks, reading_history, user_progress)
- `002_admin_policies.sql` - Admin RLS policies and is_admin_user() function
- `003_add_profile_fields.sql` - Additional profile fields
- `004_topics_table.sql` - Topics table creation
- `005_topics_policies.sql` - Topics RLS policies
- `006_sections_table.sql` - Sections table
- `007_categories_table.sql` - Categories table
- `008_sections_categories_policies.sql` - Sections/categories RLS policies
- `009_add_video_column_to_topics.sql` - Video column addition
- `010_notifications_table.sql` - Notifications table creation
- `033_notifications_final_production_policy.sql` - **Final production notifications policy**
- `034_search_history_table.sql` - Search history table
- `035_bookmark_tags_table.sql` - Bookmark tags table

### Iterative Fixes (Can be ignored if 033 is applied)

- `011_fix_notifications_policy.sql` through `032_disable_rls_for_notifications_insert.sql` - These were iterative attempts to fix the notifications INSERT policy. The final solution is in `033_notifications_final_production_policy.sql`.

## Recommended Action

If setting up a new database:

1. Run migrations 001-010 in order
2. Skip migrations 011-032 (they are superseded by 033)
3. Run migration 033 (final notifications policy)
4. Run migrations 034-035

If working with an existing database:

- All migrations have already been applied, so no action needed
- The final state is correct regardless of the intermediate fixes

## Notes

- Migration 033 uses a permissive INSERT policy (allows all inserts) with application-level security
- This is safe because only admins can access the admin dashboard and notification features
- SELECT and UPDATE policies remain restrictive (users can only see/update their own notifications)

