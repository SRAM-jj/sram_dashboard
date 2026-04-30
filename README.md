# S.R.A.M — Smart Robot Arm Monitor

> 2축 로봇팔(어깨 + 팔꿈치)의 토크·속도·온도를 실시간으로 보여주고, 임계치를 넘으면 Gemini AI 가 원인을 진단해주는 모니터링 대시보드입니다. 우측 하단에는 같은 데이터로 움직이는 **3D 디지털 트윈**이 떠 있어요.

---

## 1. 한눈에 보기

| 항목 | 내용 |
|---|---|
| 프레임워크 | React 19 + Vite 6 |
| 스타일 | Tailwind CSS v4 |
| 차트 | Recharts |
| 3D | three.js + @react-three/fiber + @react-three/drei |
| AI | `@google/genai` (Gemini) |
| 데이터 소스 | **현재는 모두 mock** (`Dashboard.tsx` 내부에서 sin/cos + 난수로 생성) |

> 실제 하드웨어/MQTT 연동은 아직 없습니다. 텔레메트리는 60초 주기로 SAFE → WARNING → DANGER → ERROR 상태를 한 바퀴 돌도록 시뮬레이션됩니다.

---

## 2. 시작하기

### 필요한 것

- Node.js 18+ (권장 20+)
- Gemini API 키 (없어도 동작은 하지만, 위험 상태일 때 AI 분석 카드가 동작하지 않음)

### 설치 & 실행

```bash
npm install

# .env (또는 .env.local) 에 키 추가
echo "VITE_GEMINI_API_KEY=여기에_키" > .env

npm run dev
```

기본 포트는 3000 이지만, 사용 중이면 Vite 가 자동으로 다음 포트를 잡습니다 (예: 3001). 콘솔에 찍히는 URL 을 확인하세요.

### 그 외 스크립트

```bash
npm run build     # 프로덕션 빌드
npm run preview   # 빌드 결과를 로컬에서 미리보기
npm run lint      # tsc --noEmit (타입체크)
npm run clean     # dist 폴더 제거
```

---

## 3. 화면 구성

로그인 화면을 통과하면 **그리드 뷰**가 뜹니다.

```
┌────────────────────────────── StatusBar ──────────────────────────────┐
│  S.RAM 로고 / 시스템 상태 (SAFE/WARNING/DANGER/ERROR) / 현재시각       │
├──────────────────────────────┬────────────────────────────────────────┤
│  MotorChartCard (Motor 1)    │                                        │
│  MotorChartCard (Motor 2)    │   TelemetryOverview                    │
│                              │   (온도·토크 vs 임계치)                │
│                              │                                        │
│         AIAnalysisCard       │                                        │
│   (위험/에러일 때 Gemini 진단)│                                        │
├──────────────────────────────┴────────────────────────────────────────┤
│                                                                       │
│                  RobotModel (3D 디지털 트윈, 자동 회전)               │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

`MotorChartCard` 의 “상세보기” 버튼을 누르면 `DetailView` 로 화면이 전환됩니다.

---

## 4. 디렉터리 구조

```text
src/components/
├── dashboard/
│   ├── RobotModel.tsx       # Three.js 기반 3D 로봇팔 시뮬레이션
│   ├── MotorChartCard.tsx   # 개별 모터 데이터 시각화 차트
│   ├── TelemetryOverview.tsx # 시스템 전반 텔레메트리 요약
│   ├── AIAnalysisCard.tsx    # Gemini API 기반 AI 분석 결과 표시
│   └── DetailView.tsx       # 모터별 상세 로그 및 정밀 분석 뷰
├── Dashboard.tsx            # 메인 대시보드 레이아웃 및 데이터 관리
└── Login.tsx                # 현대적인 애니메이션이 적용된 로그인 화면
```

---

## 5. 3D 로봇 모델은 어떻게 움직이나 (`RobotModel.tsx`)

### 5.1. 모델 파일 사정

`public/robot.glb` 의 노드 트리는 **계층이 없는 평탄(flat) 구조**입니다 (Node0 루트 아래에 Node1~Node9 가 모두 형제로 있음). 즉, glTF 만으로는 “모터를 돌리면 그 위 링크가 같이 돌아간다” 같은 부모-자식 관계가 **존재하지 않습니다**. 그래서 React 코드에서 직접 `<group>` 으로 다시 묶어줍니다.

GLB 의 accessor bounds 를 분석해서 각 노드의 크기/중심/납작한 정도를 보면:

| 노드 | 정체 | 중심 좌표 | 비고 |
|---|---|---|---|
| Node1 | 베이스/받침대 | (16.3, 8.4, 17.7) | 가장 큼, 바닥에 붙어 있음 |
| **Node2** | **모터 1 (디스크)** | **(16.7, 23.3, 17.8)** | 베이스 위에 볼트로 고정 |
| Node3 | 위팔 (링크) | (18.8, 34.6, 13.6) | 세로로 길쭉 |
| **Node4** | **모터 2 (디스크)** | **(18.9, 40.8, 15.0)** | flatness 0.59 — 가장 디스크 같음 |
| Node5 | 아래팔 (링크) | (5.8, 29.8, 33.0) | Z 방향으로 뻗음 |
| Node6 | 손목 | (3.2, 24.0, 37.7) | |
| Node7 | 그리퍼 본체 | (2.3, 18.4, 38.4) | |
| Node8, Node9 | 그리퍼 손가락 | — | 좌·우 |

**Node2 와 Node4** 가 두 개의 “볼트로 조여진 동그란 모터”입니다. 모터 1은 베이스에 고정돼 위팔을 돌리고, 모터 2는 위팔에 고정돼 아래팔을 돌려요.

### 5.2. 우리가 만든 두 관절 계층

핵심: **모터 하우징 자체는 안 돕니다.** 모터는 자기가 붙은 부모 링크에 단단히 고정돼 있고, 회전하는 건 모터 축에 물린 다음 링크예요.

```
정적(고정):
  Node1 (베이스)
  Node2 (모터 1 하우징, 베이스에 볼트)

Joint 1 — 모터 1 축을 중심으로 회전:
  Node3 (위팔)
  Node4 (모터 2 하우징, 위팔에 볼트)
  
  Joint 2 — 모터 2 축을 중심으로 회전:
    Node5..Node9 (아래팔 + 그리퍼)
```

두 관절 모두 X축 회전(피치)이라, 팔이 옆으로 휘두르는 게 아니라 **앞뒤로 접혔다 펴졌다** 합니다 — 2-DOF 로봇팔의 가장 자연스러운 동작이에요. 모터 하우징(Node2, Node4) 은 각자의 온도에 따라 청록 ↔ 빨강 발광이 들어와서, 시각적으로 “지금 어느 모터가 뜨거운지” 한눈에 보입니다.

각 관절 그룹은 **translate-rotate-translate-back** 트릭을 씁니다.

```tsx
<group position={PIVOT}>            // 회전 중심을 월드 원점으로 이동
  <group position={[-PIVOT...]}>    // 안쪽 좌표는 원래 위치로 되돌림
    {/* 메시들 */}
  </group>
</group>
```

이 패턴 덕분에 그룹 자체에 `rotation.y` 만 바꿔주면 회전축이 **PIVOT 좌표**로 잡힙니다. 피봇 좌표는 GLB 의 accessor bounds (각 메시의 min/max) 를 보고 어깨/팔꿈치가 자연스러운 위치에서 꺾이도록 잡았어요.

### 5.3. 자율 모션

`useFrame` 안에서 매 프레임 sin/cos 으로 각도를 갱신합니다.

```ts
joint1Ref.current.rotation.x = Math.sin(t * 0.6) * 0.6        // ±34° 피치
joint2Ref.current.rotation.x = Math.sin(t * 0.9 + 1.2) * 0.7  // ±40° 피치, 위상 어긋남
```

서로 다른 주기 + 위상차 덕분에 두 관절이 **따로 노는 느낌**이 납니다. 텔레메트리가 없어도 동작해요. (모킹용으로 “일단 보여주기” 가 목적이니까요.)

### 5.4. 온도 시각화

`latestData` 가 있으면 어깨/팔꿈치 머티리얼의 `color` + `emissive` 를 온도 비율(30°C → 45°C 사이)에 맞춰 청록 ↔ 빨강으로 보간합니다. 위험 상태일수록 발광이 강해져 시각적으로 구분돼요.

---

## 6. 시스템 상태 판정 로직 (`Dashboard.tsx`)

가장 최근 텔레메트리 한 점을 보고 다음 임계치로 분기합니다:

| 상태 | 조건 |
|---|---|
| **SAFE**    | 최대 토크 ≤ 15 Nm 그리고 최대 온도 ≤ 35 °C |
| **WARNING** | 토크 ≤ 30 Nm 그리고 온도 ≤ 40 °C (그러나 SAFE 초과) |
| **DANGER**  | 토크 > 30 Nm 또는 온도 > 40 °C |
| **ERROR**   | 토크 > 50 Nm 또는 온도 > 45 °C |

상태가 SAFE 가 아니게 되면 `AIAnalysisCard` 가 Gemini 에 `현재 토크/온도/임계치/감지된 모터` 를 넣어 한국어로 3문장 이내 진단을 받아옵니다. SAFE 로 돌아오면 분석 결과는 비워져요.

---

## 7. 자주 부딪히는 문제

### CSS @import 경고

`@import url(...)` 은 다른 CSS 룰보다 **먼저** 와야 합니다. 폰트는 `index.html` 에 `<link>` 로 넣어 이 문제를 회피했어요. 새 폰트를 추가할 때도 가급적 `<link>` 또는 Tailwind 의 `@import "tailwindcss"` 위쪽에 두세요.

### 3D 뷰가 안 보임 / 부품이 흩어짐

- `nodes.NodeX.rotation` 을 직접 바꿔도 `<mesh geometry={...} />` 에는 적용되지 않습니다 (geometry 만 가져왔으니까요). 회전을 시키고 싶으면 **`<group ref>` 에다가 적용**해야 합니다.
- GLB 가 평탄 구조라 부모-자식 회전이 자동으로 되지 않습니다. `RobotModel.tsx` 의 그룹 중첩을 그대로 유지해 주세요.

### Gemini API 호출 실패

`.env` 의 `VITE_GEMINI_API_KEY` 를 확인하세요. 모델 이름이 바뀐 경우 `Dashboard.tsx` 의 `model: "gemini-3-flash-preview"` 도 같이 손봐줘야 합니다.

---

## 8. 다음 단계 아이디어

- 실제 MQTT/WebSocket 으로 텔레메트리 수신
- 그리퍼(Node7~9) 를 별도 관절로 분리해서 “집고-놓기” 모션 추가
- DetailView 에 모터별 FFT/스펙트럼 카드 추가
- 임계치/주기 같은 상수를 한 파일로 분리 (`config/thresholds.ts`)
