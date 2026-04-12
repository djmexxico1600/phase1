/**
 * @file seed.ts
 * @description Database seed script — creates realistic initial data for development.
 * Run with: pnpm db:seed
 */
import { db } from "./client";
import { users } from "./schema/users";
import { beats } from "./schema/beats";
import { licenses } from "./schema/licenses";
import { transactions } from "./schema/transactions";
import { tags, beatTags } from "./schema/tags";
import { follows } from "./schema/follows";
import { notifications } from "./schema/notifications";
import { subscriptions } from "./schema/subscriptions";

// ---------------------------------------------------------------------------
// Seed data constants
// ---------------------------------------------------------------------------

const ADMIN_ID = "00000000-0000-0000-0000-000000000001";
const PRODUCER_1_ID = "00000000-0000-0000-0000-000000000002";
const PRODUCER_2_ID = "00000000-0000-0000-0000-000000000003";
const PRODUCER_3_ID = "00000000-0000-0000-0000-000000000004";
const BUYER_1_ID = "00000000-0000-0000-0000-000000000005";
const BUYER_2_ID = "00000000-0000-0000-0000-000000000006";
const BUYER_3_ID = "00000000-0000-0000-0000-000000000007";
const BUYER_4_ID = "00000000-0000-0000-0000-000000000008";
const BUYER_5_ID = "00000000-0000-0000-0000-000000000009";

const BEAT_1_ID = "10000000-0000-0000-0000-000000000001";
const BEAT_2_ID = "10000000-0000-0000-0000-000000000002";
const BEAT_3_ID = "10000000-0000-0000-0000-000000000003";
const BEAT_4_ID = "10000000-0000-0000-0000-000000000004";
const BEAT_5_ID = "10000000-0000-0000-0000-000000000005";
const BEAT_6_ID = "10000000-0000-0000-0000-000000000006";
const BEAT_7_ID = "10000000-0000-0000-0000-000000000007";
const BEAT_8_ID = "10000000-0000-0000-0000-000000000008";
const BEAT_9_ID = "10000000-0000-0000-0000-000000000009";
const BEAT_10_ID = "10000000-0000-0000-0000-000000000010";

const TAG_1_ID = "20000000-0000-0000-0000-000000000001";
const TAG_2_ID = "20000000-0000-0000-0000-000000000002";
const TAG_3_ID = "20000000-0000-0000-0000-000000000003";
const TAG_4_ID = "20000000-0000-0000-0000-000000000004";
const TAG_5_ID = "20000000-0000-0000-0000-000000000005";

// ---------------------------------------------------------------------------
// Seed functions
// ---------------------------------------------------------------------------

async function seedTags() {
  console.log("Seeding tags...");
  await db
    .insert(tags)
    .values([
      {
        id: TAG_1_ID,
        name: "Hard Trap",
        slug: "hard-trap",
        category: "genre",
        description: "Heavy 808s and distorted hi-hats",
        usageCount: 0,
      },
      {
        id: TAG_2_ID,
        name: "Dark Melodic",
        slug: "dark-melodic",
        category: "mood",
        description: "Melancholic melodies with dark undertones",
        usageCount: 0,
      },
      {
        id: TAG_3_ID,
        name: "Piano",
        slug: "piano",
        category: "instrument",
        description: "Piano-driven compositions",
        usageCount: 0,
      },
      {
        id: TAG_4_ID,
        name: "Boom Bap",
        slug: "boom-bap",
        category: "genre",
        description: "Classic NYC hip-hop drum patterns",
        usageCount: 0,
      },
      {
        id: TAG_5_ID,
        name: "Afro Drill",
        slug: "afro-drill",
        category: "genre",
        description: "UK Drill fused with Afrobeats melodies",
        usageCount: 0,
      },
    ])
    .onConflictDoNothing();
  console.log("Tags seeded.");
}

async function seedUsers() {
  console.log("Seeding users...");
  await db
    .insert(users)
    .values([
      // Admin
      {
        id: ADMIN_ID,
        email: "admin@beatforge.io",
        emailVerified: true,
        name: "BeatForge Admin",
        username: "admin",
        role: "admin",
        avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=BeatForge",
        isActive: true,
        isBanned: false,
        verificationStatus: "verified",
        humanMadeBadge: false,
        totalEarnings: "0.00",
        pendingEarnings: "0.00",
        followerCount: 0,
        followingCount: 0,
        beatCount: 0,
        totalSales: 0,
      },
      // Producer 1 — main producer with human-made badge
      {
        id: PRODUCER_1_ID,
        email: "dj.phantom@beatforge.io",
        emailVerified: true,
        name: "Marcus Williams",
        username: "djphantom",
        displayName: "DJ Phantom",
        role: "producer",
        avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=djphantom",
        bannerUrl: null,
        bio: "Multi-platinum producer from Atlanta. Crafting authentic human-made beats since 2015. Trap, Hip-Hop, and everything in between.",
        websiteUrl: "https://djphantom.com",
        twitterHandle: "djphantombeats",
        instagramHandle: "djphantombeats",
        verificationStatus: "verified",
        humanMadeBadge: true,
        humanMadeBadgeGrantedAt: new Date("2024-01-15"),
        stripeAccountId: "acct_test_phantom001",
        totalEarnings: "12450.00",
        pendingEarnings: "1200.00",
        followerCount: 4820,
        followingCount: 112,
        beatCount: 4,
        totalSales: 287,
        isActive: true,
        isBanned: false,
      },
      // Producer 2 — international producer
      {
        id: PRODUCER_2_ID,
        email: "soulcraft@beatforge.io",
        emailVerified: true,
        name: "Amara Diallo",
        username: "soulcraft",
        displayName: "SoulCraft",
        role: "producer",
        avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=soulcraft",
        bannerUrl: null,
        bio: "Afrobeats & R&B specialist from Lagos. Fusing West African rhythms with contemporary production. Human-made, soul-infused.",
        websiteUrl: "https://soulcraftbeats.com",
        twitterHandle: "soulcraftbeats",
        instagramHandle: "soulcraftproducer",
        verificationStatus: "verified",
        humanMadeBadge: true,
        humanMadeBadgeGrantedAt: new Date("2024-03-20"),
        stripeAccountId: "acct_test_soulcraft002",
        totalEarnings: "8930.00",
        pendingEarnings: "750.00",
        followerCount: 3100,
        followingCount: 89,
        beatCount: 3,
        totalSales: 198,
        isActive: true,
        isBanned: false,
      },
      // Producer 3 — newer producer, pending verification
      {
        id: PRODUCER_3_ID,
        email: "midnight.wav@beatforge.io",
        emailVerified: true,
        name: "Tyler Chen",
        username: "midnightwav",
        displayName: "MIDNIGHT.WAV",
        role: "producer",
        avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=midnightwav",
        bannerUrl: null,
        bio: "Dark melodic trap and drill from Los Angeles. Every beat is handcrafted — no loops, no presets.",
        twitterHandle: "midnightwav",
        instagramHandle: "midnightwav",
        verificationStatus: "pending",
        verificationRequestedAt: new Date("2024-06-01"),
        humanMadeBadge: false,
        stripeAccountId: "acct_test_midnight003",
        totalEarnings: "2100.00",
        pendingEarnings: "400.00",
        followerCount: 890,
        followingCount: 45,
        beatCount: 3,
        totalSales: 67,
        isActive: true,
        isBanned: false,
      },
      // Buyers
      {
        id: BUYER_1_ID,
        email: "artist.kendall@email.com",
        emailVerified: true,
        name: "Kendall Moore",
        username: "kendallmoore",
        role: "buyer",
        avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=kendall",
        isActive: true,
        isBanned: false,
        verificationStatus: "unverified",
        humanMadeBadge: false,
        totalEarnings: "0.00",
        pendingEarnings: "0.00",
        followerCount: 0,
        followingCount: 3,
        beatCount: 0,
        totalSales: 0,
      },
      {
        id: BUYER_2_ID,
        email: "rap.jay@email.com",
        emailVerified: true,
        name: "Jay Thompson",
        username: "jayT",
        role: "buyer",
        avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=jay",
        isActive: true,
        isBanned: false,
        verificationStatus: "unverified",
        humanMadeBadge: false,
        totalEarnings: "0.00",
        pendingEarnings: "0.00",
        followerCount: 0,
        followingCount: 2,
        beatCount: 0,
        totalSales: 0,
      },
      {
        id: BUYER_3_ID,
        email: "singer.mia@email.com",
        emailVerified: true,
        name: "Mia Santos",
        username: "miasantos",
        role: "buyer",
        avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=mia",
        isActive: true,
        isBanned: false,
        verificationStatus: "unverified",
        humanMadeBadge: false,
        totalEarnings: "0.00",
        pendingEarnings: "0.00",
        followerCount: 0,
        followingCount: 1,
        beatCount: 0,
        totalSales: 0,
      },
      {
        id: BUYER_4_ID,
        email: "producer.alex@email.com",
        emailVerified: false,
        name: "Alex Rivera",
        username: "alexrivera",
        role: "buyer",
        avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=alex",
        isActive: true,
        isBanned: false,
        verificationStatus: "unverified",
        humanMadeBadge: false,
        totalEarnings: "0.00",
        pendingEarnings: "0.00",
        followerCount: 0,
        followingCount: 0,
        beatCount: 0,
        totalSales: 0,
      },
      {
        id: BUYER_5_ID,
        email: "rapper.omar@email.com",
        emailVerified: true,
        name: "Omar Jackson",
        username: "omarjackson",
        role: "buyer",
        avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=omar",
        isActive: true,
        isBanned: false,
        verificationStatus: "unverified",
        humanMadeBadge: false,
        totalEarnings: "0.00",
        pendingEarnings: "0.00",
        followerCount: 0,
        followingCount: 2,
        beatCount: 0,
        totalSales: 0,
      },
    ])
    .onConflictDoNothing();
  console.log("Users seeded.");
}

async function seedBeats() {
  console.log("Seeding beats...");
  const now = new Date();

  await db
    .insert(beats)
    .values([
      // Beat 1 — DJ Phantom, Trap
      {
        id: BEAT_1_ID,
        producerId: PRODUCER_1_ID,
        title: "Dark Matter",
        slug: "dark-matter-djphantom",
        description:
          "Hard-hitting trap banger with ominous synths and punishing 808s. Perfect for hard rap and drill records.",
        status: "published",
        previewFileKey: "previews/dark-matter-preview.mp3",
        audioFileKey: "audio/dark-matter-full.wav",
        coverArtKey: "covers/dark-matter.jpg",
        bpm: 140,
        key: "a_minor",
        genre: "trap",
        mood: "dark",
        durationSeconds: 178,
        isHumanMade: true,
        humanMadeVerifiedAt: new Date("2024-02-01"),
        humanMadeVerifiedBy: ADMIN_ID,
        aiDetectionScore: 0.03,
        aiDetectionRunAt: new Date("2024-02-01"),
        playCount: 14200,
        likeCount: 892,
        salesCount: 78,
        lowestPrice: "29.99",
        isFeatured: true,
        isExclusive: false,
        publishedAt: new Date("2024-02-01"),
        tagIds: [TAG_1_ID, TAG_2_ID],
        metaTitle: "Dark Matter — Hard Trap Beat by DJ Phantom",
        metaDescription:
          "Dark Matter is a hard trap beat with heavy 808s and dark synths by DJ Phantom. Available for lease or exclusive.",
        createdAt: new Date("2024-01-28"),
        updatedAt: now,
      },
      // Beat 2 — DJ Phantom, Hip Hop
      {
        id: BEAT_2_ID,
        producerId: PRODUCER_1_ID,
        title: "Golden Era",
        slug: "golden-era-djphantom",
        description:
          "Boom bap classic with soulful samples, crisp snares, and tight hi-hats. A love letter to the golden age of hip-hop.",
        status: "published",
        previewFileKey: "previews/golden-era-preview.mp3",
        audioFileKey: "audio/golden-era-full.wav",
        coverArtKey: "covers/golden-era.jpg",
        bpm: 92,
        key: "f_major",
        genre: "hip_hop",
        mood: "motivational",
        durationSeconds: 204,
        isHumanMade: true,
        humanMadeVerifiedAt: new Date("2024-03-01"),
        humanMadeVerifiedBy: ADMIN_ID,
        aiDetectionScore: 0.01,
        aiDetectionRunAt: new Date("2024-03-01"),
        playCount: 8900,
        likeCount: 601,
        salesCount: 45,
        lowestPrice: "29.99",
        isFeatured: false,
        isExclusive: false,
        publishedAt: new Date("2024-03-01"),
        tagIds: [TAG_4_ID, TAG_3_ID],
        metaTitle: "Golden Era — Boom Bap Hip-Hop Beat by DJ Phantom",
        metaDescription:
          "A soulful boom bap beat with classic hip-hop energy. Produced by DJ Phantom.",
        createdAt: new Date("2024-02-25"),
        updatedAt: now,
      },
      // Beat 3 — DJ Phantom, Drill
      {
        id: BEAT_3_ID,
        producerId: PRODUCER_1_ID,
        title: "Infrared",
        slug: "infrared-djphantom",
        description:
          "UK Drill-influenced banger with sliding 808s and ominous melodies. Ready for street anthems.",
        status: "published",
        previewFileKey: "previews/infrared-preview.mp3",
        audioFileKey: "audio/infrared-full.wav",
        coverArtKey: "covers/infrared.jpg",
        bpm: 144,
        key: "g_minor",
        genre: "drill",
        mood: "aggressive",
        durationSeconds: 192,
        isHumanMade: true,
        humanMadeVerifiedAt: new Date("2024-04-15"),
        humanMadeVerifiedBy: ADMIN_ID,
        aiDetectionScore: 0.02,
        aiDetectionRunAt: new Date("2024-04-15"),
        playCount: 11400,
        likeCount: 742,
        salesCount: 62,
        lowestPrice: "34.99",
        isFeatured: true,
        isExclusive: false,
        publishedAt: new Date("2024-04-15"),
        tagIds: [TAG_1_ID],
        createdAt: new Date("2024-04-10"),
        updatedAt: now,
      },
      // Beat 4 — DJ Phantom, RnB (draft)
      {
        id: BEAT_4_ID,
        producerId: PRODUCER_1_ID,
        title: "Velvet Nights",
        slug: "velvet-nights-djphantom",
        description: "Smooth R&B production with lush chords and silky melodies.",
        status: "draft",
        bpm: 78,
        key: "e_major",
        genre: "rnb",
        mood: "romantic",
        durationSeconds: 215,
        isHumanMade: true,
        playCount: 0,
        likeCount: 0,
        salesCount: 0,
        lowestPrice: "39.99",
        isFeatured: false,
        isExclusive: false,
        createdAt: new Date("2024-05-01"),
        updatedAt: now,
      },
      // Beat 5 — SoulCraft, Afrobeats
      {
        id: BEAT_5_ID,
        producerId: PRODUCER_2_ID,
        title: "Lagos Nights",
        slug: "lagos-nights-soulcraft",
        description:
          "Infectious Afrobeats groove with live percussion, kora samples, and irresistible energy. Straight from Lagos.",
        status: "published",
        previewFileKey: "previews/lagos-nights-preview.mp3",
        audioFileKey: "audio/lagos-nights-full.wav",
        coverArtKey: "covers/lagos-nights.jpg",
        bpm: 104,
        key: "d_major",
        genre: "afrobeats",
        mood: "happy",
        durationSeconds: 220,
        isHumanMade: true,
        humanMadeVerifiedAt: new Date("2024-04-20"),
        humanMadeVerifiedBy: ADMIN_ID,
        aiDetectionScore: 0.04,
        aiDetectionRunAt: new Date("2024-04-20"),
        playCount: 19800,
        likeCount: 1340,
        salesCount: 89,
        lowestPrice: "29.99",
        isFeatured: true,
        isExclusive: false,
        publishedAt: new Date("2024-04-20"),
        tagIds: [TAG_5_ID],
        metaTitle: "Lagos Nights — Afrobeats Beat by SoulCraft",
        metaDescription:
          "Authentic Afrobeats production with live percussion and kora samples by SoulCraft.",
        createdAt: new Date("2024-04-15"),
        updatedAt: now,
      },
      // Beat 6 — SoulCraft, RnB
      {
        id: BEAT_6_ID,
        producerId: PRODUCER_2_ID,
        title: "Midnight Soul",
        slug: "midnight-soul-soulcraft",
        description:
          "Late-night R&B with warm chord progressions, Rhodes piano, and smooth bass lines.",
        status: "published",
        previewFileKey: "previews/midnight-soul-preview.mp3",
        audioFileKey: "audio/midnight-soul-full.wav",
        coverArtKey: "covers/midnight-soul.jpg",
        bpm: 84,
        key: "b_flat_major" as unknown as "b_major",
        genre: "rnb",
        mood: "romantic",
        durationSeconds: 195,
        isHumanMade: true,
        humanMadeVerifiedAt: new Date("2024-05-05"),
        humanMadeVerifiedBy: ADMIN_ID,
        aiDetectionScore: 0.02,
        aiDetectionRunAt: new Date("2024-05-05"),
        playCount: 7600,
        likeCount: 512,
        salesCount: 43,
        lowestPrice: "29.99",
        isFeatured: false,
        isExclusive: false,
        publishedAt: new Date("2024-05-05"),
        tagIds: [TAG_3_ID],
        createdAt: new Date("2024-05-01"),
        updatedAt: now,
      },
      // Beat 7 — SoulCraft, Dancehall
      {
        id: BEAT_7_ID,
        producerId: PRODUCER_2_ID,
        title: "Kingston Riddim",
        slug: "kingston-riddim-soulcraft",
        description:
          "Authentic dancehall riddim with syncopated rhythms and vibrant Caribbean flavor.",
        status: "published",
        previewFileKey: "previews/kingston-riddim-preview.mp3",
        audioFileKey: "audio/kingston-riddim-full.wav",
        coverArtKey: "covers/kingston-riddim.jpg",
        bpm: 96,
        key: "g_major",
        genre: "dancehall",
        mood: "happy",
        durationSeconds: 188,
        isHumanMade: true,
        humanMadeVerifiedAt: new Date("2024-05-20"),
        humanMadeVerifiedBy: ADMIN_ID,
        aiDetectionScore: 0.01,
        aiDetectionRunAt: new Date("2024-05-20"),
        playCount: 6100,
        likeCount: 398,
        salesCount: 31,
        lowestPrice: "24.99",
        isFeatured: false,
        isExclusive: false,
        publishedAt: new Date("2024-05-20"),
        tagIds: [],
        createdAt: new Date("2024-05-15"),
        updatedAt: now,
      },
      // Beat 8 — MIDNIGHT.WAV, Dark Trap
      {
        id: BEAT_8_ID,
        producerId: PRODUCER_3_ID,
        title: "Void",
        slug: "void-midnightwav",
        description:
          "Atmospheric dark trap with layered pads, haunting melodies, and deep 808 sub-bass.",
        status: "published",
        previewFileKey: "previews/void-preview.mp3",
        audioFileKey: "audio/void-full.wav",
        coverArtKey: "covers/void.jpg",
        bpm: 138,
        key: "c_minor",
        genre: "trap",
        mood: "dark",
        durationSeconds: 168,
        isHumanMade: false,
        aiDetectionScore: 0.12,
        aiDetectionRunAt: new Date("2024-05-25"),
        playCount: 4200,
        likeCount: 267,
        salesCount: 19,
        lowestPrice: "19.99",
        isFeatured: false,
        isExclusive: false,
        publishedAt: new Date("2024-05-25"),
        tagIds: [TAG_2_ID],
        createdAt: new Date("2024-05-20"),
        updatedAt: now,
      },
      // Beat 9 — MIDNIGHT.WAV, Drill
      {
        id: BEAT_9_ID,
        producerId: PRODUCER_3_ID,
        title: "Cold Blooded",
        slug: "cold-blooded-midnightwav",
        description:
          "Ice-cold drill beat with UK influences, sliding bass, and calculated aggression.",
        status: "published",
        previewFileKey: "previews/cold-blooded-preview.mp3",
        audioFileKey: "audio/cold-blooded-full.wav",
        coverArtKey: "covers/cold-blooded.jpg",
        bpm: 142,
        key: "d_minor",
        genre: "drill",
        mood: "aggressive",
        durationSeconds: 175,
        isHumanMade: false,
        aiDetectionScore: 0.08,
        aiDetectionRunAt: new Date("2024-06-01"),
        playCount: 3800,
        likeCount: 224,
        salesCount: 28,
        lowestPrice: "19.99",
        isFeatured: false,
        isExclusive: false,
        publishedAt: new Date("2024-06-01"),
        tagIds: [TAG_1_ID],
        createdAt: new Date("2024-05-27"),
        updatedAt: now,
      },
      // Beat 10 — MIDNIGHT.WAV, Electronic (free)
      {
        id: BEAT_10_ID,
        producerId: PRODUCER_3_ID,
        title: "Signal Lost",
        slug: "signal-lost-midnightwav",
        description:
          "Free electronic beat to showcase my style. Glitchy textures and hypnotic grooves.",
        status: "published",
        previewFileKey: "previews/signal-lost-preview.mp3",
        audioFileKey: "audio/signal-lost-full.wav",
        coverArtKey: "covers/signal-lost.jpg",
        bpm: 120,
        key: "f_sharp_minor",
        genre: "electronic",
        mood: "mysterious",
        durationSeconds: 210,
        isHumanMade: false,
        aiDetectionScore: 0.15,
        aiDetectionRunAt: new Date("2024-06-05"),
        playCount: 2100,
        likeCount: 145,
        salesCount: 0,
        lowestPrice: "0.00",
        isFeatured: false,
        isFree: true,
        allowedForFreeDownload: true,
        isExclusive: false,
        publishedAt: new Date("2024-06-05"),
        tagIds: [],
        createdAt: new Date("2024-06-02"),
        updatedAt: now,
      },
    ])
    .onConflictDoNothing();
  console.log("Beats seeded.");
}

async function seedLicenses() {
  console.log("Seeding licenses...");

  const beatIds = [
    BEAT_1_ID, BEAT_2_ID, BEAT_3_ID,
    BEAT_5_ID, BEAT_6_ID, BEAT_7_ID,
    BEAT_8_ID, BEAT_9_ID,
  ];

  // Standard license tiers for each beat
  const licenseRows = beatIds.flatMap((beatId) => {
    const isAffordable = [BEAT_7_ID, BEAT_8_ID, BEAT_9_ID].includes(beatId);
    const basePrice = isAffordable ? "19.99" : "29.99";
    const premiumPrice = isAffordable ? "34.99" : "49.99";
    const trackoutPrice = isAffordable ? "79.99" : "99.99";
    const exclusivePrice = isAffordable ? "199.99" : "299.99";

    return [
      {
        beatId,
        type: "basic" as const,
        name: "Basic Lease (MP3)",
        price: basePrice,
        includesMp3: true,
        includesWav: false,
        includesStems: false,
        distributionLimit: 2000,
        audioStreamsLimit: 100000,
        musicVideoLimit: 1,
        broadcastingRightsIncluded: false,
        profitLimit: "5000.00",
        isAvailable: true,
      },
      {
        beatId,
        type: "premium" as const,
        name: "Premium Lease (WAV)",
        price: premiumPrice,
        includesMp3: true,
        includesWav: true,
        includesStems: false,
        distributionLimit: 10000,
        audioStreamsLimit: 500000,
        musicVideoLimit: 1,
        broadcastingRightsIncluded: false,
        profitLimit: "25000.00",
        isAvailable: true,
      },
      {
        beatId,
        type: "trackout" as const,
        name: "Trackout Lease (WAV + Stems)",
        price: trackoutPrice,
        includesMp3: true,
        includesWav: true,
        includesStems: true,
        distributionLimit: 50000,
        audioStreamsLimit: null,
        musicVideoLimit: 1,
        broadcastingRightsIncluded: true,
        profitLimit: null,
        isAvailable: true,
      },
      {
        beatId,
        type: "exclusive" as const,
        name: "Exclusive Rights",
        price: exclusivePrice,
        includesMp3: true,
        includesWav: true,
        includesStems: true,
        distributionLimit: null,
        audioStreamsLimit: null,
        musicVideoLimit: null,
        broadcastingRightsIncluded: true,
        profitLimit: null,
        isAvailable: true,
      },
    ];
  });

  // Free beat license
  licenseRows.push({
    beatId: BEAT_10_ID,
    type: "basic" as const,
    name: "Free Download",
    price: "0.00",
    includesMp3: true,
    includesWav: false,
    includesStems: false,
    distributionLimit: 500,
    audioStreamsLimit: 10000,
    musicVideoLimit: 0,
    broadcastingRightsIncluded: false,
    profitLimit: "0.00",
    isAvailable: true,
  });

  await db.insert(licenses).values(licenseRows).onConflictDoNothing();
  console.log("Licenses seeded.");
}

async function seedTransactions() {
  console.log("Seeding transactions...");

  await db
    .insert(transactions)
    .values([
      // Kendall buys Dark Matter basic lease
      {
        buyerId: BUYER_1_ID,
        producerId: PRODUCER_1_ID,
        beatId: BEAT_1_ID,
        type: "lease_purchase",
        status: "completed",
        amount: "29.99",
        platformFee: "4.50",
        producerEarnings: "25.49",
        currency: "usd",
        stripePaymentIntentId: "pi_seed_001",
        stripeCheckoutSessionId: "cs_seed_001",
        completedAt: new Date("2024-02-10"),
        createdAt: new Date("2024-02-10"),
        updatedAt: new Date("2024-02-10"),
      },
      // Jay buys Lagos Nights premium lease
      {
        buyerId: BUYER_2_ID,
        producerId: PRODUCER_2_ID,
        beatId: BEAT_5_ID,
        type: "lease_purchase",
        status: "completed",
        amount: "49.99",
        platformFee: "7.50",
        producerEarnings: "42.49",
        currency: "usd",
        stripePaymentIntentId: "pi_seed_002",
        stripeCheckoutSessionId: "cs_seed_002",
        completedAt: new Date("2024-05-01"),
        createdAt: new Date("2024-05-01"),
        updatedAt: new Date("2024-05-01"),
      },
      // Mia buys Midnight Soul trackout
      {
        buyerId: BUYER_3_ID,
        producerId: PRODUCER_2_ID,
        beatId: BEAT_6_ID,
        type: "lease_purchase",
        status: "completed",
        amount: "99.99",
        platformFee: "15.00",
        producerEarnings: "84.99",
        currency: "usd",
        stripePaymentIntentId: "pi_seed_003",
        stripeCheckoutSessionId: "cs_seed_003",
        completedAt: new Date("2024-05-12"),
        createdAt: new Date("2024-05-12"),
        updatedAt: new Date("2024-05-12"),
      },
      // Omar buys Infrared basic lease
      {
        buyerId: BUYER_5_ID,
        producerId: PRODUCER_1_ID,
        beatId: BEAT_3_ID,
        type: "lease_purchase",
        status: "completed",
        amount: "34.99",
        platformFee: "5.25",
        producerEarnings: "29.74",
        currency: "usd",
        stripePaymentIntentId: "pi_seed_004",
        stripeCheckoutSessionId: "cs_seed_004",
        completedAt: new Date("2024-04-20"),
        createdAt: new Date("2024-04-20"),
        updatedAt: new Date("2024-04-20"),
      },
      // Kendall buys Void basic lease
      {
        buyerId: BUYER_1_ID,
        producerId: PRODUCER_3_ID,
        beatId: BEAT_8_ID,
        type: "lease_purchase",
        status: "completed",
        amount: "19.99",
        platformFee: "3.00",
        producerEarnings: "16.99",
        currency: "usd",
        stripePaymentIntentId: "pi_seed_005",
        stripeCheckoutSessionId: "cs_seed_005",
        completedAt: new Date("2024-05-28"),
        createdAt: new Date("2024-05-28"),
        updatedAt: new Date("2024-05-28"),
      },
    ])
    .onConflictDoNothing();
  console.log("Transactions seeded.");
}

async function seedFollows() {
  console.log("Seeding follows...");

  await db
    .insert(follows)
    .values([
      { followerId: BUYER_1_ID, followingId: PRODUCER_1_ID },
      { followerId: BUYER_1_ID, followingId: PRODUCER_2_ID },
      { followerId: BUYER_2_ID, followingId: PRODUCER_1_ID },
      { followerId: BUYER_2_ID, followingId: PRODUCER_3_ID },
      { followerId: BUYER_3_ID, followingId: PRODUCER_2_ID },
      { followerId: BUYER_4_ID, followingId: PRODUCER_1_ID },
      { followerId: BUYER_5_ID, followingId: PRODUCER_1_ID },
      { followerId: BUYER_5_ID, followingId: PRODUCER_2_ID },
      { followerId: PRODUCER_2_ID, followingId: PRODUCER_1_ID },
      { followerId: PRODUCER_3_ID, followingId: PRODUCER_1_ID },
    ])
    .onConflictDoNothing();
  console.log("Follows seeded.");
}

async function seedNotifications() {
  console.log("Seeding notifications...");

  await db
    .insert(notifications)
    .values([
      {
        userId: PRODUCER_1_ID,
        type: "sale",
        title: "New sale!",
        body: "Kendall Moore purchased Dark Matter (Basic Lease) for $29.99",
        resourceType: "transaction",
        isRead: true,
        readAt: new Date("2024-02-10T12:00:00Z"),
        createdAt: new Date("2024-02-10T11:00:00Z"),
      },
      {
        userId: PRODUCER_1_ID,
        type: "follow",
        title: "New follower",
        body: "Jay Thompson started following you",
        resourceType: "user",
        resourceId: BUYER_2_ID,
        isRead: false,
        createdAt: new Date("2024-05-01T09:00:00Z"),
      },
      {
        userId: PRODUCER_2_ID,
        type: "sale",
        title: "New sale!",
        body: "Jay Thompson purchased Lagos Nights (Premium Lease) for $49.99",
        resourceType: "transaction",
        isRead: false,
        createdAt: new Date("2024-05-01T10:00:00Z"),
      },
      {
        userId: PRODUCER_3_ID,
        type: "system",
        title: "Verification under review",
        body: "Your identity verification request is being reviewed. We'll notify you within 3 business days.",
        isRead: false,
        createdAt: new Date("2024-06-02T08:00:00Z"),
      },
    ])
    .onConflictDoNothing();
  console.log("Notifications seeded.");
}

async function seedSubscriptions() {
  console.log("Seeding subscriptions...");

  await db
    .insert(subscriptions)
    .values([
      // Buyers on free plan (default - but create explicit records)
      {
        userId: BUYER_1_ID,
        plan: "free",
        status: "active",
        monthlyDownloadsLimit: 0,
        monthlyDownloadsUsed: 0,
      },
      {
        userId: BUYER_2_ID,
        plan: "pro",
        status: "active",
        stripeSubscriptionId: "sub_seed_buyer2",
        stripePriceId: "price_pro_monthly",
        stripeCustomerId: "cus_seed_buyer2",
        currentPeriodStart: new Date("2024-06-01"),
        currentPeriodEnd: new Date("2024-07-01"),
        monthlyDownloadsLimit: 5,
        monthlyDownloadsUsed: 2,
        downloadsResetAt: new Date("2024-07-01"),
      },
      {
        userId: BUYER_3_ID,
        plan: "unlimited",
        status: "active",
        stripeSubscriptionId: "sub_seed_buyer3",
        stripePriceId: "price_unlimited_monthly",
        stripeCustomerId: "cus_seed_buyer3",
        currentPeriodStart: new Date("2024-06-01"),
        currentPeriodEnd: new Date("2024-07-01"),
        monthlyDownloadsLimit: -1, // Unlimited represented as -1
        monthlyDownloadsUsed: 0,
        downloadsResetAt: new Date("2024-07-01"),
      },
    ])
    .onConflictDoNothing();
  console.log("Subscriptions seeded.");
}

async function seedBeatTags() {
  console.log("Seeding beat-tag associations...");

  await db
    .insert(beatTags)
    .values([
      { beatId: BEAT_1_ID, tagId: TAG_1_ID },
      { beatId: BEAT_1_ID, tagId: TAG_2_ID },
      { beatId: BEAT_2_ID, tagId: TAG_4_ID },
      { beatId: BEAT_2_ID, tagId: TAG_3_ID },
      { beatId: BEAT_3_ID, tagId: TAG_1_ID },
      { beatId: BEAT_5_ID, tagId: TAG_5_ID },
      { beatId: BEAT_6_ID, tagId: TAG_3_ID },
      { beatId: BEAT_8_ID, tagId: TAG_2_ID },
      { beatId: BEAT_9_ID, tagId: TAG_1_ID },
    ])
    .onConflictDoNothing();
  console.log("Beat-tag associations seeded.");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log("Starting database seed...\n");

  await seedTags();
  await seedUsers();
  await seedBeats();
  await seedLicenses();
  await seedTransactions();
  await seedFollows();
  await seedNotifications();
  await seedSubscriptions();
  await seedBeatTags();

  console.log("\nDatabase seed completed successfully!");
  process.exit(0);
}

main().catch((err: unknown) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
