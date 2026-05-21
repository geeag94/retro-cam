# 빈티지 레트로 캠코더 카메라 웹 앱 개발 계획안

## 프로젝트 개요
React(Vite)와 Tailwind CSS를 사용하여 브라우저에서 동작하는 빈티지 레트로 감성의 미니멀 캠코더 웹 앱을 개발한다.

## 기술 스택
- **Build Tool:** Vite (React + SWC)
- **Framework:** React 18
- **Styling:** Tailwind CSS
- **Typography:** Google Fonts - VT323 (투박한 레트로 폰트)

## 디렉토리 구조
```
.
├── docs/
│   └── plan.md              # 본 계획안
├── public/
├── src/
│   ├── App.jsx              # 전체 상태 관리 (captures, filterMode, isFlashing)
│   ├── components/
│   │   ├── CameraView.jsx   # 비디오 + 뷰파인더 코너 + 스캔라인 오버레이
│   │   ├── RecOverlay.jsx   # ● REC 깜빡임 + 실시간 시계 + 정적 정보
│   │   ├── ControlPanel.jsx # Grayscale / Sepia / Normal 토글 버튼
│   │   ├── ShutterButton.jsx# SHUTTER 버튼 + 플래시 트리거
│   │   ├── FlashEffect.jsx  # 화이트 아웃 플래시 효과
│   │   └── ThumbnailStrip.jsx # 하단 최대 4개 썸네일 (FIFO)
│   ├── hooks/
│   │   ├── useCamera.js     # getUserMedia 스트림 + 권한 관리
│   │   └── useClock.js      # 1초 단위 실시간 시계
│   ├── utils/
│   │   ├── capture.js       # Canvas 캡처 + PNG 다운로드 + 시각적 플래시
│   │   └── audio.js         # new Audio() 셔터음 재생 (src 비워둠)
│   ├── index.css            # 스캔라인 애니메이션 + VT323 폰트 임포트
│   └── main.jsx             # 진입점
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 상세 기능 정의

### 1. CameraView (`src/components/CameraView.jsx`)
- `video` 요소를 화면 중앙에 배치, `object-cover`로 컨테이너를 꽉 채운다.
- 4개의 absolute `div`로 코너 브래킷(┏ ┓ ┗ ┛)을 구현한다. (흰색, 2px 두께)
- `pointer-events: none`인 스캔라인 오버레이를 덮어씌운다.
  - `repeating-linear-gradient`로 2px 간격의 반투명 가로줄을 생성한다.
- 필터 모드(`normal`, `grayscale`, `sepia`)에 따라 비디오에 CSS 필터를 적용한다.

### 2. RecOverlay (`src/components/RecOverlay.jsx`)
- **좌측 상단:** 빨간색 `● REC` 표시
  - CSS `@keyframes`를 사용하여 1초 간격으로 `opacity`가 깜빡이는 애니메이션을 적용한다.
- **우측 상단:** 실제 캠코더처럼 보이는 정적 텍스트들
  - `ISO 800`
  - `4K 24FPS`
  - `🔋 87%`
  - `AWB`
  - 흰색 또는 회색의 작은 텍스트로 배치한다.
- **하단 중앙 (또는 좌측 하단):** 실시간 날짜/시간
  - 형식: `YYYY.MM.DD AM/PM HH:MM:SS`
  - VT323 폰트를 사용한다.

### 3. 필터 토글 (ControlPanel)
- 하단에 3개의 토글 버튼을 배치한다: `NORMAL`, `GRAYSCALE`, `SEPIA`
- 클릭 시 `filterMode` 상태를 변경한다.
- 변경된 상태는 `CameraView`의 비디오 및 캡처 로직에 전달되어 CSS 필터를 적용한다.

### 4. 촬영 플로우
- 사용자가 `SHUTTER` 버튼을 클릭하면 다음 순서로 동작한다:
  1. **오디오 재생:** `new Audio('./shutter.mp3')` 객체를 생성 및 재생한다. (실제 파일 경로는 비워두고, 주석으로 사용자가 채워넣도록 안내한다.)
  2. **플래시 효과:** `FlashEffect` 컴포넌트를 트리거한다. 화면 전체를 덮는 흰색 오버레이가 200ms 동안 `opacity`를 1에서 0으로 전환되며 번쩍인다.
  3. **이미지 캡처:** 숨겨진 `<canvas>` 요소에 현재 `video`의 프레임을 그린다. 이때 현재 적용된 CSS 필터(grayscale, sepia)를 Canvas 2D Context의 `filter` 속성으로 동일하게 적용한다.
  4. **PNG 다운로드:** `canvas.toDataURL('image/png')`로 Base64 PNG 데이터 URL을 생성한다. `<a>` 태그의 `download` 속성을 `capture_YYYYMMDD_HHMMSS.png`로 설정하고, `href`에 데이터 URL을 넣은 뒤 프로그래밍 방식으로 클릭하여 즉시 다운로드한다.
  5. **썸네일 저장:** 동일한 데이터 URL을 `captures` 상태 배열의 맨 앞에 추가한다. 배열의 길이는 최대 4개로 제한하며, 초과 시 가장 오래된 항목(배열 끝)을 제거한다(FIFO 방식).

### 5. 썸네일 스트립 (ThumbnailStrip)
- 화면 하단에 fixed 위치로 가로 스크롤 가능한 영역을 배치한다.
- 각 썸네일은 80x60px 크기로 표시한다.
- 썸네일 클릭 시 해당 이미지를 다시 다운로드할 수 있도록 한다.
- 스크롤바는 CSS로 숨긴다.

### 6. 상태 관리 (App.jsx)
```javascript
const [captures, setCaptures] = useState([]);       // 썸네일 URL 배열 (최대 4개 FIFO)
const [filterMode, setFilterMode] = useState('normal'); // 'normal' | 'grayscale' | 'sepia'
const [isFlashing, setIsFlashing] = useState(false);  // 플래시 트리거
```

## 스타일 가이드
- **배경색:** `#111111` 또는 `#1a1a1a` (어두운 그레이)
- **폰트:** 전체에 `font-family: 'VT323', monospace` 적용
- **텍스트 색상:** 기본 `#f0f0f0`
- **REC 점 색상:** `#ff0000`
- **버튼 테두리:** `#555555`
- **스캔라인:** `rgba(0, 0, 0, 0.3)` 또는 `rgba(255, 255, 255, 0.1)`

## 의존성
- `react`
- `react-dom`
- `tailwindcss`
- `postcss`
- `autoprefixer`

## 참고 사항
- `navigator.mediaDevices.getUserMedia` 사용 시 브라우저 보안 정책으로 인해 HTTPS 또는 `localhost` 환경에서만 정상 작동한다.
- 셔터음 파일은 프로젝트의 `public/` 폴더에 넣고 경로를 지정해야 한다. 현재는 코드 내에서 경로를 비워두거나 예시 경로만 주석으로 남겨둔다.
- 카메라 권한이 거부될 경우를 대비한 기본 UI/에러 메시지를 간단히 표시하도록 한다.
