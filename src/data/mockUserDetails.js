const mockUserDetails = [
  {
    id: -1,
    nickname: "자취 5년차",
    profileImageUrl: null,
    residenceYears: 0,
    trustScore: 50,
    postCount: 2,
    followerCount: 3,
    followingCount: 3,
    isFollowing: false,
    tips: [
      {
        id: -101,
        categoryId: "FOOD_SAVING",
        title: "연세대 주변 맛집 1티어",
        content: "여기는 마제소바가 정말 맛있고 가성비도 좋아요",
        author: {
          id: -1,
          nickname: "자취 5년차",
          residenceYears: 0,
          trustScore: 15,
        },
      },
      {
        id: -102,
        categoryId: "HEALTH",
        title: "친절히 진료해주는 안과 추천",
        content: "과진료 없이 필요한 설명 잘 해주세요",
        author: {
          id: -1,
          nickname: "자취 5년차",
          residenceYears: 0,
          trustScore: 50,
        },
      },
    ],
  },
  {
    id: -2,
    nickname: "신촌 프로 자취러",
    profileImageUrl: null,
    residenceYears: 5,
    trustScore: 90,
    postCount: 2,
    followerCount: 3,
    followingCount: 3,
    isFollowing: false,
    tips: [
      {
        id: -201,
        categoryId: "FOOD_SAVING",
        title: "연세대 주변 맛집 1티어",
        content: "여기는 마제소바가 정말 맛있고 가성비도 좋아요",
        author: {
          id: -2,
          nickname: "자취 5년차",
          residenceYears: 0,
          trustScore: 15,
        },
      },
      {
        id: -202,
        categoryId: "HEALTH",
        title: "친절히 진료해주는 안과 추천",
        content: "과진료 없이 필요한 설명 잘 해주세요",
        author: {
          id: -2,
          nickname: "신촌 프로 자취러",
          residenceYears: 5,
          trustScore: 90,
        },
      },
    ],
  },
];

export default mockUserDetails;
