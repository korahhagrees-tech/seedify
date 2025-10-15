"use client";

import { useState, useEffect } from "react";
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
      // No image data, assume we're waiting for generation
      setIsWaitingForImage(true);
      
      // Check for webhook completion in localStorage (set by webhook callback)
      const checkWebhookCompletion = () => {
        const webhookData = localStorage.getItem(`webhook_complete_${seedId}`);
        if (webhookData) {
          try {
            const data = JSON.parse(webhookData);
            setImageGenerationData(data);
            setIsWaitingForImage(false);
            localStorage.removeItem(`webhook_complete_${seedId}`);
            toast.success('Image generation completed!');
          } catch (error) {
            console.error('Error parsing webhook data:', error);
          }
        }
      };
      
      // Check immediately
      checkWebhookCompletion();
      
      // Set up polling to check for webhook completion
      const pollInterval = setInterval(checkWebhookCompletion, 2000); // Check every 2 seconds
      
      // Fallback timeout (40 seconds) - remove this in production
      const fallbackTimeout = setTimeout(() => {
        clearInterval(pollInterval);
        if (isWaitingForImage) {
          setIsWaitingForImage(false);
          toast.info('Image generation is taking longer than expected. You can still explore the blooming view.');
        }
      }, 40000);
      
      return () => {
        clearInterval(pollInterval);
        clearTimeout(fallbackTimeout);
      };
    }
  }, [searchParams, seedId, isWaitingForImage]);

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
