// '비둘기 발자국 수첩': 주운 단서가 자동으로 모인다.
// 스테이지가 바뀌어도 내용이 유지되도록 모듈 하나로 둔다.
export const notebook = {
  clues: [], // { id, name }

  add(clue) {
    if (this.has(clue.id)) return;
    this.clues.push(clue);
  },

  has(id) {
    return this.clues.some((c) => c.id === id);
  },
};
