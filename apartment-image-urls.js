/**
 * Property image URLs for 6 Knoxville apartment communities
 * Collected from main pages, gallery, and amenities pages
 * High-quality property photos (exterior, interiors, amenities, common areas)
 */

const APARTMENT_IMAGES = {
  HUB_KNOXVILLE: [
    "https://hubknoxville.com/wp-content/uploads/2025/10/Hub-Knoxville-gallery-hero.webp",
    "https://hubknoxville.com/wp-content/uploads/2025/10/Hub-Knoxville-index-hero-1.webp",
    "https://hubknoxville.com/wp-content/uploads/2025/10/Hub-Knox_Gallery_Kitchen.webp",
    "https://hubknoxville.com/wp-content/uploads/2025/10/Hub-Knox_Gallery_Living-Space-2.webp",
    "https://hubknoxville.com/wp-content/uploads/2025/10/Hub-Knoxville-amenities-7.webp",
    "https://hubknoxville.com/wp-content/uploads/2025/10/Hub-Knox_Gallery_Lobby-2.webp",
  ],

  UNIVERSITY_WALK: [
    "https://universitywalkknox.com/wp-content/uploads/2025/10/Student_Quarters_University_Walk_01-scaled.jpg",
    "https://universitywalkknox.com/wp-content/uploads/2025/10/Student_Quarters_University_Walk_17-scaled.jpg",
    "https://universitywalkknox.com/wp-content/uploads/2025/10/Student_Quarters_University_Walk_11-scaled.jpg",
    "https://universitywalkknox.com/wp-content/uploads/2025/10/Student_Quarters_University_Walk_22-scaled.jpg",
    "https://universitywalkknox.com/wp-content/uploads/2025/10/568_14_Gallery_730x547.jpg",
  ],

  THE_KNOX_APARTMENTS: [
    "https://livetheknox.com/wp-content/uploads/2022/04/index-header-1600x800-c-default.jpg",
    "https://livetheknox.com/wp-content/uploads/2022/04/0000_Workout-1024x485-c-default.jpg",
    "https://livetheknox.com/wp-content/uploads/2022/04/0001_TV-Lounge-1024x485-c-default.jpg",
    "https://livetheknox.com/wp-content/uploads/2022/04/0002_Pool-Table-Dining-1024x485-c-default.jpg",
    "https://livetheknox.com/wp-content/uploads/2022/04/0006_Deck-3-1024x485-c-default.jpg",
  ],

  THE_STANDARD_AT_KNOXVILLE: [
    "https://www.thestandardatknoxville.com/wp-content/uploads/2023/07/Standard-at-Knoxville-gallery-hero.jpg",
    "https://www.thestandardatknoxville.com/wp-content/uploads/2023/07/Standard-at-Knoxville-community-gallery-15.jpg",
    "https://www.thestandardatknoxville.com/wp-content/uploads/2023/07/Standard-at-Knoxville-community-gallery-1.jpg",
    "https://www.thestandardatknoxville.com/wp-content/uploads/2023/07/Standard-at-Knoxville-community-gallery-17.jpg",
    "https://www.thestandardatknoxville.com/wp-content/uploads/2023/07/Standard-at-Knoxville-community-gallery-23.jpg",
  ],

  VILLAS_KNOXVILLE: [
    "https://villasknoxville.com/wp-content/uploads/2025/07/25.07.11-VK-Party-Deck-dusk-11.webp",
    "https://villasknoxville.com/wp-content/uploads/2025/07/25.07.11-VK-Pool-Deck-dusk-1.webp",
    "https://villasknoxville.com/wp-content/uploads/2025/03/Villas-Knoxville_3R_S3.webp",
    "https://villasknoxville.com/wp-content/uploads/2025/03/Villas-Knoxville_1R_C1_TH-Combined.webp",
    "https://villasknoxville.com/wp-content/uploads/2025/03/VKNX-VBackground.png",
  ],

  THE_COMMONS_AT_KNOXVILLE: [
    "https://images.squarespace-cdn.com/content/v1/6490b536ff0b1623acfcc5f9/3f9fd716-d1cc-4731-a64c-d36fd68e56f3/The+Commons+Knoxville-poi-020.jpg",
    "https://images.squarespace-cdn.com/content/v1/6490b536ff0b1623acfcc5f9/44d68413-9fbe-4869-afb0-13e5f6f2928b/The+Commons+Knoxville-poi-018.jpg",
    "https://images.squarespace-cdn.com/content/v1/6490b536ff0b1623acfcc5f9/cac550b5-e9ed-4d7b-9bdc-97af0c2fd59a/The+Commons+at+Knoxville-POI-17.jpg",
    "https://images.squarespace-cdn.com/content/v1/6490b536ff0b1623acfcc5f9/6aa6a03f-2799-42e6-8364-5974e74f5543/The+Commons+Knoxville-poi-021.jpg",
    "https://images.squarespace-cdn.com/content/v1/6490b536ff0b1623acfcc5f9/1762552562286-5JKXKEXAAH9KXOSLVBLZ/image-asset.jpeg",
  ],
};

// Plain list format for each apartment
/*
HUB_KNOXVILLE:
- https://hubknoxville.com/wp-content/uploads/2025/10/Hub-Knoxville-gallery-hero.webp
- https://hubknoxville.com/wp-content/uploads/2025/10/Hub-Knoxville-index-hero-1.webp
- https://hubknoxville.com/wp-content/uploads/2025/10/Hub-Knox_Gallery_Kitchen.webp
- https://hubknoxville.com/wp-content/uploads/2025/10/Hub-Knox_Gallery_Living-Space-2.webp
- https://hubknoxville.com/wp-content/uploads/2025/10/Hub-Knoxville-amenities-7.webp
- https://hubknoxville.com/wp-content/uploads/2025/10/Hub-Knox_Gallery_Lobby-2.webp

UNIVERSITY_WALK:
- https://universitywalkknox.com/wp-content/uploads/2025/10/Student_Quarters_University_Walk_01-scaled.jpg
- https://universitywalkknox.com/wp-content/uploads/2025/10/Student_Quarters_University_Walk_17-scaled.jpg
- https://universitywalkknox.com/wp-content/uploads/2025/10/Student_Quarters_University_Walk_11-scaled.jpg
- https://universitywalkknox.com/wp-content/uploads/2025/10/Student_Quarters_University_Walk_22-scaled.jpg
- https://universitywalkknox.com/wp-content/uploads/2025/10/568_14_Gallery_730x547.jpg

THE_KNOX_APARTMENTS:
- https://livetheknox.com/wp-content/uploads/2022/04/index-header-1600x800-c-default.jpg
- https://livetheknox.com/wp-content/uploads/2022/04/0000_Workout-1024x485-c-default.jpg
- https://livetheknox.com/wp-content/uploads/2022/04/0001_TV-Lounge-1024x485-c-default.jpg
- https://livetheknox.com/wp-content/uploads/2022/04/0002_Pool-Table-Dining-1024x485-c-default.jpg
- https://livetheknox.com/wp-content/uploads/2022/04/0006_Deck-3-1024x485-c-default.jpg

THE_STANDARD_AT_KNOXVILLE:
- https://www.thestandardatknoxville.com/wp-content/uploads/2023/07/Standard-at-Knoxville-gallery-hero.jpg
- https://www.thestandardatknoxville.com/wp-content/uploads/2023/07/Standard-at-Knoxville-community-gallery-15.jpg
- https://www.thestandardatknoxville.com/wp-content/uploads/2023/07/Standard-at-Knoxville-community-gallery-1.jpg
- https://www.thestandardatknoxville.com/wp-content/uploads/2023/07/Standard-at-Knoxville-community-gallery-17.jpg
- https://www.thestandardatknoxville.com/wp-content/uploads/2023/07/Standard-at-Knoxville-community-gallery-23.jpg

VILLAS_KNOXVILLE:
- https://villasknoxville.com/wp-content/uploads/2025/07/25.07.11-VK-Party-Deck-dusk-11.webp
- https://villasknoxville.com/wp-content/uploads/2025/07/25.07.11-VK-Pool-Deck-dusk-1.webp
- https://villasknoxville.com/wp-content/uploads/2025/03/Villas-Knoxville_3R_S3.webp
- https://villasknoxville.com/wp-content/uploads/2025/03/Villas-Knoxville_1R_C1_TH-Combined.webp
- https://villasknoxville.com/wp-content/uploads/2025/03/VKNX-VBackground.png

THE_COMMONS_AT_KNOXVILLE:
- https://images.squarespace-cdn.com/content/v1/6490b536ff0b1623acfcc5f9/3f9fd716-d1cc-4731-a64c-d36fd68e56f3/The+Commons+Knoxville-poi-020.jpg
- https://images.squarespace-cdn.com/content/v1/6490b536ff0b1623acfcc5f9/44d68413-9fbe-4869-afb0-13e5f6f2928b/The+Commons+Knoxville-poi-018.jpg
- https://images.squarespace-cdn.com/content/v1/6490b536ff0b1623acfcc5f9/cac550b5-e9ed-4d7b-9bdc-97af0c2fd59a/The+Commons+at+Knoxville-POI-17.jpg
- https://images.squarespace-cdn.com/content/v1/6490b536ff0b1623acfcc5f9/6aa6a03f-2799-42e6-8364-5974e74f5543/The+Commons+Knoxville-poi-021.jpg
- https://images.squarespace-cdn.com/content/v1/6490b536ff0b1623acfcc5f9/1762552562286-5JKXKEXAAH9KXOSLVBLZ/image-asset.jpeg
*/

export default APARTMENT_IMAGES;
