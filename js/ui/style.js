// design.md의 색 · 글꼴 · 글자 크기. 모든 화면과 그래픽은 여기 값만 쓴다.
export const COLORS = {
  cream: 0xf4ebd9, // 바닥 · 배경, 팝업 바탕
  navy: 0x2b2d42, // 글자, 외곽선, 그림자, NPC 몸
  gray: 0x8e9aaf, // 구구, 가구 · 벽 같은 배경 사물
  yellow: 0xffb547, // 강조: 단서, 아이템, 버튼, 열린 문, 평소 시야
  red: 0xe5533d, // 위험: 구구를 본 시야, 발각 · 실패, 서류 뭉치 외곽
};

export const CSS_COLORS = {
  cream: '#F4EBD9',
  navy: '#2B2D42',
  red: '#E5533D',
};

export const OUTLINE = 3; // 외곽선 두께

const FONT = 'Jua, sans-serif';
export const TEXT = {
  large: { fontFamily: FONT, fontSize: '40px', color: CSS_COLORS.navy },
  normal: { fontFamily: FONT, fontSize: '22px', color: CSS_COLORS.navy },
  small: { fontFamily: FONT, fontSize: '16px', color: CSS_COLORS.navy },
};
