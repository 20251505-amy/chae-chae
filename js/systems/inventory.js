// 획득한 아이템 · 출입 권한 (학생증, 마스터키 조각, 임시 출입증 등).
// 스테이지가 바뀌어도 내용이 유지되도록 모듈 하나로 둔다.
export const inventory = {
  items: [], // { id, name }

  add(item) {
    if (this.has(item.id)) return;
    this.items.push(item);
  },

  has(id) {
    return this.items.some((i) => i.id === id);
  },

  // 처음부터 다시 할 때 비운다.
  reset() {
    this.items = [];
  },
};
