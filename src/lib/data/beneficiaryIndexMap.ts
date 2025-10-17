export type BeneficiaryIndexCode = {
  index: number;
  code: string; // e.g., "01-GRG"
};

// Static mapping extracted from backend response to avoid extra calls
export const BENEFICIARY_INDEX_TO_CODE: BeneficiaryIndexCode[] = [
  { index: 0, code: "01-GRG" },
  { index: 1, code: "02-ELG" },
  { index: 2, code: "03-JAG" },
  { index: 3, code: "04-BUE" },
  { index: 4, code: "05-WAL" },
  { index: 5, code: "06-PIM" },
  { index: 6, code: "07-HAR" },
  { index: 7, code: "08-STE" },
];

export function getCodeForIndex(index: number | undefined | null): string | undefined {
  if (index === undefined || index === null) return undefined;
  const found = BENEFICIARY_INDEX_TO_CODE.find((b) => b.index === index);
  return found?.code;
}

export function codeToSeedEmblemPath(code: string | undefined | null): string {
  // Codes like "01-GRG" map to public path "/seeds/01__GRG.png"
  if (!code) return "/seeds/01__GRG.png"; // safe default
  const file = `${code.replace("-", "__")}_big.svg`;
  return `/seeds/${file}`;
}


