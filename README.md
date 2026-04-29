# S.RAM 로봇 제어 시스템 (Robot Control System)

S.RAM 로봇 제어 시스템은 실시간 원격 데이터(Telemetry) 분석, 에러 트래킹, 그리고 AI 기반 이상 징후 감지 기능을 제공하는 전문가용 웹 기반 모니터링 및 제어 대시보드입니다.

## 🚀 주요 기능

- **실시간 데이터 시각화**: `recharts`를 활용하여 모터의 토크, 속도, 온도를 모니터링할 수 있는 반응형 차트를 제공합니다.
- **AI 기반 이상 징후 분석**: Google Gemini AI(`@google/genai`)를 연동하여 하드웨어 상태가 안전(SAFE) 기준치를 초과할 경우, 즉각적으로 데이터를 분석하고 전문가 수준의 진단을 제공합니다.
- **동적 상태 모니터링**: 실시간 하드웨어 데이터를 바탕으로 시스템의 현재 상태(SAFE, WARNING, DANGER, ERROR)를 자동으로 추적합니다.
- **모던 UI/UX**: Tailwind CSS를 사용한 다크 테마 기반의 반응형 인터페이스로, 부드러운 애니메이션(`motion/react`)과 깔끔한 아이콘(`lucide-react`)을 제공합니다.
- **인터랙티브 레이아웃**: 전체 상태를 한눈에 볼 수 있는 그리드 뷰와 특정 모터의 상태를 깊이 있게 분석할 수 있는 상세 뷰를 모두 지원합니다.

## 📁 프로젝트 구조 및 컴포넌트 상세 기능

대시보드 메인 화면은 효율적인 협업과 유지보수를 위해 기능별로 독립적인 컴포넌트로 분리되어 있습니다:

```text
src/
├── App.tsx                     # 페이지 간 화면 전환(라우팅) 및 전체 애니메이션 관리
└── components/
    ├── Login.tsx               # 사용자 로그인 화면
    ├── Dashboard.tsx           # 상태 관리(State) 및 하위 컴포넌트들을 조립하는 대시보드 메인 뼈대
    └── dashboard/              # 대시보드 전용 하위 기능 컴포넌트 폴더
        ├── StatusBar.tsx       # 최상단 로고, 로그아웃 버튼, 현재 시스템 상태(SAFE/WARNING 등) 및 시간 표시줄
        ├── MotorChartCard.tsx  # 개별 모터의 토크/속도 변화를 실시간으로 그리는 차트 카드 (재사용 가능)
        ├── TelemetryOverview.tsx # 하단의 모터별 온도/토크 변화 및 임계치를 비교하는 오버뷰 차트
        ├── AIAnalysisCard.tsx  # 위험/에러 상황 발생 시 Gemini AI 모델의 분석 결과를 띄우는 진단 창
        └── DetailView.tsx      # 특정 모터 상세보기 클릭 시 나타나는 모터 전용 상세 분석 및 제어 화면
```

## 🛠 기술 스택

- **프론트엔드 프레임워크**: React 19 + Vite
- **스타일링**: Tailwind CSS v4
- **차트**: Recharts
- **아이콘**: Lucide React
- **애니메이션**: Motion (Framer Motion)
- **AI 연동**: Google GenAI SDK

## ⚙️ 시작하기

### 필요 요구 사항

- [Node.js](https://nodejs.org/) (v18 이상 권장)
- npm 또는 yarn

### 설치 및 실행

1. 저장소를 클론하고 프로젝트 폴더로 이동합니다:
   ```bash
   cd sram_dashboard
   ```

2. 패키지(의존성)를 설치합니다:
   ```bash
   npm install
   ```

3. 환경 변수를 설정합니다:
   프로젝트 최상위 경로에 `.env` 파일을 만들고 Google Gemini API 키를 입력합니다:
   ```env
   VITE_GEMINI_API_KEY=당신의_제미나이_API_키를_여기에_입력하세요
   ```

4. 로컬 개발 서버를 실행합니다:
   ```bash
   npm run dev
   ```

5. 브라우저를 열고 `http://localhost:3000` 에 접속하여 대시보드를 확인합니다.

## 📊 상태 임계치 기준

시스템은 다음과 같은 자동화된 기준을 바탕으로 모터의 건강 상태를 평가합니다:
- **SAFE (안전)**: 토크 15Nm 이하 & 온도 35°C 이하
- **WARNING (주의)**: 토크 30Nm 이하 & 온도 40°C 이하
- **DANGER (위험)**: 토크 30Nm 초과 또는 온도 40°C 초과
- **ERROR (오류)**: 토크 50Nm 초과 또는 온도 45°C 초과
