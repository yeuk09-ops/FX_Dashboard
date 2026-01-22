// ========================================
// FNF 외환 종합 대시보드 데이터
// 분기/누적 이원화 구조 (DB 기반 Single Source of Truth)
// ========================================

export type ViewMode = 'quarterly' | 'cumulative';

// 통화별 색상 정의
export const currencyColors: Record<string, string> = {
  USD: '#3B82F6',   // blue-500
  CNY: '#EF4444',   // red-500
  HKD: '#10B981',   // emerald-500
  EUR: '#8B5CF6',   // violet-500
  JPY: '#F59E0B',   // amber-500
  TWD: '#EC4899'    // pink-500
};

// ========================================
// 환율 데이터 (분기말 기준)
// ========================================
export const exchangeRateData = [
  { quarter: "23.4Q", USD: 1289.4, CNY: 180.84, HKD: 165.06, EUR: 1426.59, JPY: 9.13, TWD: 41.00 },
  { quarter: "24.1Q", USD: 1346.8, CNY: 185.75, HKD: 172.10, EUR: 1452.93, JPY: 8.89, TWD: 42.00 },
  { quarter: "24.2Q", USD: 1389.2, CNY: 190.43, HKD: 177.90, EUR: 1487.07, JPY: 8.64, TWD: 43.00 },
  { quarter: "24.3Q", USD: 1319.6, CNY: 188.74, HKD: 169.76, EUR: 1474.06, JPY: 9.25, TWD: 42.50 },
  { quarter: "24.4Q", USD: 1470.0, CNY: 201.27, HKD: 189.30, EUR: 1528.73, JPY: 9.36, TWD: 45.13 },
  { quarter: "25.1Q", USD: 1466.5, CNY: 201.68, HKD: 188.53, EUR: 1587.85, JPY: 9.82, TWD: 45.50 },
  { quarter: "25.2Q", USD: 1356.4, CNY: 189.16, HKD: 172.80, EUR: 1591.80, JPY: 9.39, TWD: 44.50 },
  { quarter: "25.3Q", USD: 1402.2, CNY: 196.82, HKD: 180.15, EUR: 1644.50, JPY: 9.44, TWD: 46.10 }
];

// ========================================
// 종합 외환손익 데이터 - 분기별 (해당 분기만의 손익)
// DB 테이블: fx_comprehensive_pl (분기별 원본)
// ========================================
export const quarterlyData = [
  { quarter: "23.4Q", year: 2023, recv_balance: 1215.2, payable_balance: 0, eval_recv_pl: -6.5, eval_payable_pl: 0, eval_net_pl: -6.5, trade_recv_pl: 0, trade_payable_pl: 0, trade_net_pl: 0, settlement_recv: 0, settlement_payable: 0, total_net_pl: -6.5 },
  { quarter: "24.1Q", year: 2024, recv_balance: 527.5, payable_balance: -373.4, eval_recv_pl: 14.4, eval_payable_pl: -3.6, eval_net_pl: 10.8, trade_recv_pl: 24.7, trade_payable_pl: -21.1, trade_net_pl: 3.6, settlement_recv: 2089, settlement_payable: -969, total_net_pl: 14.4 },
  { quarter: "24.2Q", year: 2024, recv_balance: 479.3, payable_balance: -401.3, eval_recv_pl: 10.3, eval_payable_pl: -0.3, eval_net_pl: 10.1, trade_recv_pl: -7.4, trade_payable_pl: 12.5, trade_net_pl: 5.1, settlement_recv: 778, settlement_payable: -349, total_net_pl: 15.2 },
  { quarter: "24.3Q", year: 2024, recv_balance: 1018.2, payable_balance: -674.3, eval_recv_pl: -21.4, eval_payable_pl: 11.1, eval_net_pl: -10.4, trade_recv_pl: -24.1, trade_payable_pl: 24.9, trade_net_pl: 0.8, settlement_recv: 2395, settlement_payable: -959, total_net_pl: -9.6 },
  { quarter: "24.4Q", year: 2024, recv_balance: 491.6, payable_balance: -637.1, eval_recv_pl: 45.5, eval_payable_pl: -25.4, eval_net_pl: 20.1, trade_recv_pl: 48.5, trade_payable_pl: -37.0, trade_net_pl: 11.5, settlement_recv: 1284, settlement_payable: -706, total_net_pl: 31.6 },
  { quarter: "25.1Q", year: 2025, recv_balance: 735.8, payable_balance: -454.7, eval_recv_pl: 4.4, eval_payable_pl: -4.4, eval_net_pl: -0.1, trade_recv_pl: -17.8, trade_payable_pl: -12.7, trade_net_pl: -30.4, settlement_recv: 2296, settlement_payable: -1079, total_net_pl: -30.5 },
  { quarter: "25.2Q", year: 2025, recv_balance: 732.5, payable_balance: -479.8, eval_recv_pl: -38.9, eval_payable_pl: 9.2, eval_net_pl: -29.6, trade_recv_pl: 1.7, trade_payable_pl: 26.8, trade_net_pl: 28.5, settlement_recv: 1118, settlement_payable: -586, total_net_pl: -1.1 },
  { quarter: "25.3Q", year: 2025, recv_balance: 1684.8, payable_balance: -854.0, eval_recv_pl: 30.5, eval_payable_pl: -10.5, eval_net_pl: 20.0, trade_recv_pl: 58.1, trade_payable_pl: -23.7, trade_net_pl: 34.3, settlement_recv: 3012, settlement_payable: -1266, total_net_pl: 54.3 }
];

// ========================================
// 종합 외환손익 데이터 - 누적 (연초부터 해당 분기까지 YTD)
// DB 테이블: fx_cumulative_pl (계산된 누적)
// ========================================
export const cumulativeData = [
  { quarter: "23.4Q", year: 2023, recv_balance: 1215.2, payable_balance: 0, eval_recv_pl: -6.5, eval_payable_pl: 0, eval_net_pl: -6.5, trade_recv_pl: 0, trade_payable_pl: 0, trade_net_pl: 0, settlement_recv: 0, settlement_payable: 0, total_net_pl: -6.5 },
  { quarter: "24.1Q", year: 2024, recv_balance: 527.5, payable_balance: -373.4, eval_recv_pl: 14.4, eval_payable_pl: -3.6, eval_net_pl: 10.8, trade_recv_pl: 24.7, trade_payable_pl: -21.1, trade_net_pl: 3.6, settlement_recv: 2089, settlement_payable: -969, total_net_pl: 14.4 },
  { quarter: "24.2Q", year: 2024, recv_balance: 479.3, payable_balance: -401.3, eval_recv_pl: 24.7, eval_payable_pl: -3.9, eval_net_pl: 20.9, trade_recv_pl: 17.3, trade_payable_pl: -8.6, trade_net_pl: 8.7, settlement_recv: 2867, settlement_payable: -1318, total_net_pl: 29.6 },
  { quarter: "24.3Q", year: 2024, recv_balance: 1018.2, payable_balance: -674.3, eval_recv_pl: 3.3, eval_payable_pl: 7.2, eval_net_pl: 10.5, trade_recv_pl: -6.8, trade_payable_pl: 16.3, trade_net_pl: 9.5, settlement_recv: 5262, settlement_payable: -2277, total_net_pl: 20.0 },
  { quarter: "24.4Q", year: 2024, recv_balance: 491.6, payable_balance: -637.1, eval_recv_pl: 48.8, eval_payable_pl: -18.2, eval_net_pl: 30.6, trade_recv_pl: 41.7, trade_payable_pl: -20.7, trade_net_pl: 21.0, settlement_recv: 6546, settlement_payable: -2983, total_net_pl: 51.6 },
  { quarter: "25.1Q", year: 2025, recv_balance: 735.8, payable_balance: -454.7, eval_recv_pl: 4.4, eval_payable_pl: -4.4, eval_net_pl: -0.1, trade_recv_pl: -17.8, trade_payable_pl: -12.7, trade_net_pl: -30.4, settlement_recv: 2296, settlement_payable: -1079, total_net_pl: -30.5 },
  { quarter: "25.2Q", year: 2025, recv_balance: 732.5, payable_balance: -479.8, eval_recv_pl: -34.5, eval_payable_pl: 4.8, eval_net_pl: -29.7, trade_recv_pl: -16.1, trade_payable_pl: 14.1, trade_net_pl: -1.9, settlement_recv: 3414, settlement_payable: -1665, total_net_pl: -31.6 },
  { quarter: "25.3Q", year: 2025, recv_balance: 1684.8, payable_balance: -854.0, eval_recv_pl: -4.0, eval_payable_pl: -5.7, eval_net_pl: -9.7, trade_recv_pl: 42.0, trade_payable_pl: -9.6, trade_net_pl: 32.4, settlement_recv: 6426, settlement_payable: -2931, total_net_pl: 22.7 }
];

// ========================================
// 통화별 채권 평가손익 - 분기별
// ========================================
export const currencyRecvEvalPL_Quarterly = [
  { quarter: "23.4Q", CNY: -5.46, HKD: 1.45, USD: -0.92, TWD: -1.53, EUR: 0.00 },
  { quarter: "24.1Q", CNY: 5.67, HKD: 10.78, USD: 1.81, TWD: 2.53, EUR: 0.02 },
  { quarter: "24.2Q", CNY: 0.21, HKD: 9.67, USD: -0.06, TWD: 0.51, EUR: 0.04 },
  { quarter: "24.3Q", CNY: 0.81, HKD: -19.49, USD: -1.61, TWD: -1.05, EUR: -0.11 },
  { quarter: "24.4Q", CNY: -0.08, HKD: 38.59, USD: 3.30, TWD: 3.30, EUR: 0.45 },
  { quarter: "25.1Q", CNY: 2.37, HKD: -0.88, USD: 1.11, TWD: 1.26, EUR: 0.50 },
  { quarter: "25.2Q", CNY: -3.62, HKD: -30.37, USD: -2.95, TWD: -1.41, EUR: -0.47 },
  { quarter: "25.3Q", CNY: 10.38, HKD: 17.61, USD: 1.95, TWD: 0.50, EUR: 0.03 }
];

// ========================================
// 통화별 채권 평가손익 - 누적 (YTD)
// ========================================
export const currencyRecvEvalPL_Cumulative = [
  { quarter: "23.4Q", CNY: -5.46, HKD: 1.45, USD: -0.92, TWD: -1.53, EUR: 0.00 },
  { quarter: "24.1Q", CNY: 0.21, HKD: 12.23, USD: 0.89, TWD: 1.00, EUR: 0.02 },
  { quarter: "24.2Q", CNY: 0.42, HKD: 21.90, USD: 0.83, TWD: 1.51, EUR: 0.06 },
  { quarter: "24.3Q", CNY: 1.23, HKD: 2.41, USD: -0.78, TWD: 0.46, EUR: -0.05 },
  { quarter: "24.4Q", CNY: 1.15, HKD: 41.00, USD: 2.52, TWD: 3.76, EUR: 0.40 },
  { quarter: "25.1Q", CNY: 2.37, HKD: -0.88, USD: 1.11, TWD: 1.26, EUR: 0.50 },
  { quarter: "25.2Q", CNY: -1.25, HKD: -31.25, USD: -1.84, TWD: -0.15, EUR: 0.03 },
  { quarter: "25.3Q", CNY: 9.13, HKD: -13.64, USD: 0.11, TWD: 0.35, EUR: 0.06 }
];

// ========================================
// 통화별 채무 평가손익 - 분기별
// ========================================
export const currencyPayableEvalPL_Quarterly = [
  { quarter: "23.4Q", USD: 0, EUR: 0, CNY: 0, JPY: 0 },
  { quarter: "24.1Q", USD: -3.57, EUR: -0.17, CNY: 0.00, JPY: 0 },
  { quarter: "24.2Q", USD: -0.29, EUR: 0.18, CNY: 0.01, JPY: 0 },
  { quarter: "24.3Q", USD: 11.08, EUR: 0.05, CNY: -0.01, JPY: 0 },
  { quarter: "24.4Q", USD: -25.42, EUR: -0.24, CNY: -0.01, JPY: 0 },
  { quarter: "25.1Q", USD: -4.38, EUR: -0.50, CNY: 0.00, JPY: 0 },
  { quarter: "25.2Q", USD: 9.13, EUR: 0.52, CNY: 0.00, JPY: 0 },
  { quarter: "25.3Q", USD: -10.46, EUR: -0.08, CNY: 0.00, JPY: 0 }
];

// ========================================
// 통화별 채무 평가손익 - 누적 (YTD)
// ========================================
export const currencyPayableEvalPL_Cumulative = [
  { quarter: "23.4Q", USD: 0, EUR: 0, CNY: 0, JPY: 0 },
  { quarter: "24.1Q", USD: -3.57, EUR: -0.17, CNY: 0.00, JPY: 0 },
  { quarter: "24.2Q", USD: -3.86, EUR: 0.01, CNY: 0.01, JPY: 0 },
  { quarter: "24.3Q", USD: 7.22, EUR: 0.06, CNY: 0.00, JPY: 0 },
  { quarter: "24.4Q", USD: -18.20, EUR: -0.18, CNY: -0.01, JPY: 0 },
  { quarter: "25.1Q", USD: -4.38, EUR: -0.50, CNY: 0.00, JPY: 0 },
  { quarter: "25.2Q", USD: 4.75, EUR: 0.02, CNY: 0.00, JPY: 0 },
  { quarter: "25.3Q", USD: -5.71, EUR: -0.06, CNY: 0.00, JPY: 0 }
];

// ========================================
// 통화별 거래손익 - 분기별
// ========================================
export const currencyTradePL_Quarterly = [
  { quarter: "24.1Q", CNY: 21.2, HKD: 3.2, USD: 0.1, TWD: 0, EUR: 0 },
  { quarter: "24.2Q", CNY: -10.4, HKD: -0.8, USD: 3.6, TWD: -0.1, EUR: 0 },
  { quarter: "24.3Q", CNY: -22.6, HKD: -0.7, USD: -0.4, TWD: 0.1, EUR: 0 },
  { quarter: "24.4Q", CNY: 50.3, HKD: 0.8, USD: -3.6, TWD: 0, EUR: 0 },
  { quarter: "25.1Q", CNY: -28.3, HKD: 3.3, USD: 6.8, TWD: -0.8, EUR: 0 },
  { quarter: "25.2Q", CNY: 14.5, HKD: -3.3, USD: -11.3, TWD: 0.6, EUR: 0.9 },
  { quarter: "25.3Q", CNY: 55.9, HKD: 1.9, USD: 11.4, TWD: -0.6, EUR: 0.3 }
];

// ========================================
// 통화별 거래손익 - 누적 (YTD)
// ========================================
export const currencyTradePL_Cumulative = [
  { quarter: "24.1Q", CNY: 21.2, HKD: 3.2, USD: 0.1, TWD: 0, EUR: 0 },
  { quarter: "24.2Q", CNY: 10.8, HKD: 2.4, USD: 3.7, TWD: -0.1, EUR: 0 },
  { quarter: "24.3Q", CNY: -11.8, HKD: 1.7, USD: 3.3, TWD: 0, EUR: 0 },
  { quarter: "24.4Q", CNY: 38.5, HKD: 2.5, USD: -0.3, TWD: 0, EUR: 0 },
  { quarter: "25.1Q", CNY: -28.3, HKD: 3.3, USD: 6.8, TWD: -0.8, EUR: 0 },
  { quarter: "25.2Q", CNY: -13.8, HKD: 0, USD: -4.5, TWD: -0.2, EUR: 0.9 },
  { quarter: "25.3Q", CNY: 42.1, HKD: -1.4, USD: 0.1, TWD: 0, EUR: 1.2 }
];

// ========================================
// 통화별 장부금액 추이
// ========================================
export const currencyBalanceData = [
  { quarter: "23.4Q", recv_CNY: 733.2, recv_HKD: 349.0, recv_USD: 43.8, recv_TWD: 88.7, recv_EUR: 0.5, pay_USD: 0, pay_EUR: 0 },
  { quarter: "24.1Q", recv_CNY: 7.8, recv_HKD: 352.8, recv_USD: 81.1, recv_TWD: 83.4, recv_EUR: 2.3, pay_USD: -371.5, pay_EUR: -1.7 },
  { quarter: "24.2Q", recv_CNY: 22.3, recv_HKD: 336.0, recv_USD: 59.6, recv_TWD: 59.2, recv_EUR: 2.2, pay_USD: -400.3, pay_EUR: -0.2 },
  { quarter: "24.3Q", recv_CNY: 518.0, recv_HKD: 364.1, recv_USD: 57.2, recv_TWD: 67.4, recv_EUR: 11.6, pay_USD: -668.0, pay_EUR: -0.7 },
  { quarter: "24.4Q", recv_CNY: 12.7, recv_HKD: 360.4, recv_USD: 41.9, recv_TWD: 64.4, recv_EUR: 12.2, pay_USD: -635.8, pay_EUR: -1.2 },
  { quarter: "25.1Q", recv_CNY: 204.5, recv_HKD: 348.2, recv_USD: 106.3, recv_TWD: 63.0, recv_EUR: 13.8, pay_USD: -452.9, pay_EUR: -1.7 },
  { quarter: "25.2Q", recv_CNY: 19.6, recv_HKD: 343.5, recv_USD: 43.8, recv_TWD: 46.4, recv_EUR: 0.8, pay_USD: -478.6, pay_EUR: -1.1 },
  { quarter: "25.3Q", recv_CNY: 1154.2, recv_HKD: 375.0, recv_USD: 80.5, recv_TWD: 74.2, recv_EUR: 0.8, pay_USD: -853.1, pay_EUR: -0.8 }
];

// ========================================
// 환율 변동성 데이터 (최근 8분기 기준)
// ========================================
export const volatilityData: Record<string, { stdDev: number; range: { min: number; max: number }; volatility: number }> = {
  USD: { stdDev: 58.2, range: { min: 1289.4, max: 1470.0 }, volatility: 4.4 },
  CNY: { stdDev: 7.1, range: { min: 180.84, max: 201.68 }, volatility: 3.9 },
  HKD: { stdDev: 8.5, range: { min: 165.06, max: 189.30 }, volatility: 5.0 },
  EUR: { stdDev: 73.5, range: { min: 1426.59, max: 1644.50 }, volatility: 5.0 },
  JPY: { stdDev: 0.41, range: { min: 8.64, max: 9.82 }, volatility: 4.5 },
  TWD: { stdDev: 1.8, range: { min: 41.00, max: 46.10 }, volatility: 4.4 }
};

// ========================================
// 민감도 분석 데이터 (25.3Q 기준)
// ========================================
export interface SensitivityItem {
  currency: string;
  recvBalance: number;      // 채권 잔액 (억원)
  payableBalance: number;   // 채무 잔액 (억원)
  netExposure: number;      // 순 익스포저 (채권 - 채무)
  currentRate: number;      // 현재 환율
  change1pct: number;       // 1% 변동 시 영향 (억원)
  change10won: number;      // 10원 변동 시 영향 (억원)
  riskLevel: 'high' | 'medium' | 'low';
  hedgeRatio: number;       // 자연헤지율 (%)
}

export const sensitivityAnalysis: SensitivityItem[] = [
  {
    currency: 'CNY',
    recvBalance: 1154.2,
    payableBalance: 0,
    netExposure: 1154.2,
    currentRate: 196.82,
    change1pct: 11.54,
    change10won: 58.6,
    riskLevel: 'high',
    hedgeRatio: 0
  },
  {
    currency: 'HKD',
    recvBalance: 375.0,
    payableBalance: 0,
    netExposure: 375.0,
    currentRate: 180.15,
    change1pct: 3.75,
    change10won: 20.8,
    riskLevel: 'medium',
    hedgeRatio: 0
  },
  {
    currency: 'USD',
    recvBalance: 80.5,
    payableBalance: -853.1,
    netExposure: -772.6,
    currentRate: 1402.2,
    change1pct: -7.73,
    change10won: -5.5,
    riskLevel: 'high',
    hedgeRatio: 9.4
  },
  {
    currency: 'EUR',
    recvBalance: 0.8,
    payableBalance: -0.8,
    netExposure: 0,
    currentRate: 1644.50,
    change1pct: 0,
    change10won: 0,
    riskLevel: 'low',
    hedgeRatio: 100
  },
  {
    currency: 'TWD',
    recvBalance: 74.2,
    payableBalance: 0,
    netExposure: 74.2,
    currentRate: 46.10,
    change1pct: 0.74,
    change10won: 16.1,
    riskLevel: 'low',
    hedgeRatio: 0
  }
];

// ========================================
// 시나리오 분석 데이터
// ========================================
export interface ScenarioItem {
  scenario: string;
  description: string;
  USD: number;
  CNY: number;
  HKD: number;
  EUR: number;
  total: number;
}

export const scenarioAnalysis: ScenarioItem[] = [
  {
    scenario: '환율 5% 상승',
    description: '주요 통화 일괄 5% 상승 시 손익 영향',
    USD: -38.6,
    CNY: 57.7,
    HKD: 18.8,
    EUR: 0,
    total: 37.9
  },
  {
    scenario: '환율 5% 하락',
    description: '주요 통화 일괄 5% 하락 시 손익 영향',
    USD: 38.6,
    CNY: -57.7,
    HKD: -18.8,
    EUR: 0,
    total: -37.9
  },
  {
    scenario: 'USD만 10% 상승',
    description: '달러 단독 급등 시 손익 영향 (원화 약세)',
    USD: -77.3,
    CNY: 0,
    HKD: 0,
    EUR: 0,
    total: -77.3
  },
  {
    scenario: 'CNY만 10% 상승',
    description: '위안화 단독 급등 시 손익 영향',
    USD: 0,
    CNY: 115.4,
    HKD: 0,
    EUR: 0,
    total: 115.4
  }
];

// ========================================
// 리스크 지표 데이터
// ========================================
export const riskIndicators = {
  totalRecvBalance: 1684.8,      // 총 외화채권 (억원)
  totalPayableBalance: 854.0,    // 총 외화채무 (억원)
  netExposure: 830.8,            // 순 익스포저 (억원)
  netExposureRatio: 50.7,        // 순 익스포저 비율 (%)
  usdNaturalHedgeRatio: 9.4,     // USD 자연헤지율 (%)
  usdVolatility: 4.4,            // USD 변동성 (%)
  maxExposureCurrency: 'CNY',    // 최대 익스포저 통화
  maxExposureAmount: 1154.2,     // 최대 익스포저 금액 (억원)
  impact1pctAll: 8.3             // 전체 1% 변동 시 영향 (억원)
};

// ========================================
// 환위험 관리방안 데이터
// ========================================
export interface ManagementRecommendation {
  currency: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  recommendations: string[];
}

export const managementRecommendations: ManagementRecommendation[] = [
  {
    currency: 'CNY',
    title: 'CNY 집중 리스크 관리',
    description: 'CNY 채권 1,154억원은 전체 채권의 68%를 차지하여 집중 리스크 존재',
    priority: 'high',
    recommendations: [
      'CNY 채권 결제 시기 분산 (월별 균등 수금)',
      'CNY 선물환 매도 계약 검토 (50% 헤지)',
      '중국 매출처 결제조건 협의 (조기수금 인센티브)'
    ]
  },
  {
    currency: 'USD',
    title: 'USD 자연 헤지 확대',
    description: 'USD 채권 80억 대비 채무 853억으로 순채무 포지션',
    priority: 'medium',
    recommendations: [
      'USD 결제 매입 확대로 자연헤지 비율 개선',
      'USD 채무 결제 시기 조정 (환율 하락 시 선지급)',
      '달러 예금 운용으로 환차익 기회 활용'
    ]
  },
  {
    currency: 'HKD',
    title: 'HKD 장부환율 관리',
    description: 'HKD 장부환율(189.6원)이 현재 환율(180.2원) 대비 고평가',
    priority: 'medium',
    recommendations: [
      '고환율 시점 발생 채권 우선 회수',
      'HKD 연계 페그제 특성상 USD 헤지로 간접 관리',
      '홍콩 거래처 결제통화 USD 전환 협의'
    ]
  }
];

// ========================================
// 액션 플랜 데이터
// ========================================
export interface ActionPlan {
  period: 'short' | 'medium' | 'long';
  periodLabel: string;
  duration: string;
  actions: string[];
}

export const actionPlans: ActionPlan[] = [
  {
    period: 'short',
    periodLabel: '단기',
    duration: '1개월',
    actions: [
      'CNY 500억원 선물환 매도 계약 체결',
      'USD 채무 200억원 조기 상환 검토'
    ]
  },
  {
    period: 'medium',
    periodLabel: '중기',
    duration: '3개월',
    actions: [
      'HKD 채권 회수 일정 조정 (고환율 채권 우선)',
      '자연헤지 비율 목표 설정 (20% → 30%)'
    ]
  },
  {
    period: 'long',
    periodLabel: '장기',
    duration: '6개월',
    actions: [
      '통화별 익스포저 한도 설정 및 모니터링',
      '환위험 관리 정책 수립 및 시스템화'
    ]
  }
];

// ========================================
// 타입 정의
// ========================================
export interface ComprehensiveData {
  quarter: string;
  year: number;
  recv_balance: number;
  payable_balance: number;
  eval_recv_pl: number;
  eval_payable_pl: number;
  eval_net_pl: number;
  trade_recv_pl: number;
  trade_payable_pl: number;
  trade_net_pl: number;
  settlement_recv: number;
  settlement_payable: number;
  total_net_pl: number;
}

export interface ExchangeRate {
  quarter: string;
  USD: number;
  CNY: number;
  HKD: number;
  EUR: number;
  JPY: number;
  TWD: number;
}

export interface CurrencyEvalPL {
  quarter: string;
  CNY: number;
  HKD: number;
  USD: number;
  TWD: number;
  EUR: number;
}

export interface CurrencyPayablePL {
  quarter: string;
  USD: number;
  EUR: number;
  CNY: number;
  JPY: number;
}

export interface CurrencyBalance {
  quarter: string;
  recv_CNY: number;
  recv_HKD: number;
  recv_USD: number;
  recv_TWD: number;
  recv_EUR: number;
  pay_USD: number;
  pay_EUR: number;
}

// ========================================
// 헬퍼 함수
// ========================================

/**
 * viewMode에 따라 적절한 종합 데이터를 반환
 */
export const getComprehensiveData = (viewMode: ViewMode): ComprehensiveData[] => {
  return viewMode === 'quarterly' ? quarterlyData : cumulativeData;
};

/**
 * viewMode에 따라 적절한 채권 평가손익 데이터를 반환
 */
export const getCurrencyRecvEvalPL = (viewMode: ViewMode): CurrencyEvalPL[] => {
  return viewMode === 'quarterly' ? currencyRecvEvalPL_Quarterly : currencyRecvEvalPL_Cumulative;
};

/**
 * viewMode에 따라 적절한 채무 평가손익 데이터를 반환
 */
export const getCurrencyPayableEvalPL = (viewMode: ViewMode): CurrencyPayablePL[] => {
  return viewMode === 'quarterly' ? currencyPayableEvalPL_Quarterly : currencyPayableEvalPL_Cumulative;
};

/**
 * viewMode에 따라 적절한 거래손익 데이터를 반환
 */
export const getCurrencyTradePL = (viewMode: ViewMode) => {
  return viewMode === 'quarterly' ? currencyTradePL_Quarterly : currencyTradePL_Cumulative;
};

/**
 * YoY 변동률 계산
 */
export const calcYoY = (current: number, yoy: number): number => {
  return yoy !== 0 ? ((current - yoy) / Math.abs(yoy)) * 100 : 0;
};

/**
 * YoY 변동금액 계산
 */
export const calcYoYAmount = (current: number, yoy: number): number => {
  return current - yoy;
};
