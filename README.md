# S.R.A.M — Smart Robot Arm Monitor & MLOps Node

> **S.R.A.M**은 산업용 로봇팔의 정밀 모니터링과 AI 분석을 통합한 차세대 대시보드입니다.  
> 실시간 텔레메트리, 3D 디지털 트윈을 통한 시각화는 물론, 로컬 LLM 인프라의 성능까지 실시간으로 감시하는 **MLOps 통합 관제 환경**을 제공합니다.

---

## 1. 주요 특징 (Core Features)

*   **3D Digital Twin**: `three.js` 기반의 정밀 로봇 모델이 실제 데이터와 동기화되어 실시간 동작을 재현합니다.
*   **AI Diagnostics**: 시스템 이상 감지 시 Gemini 1.5 Pro가 즉시 원인을 분석하고 한국어 조치 리포트를 생성합니다.
*   **MLOps Monitoring**: RTX 4070 기반 로컬 LLM 서버(Llama 3.1)의 VRAM, 온도, 추론 속도(Tokens/s) 및 큐 상태를 실시간 감시합니다.
*   **Precision Kinematics**: 부품 분리 없이 실제 관절 축을 중심으로 구동되는 계층형 로봇 메커니즘을 구현했습니다.
*   **Dynamic UI**: Tailwind CSS v4와 Framer Motion을 사용한 모던하고 역동적인 글래스모피즘 인터페이스를 제공합니다.

---

## 2. 화면 구성 (System Architecture)

대시보드는 크게 3가지 핵심 뷰로 구성됩니다.

### 2.1. 탭 시스템 (Navigation)
*   **Robot View**: 실시간 차트, 텔레메트리 데이터, 3D 디지털 트윈 모델 표시.
*   **AI Performance**: 로컬 AI 서버의 하드웨어 리소스 및 추론 퍼포먼스 모니터링.
*   **History Archive**: 데이터베이스에 저장된 과거 이력 및 로그 관리 (준비 중).

### 2.2. 레이아웃 구성 (3-Column Grid)
```text
┌───────────────────────────────── Header (Tabs & Settings) ─────────────────────────────────┐
│ [Robot View] [AI Performance] [History Archive]                Settings / Logout / Time   │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────┐ ┌───────────────────────────┐ ┌───────────────────────────────┐ │
│ │  Motor Charts (L)     │ │  Telemetry & AI (C)       │ │  3D Digital Twin (R)          │ │
│ │  - Torque/Speed (M1)  │ │  - Temp/Torque Overview   │ │  - Real-time Animation        │ │
│ │  - Torque/Speed (M2)  │ │  - AI Analysis Report     │ │  - Thermal Feedback (Emissive)│ │
│ └───────────────────────┘ └───────────────────────────┘ └───────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 기술 스택 (Tech Stack)

| 구분 | 기술 |
|---|---|
| **Core** | React 19, Vite 6, TypeScript |
| **Styling** | Tailwind CSS v4, Framer Motion |
| **3D Rendering** | Three.js, @react-three/fiber, @react-three/drei |
| **Visualization** | Recharts (Responsive Area/Line Charts) |
| **AI (Cloud)** | Google Gemini 1.5 Flash (Diagnostic Analysis) |
| **AI (Local)** | Ollama (Llama 3.1:8b) - MLOps Monitoring Target |

---

## 4. 디렉터리 구조 (Directory Structure)

```text
src/
├── components/
│   ├── dashboard/
│   │   ├── RobotModel.tsx       # 계층형 3D 로봇 관절 시뮬레이션
│   │   ├── MotorChartCard.tsx   # 모터 성능 데이터 시각화
│   │   ├── AIAnalysisCard.tsx   # Gemini API 연동 자동 진단
│   │   ├── TelemetryOverview.tsx # 시스템 전반 텔레메트리 요약
│   │   └── DetailView.tsx       # 정밀 로그 및 차트 상세 분석
│   ├── AINodeMonitor.tsx        # MLOps 전용 서버 모니터링 패널 [NEW]
│   ├── Dashboard.tsx            # 메인 레이아웃 및 탭 전환 관리
│   ├── Settings.tsx             # 시스템 설정 (API 키, MQTT 등)
│   └── Login.tsx                # 애니메이션 기반 로그인 인터페이스
└── App.tsx                      # 글로벌 라우팅 및 뷰 상태 관리
```

---

## 5. 3D 디지털 트윈 메커니즘 (`RobotModel.tsx`)

### 5.1. 계층형 관절 구조 (Hierarchy)
단순한 독립 부품들의 모음이 아닌, 실제 로봇의 물리 구조를 코드로 재구성했습니다.
*   **Static**: 베이스 및 어깨 하우징 고정.
*   **Joint 1 (Shoulder)**: 위팔을 포함한 팔 전체 회전.
*   **Joint 2 (Elbow)**: 아래팔과 집게 회전.
*   **Joint 3 (Wrist)**: 집게 부품의 정밀 꺾임 제어.

### 5.2. 피벗 포인트 최적화 (Pivot Alignment)
`Translate-Rotate-Translate Back` 트릭을 사용하여 각 부품의 정중앙 축을 기준으로 회전하며, 부품 간의 유격(Gap)을 소수점 단위로 정밀 보정하여 시각적 완성도를 높였습니다.

---

## 6. 설치 및 시작하기 (Getting Started)

1.  **의존성 설치**
    ```bash
    npm install
    ```
2.  **환경 변수 설정**
    `.env` 파일에 Gemini API 키를 입력합니다. (대시보드 설정 화면에서도 실시간 입력 가능)
    ```text
    VITE_GEMINI_API_KEY=your_gemini_api_key
    ```
3.  **개발 서버 실행**
    ```bash
    npm run dev
    ```

---

## 7. 향후 로드맵 (Roadmap)

*   [ ] **Real-time Connectivity**: 실제 로봇 하드웨어와의 MQTT/WebSocket 연동.
*   [ ] **History Archive Implementation**: 과거 로그 데이터베이스 연동 및 조회 기능.
*   [ ] **Predictive Maintenance**: AI를 활용한 소모품 교체 주기 예측 모델 탑재.
*   [ ] **Export System**: 분석 보고서 PDF 자동 생성 및 이메일 발송 기능.

---
© 2026 S.R.A.M Project. All rights reserved.
