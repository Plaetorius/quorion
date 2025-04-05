export interface Project {
  id: string
  name: string
  organizationName: string
  imageUrl: string
  adminAddresses: string[]
  validatorAddresses: string[]
  dataTypes: string[]
  requiredElements: number
  collectedElements: number
  totalPrizePool: number
  distributedPrizePool: number
  contactEmail: string
  description?: string
}

export const projects: Project[] = [
  {
    id: "clq1g5x0g0000156tqw2wjy3p",
    name: "Diabetes Monitoring Patterns",
    organizationName: "HealthTech Research Institute",
    imageUrl: "/images/projects/diabetes-monitoring.jpg",
    adminAddresses: ["0x8a7F7c5B9A8e3Aef8c6fAc5F6d5E2d3C1B2a1F0E", "0x7B6c5D4e3F2a1E0D9c8B7a6F5e4D3c2B1a0F9e8D"],
    validatorAddresses: [
      "0x6C5d4B3a2F1e0D9c8B7a6F5e4D3c2B1a0F9e8D7",
      "0x5D4c3B2a1F0e9D8c7B6a5F4e3D2c1B0a9F8e7D6",
      "0x4C3b2A1f0E9d8C7b6A5f4E3d2C1b0A9f8E7d6C5",
    ],
    dataTypes: ["Photos", "Forms"],
    requiredElements: 10000,
    collectedElements: 7823,
    totalPrizePool: 250000,
    distributedPrizePool: 195575,
    contactEmail: "research@healthtech.org",
    description:
      "This project aims to collect and analyze glucose monitoring patterns from diabetes patients to improve predictive algorithms for insulin management systems. Data collected will help develop more accurate and personalized treatment plans.",
  },
  {
    id: "clq1g5x0g0001156tqwzxjy3p",
    name: "Sleep Apnea Audio Analysis",
    organizationName: "NeuraSleep Labs",
    imageUrl: "/images/projects/sleep-apnea.jpg",
    adminAddresses: ["0x3B2a1F0e9D8c7B6a5F4e3D2c1B0a9F8e7D6c5B4", "0x2A1f0E9d8C7b6A5f4E3d2C1b0A9f8E7d6C5b4A3"],
    validatorAddresses: ["0x1F0e9D8c7B6a5F4e3D2c1B0a9F8e7D6c5B4a3F2", "0x0E9d8C7b6A5f4E3d2C1b0A9f8E7d6C5b4A3f2E1"],
    dataTypes: ["Audios", "Forms"],
    requiredElements: 5000,
    collectedElements: 4217,
    totalPrizePool: 175000,
    distributedPrizePool: 147595,
    contactEmail: "projects@neurasleep.io",
    description:
      "NeuraSleep Labs is collecting audio recordings of sleep patterns to develop advanced detection algorithms for sleep apnea. This non-invasive approach aims to make diagnosis more accessible and comfortable for patients worldwide.",
  },
  {
    id: "clq1g5x0g0002156tqw2wjy3p",
    name: "Dermatological Condition Database",
    organizationName: "Global Skin Health Foundation",
    imageUrl: "/images/projects/dermatology.jpg",
    adminAddresses: ["0x9D8c7B6a5F4e3D2c1B0a9F8e7D6c5B4a3F2e1D0", "0x8C7b6A5f4E3d2C1b0A9f8E7d6C5b4A3f2E1d0C9"],
    validatorAddresses: [
      "0x7B6a5F4e3D2c1B0a9F8e7D6c5B4a3F2e1D0c9B8",
      "0x6A5f4E3d2C1b0A9f8E7d6C5b4A3f2E1d0C9b8A7",
      "0x5F4e3D2c1B0a9F8e7D6c5B4a3F2e1D0c9B8a7F6",
    ],
    dataTypes: ["Photos", "Forms"],
    requiredElements: 20000,
    collectedElements: 8945,
    totalPrizePool: 300000,
    distributedPrizePool: 134175,
    contactEmail: "database@skinhealth.org",
    description:
      "This global initiative aims to build a comprehensive database of dermatological conditions across diverse skin types and ethnicities. The data will help develop more inclusive diagnostic tools and treatments for skin conditions worldwide.",
  },
  {
    id: "clq1g5x0g0003156tqw2wjy3p",
    name: "Cardiac Rehabilitation Monitoring",
    organizationName: "HeartTech Innovations",
    imageUrl: "/images/projects/cardiac-rehab.jpg",
    adminAddresses: ["0x4E3d2C1b0A9f8E7d6C5b4A3f2E1d0C9b8A7f6E5", "0x3D2c1B0a9F8e7D6c5B4a3F2e1D0c9B8a7F6e5D4"],
    validatorAddresses: ["0x2C1b0A9f8E7d6C5b4A3f2E1d0C9b8A7f6E5d4C3", "0x1B0a9F8e7D6c5B4a3F2e1D0c9B8a7F6e5D4c3B2"],
    dataTypes: ["Videos", "Forms"],
    requiredElements: 7500,
    collectedElements: 2134,
    totalPrizePool: 225000,
    distributedPrizePool: 64020,
    contactEmail: "rehab@hearttech.med",
    description:
      "HeartTech is collecting video data of cardiac rehabilitation exercises to develop AI-powered coaching systems for at-home recovery programs. This project aims to improve recovery outcomes and make rehabilitation more accessible.",
  },
  {
    id: "clq1g5x0g0004156tqw2wjy3p",
    name: "Neurological Response Patterns",
    organizationName: "BrainWave Research Consortium",
    imageUrl: "/images/projects/neuro-response.jpg",
    adminAddresses: ["0x0A9f8E7d6C5b4A3f2E1d0C9b8A7f6E5d4C3b2A1", "0xF8e7D6c5B4a3F2e1D0c9B8a7F6e5D4c3B2a1F0"],
    validatorAddresses: [
      "0xE7d6C5b4A3f2E1d0C9b8A7f6E5d4C3b2A1f0E9",
      "0xD6c5B4a3F2e1D0c9B8a7F6e5D4c3B2a1F0e9D8",
      "0xC5b4A3f2E1d0C9b8A7f6E5d4C3b2A1f0E9d8C7",
    ],
    dataTypes: ["Videos", "Audios", "Forms"],
    requiredElements: 15000,
    collectedElements: 3782,
    totalPrizePool: 400000,
    distributedPrizePool: 100853,
    contactEmail: "studies@brainwave.org",
    description:
      "This comprehensive study collects multimodal data to map neurological responses to various stimuli. The project aims to advance our understanding of brain function and develop new therapeutic approaches for neurological conditions.",
  },
]

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id)
}

