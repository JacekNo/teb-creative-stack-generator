import type { SocialCreativeData } from '../types/social.types';

export const socialCreativesMock: SocialCreativeData[] = [
  {
    courseId: 'pku-barber',
    courseName: 'Barber',
    brandKey: 'kursy',
    offerMode: 'stationary',
    imageKey: 'pku-barber',
    imagePath: '/creative-stack/images/kursy/pku-barber.png',

    /**
     * Legacy field kept temporarily for the current renderer.
     * Target renderer should use courseFacts/courseBadges instead.
     */
    benefit: 'Nauka praktyczna od pierwszych zajęć',

    courseFacts: [
      {
        id: 'duration',
        type: 'duration',
        value: '2 semestry',
        label: 'Czas trwania',
        icon: 'clock',
      },
    ],

    courseBadges: [
      {
        id: 'no-matura',
        label: 'Nie wymagamy matury!',
        tone: 'primary',
      },
      {
        id: 'popular',
        label: 'Popularne',
        tone: 'popular',
      },
    ],

    cityId: 'poznan',
    cityName: 'Poznań',

    enabledComponents: [
      'photo',
      'courseName',
      'benefit',
      'courseFacts',
      'courseBadges',
      'city',
      'brandLogo',
    ],
  },

  {
    courseId: 'pku-programowanie-python-z-cisco-networking-academy',
    courseName: 'Programowanie Python z Cisco Networking Academy ONLINE',
    brandKey: 'kursy',
    offerMode: 'online',
    offerModeLabel: 'Nauka online',
    imageKey: 'pku-programowanie-python-z-cisco-networking-academy',
    imagePath:
      '/creative-stack/images/kursy/pku-programowanie-python-z-cisco-networking-academy.png',

    /**
     * Legacy field kept temporarily for the current renderer.
     * Target renderer should use courseFacts/courseBadges instead.
     */
    benefit: 'Praktyczna nauka programowania',

    courseFacts: [
      {
        id: 'hours',
        type: 'hours',
        value: '188 godzin',
        label: '10 miesięcy kształcenia',
        icon: 'clock',
      },
      {
        id: 'schedule',
        type: 'schedule',
        value: 'Tryb weekendowy',
        label: 'Zajęcia online na żywo',
        icon: 'calendar',
      },
    ],

    courseBadges: [
      {
        id: 'no-matura',
        label: 'Nie wymagamy matury!',
        tone: 'primary',
      },
      {
        id: 'fast-start',
        label: 'Szybki START',
        tone: 'green',
      },
      {
        id: 'month',
        label: 'W SIERPNIU',
        tone: 'green',
      },
    ],

    partner: {
      key: 'cisco',
      name: 'Cisco Networking Academy',
      logoPath: '/creative-stack/logos/partners/cisco.svg',
    },

    enabledComponents: [
      'photo',
      'courseName',
      'offerMode',
      'benefit',
      'courseFacts',
      'courseBadges',
      'partnerLogo',
      'brandLogo',
    ],
  },
];
