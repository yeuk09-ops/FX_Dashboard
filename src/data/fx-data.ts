// ========================================
// FNF 외환 종합 대시보드 데이터
// 동적 분기 선택 구조 (JSON 기반)
// ========================================

// JSON 데이터 import
import data254Q from './quarters/25.4Q.json';
import data253Q from './quarters/25.3Q.json';

export type ViewMode = 'quarterly' | 'cumulative';
export type BaseQuarter = '25.4Q' | '25.3Q';

// ========================================
// 분기 설정
// ========================================
export const AVAILABLE_QUARTERS: BaseQuarter[] = ['25.4Q', '25.3Q'];
export const DEFAULT_QUARTER: BaseQuarter = '25.4Q';

// ========================================
// 분기별 데이터 매핑
// ========================================
interface QuarterData {
  baseQuarter: string;
  lastUpdated: string;
  exchangeRateData: ExchangeRateItem[];
  quarterlyData: ComprehensiveDataItem[];
  cumulativeData: ComprehensiveDataItem[];
  currencyRecvEvalPL_Quarterly: CurrencyEvalPLItem[];
  currencyRecvEvalPL_Cumulative: CurrencyEvalPLItem[];
  currencyPayableEvalPL_Quarterly: CurrencyPayableEvalPLItem[];
  currencyPayableEvalPL_Cumulative: CurrencyPayableEvalPLItem[];
  currencyTradePL_Quarterly: CurrencyTradePLItem[];
  currencyTradePL_Cumulative: CurrencyTradePLItem[];
  currencyBalanceData: CurrencyBalanceItem[];
  currencyRecvSettlement_Quarterly: CurrencySettlementItem[];
  currencyRecvSettlement_Cumulative: CurrencySettlementItem[];
  currencyPaySettlement_Quarterly: CurrencyPaySettlementItem[];
  currencyPaySettlement_Cumulative: CurrencyPaySettlementItem[];
  volatilityData: VolatilityData;
  sensitivityAnalysis: SensitivityItem[];
  scenarioAnalysis: ScenarioItem[];
  riskIndicators: RiskIndicators;
  managementRecommendations: RecommendationItem[];
  actionPlans: ActionPlanItem[];
  aiInsight: AIInsight;
}

// 분기별 데이터 맵
const quarterDataMap: Record<BaseQuarter, QuarterData> = {
  '25.4Q': data254Q as QuarterData,
  '25.3Q': data253Q as QuarterData
};

// ========================================
// 데이터 getter 함수
// ========================================
export function getQuarterData(quarter: BaseQuarter = DEFAULT_QUARTER): QuarterData {
  return quarterDataMap[quarter];
}

export function getBaseQuarter(quarter: BaseQuarter = DEFAULT_QUARTER): string {
  return quarterDataMap[quarter].baseQuarter;
}

export function getLastUpdated(quarter: BaseQuarter = DEFAULT_QUARTER): string {
  return quarterDataMap[quarter].lastUpdated;
}

// ========================================
// 타입 정의
// ========================================
interface ExchangeRateItem {
  quarter: string;
  USD: number;
  CNY: number;
  HKD: number;
  EUR: number;
  JPY: number;
  TWD: number;
}

interface ComprehensiveDataItem {
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

interface CurrencyEvalPLItem {
  quarter: string;
  CNY: number;
  HKD: number;
  USD: number;
  TWD: number;
  EUR: number;
}

interface CurrencyPayableEvalPLItem {
  quarter: string;
  USD: number;
  EUR: number;
  CNY: number;
  JPY: number;
}

interface CurrencyTradePLItem {
  quarter: string;
  CNY: number;
  HKD: number;
  USD: number;
  TWD: number;
  EUR: number;
}

interface CurrencyBalanceItem {
  quarter: string;
  recv_CNY: number;
  recv_HKD: number;
  recv_USD: number;
  recv_TWD: number;
  recv_EUR: number;
  pay_USD: number;
  pay_EUR: number;
}

interface CurrencySettlementItem {
  quarter: string;
  CNY: number;
  HKD: number;
  USD: number;
  TWD: number;
  EUR: number;
}

interface CurrencyPaySettlementItem {
  quarter: string;
  USD: number;
  EUR: number;
  CNY: number;
}

interface VolatilityData {
  [currency: string]: {
    stdDev: number;
    range: { min: number; max: number };
    volatility: number;
  };
}

interface SensitivityItem {
  currency: string;
  recvBalance: number;
  payableBalance: number;
  netExposure: number;
  currentRate: number;
  change1pct: number;
  change10won: number;
  riskLevel: string;
  hedgeRatio: number;
}

export interface ScenarioItem {
  scenario: string;
  description: string;
  USD: number;
  CNY: number;
  HKD: number;
  EUR: number;
  total: number;
}

interface RiskIndicators {
  totalRecvBalance: number;
  totalPayableBalance: number;
  netExposure: number;
  netExposureRatio: number;
  usdNaturalHedgeRatio: number;
  usdVolatility: number;
  maxExposureCurrency: string;
  maxExposureAmount: number;
  impact1pctAll: number;
}

interface RecommendationItem {
  currency: string;
  title: string;
  description: string;
  priority: string;
  recommendations: string[];
}

interface ActionPlanItem {
  period: string;
  periodLabel: string;
  duration: string;
  actions: string[];
}

interface InstitutionalForecast {
  institution: string;
  q1: number;
  q2: number;
  yearEnd: number;
  trend: string;
}

interface AIInsight {
  lastUpdated: string;
  businessStructure: {
    recv: {
      cnyRatio: number;
      cnyAmount: number;
      hkdAmount: number;
      twdAmount: number;
      description: string;
    };
    pay: {
      usdAmount: number;
      usdHedgeRatio: number;
      description: string;
    };
  };
  strengths: string[];
  risks: string[];
  fxOutlook: {
    usd: {
      current: number;
      forecastRange: string;
      source: string;
      comment: string;
      impact: string;
      institutionalForecasts: InstitutionalForecast[];
    };
    cny: {
      current: number;
      forecastRange: string;
      source: string;
      comment: string;
      impact: string;
      institutionalForecasts: InstitutionalForecast[];
    };
    overall: {
      rating: string;
      comment: string;
      warning: string;
    };
    lastUpdated?: string;
  };
  hedgeActions: {
    period: string;
    title: string;
    description: string;
  }[];
}

// ========================================
// 통화별 색상 정의
// ========================================
export const currencyColors: Record<string, string> = {
  USD: '#3B82F6',   // blue-500
  CNY: '#EF4444',   // red-500
  HKD: '#10B981',   // emerald-500
  EUR: '#8B5CF6',   // violet-500
  JPY: '#F59E0B',   // amber-500
  TWD: '#EC4899'    // pink-500
};

// ========================================
// 기본 데이터 export (DEFAULT_QUARTER 기준)
// 하위 호환성을 위해 유지
// ========================================
const defaultData = quarterDataMap[DEFAULT_QUARTER];

export const exchangeRateData = defaultData.exchangeRateData;
export const quarterlyData = defaultData.quarterlyData;
export const cumulativeData = defaultData.cumulativeData;
export const currencyRecvEvalPL_Quarterly = defaultData.currencyRecvEvalPL_Quarterly;
export const currencyRecvEvalPL_Cumulative = defaultData.currencyRecvEvalPL_Cumulative;
export const currencyPayableEvalPL_Quarterly = defaultData.currencyPayableEvalPL_Quarterly;
export const currencyPayableEvalPL_Cumulative = defaultData.currencyPayableEvalPL_Cumulative;
export const currencyTradePL_Quarterly = defaultData.currencyTradePL_Quarterly;
export const currencyTradePL_Cumulative = defaultData.currencyTradePL_Cumulative;
export const currencyBalanceData = defaultData.currencyBalanceData;
export const currencyRecvSettlement_Quarterly = defaultData.currencyRecvSettlement_Quarterly;
export const currencyRecvSettlement_Cumulative = defaultData.currencyRecvSettlement_Cumulative;
export const currencyPaySettlement_Quarterly = defaultData.currencyPaySettlement_Quarterly;
export const currencyPaySettlement_Cumulative = defaultData.currencyPaySettlement_Cumulative;
export const volatilityData = defaultData.volatilityData;
export const sensitivityAnalysis = defaultData.sensitivityAnalysis;
export const scenarioAnalysis = defaultData.scenarioAnalysis;
export const riskIndicators = defaultData.riskIndicators;
export const managementRecommendations = defaultData.managementRecommendations;
export const actionPlans = defaultData.actionPlans;
export const aiInsight = defaultData.aiInsight;

// ========================================
// 통화별 채권/채무 평가손익 (하위 호환)
// ========================================
export const currencyRecvEvalPL = currencyRecvEvalPL_Cumulative;
export const currencyPayableEvalPL = currencyPayableEvalPL_Cumulative;

// ========================================
// 유틸리티 함수
// ========================================

// YoY 변화율 계산 (%)
export function calcYoY(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

// YoY 변화량 계산 (절대값)
export function calcYoYAmount(current: number, previous: number): number {
  return current - previous;
}

// 분기 비교 함수 (기준분기와 비교분기)
export function getCompareQuarter(baseQ: string, viewMode: ViewMode): string {
  // 예: 25.4Q → 누적: 24.4Q (전기말), 분기: 24.4Q (전년동기)
  const year = parseInt(baseQ.slice(0, 2));
  const q = baseQ.slice(3, 4);
  return `${year - 1}.${q}Q`;
}

// 전분기 계산
export function getPrevQuarter(quarter: string): string {
  const year = parseInt(quarter.slice(0, 2));
  const q = parseInt(quarter.slice(3, 4));
  if (q === 1) {
    return `${year - 1}.4Q`;
  }
  return `${year}.${q - 1}Q`;
}
