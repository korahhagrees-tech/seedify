export const assets = {
  // SVGs
  copy: "/copy.svg",
  email: "/mail.svg",
  key: "/key-round.svg",
  logout: "/logout.svg",
  subtract: "/Subtract.svg",
  subtracts: "/assets/SeedbedText.svg",
  seedRoot: "/seed-root.svg",
  seedRootWhite: "/seed-root-1.svg",
  seedTransparent: "/seed-transparent.svg",
  arrowLeft: "/arrow-left.svg",
  arrowUp: "/arrow-up.svg",
  audioPlay: "/audio-play.svg",
  exploreGarden: "/explore-garden.svg",
  file: "/file.svg",
  firstSeed: "/first-seed.png",
  flowersBg: "/flowers-bg.png",
  globe: "/globe.svg",
  glowers: "/glowers.svg",
  gradient: "/gradient.png",
  next: "/next.svg",
  profileButton: "/Profile Button.svg",
  seedbedButton: "/Seedbed Button.svg",
  seedRootSvg: "/seed-root.svg",
  share: "/share.svg",
  testPink: "/test-pink.svg",
  text: "/text.svg",
  vercel: "/vercel.svg",
  window: "/window.svg",
  seedbed: "/Seedbed.svg",
  seedbedFrame: "/seed-bed-frame.svg",
  project01: "/seeds/02__ELG_small.svg",
  // Location SVGs
  buenaVista: "/Buena-Vista.svg",
  elGlobo: "/EL-Globo.svg",
  grgichHills: "/Grgich-Hills.svg",
  walkersReserve: "/Walkers-R.svg",

  textPink: "/test-pink.svg",
  textBlack: "/assets/WOF_Logo-black.png",

  chooseBeneficiary: '/assets/BENEFICIARIES.svg'

} as const;

export type AssetKey = keyof typeof assets;
