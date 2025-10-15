/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import WayOfFlowersCard from "@/components/WayOfFlowersCard";
import PaymentModal from "@/components/PaymentModal";
import { getWayOfFlowersData } from "@/lib/data/componentData";
import { fetchSeedById, beneficiaryToEcosystemProject } from "@/lib/api";
import { toast } from "sonner";

export default function WayOfFlowers({
  params,
}: {
  params: Promise<{ seedId: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [ecosystemBackgroundUrl, setEcosystemBackgroundUrl] = useState<string>("");
  
  // Image generation state management
  const [isWaitingForImage, setIsWaitingForImage] = useState(false);
  const [imageGenerationData, setImageGenerationData] = useState<{
    snapshotImageUrl?: string;
    backgroundImageUrl?: string;
    beneficiaryCode?: string;
  } | null>(null);

  // Unwrap params using React.use()
  const { seedId } = use(params);

  const wayOfFlowersData = getWayOfFlowersData(seedId);

  // Function to call webhook and handle response
  const callWebhookForImageGeneration = useCallback(async (webhookData: any) => {
    try {
      console.log('🔗 Calling webhook from way-of-flowers page:', webhookData);
      
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiBaseUrl}/snapshot-minted`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookData),
      });
      
      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }
      
      const webhookResult = await response.json();
      console.log('✅ Webhook response:', webhookResult);
      
      // Process webhook response
      if (webhookResult.success && webhookResult.data) {
        const { imageUrl, beneficiaryCode } = webhookResult.data;
        
        // Transform beneficiaryCode format: 02-ELG -> 02__ELG
        const transformedBeneficiaryCode = beneficiaryCode ? beneficiaryCode.replace('-', '__') : '';
        const backgroundImageUrl = `/project_images/${transformedBeneficiaryCode}.png`;
        
        const imageData = {
          snapshotImageUrl: imageUrl,
          backgroundImageUrl,
          beneficiaryCode
        };
        
        setImageGenerationData(imageData);
        setIsWaitingForImage(false);
        toast.success('Image generation completed!');
        
        // Clean up webhook data
        localStorage.removeItem(`webhook_data_${seedId}`);
        
        console.log('🖼️ Image generation completed:', imageData);
      } else {
        throw new Error('Webhook response indicates failure');
      }
      
    } catch (error) {
      console.error('❌ Webhook call failed:', error);
      setIsWaitingForImage(false);
      toast.error('Image generation failed. You can still explore the blooming view.');
      
      // Clean up webhook data on failure
      localStorage.removeItem(`webhook_data_${seedId}`);
    }
  }, [seedId]);

  // Check if we're coming from a successful mint (waiting for image generation)
  useEffect(() => {
    // Check URL params for image data (in case we're coming from a completed webhook)
    const snapshotImageUrl = searchParams.get('snapshotImageUrl');
    const backgroundImageUrl = searchParams.get('backgroundImageUrl');
    const beneficiaryCode = searchParams.get('beneficiaryCode');
    
    if (snapshotImageUrl || backgroundImageUrl || beneficiaryCode) {
      // We have image data, set it and show explore button
      setImageGenerationData({
        snapshotImageUrl: snapshotImageUrl || undefined,
        backgroundImageUrl: backgroundImageUrl || undefined,
        beneficiaryCode: beneficiaryCode || undefined,
      });
      setIsWaitingForImage(false);
    } else {
      // No image data, check if we need to call webhook
      const webhookDataString = localStorage.getItem(`webhook_data_${seedId}`);
      
      if (webhookDataString) {
        // We have webhook data from transaction → Start webhook call
        setIsWaitingForImage(true);
        console.log('🔄 Starting webhook call from way-of-flowers page');
        
        try {
          const webhookData = JSON.parse(webhookDataString);
          callWebhookForImageGeneration(webhookData);
        } catch (error) {
          console.error('Error parsing webhook data:', error);
          setIsWaitingForImage(false);
        }
      } else {
        // No webhook data, assume we're not in minting flow
        setIsWaitingForImage(false);
        console.log('ℹ️ No webhook data found - not in minting flow');
      }
    }
  }, [searchParams, seedId, callWebhookForImageGeneration]);


  // Fetch ecosystem background image
  useEffect(() => {
    async function loadEcosystemBackground() {
      try {
        // Fetch the seed by ID to get beneficiaries
        const seed = await fetchSeedById(seedId);

        if (seed && seed.beneficiaries && seed.beneficiaries.length > 0) {
          // Use the first beneficiary's background image
          const firstBeneficiary = seed.beneficiaries[0];
          const ecosystem = beneficiaryToEcosystemProject(
            firstBeneficiary,
            seed
          );

          if (ecosystem.backgroundImageUrl) {
            setEcosystemBackgroundUrl(ecosystem.backgroundImageUrl);
          }
        }
      } catch (err) {
        console.error("Error loading ecosystem background:", err);
        // Fallback to original background if ecosystem fails
        setEcosystemBackgroundUrl(wayOfFlowersData.backgroundImageUrl);
      }
    }

    loadEcosystemBackground();
  }, [seedId, wayOfFlowersData.backgroundImageUrl]);

  const handleExploreClick = () => {
    // Navigate to blooming page with image data
    if (imageGenerationData) {
      const params = new URLSearchParams();
      if (imageGenerationData.snapshotImageUrl) {
        params.set('snapshotImageUrl', imageGenerationData.snapshotImageUrl);
      }
      if (imageGenerationData.backgroundImageUrl) {
        params.set('backgroundImageUrl', imageGenerationData.backgroundImageUrl);
      }
      if (imageGenerationData.beneficiaryCode) {
        params.set('beneficiaryCode', imageGenerationData.beneficiaryCode);
      }
      
      const queryString = params.toString();
      router.push(`/way-of-flowers/${seedId}/blooming${queryString ? `?${queryString}` : ''}`);
    } else {
      // Fallback to blooming page without image data
      router.push(`/way-of-flowers/${seedId}/blooming`);
    }
  };

  const handleTryAgainClick = () => {
    setShowPaymentModal(true);
  };

  // Use ecosystem background if available, otherwise fallback to original
  const backgroundImageUrl =
    ecosystemBackgroundUrl || wayOfFlowersData.backgroundImageUrl;

  return (
    <div className="min-h-screen w-full">
      <WayOfFlowersCard
        backgroundImageUrl={backgroundImageUrl}
        seedEmblemUrl={wayOfFlowersData.seedEmblemUrl}
        firstText={wayOfFlowersData.firstText}
        secondText={wayOfFlowersData.secondText}
        thirdText={wayOfFlowersData.thirdText}
        mainQuote={wayOfFlowersData.mainQuote}
        author={wayOfFlowersData.author}
        onExploreClick={handleExploreClick}
        onTryAgainClick={handleTryAgainClick}
        isWaitingForImage={isWaitingForImage}
        imageGenerationData={imageGenerationData}
      />

      {/* Payment Modal for Try Again */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        seedId={seedId}
        amount={50}
      />
    </div>
  );
}
