# Way of Flowers - Backend API Schema

## Overview
This document outlines the complete data structure required for the Way of Flowers backend API, based on frontend component analysis.

## Core Data Models

### 1. Seed Model
```typescript
interface Seed {
  // Basic Identification
  id: string;                    // Unique seed identifier (e.g., "1", "2")
  label: string;                 // Display label (e.g., "seed 001")
  name: string;                  // Human-readable name (e.g., "Seed #1")
  description: string;           // Brief description
  
  // Visual Assets
  seedImageUrl: string;          // Main seed image URL
  latestSnapshotUrl: string | null; // Latest snapshot image URL
  
  // Blockchain Data
  owner: string;                 // Wallet address of owner
  depositAmount: string | null;  // Deposit amount in Wei
  snapshotPrice: string;         // Current snapshot price (formatted string)
  snapshotCount: number;         // Number of snapshots/evolutions
  
  // Status Flags
  isWithdrawn: boolean;          // Whether seed has been withdrawn
  isLive: boolean;               // Whether seed is currently active
  
  // Metadata
  metadata: SeedMetadata;        // NFT metadata attributes
  
  // Story Data
  story: SeedStory;              // Story content for the seed
}

interface SeedMetadata {
  exists: boolean;
  attributes: Array<{
    trait_type: string;          // Attribute name (e.g., "Type", "Token ID")
    value: string | number;      // Attribute value
  }>;
}

interface SeedStory {
  title: string;                 // Story title
  author: string;                // Story author
  story: string;                 // Full story text (multiline)
}
```

### 2. Ecosystem Project Model
```typescript
interface EcosystemProject {
  // Basic Info
  title: string;                 // Project title
  subtitle: string;              // Project subtitle/location
  shortText: string;             // Brief description
  extendedText: string;          // Detailed description
  
  // Visual Assets
  backgroundImageUrl: string;    // Background image for blooming view
  seedEmblemUrl: string;         // Seed emblem/icon URL
}
```

### 3. Way of Flowers Data Model
```typescript
interface WayOfFlowersData {
  // Visual Assets
  backgroundImageUrl: string;    // Background image URL
  seedEmblemUrl: string;         // Seed emblem URL
  
  // Text Content
  firstText: string;             // First line of text
  secondText: string;            // Second line of text
  thirdText: string;             // Third line of text
  mainQuote: string;             // Main quote text
  author: string;                // Quote author
}
```

### 4. Beneficiary Model
```typescript
interface Beneficiary {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  slug: string;                  // URL slug
  image: string;                 // Image URL
  
  // Positioning for Seedbed Card
  position: {
    top: string;                 // CSS top class
    left: string;                // CSS left class
    width: string;               // CSS width class
    height: string;              // CSS height class
    transform: string;           // CSS transform class
  };
  
  labelPosition: {
    top: string;                 // CSS top class for label
    left: string;                // CSS left class for label
    transform: string;           // CSS transform class for label
  };
}
```

## API Endpoints

### 1. Garden Data
```
GET /api/garden-data
```
**Response:**
```typescript
interface GardenDataResponse {
  success: boolean;
  seeds: Seed[];
  timestamp: number;
}
```

### 2. Individual Seed
```
GET /api/seeds/:id
```
**Response:**
```typescript
interface SeedResponse {
  success: boolean;
  seed: Seed;
  timestamp: number;
}
```

### 3. Ecosystem Project Data
```
GET /api/ecosystem-projects/:seedId
```
**Response:**
```typescript
interface EcosystemProjectResponse {
  success: boolean;
  project: EcosystemProject;
  timestamp: number;
}
```

### 4. Way of Flowers Data
```
GET /api/way-of-flowers/:seedId
```
**Response:**
```typescript
interface WayOfFlowersResponse {
  success: boolean;
  data: WayOfFlowersData;
  timestamp: number;
}
```

### 5. Seed Story
```
GET /api/seed-stories/:seedId
```
**Response:**
```typescript
interface SeedStoryResponse {
  success: boolean;
  story: SeedStory;
  timestamp: number;
}
```

### 6. Beneficiaries
```
GET /api/beneficiaries
```
**Response:**
```typescript
interface BeneficiariesResponse {
  success: boolean;
  beneficiaries: Beneficiary[];
  timestamp: number;
}
```

## Data Relationships

### Seed-to-Project Mapping
- Each seed ID maps to one ecosystem project
- Each seed ID maps to one Way of Flowers data set
- Each seed ID maps to one story

### Example Seed Data Structure
```json
{
  "id": "1",
  "label": "seed 001",
  "name": "Seed #1",
  "description": "A unique seed from the Way of Flowers collection",
  "seedImageUrl": "https://wof-flourishing-backup.s3.amazonaws.com/seed1/seed.png",
  "latestSnapshotUrl": null,
  "snapshotCount": 643,
  "owner": "0xc4b3CE8DD17F437ba4d9fc8D8e65E05e047792A8",
  "depositAmount": null,
  "snapshotPrice": "22, 232",
  "isWithdrawn": false,
  "isLive": true,
  "metadata": {
    "exists": true,
    "attributes": [
      { "trait_type": "Type", "value": "Seed" },
      { "trait_type": "Token ID", "value": 1 },
      { "trait_type": "Snapshots", "value": 11 },
      { "trait_type": "Live", "value": "yes" }
    ]
  },
  "story": {
    "title": "We are the Soil",
    "author": "Stanley Qiufan Chen",
    "story": "As a kid, I fever-dreamed too often..."
  }
}
```

## Frontend Component Data Usage

### SeedCard Component
- Uses: `id`, `label`, `name`, `seedImageUrl`, `snapshotPrice`, `owner`, `snapshotCount`

### BloomingView Component
- Uses: `backgroundImageUrl` (from ecosystem project), `beneficiary` (derived from project title), `seedEmblemUrl`, `storyText` (from story)

### StoryPanel Component
- Uses: `title`, `author`, `story` (from seed story)

### WayOfFlowersCard Component
- Uses: `backgroundImageUrl`, `seedEmblemUrl`, `firstText`, `secondText`, `thirdText`, `mainQuote`, `author`

### SeedbedCard Component
- Uses: `beneficiaries` array with positioning data

## Notes for Backend Implementation

1. **Image URLs**: All image URLs should be absolute URLs pointing to CDN or storage service
2. **Price Formatting**: `snapshotPrice` is displayed as formatted string (e.g., "22, 232")
3. **Address Formatting**: Owner addresses are displayed with `formatAddress()` helper (shows last 4 chars)
4. **Story Text**: Stories are multiline text with proper line breaks
5. **Positioning Data**: Beneficiary positioning uses Tailwind CSS classes
6. **Fallbacks**: All data getters have fallbacks to seed "1" if requested seed doesn't exist
7. **Async Params**: Next.js 15 requires `params` to be unwrapped with `React.use()` in client components

## Database Schema Suggestions

### Seeds Table
```sql
CREATE TABLE seeds (
  id VARCHAR(50) PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  seed_image_url TEXT NOT NULL,
  latest_snapshot_url TEXT,
  snapshot_count INTEGER DEFAULT 0,
  owner VARCHAR(42) NOT NULL,
  deposit_amount VARCHAR(78),
  snapshot_price VARCHAR(50) NOT NULL,
  is_withdrawn BOOLEAN DEFAULT FALSE,
  is_live BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Seed Stories Table
```sql
CREATE TABLE seed_stories (
  seed_id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(200) NOT NULL,
  story TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seed_id) REFERENCES seeds(id)
);
```

### Ecosystem Projects Table
```sql
CREATE TABLE ecosystem_projects (
  seed_id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  subtitle VARCHAR(200) NOT NULL,
  short_text TEXT NOT NULL,
  extended_text TEXT NOT NULL,
  background_image_url TEXT NOT NULL,
  seed_emblem_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seed_id) REFERENCES seeds(id)
);
```

### Way of Flowers Data Table
```sql
CREATE TABLE way_of_flowers_data (
  seed_id VARCHAR(50) PRIMARY KEY,
  background_image_url TEXT NOT NULL,
  seed_emblem_url TEXT NOT NULL,
  first_text VARCHAR(200) NOT NULL,
  second_text VARCHAR(200) NOT NULL,
  third_text VARCHAR(200) NOT NULL,
  main_quote TEXT NOT NULL,
  author VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seed_id) REFERENCES seeds(id)
);
```

### Beneficiaries Table
```sql
CREATE TABLE beneficiaries (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  position_top VARCHAR(50) NOT NULL,
  position_left VARCHAR(50) NOT NULL,
  position_width VARCHAR(50) NOT NULL,
  position_height VARCHAR(50) NOT NULL,
  position_transform VARCHAR(50) NOT NULL,
  label_position_top VARCHAR(50) NOT NULL,
  label_position_left VARCHAR(50) NOT NULL,
  label_position_transform VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
