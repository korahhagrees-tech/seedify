/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  const webhookInFlightRef = useRef(false);

  // Unwrap params using React.use()
  const { seedId } = use(params);

  const wayOfFlowersData = getWayOfFlowersData(seedId);

  // Function to call webhook and handle response
  const callWebhookForImageGeneration = useCallback(async (webhookData: any) => {
    if (webhookInFlightRef.current) {
      console.log('⏭️ Webhook already in-flight; skipping duplicate call');
      return;
    }
    webhookInFlightRef.current = true;
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
        const { beneficiaryCode, blockchain } = webhookResult.data;
        const { seedId: responseSeedId, snapshotId, processId } = webhookResult.data;

        // Construct the actual image URL using the response data
        // Pattern: https://d17wy07434ngk.cloudfront.net/seed{seedId}/snap{seedId}-{positionInSeed}-{processId}.png
        const constructedImageUrl = `https://d17wy07434ngk.cloudfront.net/seed${responseSeedId}/snap${responseSeedId}-${snapshotId}-${processId}.png`;

        // Transform beneficiaryCode format: 02-ELG -> 02__ELG
        const transformedBeneficiaryCode = beneficiaryCode ? beneficiaryCode.replace('-', '__') : '';
        const backgroundImageUrl = `/project_images/${transformedBeneficiaryCode}.png`;

        const imageData = {
          snapshotImageUrl: constructedImageUrl,
          backgroundImageUrl,
          beneficiaryCode
        };

        setImageGenerationData(imageData);
        setIsWaitingForImage(false);
        toast.success('Image generation completed!');

        // Clean up webhook data
        // Keep data around until navigation completes; do cleanup later if needed

        console.log('🖼️ Image generation completed:', imageData);
      } else {
        throw new Error('Webhook response indicates failure');
      }

    } catch (error) {
      console.error('❌ Webhook call failed:', error);
      setIsWaitingForImage(false);
      toast.error('Image generation failed. You can still explore the blooming view.');

      // Fallback: construct snapshot image URL from the original payload we sent
      try {
        const { seedId: sId, snapshotId, processId, beneficiaryCode } = webhookData || {};
        if (sId && snapshotId && processId) {
          const constructedImageUrl = `https://d17wy07434ngk.cloudfront.net/seed${sId}/snap${sId}-${snapshotId}-${processId}.png`;
          const transformedCode = beneficiaryCode ? String(beneficiaryCode).replace('-', '__') : '';
          const backgroundImageUrl = transformedCode ? `/project_images/${transformedCode}.png` : undefined;
          setImageGenerationData({ snapshotImageUrl: constructedImageUrl, backgroundImageUrl, beneficiaryCode });
        }
      } catch (e) {
        console.warn('Fallback URL construction failed', e);
      }
    }
    finally {
      webhookInFlightRef.current = false;
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
    // Navigate to blooming page with validated image data
    let img = imageGenerationData;

    // If current data is missing/invalid, rebuild from stored payload
    const isInvalid = !img ||
      !img.snapshotImageUrl || img.snapshotImageUrl.includes('undefined') ||
      !img.backgroundImageUrl || img.backgroundImageUrl.endsWith('/.png');

    if (isInvalid) {
      try {
        const storedStr = localStorage.getItem(`webhook_data_${seedId}`);
        if (storedStr) {
          const stored = JSON.parse(storedStr);
          const sId = stored?.seedId;
          const snapshotId = stored?.snapshotId;
          const processId = stored?.processId;
          const code = stored?.beneficiaryCode as string | undefined;
          const constructed = (sId && snapshotId && processId)
            ? `https://d17wy07434ngk.cloudfront.net/seed${sId}/snap${sId}-${snapshotId}-${processId}.png`
            : undefined;
          const bg = code ? `/project_images/${String(code).replace('-', '__')}.png` : undefined;
          img = {
            snapshotImageUrl: constructed,
            backgroundImageUrl: bg,
            beneficiaryCode: code,
          };
          setImageGenerationData(img);
        }
      } catch { /* ignore */ }
    }

    const params = new URLSearchParams();
    if (img?.snapshotImageUrl && !img.snapshotImageUrl.includes('undefined')) {
      params.set('snapshotImageUrl', img.snapshotImageUrl);
    }
    if (img?.backgroundImageUrl && !img.backgroundImageUrl.endsWith('/.png')) {
      params.set('backgroundImageUrl', img.backgroundImageUrl);
    }
    if (img?.beneficiaryCode) {
      params.set('beneficiaryCode', img.beneficiaryCode);
    }
    try {
      const stored = localStorage.getItem(`webhook_data_${seedId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.beneficiaryName) params.set('beneficiaryName', parsed.beneficiaryName);
      }
    } catch { }

    const queryString = params.toString();
    router.push(`/way-of-flowers/${seedId}/blooming${queryString ? `?${queryString}` : ''}`);
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
      // onTryAgainClick={handleTryAgainClick}
      // isWaitingForImage={isWaitingForImage}
      // imageGenerationData={imageGenerationData}
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
