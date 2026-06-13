import type { SocialCreativeData } from "../types/social.types";

export const socialCreativesMock: SocialCreativeData[] = [
  {
    courseId: "pku-barber",
    courseName: "Barber",
    brandKey: "kursy",
    offerMode: "stationary",
    imageKey: "pku-barber",
    imagePath: "/creative-stack/images/kursy/pku-barber.png",
    benefit: "Nauka praktyczna od pierwszych zajęć",
    priceLabel: "od 0 zł",
    startDateLabel: "Start: wrzesień",
    cityId: "poznan",
    cityName: "Poznań",
    enabledComponents: [
      "photo",
      "courseName",
      "benefit",
      "price",
      "startDate",
      "city",
      "brandLogo",
    ],
  },

  {
    courseId: "pku-programowanie-python-z-cisco-networking-academy",
    courseName: "Programowanie Python",
    brandKey: "kursy",
    offerMode: "online",
    offerModeLabel: "Nauka online",
    imageKey: "pku-programowanie-python-z-cisco-networking-academy",
    imagePath:
      "/creative-stack/images/kursy/pku-programowanie-python-z-cisco-networking-academy.png",
    benefit: "Praktyczna nauka programowania",
    priceLabel: "od 0 zł",
    startDateLabel: "Start: wrzesień",
    partner: {
      key: "cisco",
      name: "Cisco Networking Academy",
      logoPath: "/creative-stack/logos/partners/cisco.svg",
    },
    enabledComponents: [
      "photo",
      "courseName",
      "offerMode",
      "benefit",
      "price",
      "startDate",
      "partnerLogo",
      "brandLogo",
    ],
  },
];
