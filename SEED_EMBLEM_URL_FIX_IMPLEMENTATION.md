# Seed Emblem URL Fix Implementation

## ✅ What I Fixed

Fixed the **seed emblem URL construction logic** across multiple components to use the correct beneficiary code format with underscores instead of dashes, following the pattern `/seeds/{beneficiaryCode}.png`.

## 🔧 Changes Made

### **1. Fixed `beneficiaryToEcosystemProject` Function**
**File**: `src/lib/api/utils/dataMappers.ts`

**Before:**
```typescript
// Get seedEmblemUrl from wayOfFlowersData if available
const seedEmblemUrl = typeof seedData?.wayOfFlowersData?.seedEmblemUrl === 'string'
  ? seedData.wayOfFlowersData.seedEmblemUrl
  : undefined;
```

**After:**
```typescript
// Construct seedEmblemUrl using beneficiary code with underscores
// Convert beneficiary code from "01-GRG" to "01__GRG" format
const beneficiaryCodeWithUnderscores = beneficiary.code.replace('-', '__');
const seedEmblemUrl = `/seeds/${beneficiaryCodeWithUnderscores}.png`;
```

### **2. Updated Way-of-Flowers Page**
**File**: `src/app/way-of-flowers/[seedId]/page.tsx`

**Added:**
- `ecosystemSeedEmblemUrl` state to store the correct seed emblem from ecosystem data
- Logic to extract seed emblem from `beneficiaryToEcosystemProject` result
- Fallback logic to use ecosystem seed emblem over hardcoded backend data

**Key Changes:**
```typescript
const [ecosystemSeedEmblemUrl, setEcosystemSeedEmblemUrl] = useState<string>("");

// In loadEcosystemBackground function:
if (ecosystem.seedEmblemUrl) {
  setEcosystemSeedEmblemUrl(ecosystem.seedEmblemUrl);
}

// Use ecosystem seed emblem if available, otherwise fallback to original
const seedEmblemUrl = ecosystemSeedEmblemUrl || wayOfFlowersData.seedEmblemUrl;
```

### **3. Enhanced SeedDetailPage with Three-Tier Fallback**
**File**: `src/components/seeds/SeedDetailPage.tsx`

**Added:**
- Three-tier fallback system for seed images
- Proper error handling with retry logic
- CloudFront URL construction using seed ID

**Key Changes:**
```typescript
const [imageErrorCount, setImageErrorCount] = useState(0);

const getCurrentImageSrc = () => {
  // Tier 1: Original backend URL
  if (imageErrorCount === 0 && seed.seedImageUrl && seed.seedImageUrl.length > 0) {
    return seed.seedImageUrl;
  }
  
  // Tier 2: CloudFront URL with seed ID
  if (imageErrorCount === 1) {
    return `https://d17wy07434ngk.cloudfront.net/seed${seed.id}/seed.png`;
  }
  
  // Tier 3: Universal fallback
  return "https://d17wy07434ngk.cloudfront.net/seed1/seed.png";
};

const handleImageError = () => {
  if (imageErrorCount < 2) {
    setImageErrorCount(prev => prev + 1);
  } else {
    setImageError(true);
  }
};
```

## 🎯 How It Works

### **Beneficiary Code Transformation:**
- **Input**: `"01-GRG"` (from backend response)
- **Transformation**: `beneficiary.code.replace('-', '__')`
- **Output**: `"01__GRG"`
- **Final URL**: `/seeds/01__GRG.png`

### **Three-Tier Fallback System:**
1. **Tier 1**: Original backend `seedImageUrl`
2. **Tier 2**: CloudFront URL with seed ID: `https://d17wy07434ngk.cloudfront.net/seed{id}/seed.png`
3. **Tier 3**: Universal fallback: `https://d17wy07434ngk.cloudfront.net/seed1/seed.png`

### **Error Handling:**
- Each tier is tried sequentially on image load failure
- Console logging for debugging
- Graceful degradation to final fallback

## 📊 Affected Components

### **1. Ecosystem Project Cards**
- Now use correct seed emblem URLs based on beneficiary code
- Proper fallback to `/seeds/{beneficiaryCode}.png` format

### **2. Way-of-Flowers Pages**
- Seed emblems now match the beneficiary being viewed
- Dynamic construction based on ecosystem data

### **3. Seed Detail Pages**
- Enhanced three-tier fallback system
- Better error handling and retry logic
- CloudFront URL construction for better reliability

## 🎉 Benefits

### **1. Correct Image Loading**
- Seed emblems now use the proper beneficiary code format
- Consistent with the backend response structure
- Proper underscore replacement for file paths

### **2. Better Error Handling**
- Three-tier fallback system prevents broken images
- Sequential retry logic with proper error tracking
- Console logging for debugging

### **3. Improved Reliability**
- CloudFront URLs as secondary fallback
- Universal fallback as final safety net
- Dynamic construction based on actual data

## 🔍 Backend Response Structure

The backend provides beneficiary data like this:
```json
{
  "beneficiaries": [
    {
      "code": "01-GRG",
      "name": "Grgich Hills Estate Regenerative Sheep Grazing",
      "projectData": {
        "backgroundImage": "/project_images/01__GRG.png"
      }
    }
  ]
}
```

**Now correctly transformed to:**
- **Seed Emblem**: `/seeds/01__GRG.png`
- **Background Image**: `/project_images/01__GRG.png`

## 🎉 Result

**All seed emblem URLs now use the correct beneficiary code format with underscores, ensuring proper image loading across the ecosystem pages, way-of-flowers pages, and seed detail pages!** 🎉

### **Key Features:**
- ✅ **Correct URL Construction** → Uses beneficiary code with underscores
- ✅ **Three-Tier Fallback** → Robust error handling and retry logic
- ✅ **Dynamic Generation** → Based on actual beneficiary data
- ✅ **Consistent Format** → Matches backend response structure
