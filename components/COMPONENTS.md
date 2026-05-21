# UI Components

이 문서는 `web-ui`에서 사용할 주요 컴포넌트 사양입니다.

목표: 재사용 가능한 HTML 구조와 CSS 클래스, 간단한 동작을 정의하여 일관된 UI를 구현합니다.

1. Card
- 용도: 요약 정보 / 패널
- 구조: `<div class="card"> <header class="card-head">...` 등
- 주요 클래스: `card`, `card-head`, `card-body`, `card-footer`
- 변형: `card--compact`, `card--ghost`, `card--accent`

HTML 예시:

```html
<div class="card card--compact">
  <div class="card-head">
    <h3>발견 자산</h3>
    <span class="card-meta">Updated</span>
  </div>
  <div class="card-body">
    <div class="card-value">123</div>
  </div>
</div>
```

2. Badge / Pill
- 용도: 상태 표시
- 클래스: `pill`, `pill--success`, `pill--danger`, `pill--neutral`

3. Table / List
- 용도: 자산 목록, 취약점 리스트
- 클래스: `table`, `table--compact`, `list`, `list-item`

4. Buttons
- 크기: `button`, `button.small`, `button.ghost`
- 색상/의도: `button.primary`, `button.secondary`, `button.tertiary`

5. Filter Panel
- 왼쪽 사이드에 위치하며 체크박스/토글로 필터 제공
- 클래스: `filter-panel`, `filter-section`

6. Modal / Drawer (향후)
- 구조: `modal`, `modal__backdrop`, `modal__content`

## Accessibility
- 버튼은 `aria-pressed`, 토글에는 `aria-expanded` 사용
- 색상 대비를 확인하여 `--accent` 등의 색상 변수 조정

## JS Patterns
- 컴포넌트는 `data-*` 속성으로 초기화
- 이벤트 위임 사용

## Next Steps
- 각 컴포넌트의 `index.html` 샘플 섹션으로 이동
- SCSS로 분리하여 변수/믹스인 정리
- 컴포넌트별 테스트 페이지 생성
