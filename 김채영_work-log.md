# 작업 로그

## 2026-11-18 15:59
- **요청 요약:** 기획안과 스테이지 표를 바탕으로 spec.md를 채우고, index.html과 필요한 파일 만들기
- **수정한 파일:** spec.md, index.html, css/style.css, js/main.js, js/scenes/TitleScene.js
- **판단 근거:** 시점·화면 비율·조작·MVP는 답을 받지 못해 [미정]으로 두고, 게임 기능 없이 Phaser 실행만 확인하는 최소 구조로 만들었다.

## 2026-11-18 (기획안 비교)
- **요청 요약:** 오늘 쓴 기획안과 spec.md를 비교해 다른 부분을 목록으로 알려 주기 (코드 수정 없음)
- **수정한 파일:** 없음
- **판단 근거:** 코드를 고치지 말라는 요청에 따라 비교 결과만 목록으로 정리했다.

## 2026-11-18 16:08
- **요청 요약:** spec.md를 바탕으로 게임 개발 작업을 나눈 작업 목록 task.md 만들기
- **수정한 파일:** task.md
- **판단 근거:** spec.md에 [미정]이 많아 결정할 항목을 맨 앞에 두고, 그 결정에 기대는 작업에는 "결정 필요"를 표시했다.

## 2026-11-18 16:09
- **요청 요약:** 시점을 탑다운으로, MVP를 Stage 01·10으로 정하기 (화면 비율 PC 가로도 함께 반영)
- **수정한 파일:** spec.md, task.md
- **판단 근거:** 사용자가 정한 시점·화면 비율·MVP만 spec.md에 반영하고, task.md에는 Stage 01·10의 위협과 기믹에 필요한 작업만 [MVP]로 표시했다.

## 2026-11-18 16:10
- **요청 요약:** 작업 목록에서 체크되지 않은 첫 작업 하나 구현하기
- **수정한 파일:** js/main.js, task.md
- **판단 근거:** 앞선 미체크 항목(조작·수치·화면 구성·그래픽)은 사용자가 정할 결정 사항이라 건너뛰고, 구현할 수 있는 첫 작업인 PC 가로 화면 설정(1280×720 FIT)을 했다.

## 2026-11-18 16:11
- **요청 요약:** 작업 목록의 다음 작업(탑다운 스테이지 장면 구조) 진행
- **수정한 파일:** js/main.js, js/scenes/StageScene.js, js/scenes/Stage01Scene.js, js/scenes/Stage10Scene.js, task.md
- **판단 근거:** 시작 화면 구성이 [미정]이라 스테이지로 넘어가는 버튼 대신 개발 확인용 주소(?stage=1, ?stage=10)로 확인하게 했다.

## 2026-11-18 16:14
- **요청 요약:** 조작을 방향키/WASD 이동, 스페이스 비행으로 정하고 걷기 이동 구현
- **수정한 파일:** js/objects/Gugu.js, js/scenes/StageScene.js, spec.md, task.md
- **판단 근거:** 작업 하나만 하라는 흐름에 따라 걷기만 구현했고, 쪼기 키는 "다른 키"로만 말해 [미정]으로 두었다.

## 2026-11-18 16:18
- **요청 요약:** 시작 화면에서 아무 키나 클릭으로 Stage 01 시작하게 하기
- **수정한 파일:** js/scenes/TitleScene.js, spec.md, task.md
- **판단 근거:** 사용자가 제안한 시작 화면 구성을 그대로 spec.md에 적고, 시작 방법을 알 수 있도록 안내 문구 한 줄만 더했다.

## 2026-11-18 16:19
- **요청 요약:** 다음 작업 진행 — 비행(스페이스를 누르는 동안) 구현, 쪼기 키를 Enter로 정하기
- **수정한 파일:** js/objects/Gugu.js, spec.md, task.md
- **판단 근거:** 비행 방식과 쪼기 키는 사용자에게 물어 정했고, 아직 높은 곳(책장·조명)이 없어 비행 상태와 겉모습만 만들었다.

## 2026-11-18 16:21
- **요청 요약:** 다음 작업 진행 — 비행 스태미나 구현
- **수정한 파일:** js/objects/Gugu.js, js/scenes/StageScene.js, spec.md, task.md
- **판단 근거:** 스태미나 수치가 명세에 없어 임시 값(4초 비행, 5초 회복)을 상수로 두어 쉽게 바꿀 수 있게 했고, 화면 표시는 별도 UI 작업으로 남겼다.

## 2026-11-18 16:23
- **요청 요약:** 다음 작업 진행 — 부리로 쪼기(Enter) 구현
- **수정한 파일:** js/objects/Gugu.js, js/scenes/StageScene.js, task.md
- **판단 근거:** 아직 쪼을 물건이 없어, 쪼는 동작(색 깜빡임)과 가까운 물건을 찾아 알리는 구조만 만들고 실제 물건은 스테이지 작업에서 넣기로 했다.

## 2026-11-18 16:24
- **요청 요약:** 다음 작업 진행 — 단서 줍기와 발자국 수첩 자동 저장
- **수정한 파일:** js/systems/notebook.js, js/objects/Clue.js, js/scenes/StageScene.js, js/scenes/Stage01Scene.js, task.md
- **판단 근거:** 줍는 방법이 명세에 없어 가장 단순한 "닿으면 줍기"로 했고, 확인용으로 Stage 01에 명세의 학보 조각 하나만 놓았다.

## 2026-11-18 16:25
- **요청 요약:** 발자국 수첩 화면을 N 키로 열고 닫기 (게임은 멈추지 않음)
- **수정한 파일:** js/ui/NotebookPanel.js, js/scenes/StageScene.js, spec.md, task.md
- **판단 근거:** 디자인이 [미정]이라 화면 오른쪽 반투명 상자에 단서 이름만 보여 주고, 열린 상태에서 단서를 주우면 바로 갱신되게 했다.

## 2026-11-18 16:26
- **요청 요약:** 4자리 비밀번호 키패드 — Enter로 쪼면 열리고, 화면의 숫자를 쪼아서 누르기
- **수정한 파일:** js/ui/KeypadPanel.js, js/objects/Gugu.js, js/scenes/StageScene.js, js/scenes/Stage01Scene.js, spec.md, task.md
- **판단 근거:** "화면의 숫자를 쪼기"를 키보드로 하려고 방향키로 칸을 고르고 Enter로 누르게 했고, 키패드를 쓰는 동안은 방향키가 겹치지 않게 구구를 멈췄다.

## 2026-11-18 16:28
- **요청 요약:** 다음 작업 진행 — 아이템 · 출입 권한 획득
- **수정한 파일:** js/systems/inventory.js, js/scenes/StageScene.js, js/scenes/Stage01Scene.js, task.md
- **판단 근거:** 수첩과 같은 방식으로 아이템 목록을 만들고, 확인용으로 Stage 01 키패드를 풀면 명세의 Stage 01 보상을 얻게 했다(실제 효과는 Stage 01 작업으로 미룸).

## 2026-11-18 16:29
- **요청 요약:** NPC 순찰 — Stage 01 학생 5명이 정해진 길을 왔다 갔다 하기
- **수정한 파일:** js/objects/Npc.js, js/scenes/StageScene.js, js/scenes/Stage01Scene.js, spec.md, task.md
- **판단 근거:** 사용자가 정한 인원과 움직임만 구현했고, 발각(시야각)과 부딪힘은 다음 작업으로 남겼다.

## 2026-11-18 16:30
- **요청 요약:** NPC 시야각 — 부채꼴로 표시, 거리 150px · 각도 60도, 날고 있으면 들키지 않기
- **수정한 파일:** js/objects/Npc.js, js/scenes/StageScene.js, spec.md, task.md
- **판단 근거:** 제안한 세 가지에 모두 동의해 그대로 구현했고, 발각 처리는 다음 작업이라 시야가 빨갛게 바뀌는 것까지만 했다.

## 2026-11-18 16:31
- **요청 요약:** 시야에 1.5초 동안 계속 보이면 발각되게 하기
- **수정한 파일:** js/scenes/StageScene.js, spec.md, task.md
- **판단 근거:** 시야에서 벗어나면 시간을 0으로 되돌리는 가장 단순한 방식으로 했고, 발각 후 처리(방생·복귀)는 다음 작업이라 "발각!" 문구만 띄웠다.

## 2026-11-18 16:32
- **요청 요약:** 발각 시 방생 → 스테이지 시작 위치로 복귀, 단서 · 아이템은 유지
- **수정한 파일:** js/objects/Gugu.js, js/scenes/StageScene.js, spec.md, task.md
- **판단 근거:** 단서 · 아이템을 유지하려고 장면을 다시 시작하지 않고 구구만 시작 위치로 옮겼다.

## 2026-11-18 16:33
- **요청 요약:** 체크포인트 저장 항목 체크, 키패드를 풀면 출입문이 열리고 닿으면 다음 스테이지로 이동
- **수정한 파일:** js/objects/Door.js, js/scenes/StageScene.js, js/scenes/Stage01Scene.js, spec.md, task.md
- **판단 근거:** 체크포인트는 시작 위치로 이미 구현되어 체크만 했고, 출입문은 다른 스테이지에서도 쓰도록 공용으로 만들었다.

## 2026-11-18 16:35
- **요청 요약:** Stage 01 마무리 — 학보 조각 4개, 비밀번호 3829, 스태미나 강화 수치는 알아서
- **수정한 파일:** js/scenes/Stage01Scene.js, js/objects/Gugu.js, spec.md, task.md
- **판단 근거:** 조각 이름에 자리와 숫자를 적어 수첩만 보고 순서를 알 수 있게 했고, 강화 수치는 앞서 예로 든 4초 → 6초로 했다.

## 2026-11-18 16:37
- **요청 요약:** Stage 10 — 환풍구에서 날고 있는 상태로 시작해 스페이스를 떼면 내려앉기, 방 배치(창가 총장님 · 가운데 책상 · 오른쪽 발코니 창문)
- **수정한 파일:** js/scenes/Stage10Scene.js, js/scenes/StageScene.js, js/objects/Gugu.js, spec.md, task.md
- **판단 근거:** 제안한 방식대로 했고, 시작할 때 스페이스를 누르고 있지 않아도 떠 있도록 "눌렀다 떼면 내려앉기"로 하고 환풍구 안에서는 움직이지 않게 했다.

## 2026-11-18 16:39
- **요청 요약:** 총장님 고개 돌림 — 창밖 2~5초 / 방 안 1~3초 무작위 반복, 방 안을 볼 때 큰 부채꼴 시야
- **수정한 파일:** js/objects/President.js, js/objects/Npc.js, js/scenes/Stage10Scene.js, spec.md, task.md
- **판단 근거:** 제안한 값대로 했고, 학생 NPC의 시야 감지를 그대로 쓰려고 Npc를 상속하고 시야 크기만 바꿀 수 있게 했다.

## 2026-11-18 16:40
- **요청 요약:** 새우깡 봉지를 Enter로 쪼면 타이밍 미니게임 시작, 초록 칸에서 Enter면 1개 꺼내기, 빗나가면 바스락 → 실패
- **수정한 파일:** js/ui/TimingPanel.js, js/scenes/Stage10Scene.js, js/scenes/StageScene.js, spec.md, task.md
- **판단 근거:** 실패는 명세의 "즉시 발각"에 맞춰 방생(환풍구 복귀)으로 처리했고, 발각될 때 열린 창(키패드·미니게임)이 남지 않도록 함께 닫게 했다.

## 2026-11-18 16:43
- **요청 요약:** 봉지 넘어뜨리기 = 날고 있는 상태로 봉지에 부딪히기 → 즉시 실패, 새우깡 2개 이상 집기 실패
- **수정한 파일:** js/scenes/Stage10Scene.js, spec.md, task.md
- **판단 근거:** "2개째 집기"는 답이 없었지만 명세에 실패 조건으로 있고 집는 방법이 쪼기뿐이라, 1개를 꺼낸 뒤 다시 쪼는 것으로 처리했다.

## 2026-11-18 16:45
- **요청 요약:** 새우깡을 꺼낸 뒤 발코니 창문에 닿으면 탈출(최종 성공), 발각되면 총장님이 공격 시작
- **수정한 파일:** js/scenes/Stage10Scene.js, spec.md, task.md
- **판단 근거:** 탈출은 명확해 구현했고, "총장님 공격"은 명세에 없던 새 기능이며 방식이 정해지지 않아 spec.md · task.md에 [미정]으로 적고 먼저 묻기로 했다.

## 2026-11-18 16:49
- **요청 요약:** 총장님 공격 — 서류 뭉치 던지기, 발각된 자리에서 바로 공격 시작 · 창문까지 도망
- **수정한 파일:** js/scenes/Stage10Scene.js, spec.md, task.md
- **판단 근거:** "네"만으로는 어느 예를 고른 것인지 알 수 없어 다시 물었고, 고른 방식대로 새우깡을 꺼낸 뒤의 발각만 공격으로 바꾸고 맞으면 새우깡을 잃게 했다.

## 2026-11-18 16:50
- **요청 요약:** 화면 작업 전에 design.md 만들기
- **수정한 파일:** design.md, spec.md, task.md
- **판단 근거:** 수업 양식(색 5가지, 글자 3단계, 버튼, 배치, 그래픽 스타일, 하지 않을 것)에 맞춰 30줄 안팎으로 쓰고, 스타일은 기획의 코믹한 분위기에 맞춰 밝은 카툰으로 정했다.

## 2026-11-18 16:53
- **요청 요약:** 기존 그래픽을 design.md에 맞추기
- **수정한 파일:** index.html, css/style.css, js/main.js, js/ui/style.js(새 파일), js/objects/Gugu.js, Npc.js, President.js, Clue.js, Door.js, js/scenes/TitleScene.js, StageScene.js, Stage10Scene.js, js/ui/NotebookPanel.js, KeypadPanel.js, TimingPanel.js
- **판단 근거:** 색 · 글꼴 · 크기를 style.js 한 곳에 모아 모든 파일이 같은 값을 쓰게 했고, 동작은 바꾸지 않고 겉모습만 바꿨다(design.md의 "앞쪽 표시"에 따라 구구 부리 · NPC 눈 추가).

## 2026-11-18 16:55
- **요청 요약:** 화면 작업 시작 — 플레이 화면 UI (스태미나 막대, 수첩 버튼)
- **수정한 파일:** js/ui/button.js(새 파일), js/ui/Hud.js(새 파일), js/scenes/StageScene.js, js/ui/NotebookPanel.js, task.md
- **판단 근거:** design.md 배치대로 오른쪽 위에 두었고, 버튼은 실패 · 엔딩 화면에서도 쓰도록 공용 함수로 만들었다. 수첩 창은 UI와 겹치지 않게 조금 아래로 내렸다.

## 2026-11-18 16:56
- **요청 요약:** 실패 화면 — 발각되면 가운데 팝업(발각! · 이유 · 다시 하기)을 띄우고 버튼을 누르면 체크포인트로 복귀
- **수정한 파일:** js/ui/FailPopup.js(새 파일), js/scenes/StageScene.js, js/scenes/Stage10Scene.js, spec.md, task.md
- **판단 근거:** 팝업이 떠 있는 동안 다시 발각되지 않도록 게임 움직임을 멈췄고, 마우스가 없어도 되게 Enter로도 다시 하기를 누를 수 있게 했다.

## 2026-11-18 16:58
- **요청 요약:** 스테이지 클리어 화면 — 출입문에 닿으면 클리어 팝업(얻은 아이템, 다음 스테이지 버튼)
- **수정한 파일:** js/ui/Popup.js(새 파일), js/ui/FailPopup.js(삭제), js/scenes/StageScene.js, js/scenes/Stage10Scene.js, spec.md, task.md
- **판단 근거:** 실패 화면과 모양이 같아 FailPopup을 제목 · 설명 · 버튼만 바꿔 쓰는 공용 Popup으로 바꾸고 두 화면이 함께 쓰게 했다.

## 2026-11-18 17:02
- **요청 요약:** 엔딩 화면 — 탈출하면 엔딩 화면(탈출 성공!, 처음으로 버튼), 처음으로 누르면 수첩 · 아이템 비우고 시작 화면
- **수정한 파일:** js/scenes/EndingScene.js(새 파일), js/scenes/Stage10Scene.js, js/main.js, js/systems/notebook.js, js/systems/inventory.js, spec.md, task.md
- **판단 근거:** 제안한 구성대로 만들었고, 처음부터 다시 할 때 이전 판의 단서 · 아이템이 남지 않도록 비우는 기능을 더했다.

## 2026-11-18 17:03
- **요청 요약:** 첨부한 회색 비둘기 그림을 구구의 캐릭터 디자인으로 쓰기 (코드로 비슷하게 그리기 선택)
- **수정한 파일:** js/objects/Gugu.js, design.md
- **판단 근거:** 그림은 정면 모습이고 게임은 탑다운이라, 그림의 특징(회색 몸, 날개 줄, 꼬리 줄무늬, 작은 부리)을 위에서 본 모습으로 옮겨 그렸고 충돌 크기는 그대로 두었다.

## 2026-11-18 17:06
- **요청 요약:** 총장님 디자인을 더 사실적으로 바꾸기
- **수정한 파일:** js/objects/President.js, design.md
- **판단 근거:** design.md의 "실사 · 실제 인물을 닮게 그리지 않기"를 지키려고, 사진처럼이 아니라 위에서 본 정장 차림 어른을 도형으로 자세히 그리는 방향으로 했다.

## 2026-11-18 17:07
- **요청 요약:** Stage 01 난이도 올리기 — 학생들이 단서 근처에서 움직이게
- **수정한 파일:** js/scenes/Stage01Scene.js, spec.md
- **판단 근거:** 학생 수(5명)는 명세대로 두고, 4명은 학보 조각 하나씩 옆을, 1명은 키패드 둘레를 돌게 했다. 속도도 80에서 100으로 조금 올렸고, 시작 위치에서는 바로 들키지 않게 거리를 두었다.

## 2026-11-18 17:09
- **요청 요약:** 학생 디자인을 사실적으로, 5명 모두 다르게 바꾸기
- **수정한 파일:** js/objects/studentLooks.js(새 파일), js/objects/Npc.js, js/scenes/StageScene.js, js/scenes/Stage01Scene.js, design.md
- **판단 근거:** 총장님과 같은 방식(위에서 본 사람을 도형으로 자세히)으로 그리고, design.md의 5가지 색 안에서 머리 모양 · 색 조합으로 다섯 명을 구분했다. 시야 · 이동은 그대로다.

## 2026-11-18 17:13
- **요청 요약:** 학생 시야에 들어오면 학생이 구구 쪽으로 시야를 돌리게 하기
- **수정한 파일:** js/objects/Npc.js, spec.md
- **판단 근거:** 따라 보기만 하면 빠져나갈 수 없어 너무 어려워지므로, 따라 보는 동안 학생은 멈춰 서게 해서 구구가 거리로 벗어나거나 날아서 피할 수 있게 했다.

## 2026-11-18 17:17
- **요청 요약:** 학생 시야 안에서 학생이 쫓아내기 공격을 쓰고, 맞으면 구구가 튕겨 나가게 하기
- **수정한 파일:** js/objects/Npc.js, js/objects/Gugu.js, js/scenes/StageScene.js, spec.md
- **판단 근거:** 사용 조건 · 맞은 뒤 · 발각 규칙을 물어 정했고(시야 안 + 60px, 2초 대기, 밀려나기만, 발각 규칙 유지), 총장님에게는 넣지 않았다.

## 2026-11-18 17:25
- **요청 요약:** 다음 작업 — '구구' 울음소리로 학생 시선 끌기 (Q, 200px 안 학생이 2초 동안 소리 난 곳을 봄, 5초 대기, "구구!" 말풍선, 총장님 제외)
- **수정한 파일:** js/objects/Gugu.js, js/objects/Npc.js, js/scenes/StageScene.js, spec.md, task.md
- **판단 근거:** 제안한 값을 사용자가 고른 대로 spec.md에 먼저 적었고, 쫓아내기처럼 addNpc로 놓은 학생만 반응하게 했다. 학생이 구구를 직접 보고 있으면 울음소리보다 구구를 따라 보는 쪽을 먼저 한다.

## 2026-11-18 17:35
- **요청 요약:** 경계 게이지 — 스태미나 막대 아래에, 쓰는 스테이지 화면에서만 보이게 하고 나머지는 알아서
- **수정한 파일:** js/ui/Hud.js, js/scenes/StageScene.js, js/scenes/Stage10Scene.js, spec.md, design.md, task.md
- **판단 근거:** 지금 빗자루 · 서류 뭉치가 있는 곳은 Stage 10뿐이라 거기서만 켰고, spec.md 3장의 "게이지가 가득 찬 상태에서 서류 뭉치에 닿으면 발각"을 따라 Stage 10 세부를 그에 맞게 고쳤다. 수치는 앞서 제안한 값(최대 100, +25/초, −10/초)을 썼다.

## 2026-11-18 17:50
- **요청 요약:** Stage 02 학생회관 만들기 (제안한 세부안 그대로), 빗자루 · 서류 뭉치 "덜 찼으면 튕겨 나가고 +40" 규칙을 Stage 10에도 적용, 순서 01 → 02 → 10
- **수정한 파일:** js/scenes/Stage02Scene.js(새 파일), js/objects/Janitor.js(새 파일), js/scenes/StageScene.js, js/scenes/Stage10Scene.js, js/scenes/Stage01Scene.js, js/main.js, spec.md, design.md, task.md
- **판단 근거:** 빗자루와 서류 뭉치가 같은 규칙을 쓰도록 StageScene에 공용 hitByHazard를 두었고, 미화원은 design.md의 '그 밖의 NPC' 모습을 그대로 썼다. 칠판은 오른쪽 위 UI와 겹쳐서 게시판 오른쪽으로 옮겼다.

## 2026-11-18 18:00
- **요청 요약:** 시작 화면 꾸미기, 게임 제목을 "총장님의 새우깡을 훔쳐라!"로 변경, 게임 그래픽 꾸미기는 (가) design.md 규칙 안에서 — 시작 화면부터 진행
- **수정한 파일:** js/scenes/TitleScene.js, js/objects/Gugu.js, js/ui/style.js, index.html, spec.md, design.md
- **판단 근거:** 5가지 색 · 그라디언트 없음 규칙을 지키려고 화려함은 움직임(튀는 제목, 나는 구구, 떨어지는 새우깡, 깜빡이는 안내)으로 냈고, 구구 그림은 Gugu.drawLook으로 꺼내 시작 화면과 게임이 같은 모습을 쓰게 했다. 제목만 72px로 키우는 것은 design.md에 따로 적었다.

## 2026-11-18 18:08
- **요청 요약:** 시작 화면 부제 삭제, 글씨체를 아주 귀엽게 변경
- **수정한 파일:** js/scenes/TitleScene.js, js/ui/style.js, js/main.js, index.html, design.md
- **판단 근거:** 귀여운 한글 Google Fonts 중 굵게 쓸 수 있어 작은 글씨(16px)도 잘 읽히는 Gaegu 700을 골랐고, 모든 글씨가 style.js의 글꼴 하나를 쓰므로 게임 전체에 함께 적용했다.

## 2026-11-25 15:49
- **요청 요약:** 숨겨진 쪽지와 장소를 찾아가 쪼아 보는 장치(게시판 자세히 보기 등)로 단서를 다양하게 얻게 하고, 이야기(시작 · 스테이지 · 단서 · 엔딩 대사, 구구 가족사, 구구는 모르고 플레이어만 아는 총장님의 사연)를 넣기
- **수정한 파일:** js/data/story.js(새 파일), js/ui/DialogBox.js(새 파일), js/ui/InspectPanel.js(새 파일), js/scenes/StoryScene.js(새 파일), js/scenes/StageScene.js, js/scenes/Stage01Scene.js, js/scenes/Stage02Scene.js, js/scenes/Stage10Scene.js, js/scenes/TitleScene.js, js/scenes/EndingScene.js, js/main.js, spec.md, design.md, task.md
- **판단 근거:** "구구는 사람 글씨를 모르고 숫자 · 그림만 알아본다"는 장치로, 단서 창에는 사람이 쓴 글을 그대로 보여 주고 구구의 한마디는 빗나가게 했다. 비밀번호(3829, 1821)는 그대로 두고 얻는 방법만 바꿨으며, 긴 글을 읽는 동안 들키지 않도록 대사창 · 자세히 보기 창이 열려 있으면 게임을 멈추게 했다.
