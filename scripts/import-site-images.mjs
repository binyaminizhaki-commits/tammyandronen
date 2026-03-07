import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_SOURCE_ROOT = "C:/Users/binya/OneDrive/מסמכים/public images tammy and ronen";
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.resolve(process.argv[2] ?? DEFAULT_SOURCE_ROOT);
const publicRoot = path.join(repoRoot, "public", "site-images");
const manifestPath = path.join(repoRoot, "src", "app", "data", "siteImages.ts");
const collator = new Intl.Collator("he", { numeric: true, sensitivity: "base" });

const topLevelConfig = {
  "סטודיו הארכיון": {
    page: "studio",
    pageSlug: "studio",
    section: "studioArchive",
    sectionSlug: "archive-studio",
    sectionTitleHe: "סטודיו הארכיון",
  },
  "רזידנסי": {
    page: "residency",
    pageSlug: "residency",
    section: "residencyLead",
    sectionSlug: "lead",
    sectionTitleHe: "רזידנסי",
  },
  "שותפים לדרך": {
    page: "home",
    pageSlug: "home",
    section: "partners",
    sectionSlug: "partners",
    sectionTitleHe: "שותפים לדרך",
  },
};

const studioGroupConfig = {
  "__root__": {
    groupSlug: "main-studio",
    groupTitleHe: "חלל הסטודיו",
    groupOrder: 1,
  },
  "הקמה": {
    groupSlug: "setup",
    groupTitleHe: "הקמה",
    groupOrder: 2,
  },
  "הקמפוס והבניין": {
    groupSlug: "campus-building",
    groupTitleHe: "הקמפוס והבניין",
    groupOrder: 3,
  },
};

const tammySectionConfig = {
  "אודות תמי ורונן": {
    section: "about",
    sectionSlug: "about",
    sectionTitleHe: "אודות תמי ורונן",
  },
  "רפרטואר": {
    section: "repertoire",
    sectionSlug: "repertoire",
    sectionTitleHe: "רפרטואר",
  },
  "עבודות קודמות": {
    section: "previousWorks",
    sectionSlug: "previous-works",
    sectionTitleHe: "עבודות קודמות",
  },
};

const repertoireGroupSlugs = {
  "י-ם רהט": "yam-rahat",
  "מטא-תמי": "meta-tammy",
  "שפתיים": "sfatayim",
};

const previousWorksGroupSlugs = {
  "Every Grain of Rice": "every-grain-of-rice",
  "אומנידיאס": "omnidias",
  "בעצב": "beatzav",
  "גיבורים": "giborim",
  "גרטל": "gretel",
  "הוט מיט א פעדער": "hot-mit-a-feder",
  "זאת הפעם": "zot-hapaam",
  "חדפ": "chadap",
  "כביש מס 1": "kvish-1",
  "לס": "las",
  "מדד האושר": "medad-haosher",
  "מה זאת עשית": "ma-zot-asit",
  "מחכות לנוטות החסד": "mehakot-lenotot-hachesed",
  "עגלה ריקה": "agala-reika",
  "עולם קטן": "olam-katan",
  "עפר": "afar",
  "פשוטות": "pshutot",
};

const sectionOrder = {
  partners: 1,
  studioArchive: 1,
  residencyLead: 1,
  about: 1,
  repertoire: 2,
  previousWorks: 3,
};

async function main() {
  await assertPathExists(sourceRoot);
  const discoveredFiles = await walk(sourceRoot);
  const preparedFiles = await Promise.all(discoveredFiles.map(prepareFileRecord));
  const groupedFiles = buildGroupCatalog(preparedFiles);
  const copiedAssets = await materializeAssets(groupedFiles);
  validateCounts(copiedAssets);
  await writeManifest(copiedAssets);

  const summary = copiedAssets.reduce(
    (accumulator, asset) => {
      accumulator.total += 1;
      accumulator.bySection[asset.section] = (accumulator.bySection[asset.section] ?? 0) + 1;
      return accumulator;
    },
    { total: 0, bySection: {} },
  );

  console.log(`Imported ${summary.total} images from ${sourceRoot}`);
  console.log(JSON.stringify(summary.bySection, null, 2));
}

async function assertPathExists(targetPath) {
  try {
    await fs.access(targetPath);
  } catch {
    throw new Error(`Source path does not exist: ${targetPath}`);
  }
}

async function walk(rootPath) {
  const entries = await fs.readdir(rootPath, { withFileTypes: true });
  const paths = [];

  for (const entry of entries) {
    const fullPath = path.join(rootPath, entry.name);
    if (entry.isDirectory()) {
      paths.push(...(await walk(fullPath)));
    } else if (entry.isFile()) {
      paths.push(fullPath);
    }
  }

  return paths.sort((left, right) => collator.compare(path.basename(left), path.basename(right)));
}

async function prepareFileRecord(filePath) {
  const relativePath = path.relative(sourceRoot, filePath);
  const pathParts = relativePath.split(path.sep);
  const extension = await detectExtension(filePath);
  const baseName = path.basename(filePath, path.extname(filePath));
  const captionHe = cleanLabel(baseName);
  const classification = classifyPath(pathParts);

  return {
    filePath,
    relativePath,
    pathParts,
    extension,
    captionHe,
    ...classification,
  };
}

function classifyPath(pathParts) {
  const topLevel = pathParts[0];

  if (topLevel !== "תמי ורונן") {
    const config = topLevelConfig[topLevel];
    if (!config) {
      throw new Error(`Unrecognized top-level folder: ${topLevel}`);
    }

    if (topLevel === "סטודיו הארכיון") {
      const maybeSubgroup = pathParts.length > 2 ? pathParts[1] : "__root__";
      const groupConfig = studioGroupConfig[maybeSubgroup];
      if (!groupConfig) {
        throw new Error(`Unrecognized studio subgroup: ${maybeSubgroup}`);
      }

      return {
        ...config,
        groupTitleHe: groupConfig.groupTitleHe,
        groupSlug: groupConfig.groupSlug,
        groupOrder: groupConfig.groupOrder,
      };
    }

    return {
      ...config,
      groupTitleHe: config.sectionTitleHe,
      groupSlug: config.sectionSlug,
      groupOrder: 1,
    };
  }

  const secondLevel = pathParts[1];
  const tammyConfig = tammySectionConfig[secondLevel];
  if (!tammyConfig) {
    throw new Error(`Unrecognized Tammy/Ronen section: ${secondLevel}`);
  }

  if (secondLevel === "אודות תמי ורונן") {
    return {
      page: "tammyRonen",
      pageSlug: "tammy-ronen",
      ...tammyConfig,
      groupTitleHe: tammyConfig.sectionTitleHe,
      groupSlug: "about",
      groupOrder: 1,
    };
  }

  const workTitleHe = pathParts[2];
  if (!workTitleHe) {
    throw new Error(`Missing work folder under ${secondLevel}`);
  }

  const groupSlug =
    secondLevel === "רפרטואר"
      ? repertoireGroupSlugs[workTitleHe]
      : previousWorksGroupSlugs[workTitleHe];

  if (!groupSlug) {
    throw new Error(`Missing slug mapping for work folder: ${workTitleHe}`);
  }

  return {
    page: "tammyRonen",
    pageSlug: "tammy-ronen",
    ...tammyConfig,
    groupTitleHe: workTitleHe,
    groupSlug,
    groupOrder: 0,
  };
}

function buildGroupCatalog(preparedFiles) {
  const groups = new Map();

  for (const file of preparedFiles) {
    const groupKey = `${file.page}::${file.section}::${file.groupSlug}`;
    const existingGroup = groups.get(groupKey);

    if (existingGroup) {
      existingGroup.files.push(file);
      continue;
    }

    groups.set(groupKey, {
      key: groupKey,
      page: file.page,
      pageSlug: file.pageSlug,
      section: file.section,
      sectionSlug: file.sectionSlug,
      sectionTitleHe: file.sectionTitleHe,
      sectionOrder: sectionOrder[file.section],
      groupSlug: file.groupSlug,
      groupTitleHe: file.groupTitleHe,
      groupOrder: file.groupOrder,
      files: [file],
    });
  }

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      files: group.files.sort((left, right) => collator.compare(left.captionHe, right.captionHe)),
    }))
    .sort(compareGroups)
    .map((group, index, allGroups) => ({
      ...group,
      groupOrder:
        group.groupOrder > 0
          ? group.groupOrder
          : allGroups
              .filter((candidate) => candidate.page === group.page && candidate.section === group.section)
              .sort(compareGroups)
              .findIndex((candidate) => candidate.key === group.key) + 1,
    }));
}

function compareGroups(left, right) {
  if (left.page !== right.page) {
    return collator.compare(left.page, right.page);
  }
  if (left.sectionOrder !== right.sectionOrder) {
    return left.sectionOrder - right.sectionOrder;
  }
  if (left.groupOrder !== right.groupOrder && left.groupOrder > 0 && right.groupOrder > 0) {
    return left.groupOrder - right.groupOrder;
  }
  return collator.compare(left.groupTitleHe, right.groupTitleHe);
}

async function materializeAssets(groups) {
  await fs.rm(publicRoot, { recursive: true, force: true });
  await fs.mkdir(publicRoot, { recursive: true });

  const assets = [];

  for (const group of groups) {
    const featuredIndex = getFeaturedIndex(group.files);

    for (const [index, file] of group.files.entries()) {
      const assetOrder = index + 1;
      const usage = getUsage(group, file, index === featuredIndex);
      const destinationDir = path.join(
        publicRoot,
        group.pageSlug,
        group.sectionSlug,
        group.groupSlug,
      );
      const destinationFileName = `image-${String(assetOrder).padStart(2, "0")}${file.extension}`;
      const absoluteDestinationPath = path.join(destinationDir, destinationFileName);
      const publicSrc = toPublicSrc(absoluteDestinationPath);

      await fs.mkdir(destinationDir, { recursive: true });
      await fs.copyFile(file.filePath, absoluteDestinationPath);

      assets.push({
        id: `${group.page}-${group.section}-${group.groupSlug}-${String(assetOrder).padStart(2, "0")}`,
        page: group.page,
        section: group.section,
        sectionTitleHe: group.sectionTitleHe,
        sectionOrder: group.sectionOrder,
        group: group.groupSlug,
        groupTitleHe: group.groupTitleHe,
        groupOrder: group.groupOrder,
        titleHe: group.groupTitleHe,
        captionHe: file.captionHe,
        altHe: buildAlt(group.groupTitleHe, file.captionHe),
        order: assetOrder,
        featured: index === featuredIndex,
        src: publicSrc,
        sourcePath: file.relativePath.replaceAll("\\", "/"),
        usage,
      });
    }
  }

  return assets.sort(compareAssets);
}

function compareAssets(left, right) {
  if (left.page !== right.page) {
    return collator.compare(left.page, right.page);
  }
  if (left.sectionOrder !== right.sectionOrder) {
    return left.sectionOrder - right.sectionOrder;
  }
  if (left.groupOrder !== right.groupOrder) {
    return left.groupOrder - right.groupOrder;
  }
  return left.order - right.order;
}

function getFeaturedIndex(files) {
  const scored = files.map((file, index) => ({ index, score: getFeatureScore(file.captionHe) }));
  const best = scored.sort((left, right) => right.score - left.score)[0];
  return best.score > 0 ? best.index : 0;
}

function getFeatureScore(captionHe) {
  const rules = [
    { pattern: "תמונה ראשית", score: 100 },
    { pattern: "פורטרט", score: 90 },
    { pattern: "החלונות", score: 80 },
    { pattern: "סולו", score: 60 },
  ];

  let score = 0;
  for (const rule of rules) {
    if (captionHe.includes(rule.pattern)) {
      score += rule.score;
    }
  }
  return score;
}

function getUsage(group, file, isFeatured) {
  if (group.page === "home") {
    return "partnerFeature";
  }

  if (group.page === "studio" && group.groupSlug === "main-studio" && isFeatured) {
    return "studioHero";
  }

  if (group.page === "residency" && isFeatured) {
    return "residencyHero";
  }

  if (group.page === "tammyRonen" && group.section === "about") {
    if (file.captionHe.startsWith("פורטרט תמי")) {
      return "tammyProfile";
    }
    if (file.captionHe.startsWith("רונן פורטרט")) {
      return "ronenProfile";
    }
  }

  return null;
}

function buildAlt(groupTitleHe, captionHe) {
  if (groupTitleHe === captionHe) {
    return groupTitleHe;
  }
  return `${groupTitleHe} - ${captionHe}`;
}

async function detectExtension(filePath) {
  const currentExtension = path.extname(filePath).toLowerCase();
  if (currentExtension) {
    return currentExtension;
  }

  const fileHandle = await fs.open(filePath, "r");
  const buffer = Buffer.alloc(12);

  try {
    await fileHandle.read(buffer, 0, 12, 0);
  } finally {
    await fileHandle.close();
  }

  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return ".webp";
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    return ".jpg";
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return ".png";
  }

  throw new Error(`Unsupported extensionless asset: ${filePath}`);
}

function cleanLabel(value) {
  return value.replaceAll("_", " ").replace(/\s+/g, " ").trim();
}

function toPublicSrc(absoluteDestinationPath) {
  const relativeToPublic = path.relative(path.join(repoRoot, "public"), absoluteDestinationPath);
  return `/${relativeToPublic.replaceAll("\\", "/")}`;
}

function validateCounts(assets) {
  const expectedCounts = {
    total: 103,
    studioArchive: 13,
    residencyLead: 1,
    partners: 1,
    about: 6,
    repertoire: 12,
    previousWorks: 70,
  };

  const actualCounts = assets.reduce(
    (accumulator, asset) => {
      accumulator.total += 1;
      accumulator[asset.section] = (accumulator[asset.section] ?? 0) + 1;
      return accumulator;
    },
    { total: 0 },
  );

  for (const [key, expectedValue] of Object.entries(expectedCounts)) {
    const actualValue = actualCounts[key] ?? 0;
    if (actualValue !== expectedValue) {
      throw new Error(`Count mismatch for ${key}: expected ${expectedValue}, received ${actualValue}`);
    }
  }
}

async function writeManifest(assets) {
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });

  const manifestSource = `export type SiteImagePage = "home" | "studio" | "residency" | "tammyRonen";
export type SiteImageSection =
  | "partners"
  | "studioArchive"
  | "residencyLead"
  | "about"
  | "repertoire"
  | "previousWorks";
export type SiteImageUsage =
  | "partnerFeature"
  | "studioHero"
  | "residencyHero"
  | "tammyProfile"
  | "ronenProfile"
  | null;

export interface SiteImageAsset {
  id: string;
  page: SiteImagePage;
  section: SiteImageSection;
  sectionTitleHe: string;
  sectionOrder: number;
  group: string;
  groupTitleHe: string;
  groupOrder: number;
  titleHe: string;
  captionHe: string;
  altHe: string;
  order: number;
  featured: boolean;
  src: string;
  sourcePath: string;
  usage: SiteImageUsage;
}

export interface ImageGroup {
  id: string;
  page: SiteImagePage;
  section: SiteImageSection;
  sectionTitleHe: string;
  titleHe: string;
  slug: string;
  order: number;
  imageCount: number;
  featuredAsset: SiteImageAsset;
  assets: SiteImageAsset[];
}

export const siteImages: SiteImageAsset[] = ${JSON.stringify(assets, null, 2)};

export const imageGroups: ImageGroup[] = Object.values(
  siteImages.reduce<Record<string, ImageGroup>>((accumulator, asset) => {
    const existingGroup = accumulator[asset.group];

    if (existingGroup) {
      existingGroup.assets.push(asset);
      existingGroup.imageCount += 1;
      if (asset.featured) {
        existingGroup.featuredAsset = asset;
      }
      return accumulator;
    }

    accumulator[asset.group] = {
      id: asset.group,
      page: asset.page,
      section: asset.section,
      sectionTitleHe: asset.sectionTitleHe,
      titleHe: asset.groupTitleHe,
      slug: asset.group,
      order: asset.groupOrder,
      imageCount: 1,
      featuredAsset: asset,
      assets: [asset],
    };

    return accumulator;
  }, {}),
).map((group) => ({
  ...group,
  assets: group.assets.sort((left, right) => left.order - right.order),
})).sort((left, right) => {
  if (left.page !== right.page) {
    return left.page.localeCompare(right.page);
  }
  if (left.section !== right.section) {
    return left.section.localeCompare(right.section);
  }
  if (left.order !== right.order) {
    return left.order - right.order;
  }
  return left.titleHe.localeCompare(right.titleHe, "he");
});

export const siteImageCounts = siteImages.reduce<Record<string, number>>((accumulator, asset) => {
  accumulator.total = (accumulator.total ?? 0) + 1;
  accumulator[asset.section] = (accumulator[asset.section] ?? 0) + 1;
  return accumulator;
}, {});

export function getGroupsBySection(page: SiteImagePage, section: SiteImageSection) {
  return imageGroups.filter((group) => group.page === page && group.section === section);
}

export function getAssetsBySection(page: SiteImagePage, section: SiteImageSection) {
  return siteImages.filter((asset) => asset.page === page && asset.section === section);
}

export function getAssetByUsage(usage: NonNullable<SiteImageUsage>) {
  return siteImages.find((asset) => asset.usage === usage) ?? null;
}
`;

  await fs.writeFile(manifestPath, manifestSource, "utf8");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
