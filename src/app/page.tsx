'use client';

import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Area, AreaChart, ReferenceLine, Cell
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Globe,
  ArrowUpRight, ArrowDownRight, BarChart3, Repeat,
  Scale, Info, Lightbulb, Target, AlertTriangle,
  Shield, Activity, FileText, ChevronRight, CheckCircle,
  AlertCircle, Clock, Zap, Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import {
  ViewMode,
  BaseQuarter,
  AVAILABLE_QUARTERS,
  DEFAULT_QUARTER,
  currencyColors,
  getQuarterData,
  ScenarioItem,
  // 타입 정의용 기본 데이터 (DEFAULT_QUARTER 기준)
  exchangeRateData as defaultExchangeRateData,
  quarterlyData as defaultQuarterlyData,
  currencyBalanceData as defaultCurrencyBalanceData,
  sensitivityAnalysis as defaultSensitivityAnalysis,
  calcYoY,
  calcYoYAmount,
  getCompareQuarter,
} from '@/data/fx-data';

// ========================================
// KPI 카드 컴포넌트
// ========================================
interface KPIDetail {
  label: string;
  value: number;
  yoyValue?: number;
}

interface CurrencyBreakdownItem {
  currency: string;
  value: number;
  ratio: number;
}

interface EnhancedKPICardProps {
  title: string;
  value: number;
  yoyChange: number;
  yoyAmount?: number;
  yoyValue?: number;
  compareLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: 'good' | 'bad';
  color?: string;
  details?: KPIDetail[];
  currencyBreakdown?: CurrencyBreakdownItem[];
}

const EnhancedKPICard: React.FC<EnhancedKPICardProps> = ({
  title, value, yoyChange, yoyAmount, yoyValue, compareLabel = "전년동기", icon: Icon, trend, details, currencyBreakdown, color = "blue"
}) => {
  const isPositive = yoyChange >= 0;
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;
  const trendColor = trend === 'good'
    ? (isPositive ? 'text-emerald-600' : 'text-red-500')
    : (isPositive ? 'text-red-500' : 'text-emerald-600');

  const gradientColors: Record<string, string> = {
    blue: "from-blue-50 to-indigo-100",
    green: "from-emerald-50 to-teal-100",
    red: "from-red-50 to-rose-100",
    purple: "from-purple-50 to-violet-100",
    orange: "from-orange-50 to-amber-100"
  };

  const valueColor = value >= 0 ? 'text-emerald-600' : 'text-red-500';

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 bg-gradient-to-br ${gradientColors[color]} rounded-xl`}>
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div className="text-right">
          <div className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
            <TrendIcon className="w-4 h-4" />
            <span>YoY {isPositive ? '+' : ''}{yoyChange?.toFixed(1)}%</span>
          </div>
          {yoyAmount !== undefined && (
            <div className={`text-[10px] mt-0.5 ${yoyAmount >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
              ({yoyAmount >= 0 ? '+' : ''}{yoyAmount.toFixed(1)}억)
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-slate-500 mb-1">{title}</div>
      <div className={`text-2xl font-bold mb-2 ${valueColor}`}>
        {value >= 0 ? '+' : ''}{value.toFixed(1)}억원
      </div>

      {yoyValue !== undefined && (
        <div className="text-xs text-slate-400 mb-3">
          {compareLabel}: <span className={yoyValue >= 0 ? 'text-emerald-500' : 'text-red-400'}>
            {yoyValue >= 0 ? '+' : ''}{yoyValue.toFixed(1)}억
          </span>
        </div>
      )}

      {details && (
        <div className="pt-3 border-t border-slate-100 space-y-1.5">
          {details.map((item, idx) => {
            const yoyDiff = item.yoyValue !== undefined ? item.value - item.yoyValue : undefined;
            return (
              <div key={idx} className="flex justify-between text-xs items-center">
                <span className="text-slate-500">{item.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`font-medium ${item.value >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {item.value >= 0 ? '+' : ''}{item.value.toFixed(1)}억
                  </span>
                  {item.yoyValue !== undefined && (
                    <span className="text-[10px] text-slate-400">
                      (전기: {item.yoyValue >= 0 ? '+' : ''}{item.yoyValue.toFixed(1)})
                    </span>
                  )}
                  {yoyDiff !== undefined && (
                    <span className={`text-[10px] font-medium ${yoyDiff >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                      {yoyDiff >= 0 ? '▲' : '▼'}{Math.abs(yoyDiff).toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {currencyBreakdown && (
        <div className="pt-3 border-t border-slate-100 mt-3">
          <div className="text-xs text-slate-400 mb-2">통화별 손익 (비중)</div>
          <div className="space-y-1.5">
            {currencyBreakdown.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currencyColors[item.currency] }}></div>
                  <span className="text-slate-600">{item.currency}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={item.value >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                    {item.value >= 0 ? '+' : ''}{item.value.toFixed(1)}억
                  </span>
                  <span className="text-slate-400">({item.ratio.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ========================================
// 환율 KPI 카드 컴포넌트
// ========================================
interface ExchangeRateKPICardProps {
  currentRates: typeof defaultExchangeRateData[0];
  prevRates: typeof defaultExchangeRateData[0];
  balanceData: typeof defaultCurrencyBalanceData[0];
  compareLabel?: string;
}

const ExchangeRateKPICard: React.FC<ExchangeRateKPICardProps> = ({ currentRates, prevRates, balanceData, compareLabel = "전분기대비" }) => {
  const qoqUsdChange = ((currentRates.USD - prevRates.USD) / prevRates.USD) * 100;
  const qoqCnyChange = ((currentRates.CNY - prevRates.CNY) / prevRates.CNY) * 100;

  const totalRecv = balanceData.recv_CNY + balanceData.recv_HKD + balanceData.recv_USD + balanceData.recv_TWD + balanceData.recv_EUR;
  const totalPayable = Math.abs(balanceData.pay_USD) + Math.abs(balanceData.pay_EUR || 0);

  const cnyRecvRatio = (balanceData.recv_CNY / totalRecv) * 100;
  const hkdRecvRatio = (balanceData.recv_HKD / totalRecv) * 100;
  const usdPayableRatio = (Math.abs(balanceData.pay_USD) / totalPayable) * 100;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl">
          <Globe className="w-5 h-5 text-amber-600" />
        </div>
        <div className="text-right text-xs text-slate-400">{compareLabel}</div>
      </div>

      <div className="text-xs text-slate-500 mb-2">주요 환율 현황</div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium text-slate-700">USD</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-slate-800">{currentRates.USD.toLocaleString()}원</span>
            <span className={`text-xs ml-2 ${qoqUsdChange >= 0 ? 'text-red-500' : 'text-emerald-600'}`}>
              ({qoqUsdChange >= 0 ? '+' : ''}{qoqUsdChange.toFixed(1)}%)
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium text-slate-700">CNY</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-slate-800">{currentRates.CNY.toFixed(2)}원</span>
            <span className={`text-xs ml-2 ${qoqCnyChange >= 0 ? 'text-red-500' : 'text-emerald-600'}`}>
              ({qoqCnyChange >= 0 ? '+' : ''}{qoqCnyChange.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100">
        <div className="text-xs text-slate-400 mb-2">통화별 잔액 비중</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-blue-50 rounded-lg p-2">
            <div className="text-blue-600 font-semibold mb-1">채권 (외화)</div>
            <div className="space-y-0.5 text-slate-600">
              <div className="flex justify-between">
                <span>CNY</span>
                <span>{balanceData.recv_CNY.toFixed(0)}억 <span className="text-blue-500">({cnyRecvRatio.toFixed(1)}%)</span></span>
              </div>
              <div className="flex justify-between">
                <span>HKD</span>
                <span>{balanceData.recv_HKD.toFixed(0)}억 <span className="text-emerald-500">({hkdRecvRatio.toFixed(1)}%)</span></span>
              </div>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-2">
            <div className="text-red-600 font-semibold mb-1">채무 (외화)</div>
            <div className="space-y-0.5 text-slate-600">
              <div className="flex justify-between">
                <span>USD</span>
                <span>{Math.abs(balanceData.pay_USD).toFixed(0)}억 <span className="text-red-500">({usdPayableRatio.toFixed(1)}%)</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================
// 민감도 카드 컴포넌트
// ========================================
interface SensitivityCardProps {
  item: typeof defaultSensitivityAnalysis[0];
}

const SensitivityCard: React.FC<SensitivityCardProps> = ({ item }) => {
  const riskColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', badge: 'bg-red-100 text-red-700' },
    medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
    low: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' }
  };

  const colors = riskColors[item.riskLevel] || riskColors.low;
  const riskLabels: Record<string, string> = { high: '고위험', medium: '중위험', low: '저위험' };

  return (
    <div className={`${colors.bg} rounded-xl p-4 border ${colors.border}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currencyColors[item.currency] }}></div>
          <span className="font-bold text-slate-800">{item.currency}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${colors.badge}`}>
            {riskLabels[item.riskLevel]}
          </span>
        </div>
        <span className="text-xs text-slate-500">{item.currentRate.toLocaleString()}원</span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
        <div>
          <div className="text-slate-500 mb-1">채권 잔액</div>
          <div className="font-semibold text-blue-600">{item.recvBalance.toFixed(1)}억</div>
        </div>
        <div>
          <div className="text-slate-500 mb-1">채무 잔액</div>
          <div className="font-semibold text-red-600">{Math.abs(item.payableBalance).toFixed(1)}억</div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-200/50">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-500">순 익스포저</span>
          <span className={`font-bold ${item.netExposure >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {item.netExposure >= 0 ? '+' : ''}{item.netExposure.toFixed(1)}억
          </span>
        </div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-500">1% 변동 영향</span>
          <span className={`font-medium ${item.change1pct >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {item.change1pct >= 0 ? '+' : ''}{item.change1pct.toFixed(2)}억
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">자연헤지율</span>
          <span className="font-medium text-slate-700">{item.hedgeRatio.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

// ========================================
// AI 인사이트 섹션 (F&F 손익구조 + 환율전망 + 리스크관리)
// ========================================
interface AIInsightSectionProps {
  currentData: typeof defaultQuarterlyData[0];
  prevData: typeof defaultQuarterlyData[0];
  rateData: typeof defaultExchangeRateData[0];
  prevRateData: typeof defaultExchangeRateData[0];
  viewMode: ViewMode;
  compareLabel: string;
  baseQuarter: string;
  scenarioAnalysis: ScenarioItem[];
}

const AIInsightSection: React.FC<AIInsightSectionProps> = ({ currentData, prevData, rateData, prevRateData, viewMode, compareLabel, baseQuarter, scenarioAnalysis }) => {
  const qEvalPL = currentData.eval_net_pl;
  const qTradePL = currentData.trade_net_pl;
  const qTotalPL = currentData.total_net_pl;

  // 비교기준 데이터와의 차이
  const prevEvalPL = prevData.eval_net_pl;
  const prevTradePL = prevData.trade_net_pl;
  const prevTotalPL = prevData.total_net_pl;

  const rateChanges = {
    USD: { rate: rateData.USD, change: rateData.USD - prevRateData.USD, pct: ((rateData.USD - prevRateData.USD) / prevRateData.USD) * 100 },
    CNY: { rate: rateData.CNY, change: rateData.CNY - prevRateData.CNY, pct: ((rateData.CNY - prevRateData.CNY) / prevRateData.CNY) * 100 },
    HKD: { rate: rateData.HKD, change: rateData.HKD - prevRateData.HKD, pct: ((rateData.HKD - prevRateData.HKD) / prevRateData.HKD) * 100 },
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 text-white">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">AI 인사이트</h3>
            <p className="text-slate-400 text-xs">F&F 외환 포지션 분석 | 비교기준: {compareLabel}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">{baseQuarter} {viewMode === 'quarterly' ? '분기' : '누적'} 순외환손익</div>
          <div className={`text-2xl font-bold ${qTotalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {qTotalPL >= 0 ? '+' : ''}{qTotalPL.toFixed(1)}억원
          </div>
        </div>
      </div>

      {/* F&F 사업구조 기반 환위험 분석 */}
      <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold text-amber-400">F&F 사업구조 기반 환위험 분석</span>
        </div>

        {/* FNF 매출 구조 요약 */}
        <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <div className="text-[10px] text-slate-400 mb-1">국내 매출</div>
              <div className="text-lg font-bold text-emerald-400">49.7%</div>
              <div className="text-[10px] text-slate-500">8,886억</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 mb-1">중국 수출</div>
              <div className="text-lg font-bold text-red-400">46.6%</div>
              <div className="text-[10px] text-slate-500">8,316억 (수출의 92.6%)</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 mb-1">기타 수출</div>
              <div className="text-lg font-bold text-blue-400">3.7%</div>
              <div className="text-[10px] text-slate-500">662억 (HK, TW 등)</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 mb-1">총 FNF 매출</div>
              <div className="text-lg font-bold text-slate-200">17,864억</div>
              <div className="text-[10px] text-slate-500">2025년 누적</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* 수출(매출) 구조 */}
          <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-700/30">
            <div className="text-xs text-blue-400 font-semibold mb-2">외화 채권 구조 (수출 → 외화 유입)</div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>
                <span><span className="text-red-400 font-semibold">CNY 채권 760억</span> (전체 채권의 62%) ← 중국 수출 46.6%</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>
                <span>HKD 348억 (28%), TWD 72억 (6%) ← 홍콩/대만 수출</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5"></div>
                <span><span className="text-amber-400 font-semibold">환율 상승 시 수출 채권 평가이익 발생</span></span>
              </li>
            </ul>
          </div>

          {/* 매입(비용) 구조 */}
          <div className="bg-red-900/30 rounded-lg p-3 border border-red-700/30">
            <div className="text-xs text-red-400 font-semibold mb-2">외화 채무 구조 (매입 → 외화 유출)</div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
                <span><span className="text-blue-400 font-semibold">USD 채무 846억</span> vs 채권 39억 → 순채무 807억</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
                <span>자연헤지율 4.6%로 극히 낮음 (FOB 전환 영향)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5"></div>
                <span><span className="text-amber-400 font-semibold">달러 강세 시 평가손실 발생</span></span>
              </li>
            </ul>
          </div>
        </div>

        {/* 강점과 리스크 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-700/30">
            <div className="text-xs text-emerald-400 font-semibold mb-2">F&F 환위험 강점</div>
            <ul className="space-y-1 text-[11px] text-slate-300">
              <li>• 순 익스포저 +372억 (채권초과) → 전반적 환율상승 시 유리</li>
              <li>• 25년 누적 거래손익 +71.6억 호조 (CNY +99.6억 기여)</li>
              <li>• EUR 자연헤지 89% 달성 (채권 2.7억 vs 채무 2.4억)</li>
            </ul>
          </div>
          <div className="bg-red-900/20 rounded-lg p-3 border border-red-700/30">
            <div className="text-xs text-red-400 font-semibold mb-2">F&F 환위험 리스크</div>
            <ul className="space-y-1 text-[11px] text-slate-300">
              <li>• <span className="text-red-400">CNY 집중도 62%</span> (760억) → 위안화 10% 급락 시 76억 손실</li>
              <li>• <span className="text-red-400">USD 순채무 807억</span> → 달러 10% 강세 시 81억 평가손실</li>
              <li>• 중국 수출 의존도 46.6% → 미중 무역갈등 리스크 내재</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 환율 전망 및 시사점 */}
      <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold text-purple-400">환율 전망 및 F&F 영향 ({baseQuarter} 기준)</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* USD 전망 */}
          <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-sm font-semibold text-blue-400">USD/KRW 전망</span>
            </div>
            <div className="text-xl font-bold text-slate-200 mb-3">1,435원 → 1,380~1,500원</div>

            {/* 기관별 전망치 테이블 */}
            <div className="bg-slate-800/50 rounded-lg p-2 mb-3">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b border-slate-600/50">
                    <th className="text-left text-slate-500 py-1 px-1">기관</th>
                    <th className="text-right text-slate-500 py-1 px-1">26.1Q</th>
                    <th className="text-right text-slate-500 py-1 px-1">26.2Q</th>
                    <th className="text-right text-slate-500 py-1 px-1">26말</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-700/30">
                    <td className="py-1 px-1 text-blue-300">KB금융</td>
                    <td className="text-right py-1 px-1">1,420</td>
                    <td className="text-right py-1 px-1">1,380</td>
                    <td className="text-right py-1 px-1 text-emerald-400">1,300↓</td>
                  </tr>
                  <tr className="border-b border-slate-700/30">
                    <td className="py-1 px-1 text-blue-300">BofA</td>
                    <td className="text-right py-1 px-1">1,450</td>
                    <td className="text-right py-1 px-1">1,420</td>
                    <td className="text-right py-1 px-1">1,395</td>
                  </tr>
                  <tr className="border-b border-slate-700/30">
                    <td className="py-1 px-1 text-blue-300">하나금융</td>
                    <td className="text-right py-1 px-1">1,430</td>
                    <td className="text-right py-1 px-1">1,400</td>
                    <td className="text-right py-1 px-1">1,380</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-1 text-blue-300">Trading Economics</td>
                    <td className="text-right py-1 px-1">1,445</td>
                    <td className="text-right py-1 px-1">1,460</td>
                    <td className="text-right py-1 px-1 text-red-400">1,500↑</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              • 미국 연준 금리 동결 기조 지속<br/>
              • 글로벌 경기 불확실성으로 달러 강세 유지<br/>
              <span className="text-amber-400">→ F&F: USD 채무 리스크 모니터링 필요</span>
            </p>
          </div>

          {/* CNY 전망 */}
          <div className="bg-red-900/20 rounded-lg p-4 border border-red-700/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-sm font-semibold text-red-400">CNY/KRW 전망</span>
            </div>
            <div className="text-xl font-bold text-slate-200 mb-3">205원 → 195~215원</div>

            {/* 기관별 전망치 테이블 */}
            <div className="bg-slate-800/50 rounded-lg p-2 mb-3">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b border-slate-600/50">
                    <th className="text-left text-slate-500 py-1 px-1">기관</th>
                    <th className="text-right text-slate-500 py-1 px-1">26.1Q</th>
                    <th className="text-right text-slate-500 py-1 px-1">26.2Q</th>
                    <th className="text-right text-slate-500 py-1 px-1">26말</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-700/30">
                    <td className="py-1 px-1 text-red-300">인민은행</td>
                    <td className="text-right py-1 px-1">203</td>
                    <td className="text-right py-1 px-1">200</td>
                    <td className="text-right py-1 px-1 text-emerald-400">195↓</td>
                  </tr>
                  <tr className="border-b border-slate-700/30">
                    <td className="py-1 px-1 text-red-300">Trading Economics</td>
                    <td className="text-right py-1 px-1">206</td>
                    <td className="text-right py-1 px-1">208</td>
                    <td className="text-right py-1 px-1 text-red-400">215↑</td>
                  </tr>
                  <tr className="border-b border-slate-700/30">
                    <td className="py-1 px-1 text-red-300">Wonforecast</td>
                    <td className="text-right py-1 px-1">204</td>
                    <td className="text-right py-1 px-1">205</td>
                    <td className="text-right py-1 px-1">206</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-1 text-red-300">신한금융</td>
                    <td className="text-right py-1 px-1">202</td>
                    <td className="text-right py-1 px-1">198</td>
                    <td className="text-right py-1 px-1">195</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              • 중국 경기 둔화 우려 지속<br/>
              • 미중 무역갈등 장기화 전망<br/>
              <span className="text-amber-400">→ F&F: CNY 채권 760억 리스크 모니터링</span>
            </p>
          </div>
        </div>

        {/* 전망 요약 및 출처 */}
        <div className="mt-3 bg-slate-800/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-xs text-amber-400 font-medium">종합 전망: 변동성 확대 예상</span>
              </div>
              <span className="text-[10px] text-slate-500">|</span>
              <span className="text-[10px] text-slate-400">단기 관리에 집중, 상/하반기 시나리오 대비 필요</span>
            </div>
            <span className="text-[9px] text-slate-500">출처: KB금융, BofA, 하나금융, 신한금융, Trading Economics, Wonforecast (26.1월 기준)</span>
          </div>
        </div>
      </div>

      {/* 환리스크 관리 방안 */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 rounded-xl p-4 border border-emerald-700/30">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-400">환리스크 관리 방안</span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-[10px] text-slate-400 mb-1">즉시 실행</div>
            <div className="text-xs text-slate-200 font-medium">CNY 선물환 헤지</div>
            <p className="text-[10px] text-slate-400 mt-1">CNY 500억 선물환 매도로 집중 리스크 분산</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-[10px] text-slate-400 mb-1">1개월 내</div>
            <div className="text-xs text-slate-200 font-medium">USD 자연헤지 확대</div>
            <p className="text-[10px] text-slate-400 mt-1">USD 결제 매입 확대로 헤지율 9%→20% 목표</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-[10px] text-slate-400 mb-1">3개월 내</div>
            <div className="text-xs text-slate-200 font-medium">결제통화 다변화</div>
            <p className="text-[10px] text-slate-400 mt-1">HKD 거래처 USD 전환 협의, 결제조건 개선</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-[10px] text-slate-400 mb-1">6개월 내</div>
            <div className="text-xs text-slate-200 font-medium">환위험 정책 수립</div>
            <p className="text-[10px] text-slate-400 mt-1">통화별 익스포저 한도 설정 및 모니터링 체계화</p>
          </div>
        </div>
      </div>

      {/* 시나리오별 손익 영향 - 간소화 */}
      <div className="mt-4 grid grid-cols-4 gap-3">
        {scenarioAnalysis.map((scenario, idx) => (
          <div key={idx} className="bg-slate-700/30 rounded-lg p-3">
            <div className="text-[10px] text-slate-400 mb-1">{scenario.scenario}</div>
            <div className={`text-lg font-bold ${scenario.total >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {scenario.total >= 0 ? '+' : ''}{scenario.total.toFixed(1)}억
            </div>
            <div className="text-[9px] text-slate-500">
              USD {scenario.USD >= 0 ? '+' : ''}{scenario.USD.toFixed(0)} / CNY {scenario.CNY >= 0 ? '+' : ''}{scenario.CNY.toFixed(0)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ========================================
// 토글 버튼 컴포넌트
// ========================================
interface ToggleBtnProps {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}

const ToggleBtn: React.FC<ToggleBtnProps> = ({ label, active, color, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      active ? `${color} text-white shadow-md` : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
    }`}
  >
    {label}
  </button>
);

// ========================================
// 커스텀 툴팁
// ========================================
interface PLTooltipProps {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}

const PLTooltip: React.FC<PLTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xl min-w-[200px]">
        <p className="text-slate-700 text-sm font-semibold mb-2 pb-2 border-b border-slate-100">{label}</p>
        {payload.map((p, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm py-0.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></div>
              <span className="text-slate-500">{p.name}</span>
            </div>
            <span className={`font-semibold ${p.value >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {p.value >= 0 ? '+' : ''}{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}억
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ========================================
// 메인 대시보드 컴포넌트
// ========================================
export default function FNFFXComprehensiveDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'plAnalysis'>('overview');
  const [viewMode, setViewMode] = useState<ViewMode>('cumulative');
  const [baseQuarter, setBaseQuarter] = useState<BaseQuarter>(DEFAULT_QUARTER);
  const [rateVisibility, setRateVisibility] = useState<Record<string, boolean>>({
    USD: true, CNY: true, HKD: false, EUR: false, JPY: false, TWD: false
  });
  // 손익분석탭 통화 선택 (전체/USD/CNY/HKD/EUR)
  const [selectedCurrency, setSelectedCurrency] = useState<'ALL' | 'USD' | 'CNY' | 'HKD' | 'EUR'>('ALL');
  // 손익분석탭 채권/채무 토글 (거래손익, 평가손익 차트용)
  const [plChartType, setPlChartType] = useState<'recv' | 'payable'>('recv');

  const currencies = ['USD', 'CNY', 'HKD', 'EUR', 'JPY', 'TWD'];
  const plFilterCurrencies: Array<'ALL' | 'USD' | 'CNY' | 'HKD' | 'EUR'> = ['ALL', 'USD', 'CNY', 'HKD', 'EUR'];

  // 기준분기에 따른 데이터 동적 로딩
  const quarterData = useMemo(() => getQuarterData(baseQuarter), [baseQuarter]);

  // 분기별 데이터 추출
  const exchangeRateData = quarterData.exchangeRateData;
  const quarterlyData = quarterData.quarterlyData;
  const cumulativeData = quarterData.cumulativeData;
  const currencyRecvEvalPL_Quarterly = quarterData.currencyRecvEvalPL_Quarterly;
  const currencyRecvEvalPL_Cumulative = quarterData.currencyRecvEvalPL_Cumulative;
  const currencyPayableEvalPL_Quarterly = quarterData.currencyPayableEvalPL_Quarterly;
  const currencyPayableEvalPL_Cumulative = quarterData.currencyPayableEvalPL_Cumulative;
  const currencyTradePL_Quarterly = quarterData.currencyTradePL_Quarterly;
  const currencyTradePL_Cumulative = quarterData.currencyTradePL_Cumulative;
  const currencyBalanceData = quarterData.currencyBalanceData;
  const currencyRecvSettlement_Quarterly = quarterData.currencyRecvSettlement_Quarterly;
  const currencyRecvSettlement_Cumulative = quarterData.currencyRecvSettlement_Cumulative;
  const currencyPaySettlement_Quarterly = quarterData.currencyPaySettlement_Quarterly;
  const currencyPaySettlement_Cumulative = quarterData.currencyPaySettlement_Cumulative;
  const currencyPayTradePL_Quarterly = quarterData.currencyPayTradePL_Quarterly;
  const currencyPayTradePL_Cumulative = quarterData.currencyPayTradePL_Cumulative;
  const sensitivityAnalysis = quarterData.sensitivityAnalysis;
  const scenarioAnalysis = quarterData.scenarioAnalysis;
  const riskIndicators = quarterData.riskIndicators;
  const managementRecommendations = quarterData.managementRecommendations;
  const actionPlans = quarterData.actionPlans;
  const aiInsight = quarterData.aiInsight;

  // 기준분기와 비교분기 (YoY)
  const yoyCompareQuarter = useMemo(() => getCompareQuarter(baseQuarter, viewMode), [baseQuarter, viewMode]);

  // viewMode에 따른 데이터 소스 선택
  const dataSource = useMemo(() => {
    return viewMode === 'quarterly' ? quarterlyData : cumulativeData;
  }, [viewMode, quarterlyData, cumulativeData]);

  const currencyRecvEvalPL = useMemo(() => {
    return viewMode === 'quarterly' ? currencyRecvEvalPL_Quarterly : currencyRecvEvalPL_Cumulative;
  }, [viewMode, currencyRecvEvalPL_Quarterly, currencyRecvEvalPL_Cumulative]);

  const currencyPayableEvalPL = useMemo(() => {
    return viewMode === 'quarterly' ? currencyPayableEvalPL_Quarterly : currencyPayableEvalPL_Cumulative;
  }, [viewMode, currencyPayableEvalPL_Quarterly, currencyPayableEvalPL_Cumulative]);

  const currencyTradePL = useMemo(() => {
    return viewMode === 'quarterly' ? currencyTradePL_Quarterly : currencyTradePL_Cumulative;
  }, [viewMode, currencyTradePL_Quarterly, currencyTradePL_Cumulative]);

  const currencyRecvSettlement = useMemo(() => {
    return viewMode === 'quarterly' ? currencyRecvSettlement_Quarterly : currencyRecvSettlement_Cumulative;
  }, [viewMode, currencyRecvSettlement_Quarterly, currencyRecvSettlement_Cumulative]);

  const currencyPaySettlement = useMemo(() => {
    return viewMode === 'quarterly' ? currencyPaySettlement_Quarterly : currencyPaySettlement_Cumulative;
  }, [viewMode, currencyPaySettlement_Quarterly, currencyPaySettlement_Cumulative]);

  const currencyPayTradePL = useMemo(() => {
    return viewMode === 'quarterly' ? currencyPayTradePL_Quarterly : currencyPayTradePL_Cumulative;
  }, [viewMode, currencyPayTradePL_Quarterly, currencyPayTradePL_Cumulative]);

  // 현재 분기 및 비교 데이터
  const currentQ = dataSource[dataSource.length - 1];
  const prevQ = dataSource[dataSource.length - 2];

  // 비교기준: 누적=전기말, 분기=전년동기 (동적 계산)
  const compareQ = useMemo(() => {
    if (viewMode === 'cumulative') {
      // 누적: 전기말
      return cumulativeData.find(q => q.quarter === yoyCompareQuarter) || cumulativeData[cumulativeData.length - 5];
    } else {
      // 분기: 전년동기
      return quarterlyData.find(q => q.quarter === yoyCompareQuarter) || quarterlyData[quarterlyData.length - 5];
    }
  }, [viewMode, yoyCompareQuarter, cumulativeData, quarterlyData]);

  // 비교기준 레이블 (동적)
  const compareLabel = viewMode === 'cumulative' ? `전기말(${yoyCompareQuarter})` : `전년동기(${yoyCompareQuarter})`;

  // 환율 비교기준: 누적=전기말, 분기=전분기
  const compareRateData = useMemo(() => {
    if (viewMode === 'cumulative') {
      // 누적: 전기말 환율
      return exchangeRateData.find(r => r.quarter === yoyCompareQuarter) || exchangeRateData[exchangeRateData.length - 5];
    } else {
      // 분기: 전분기 환율
      return exchangeRateData[exchangeRateData.length - 2];
    }
  }, [viewMode]);

  const currentRateData = exchangeRateData[exchangeRateData.length - 1];
  const prevRateData = exchangeRateData[exchangeRateData.length - 2];
  const currentBalanceData = currencyBalanceData[currencyBalanceData.length - 1];

  // 현재 분기 손익 (직접 참조)
  const currentPL = {
    eval: currentQ.eval_net_pl,
    trade: currentQ.trade_net_pl,
    total: currentQ.total_net_pl
  };

  // 비교기준 손익 데이터
  const comparePL = {
    eval: compareQ.eval_net_pl,
    trade: compareQ.trade_net_pl,
    total: compareQ.total_net_pl
  };

  // 통화별 breakdown
  const currencyBreakdown = useMemo(() => {
    const currentEval = currencyRecvEvalPL[currencyRecvEvalPL.length - 1] as unknown as Record<string, number>;
    const currentTrade = currencyTradePL[currencyTradePL.length - 1] as unknown as Record<string, number>;

    const ccys = ['CNY', 'HKD', 'USD', 'EUR', 'TWD'];
    const breakdown = ccys.map(ccy => {
      const evalPL = currentEval?.[ccy] || 0;
      const tradePL = currentTrade?.[ccy] || 0;
      return { currency: ccy, eval: evalPL, trade: tradePL, total: evalPL + tradePL };
    });

    const totalAbs = breakdown.reduce((sum, b) => sum + Math.abs(b.total), 0);
    return breakdown
      .map(b => ({ ...b, value: b.total, ratio: totalAbs > 0 ? (Math.abs(b.total) / totalAbs) * 100 : 0 }))
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  }, [currencyRecvEvalPL, currencyTradePL]);

  // 차트 데이터 생성 (직접 참조)
  const plChartData = useMemo(() => {
    return dataSource.slice(1).map((item) => ({
      quarter: item.quarter,
      eval_pl: item.eval_net_pl,
      trade_pl: item.trade_net_pl,
      total_pl: item.total_net_pl
    }));
  }, [dataSource]);

  // 채권/채무 손익 분석 데이터 (통화 선택에 따라 필터링)
  const recvPayableChartData = useMemo(() => {
    if (selectedCurrency === 'ALL') {
      // 전체: 기존 로직
      return dataSource.slice(1).map((item) => ({
        quarter: item.quarter,
        recv_eval: item.eval_recv_pl,
        recv_trade: item.trade_recv_pl,
        recv_total: item.eval_recv_pl + item.trade_recv_pl,
        payable_eval: item.eval_payable_pl,
        payable_trade: item.trade_payable_pl,
        payable_total: item.eval_payable_pl + item.trade_payable_pl
      }));
    } else {
      // 특정 통화 선택 시: 통화별 데이터 사용
      return dataSource.slice(1).map((item, idx) => {
        const recvEvalData = currencyRecvEvalPL[idx + 1] as unknown as Record<string, number>;
        const payableEvalData = currencyPayableEvalPL[idx + 1] as unknown as Record<string, number>;
        const tradeData = currencyTradePL[idx] as unknown as Record<string, number>; // trade는 24.1Q부터 시작

        const recvEval = recvEvalData?.[selectedCurrency] || 0;
        const payableEval = payableEvalData?.[selectedCurrency] || 0;
        const trade = tradeData?.[selectedCurrency] || 0;
        const payTradeData = currencyPayTradePL[idx] as unknown as Record<string, number>;
        const payTrade = payTradeData?.[selectedCurrency] || 0;

        return {
          quarter: item.quarter,
          recv_eval: recvEval,
          recv_trade: trade, // 채권 거래손익
          recv_total: recvEval + trade,
          payable_eval: payableEval,
          payable_trade: payTrade, // 채무 거래손익
          payable_total: payableEval + payTrade
        };
      });
    }
  }, [dataSource, selectedCurrency, currencyRecvEvalPL, currencyPayableEvalPL, currencyTradePL, currencyPayTradePL]);

  // 통화별 종합 손익 데이터
  const currencyCombinedData = useMemo(() => {
    const currentRecvEval = currencyRecvEvalPL[currencyRecvEvalPL.length - 1] as unknown as Record<string, number>;
    const currentPayableEval = currencyPayableEvalPL[currencyPayableEvalPL.length - 1] as unknown as Record<string, number>;
    const currentTrade = currencyTradePL[currencyTradePL.length - 1] as unknown as Record<string, number>;
    const currentPayTrade = currencyPayTradePL[currencyPayTradePL.length - 1] as unknown as Record<string, number>;

    return ['CNY', 'HKD', 'USD', 'EUR', 'TWD'].map(ccy => {
      const recvEval = currentRecvEval?.[ccy] || 0;
      const payableEval = currentPayableEval?.[ccy] || 0;
      const recvTrade = currentTrade?.[ccy] || 0;
      const payTrade = currentPayTrade?.[ccy] || 0;
      return {
        currency: ccy,
        recv_eval: recvEval,
        payable_eval: payableEval,
        trade: recvTrade,
        payable_trade: payTrade,
        total: recvEval + payableEval + recvTrade + payTrade
      };
    });
  }, [currencyRecvEvalPL, currencyPayableEvalPL, currencyTradePL, currencyPayTradePL]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">FNF 외환 종합 대시보드</h1>
            <p className="text-slate-500 text-sm mt-1">외화 평가손익(미실현) + 거래손익(실현) 통합 분석 | {baseQuarter} 기준</p>
          </div>
          {/* 기준분기 선택 드롭다운 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">기준분기:</span>
            <select
              value={baseQuarter}
              onChange={(e) => setBaseQuarter(e.target.value as BaseQuarter)}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              {AVAILABLE_QUARTERS.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('plAnalysis')}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'plAnalysis'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              손익분석
            </button>
          </div>

          {/* 누적/분기 토글 */}
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-slate-200">
            <ToggleBtn label="누적" active={viewMode === 'cumulative'} color="bg-blue-600" onClick={() => setViewMode('cumulative')} />
            <ToggleBtn label="분기" active={viewMode === 'quarterly'} color="bg-indigo-600" onClick={() => setViewMode('quarterly')} />
          </div>
        </div>

        {/* ========================================
            Overview 탭
        ======================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI 카드 섹션 */}
            <div className="grid grid-cols-4 gap-4">
              <EnhancedKPICard
                title={viewMode === 'quarterly' ? "순외환손익 (분기)" : "순외환손익 (누적)"}
                value={currentPL.total}
                yoyChange={calcYoY(currentPL.total, comparePL.total)}
                yoyAmount={calcYoYAmount(currentPL.total, comparePL.total)}
                yoyValue={comparePL.total}
                compareLabel={compareLabel}
                icon={Scale}
                trend="good"
                color="blue"
                details={[
                  { label: "평가손익", value: currentPL.eval },
                  { label: "거래손익", value: currentPL.trade }
                ]}
                currencyBreakdown={currencyBreakdown}
              />
              <EnhancedKPICard
                title={viewMode === 'quarterly' ? "평가손익 (분기)" : "평가손익 (누적)"}
                value={currentPL.eval}
                yoyChange={calcYoY(currentPL.eval, comparePL.eval)}
                yoyAmount={calcYoYAmount(currentPL.eval, comparePL.eval)}
                yoyValue={comparePL.eval}
                compareLabel={compareLabel}
                icon={BarChart3}
                trend="good"
                color="purple"
                details={[
                  { label: "채권 평가", value: currentQ.eval_recv_pl, yoyValue: compareQ.eval_recv_pl },
                  { label: "채무 평가", value: currentQ.eval_payable_pl, yoyValue: compareQ.eval_payable_pl }
                ]}
              />
              <EnhancedKPICard
                title={viewMode === 'quarterly' ? "거래손익 (분기)" : "거래손익 (누적)"}
                value={currentPL.trade}
                yoyChange={calcYoY(currentPL.trade, comparePL.trade)}
                yoyAmount={calcYoYAmount(currentPL.trade, comparePL.trade)}
                yoyValue={comparePL.trade}
                compareLabel={compareLabel}
                icon={Repeat}
                trend="good"
                color="green"
                details={[
                  { label: "채권 거래", value: currentQ.trade_recv_pl, yoyValue: compareQ.trade_recv_pl },
                  { label: "채무 거래", value: currentQ.trade_payable_pl, yoyValue: compareQ.trade_payable_pl }
                ]}
              />
              <ExchangeRateKPICard
                currentRates={currentRateData}
                prevRates={compareRateData}
                balanceData={currentBalanceData}
                compareLabel={viewMode === 'cumulative' ? "전기말대비" : "전분기대비"}
              />
            </div>

            {/* 민감도 분석 카드 섹션 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-semibold text-slate-700">통화별 환위험 민감도 분석</h3>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span>고위험</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span>중위험</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span>저위험</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-4">
                {sensitivityAnalysis.map((item, idx) => (
                  <SensitivityCard key={idx} item={item} />
                ))}
              </div>
              {/* 익스포저 요약 */}
              <div className="mt-4 grid grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">총 외화채권</div>
                  <div className="text-lg font-bold text-blue-600">{riskIndicators.totalRecvBalance.toLocaleString()}억</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">총 외화채무</div>
                  <div className="text-lg font-bold text-red-600">{riskIndicators.totalPayableBalance.toLocaleString()}억</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">순 익스포저</div>
                  <div className="text-lg font-bold text-emerald-600">+{riskIndicators.netExposure.toLocaleString()}억</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">1% 변동 영향</div>
                  <div className="text-lg font-bold text-amber-600">±{riskIndicators.impact1pctAll.toFixed(1)}억</div>
                </div>
              </div>
            </div>

            {/* AI 인사이트 섹션 */}
            <AIInsightSection
              currentData={currentQ}
              prevData={compareQ}
              rateData={currentRateData}
              prevRateData={compareRateData}
              viewMode={viewMode}
              compareLabel={compareLabel}
              baseQuarter={baseQuarter}
              scenarioAnalysis={scenarioAnalysis}
            />

            {/* 차트 섹션 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">
                  분기별 외환손익 추이 ({viewMode === 'quarterly' ? '분기' : '누적'})
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={plChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}억`} />
                    <Tooltip content={<PLTooltip />} />
                    <Legend />
                    <ReferenceLine y={0} stroke="#94A3B8" strokeDasharray="3 3" />
                    <Bar dataKey="eval_pl" fill="#8B5CF6" name="평가손익" stackId="a" barSize={25} />
                    <Bar dataKey="trade_pl" fill="#10B981" name="거래손익" stackId="a" barSize={25} />
                    <Line type="monotone" dataKey="total_pl" stroke="#3B82F6" strokeWidth={3} name="순손익" dot={{ fill: '#3B82F6' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700">환율 추이</h3>
                  <div className="flex gap-1">
                    {currencies.map(ccy => (
                      <button
                        key={ccy}
                        onClick={() => setRateVisibility(prev => ({ ...prev, [ccy]: !prev[ccy] }))}
                        className={`px-2 py-1 text-xs rounded-lg transition-all ${
                          rateVisibility[ccy] ? 'bg-white border-2 shadow-sm' : 'bg-slate-100 text-slate-400'
                        }`}
                        style={{
                          borderColor: rateVisibility[ccy] ? currencyColors[ccy] : 'transparent',
                          color: rateVisibility[ccy] ? currencyColors[ccy] : undefined
                        }}
                      >
                        {ccy}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={exchangeRateData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    {rateVisibility.USD && <Line yAxisId="left" type="monotone" dataKey="USD" stroke={currencyColors.USD} strokeWidth={2} dot={{ r: 3 }} name="USD" />}
                    {rateVisibility.EUR && <Line yAxisId="left" type="monotone" dataKey="EUR" stroke={currencyColors.EUR} strokeWidth={2} dot={{ r: 3 }} name="EUR" />}
                    {rateVisibility.CNY && <Line yAxisId="right" type="monotone" dataKey="CNY" stroke={currencyColors.CNY} strokeWidth={2} dot={{ r: 3 }} name="CNY" />}
                    {rateVisibility.HKD && <Line yAxisId="right" type="monotone" dataKey="HKD" stroke={currencyColors.HKD} strokeWidth={2} dot={{ r: 3 }} name="HKD" />}
                    {rateVisibility.JPY && <Line yAxisId="right" type="monotone" dataKey="JPY" stroke={currencyColors.JPY} strokeWidth={2} dot={{ r: 3 }} name="JPY" />}
                    {rateVisibility.TWD && <Line yAxisId="right" type="monotone" dataKey="TWD" stroke={currencyColors.TWD} strokeWidth={2} dot={{ r: 3 }} name="TWD" />}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ========================================
            손익분석 탭 (통합)
        ======================================== */}
        {activeTab === 'plAnalysis' && (
          <div className="space-y-6">
            {/* 통화 선택 필터 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-semibold text-slate-700">통화 구분</span>
                </div>
                <div className="flex gap-2">
                  {plFilterCurrencies.map(ccy => (
                    <button
                      key={ccy}
                      onClick={() => setSelectedCurrency(ccy)}
                      className={`px-4 py-2 text-sm rounded-lg font-medium transition-all flex items-center gap-2 ${
                        selectedCurrency === ccy
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {ccy === 'ALL' ? (
                        <>전체 (총액)</>
                      ) : (
                        <>
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currencyColors[ccy] }}></div>
                          {ccy}
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 채권/채무 카드 섹션 */}
            <div className="grid grid-cols-2 gap-6">
              {/* 채권 카드 */}
              <Card variant="blue" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-blue-800">채권 (외화자산)</h3>
                      <p className="text-xs text-blue-500">Foreign Currency Receivables</p>
                    </div>
                  </div>
                  <Badge variant={selectedCurrency === 'ALL' ? 'info' : selectedCurrency.toLowerCase() as 'cny' | 'usd' | 'hkd' | 'eur'}>
                    {selectedCurrency === 'ALL' ? '전체' : selectedCurrency}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 평가손익 관련 (왼쪽) */}
                  <div className="bg-white/80 rounded-xl p-4">
                    <div className="text-xs text-purple-600 font-semibold mb-3 flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" /> 평가손익
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-[10px] text-slate-500 mb-1">기말잔액</div>
                        <div className="text-lg font-bold text-blue-700">
                          {selectedCurrency === 'ALL'
                            ? currentQ.recv_balance.toLocaleString()
                            : (currentBalanceData[`recv_${selectedCurrency}` as keyof typeof currentBalanceData] as number || 0).toFixed(0)
                          }억
                        </div>
                        {/* YoY 비교 */}
                        {selectedCurrency === 'ALL' && (
                          <div className="text-[10px] text-slate-400 mt-1">
                            전년동기: {compareQ.recv_balance.toLocaleString()}억
                            <span className={`ml-1 ${calcYoY(currentQ.recv_balance, compareQ.recv_balance) >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                              (YoY {calcYoY(currentQ.recv_balance, compareQ.recv_balance) >= 0 ? '+' : ''}{calcYoY(currentQ.recv_balance, compareQ.recv_balance).toFixed(1)}%)
                            </span>
                          </div>
                        )}
                        {/* 기말잔액 통화별 구분 (ALL일 때만) */}
                        {selectedCurrency === 'ALL' && (
                          <div className="mt-2 space-y-1">
                            {['CNY', 'HKD', 'USD', 'EUR'].map(ccy => {
                              const balance = (currentBalanceData[`recv_${ccy}` as keyof typeof currentBalanceData] as number) || 0;
                              if (balance === 0) return null;
                              return (
                                <div key={ccy} className="flex items-center justify-between text-[10px]">
                                  <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currencyColors[ccy] }}></div>
                                    <span className="text-slate-500">{ccy}</span>
                                  </div>
                                  <span className="text-slate-600">{balance.toFixed(0)}억</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div className="pt-2 border-t border-slate-200">
                        <div className="text-[10px] text-slate-500 mb-1">평가손익</div>
                        <div className={`text-xl font-bold ${currentQ.eval_recv_pl >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {selectedCurrency === 'ALL' ? (
                            <>{currentQ.eval_recv_pl >= 0 ? '+' : ''}{currentQ.eval_recv_pl.toFixed(1)}억</>
                          ) : (
                            <>
                              {((currencyRecvEvalPL[currencyRecvEvalPL.length - 1] as unknown as Record<string, number>)?.[selectedCurrency] || 0) >= 0 ? '+' : ''}
                              {((currencyRecvEvalPL[currencyRecvEvalPL.length - 1] as unknown as Record<string, number>)?.[selectedCurrency] || 0).toFixed(1)}억
                            </>
                          )}
                        </div>
                        {/* YoY 비교 */}
                        {selectedCurrency === 'ALL' && (
                          <div className="text-[10px] text-slate-400 mt-1">
                            전년동기: {compareQ.eval_recv_pl >= 0 ? '+' : ''}{compareQ.eval_recv_pl.toFixed(1)}억
                            <span className={`ml-1 ${calcYoY(currentQ.eval_recv_pl, compareQ.eval_recv_pl) >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                              (YoY {calcYoY(currentQ.eval_recv_pl, compareQ.eval_recv_pl) >= 0 ? '+' : ''}{calcYoY(currentQ.eval_recv_pl, compareQ.eval_recv_pl).toFixed(1)}%)
                            </span>
                          </div>
                        )}
                        {/* 평가손익 통화별 구분 (ALL일 때만) */}
                        {selectedCurrency === 'ALL' && (
                          <div className="mt-2 space-y-1">
                            {['CNY', 'HKD', 'USD', 'EUR'].map(ccy => {
                              const evalPL = (currencyRecvEvalPL[currencyRecvEvalPL.length - 1] as unknown as Record<string, number>)?.[ccy] || 0;
                              if (evalPL === 0) return null;
                              return (
                                <div key={ccy} className="flex items-center justify-between text-[10px]">
                                  <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currencyColors[ccy] }}></div>
                                    <span className="text-slate-500">{ccy}</span>
                                  </div>
                                  <span className={evalPL >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                                    {evalPL >= 0 ? '+' : ''}{evalPL.toFixed(1)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 거래손익 관련 (오른쪽) */}
                  <div className="bg-white/80 rounded-xl p-4">
                    <div className="text-xs text-emerald-600 font-semibold mb-3 flex items-center gap-1">
                      <Repeat className="w-3 h-3" /> 거래손익
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-[10px] text-slate-500 mb-1">수금금액</div>
                        <div className="text-lg font-bold text-emerald-700">
                          {selectedCurrency === 'ALL'
                            ? `${currentQ.settlement_recv.toLocaleString()}억`
                            : `${((currencyRecvSettlement[currencyRecvSettlement.length - 1] as unknown as Record<string, number>)?.[selectedCurrency] || 0).toLocaleString(undefined, {maximumFractionDigits: 1})}억`
                          }
                        </div>
                        {/* YoY 비교 */}
                        {selectedCurrency === 'ALL' && (
                          <div className="text-[10px] text-slate-400 mt-1">
                            전년동기: {compareQ.settlement_recv.toLocaleString()}억
                            <span className={`ml-1 ${calcYoY(currentQ.settlement_recv, compareQ.settlement_recv) >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                              (YoY {calcYoY(currentQ.settlement_recv, compareQ.settlement_recv) >= 0 ? '+' : ''}{calcYoY(currentQ.settlement_recv, compareQ.settlement_recv).toFixed(1)}%)
                            </span>
                          </div>
                        )}
                        {/* 수금금액 통화별 구분 */}
                        {selectedCurrency === 'ALL' && (
                          <div className="mt-2 space-y-1">
                            {['CNY', 'HKD', 'USD', 'EUR'].map(ccy => {
                              const settlement = (currencyRecvSettlement[currencyRecvSettlement.length - 1] as unknown as Record<string, number>)?.[ccy] || 0;
                              if (settlement === 0) return null;
                              return (
                                <div key={ccy} className="flex items-center justify-between text-[10px]">
                                  <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currencyColors[ccy] }}></div>
                                    <span className="text-slate-500">{ccy}</span>
                                  </div>
                                  <span className="text-emerald-600">
                                    {settlement.toLocaleString()}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div className="pt-2 border-t border-slate-200">
                        <div className="text-[10px] text-slate-500 mb-1">거래손익</div>
                        <div className={`text-xl font-bold ${currentQ.trade_recv_pl >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {selectedCurrency === 'ALL' ? (
                            <>{currentQ.trade_recv_pl >= 0 ? '+' : ''}{currentQ.trade_recv_pl.toFixed(1)}억</>
                          ) : (
                            <>
                              {((currencyTradePL[currencyTradePL.length - 1] as unknown as Record<string, number>)?.[selectedCurrency] || 0) >= 0 ? '+' : ''}
                              {((currencyTradePL[currencyTradePL.length - 1] as unknown as Record<string, number>)?.[selectedCurrency] || 0).toFixed(1)}억
                            </>
                          )}
                        </div>
                        {/* YoY 비교 */}
                        {selectedCurrency === 'ALL' && (
                          <div className="text-[10px] text-slate-400 mt-1">
                            전년동기: {compareQ.trade_recv_pl >= 0 ? '+' : ''}{compareQ.trade_recv_pl.toFixed(1)}억
                            <span className={`ml-1 ${calcYoY(currentQ.trade_recv_pl, compareQ.trade_recv_pl) >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                              (YoY {calcYoY(currentQ.trade_recv_pl, compareQ.trade_recv_pl) >= 0 ? '+' : ''}{calcYoY(currentQ.trade_recv_pl, compareQ.trade_recv_pl).toFixed(1)}%)
                            </span>
                          </div>
                        )}
                        {/* 거래손익 통화별 구분 (ALL일 때만) */}
                        {selectedCurrency === 'ALL' && (
                          <div className="mt-2 space-y-1">
                            {['CNY', 'HKD', 'USD', 'EUR'].map(ccy => {
                              const tradePL = (currencyTradePL[currencyTradePL.length - 1] as unknown as Record<string, number>)?.[ccy] || 0;
                              if (tradePL === 0) return null;
                              return (
                                <div key={ccy} className="flex items-center justify-between text-[10px]">
                                  <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currencyColors[ccy] }}></div>
                                    <span className="text-slate-500">{ccy}</span>
                                  </div>
                                  <span className={tradePL >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                                    {tradePL >= 0 ? '+' : ''}{tradePL.toFixed(1)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 채권 총손익 */}
                <div className="mt-4 bg-blue-100 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-700">채권 총손익</span>
                  {(() => {
                    const recvEvalPL = selectedCurrency === 'ALL'
                      ? currentQ.eval_recv_pl
                      : ((currencyRecvEvalPL[currencyRecvEvalPL.length - 1] as unknown as Record<string, number>)?.[selectedCurrency] || 0);
                    const recvTradePL = selectedCurrency === 'ALL'
                      ? currentQ.trade_recv_pl
                      : ((currencyTradePL[currencyTradePL.length - 1] as unknown as Record<string, number>)?.[selectedCurrency] || 0);
                    const totalPL = recvEvalPL + recvTradePL;
                    return (
                      <span className={`text-xl font-bold ${totalPL >= 0 ? 'text-blue-700' : 'text-red-600'}`}>
                        {totalPL >= 0 ? '+' : ''}{totalPL.toFixed(1)}억
                      </span>
                    );
                  })()}
                </div>
              </Card>

              {/* 채무 카드 */}
              <Card variant="red" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-red-800">채무 (외화부채)</h3>
                      <p className="text-xs text-red-500">Foreign Currency Payables</p>
                    </div>
                  </div>
                  <Badge variant={selectedCurrency === 'ALL' ? 'destructive' : selectedCurrency.toLowerCase() as 'cny' | 'usd' | 'hkd' | 'eur'}>
                    {selectedCurrency === 'ALL' ? '전체' : selectedCurrency}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 평가손익 관련 (왼쪽) */}
                  <div className="bg-white/80 rounded-xl p-4">
                    <div className="text-xs text-purple-600 font-semibold mb-3 flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" /> 평가손익
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-[10px] text-slate-500 mb-1">기말잔액</div>
                        <div className="text-lg font-bold text-red-700">
                          {selectedCurrency === 'ALL'
                            ? Math.abs(currentQ.payable_balance).toLocaleString()
                            : Math.abs((currentBalanceData[`pay_${selectedCurrency}` as keyof typeof currentBalanceData] as number) || 0).toFixed(0)
                          }억
                        </div>
                        {/* YoY 비교 */}
                        {selectedCurrency === 'ALL' && (
                          <div className="text-[10px] text-slate-400 mt-1">
                            전년동기: {Math.abs(compareQ.payable_balance).toLocaleString()}억
                            <span className={`ml-1 ${calcYoY(Math.abs(currentQ.payable_balance), Math.abs(compareQ.payable_balance)) >= 0 ? 'text-red-400' : 'text-emerald-500'}`}>
                              (YoY {calcYoY(Math.abs(currentQ.payable_balance), Math.abs(compareQ.payable_balance)) >= 0 ? '+' : ''}{calcYoY(Math.abs(currentQ.payable_balance), Math.abs(compareQ.payable_balance)).toFixed(1)}%)
                            </span>
                          </div>
                        )}
                        {/* 기말잔액 통화별 구분 (ALL일 때만) */}
                        {selectedCurrency === 'ALL' && (
                          <div className="mt-2 space-y-1">
                            {['USD', 'EUR'].map(ccy => {
                              const balance = Math.abs((currentBalanceData[`pay_${ccy}` as keyof typeof currentBalanceData] as number) || 0);
                              if (balance === 0) return null;
                              return (
                                <div key={ccy} className="flex items-center justify-between text-[10px]">
                                  <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currencyColors[ccy] }}></div>
                                    <span className="text-slate-500">{ccy}</span>
                                  </div>
                                  <span className="text-slate-600">{balance.toFixed(0)}억</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div className="pt-2 border-t border-slate-200">
                        <div className="text-[10px] text-slate-500 mb-1">평가손익</div>
                        <div className={`text-xl font-bold ${currentQ.eval_payable_pl >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {selectedCurrency === 'ALL' ? (
                            <>{currentQ.eval_payable_pl >= 0 ? '+' : ''}{currentQ.eval_payable_pl.toFixed(1)}억</>
                          ) : (
                            <>
                              {((currencyPayableEvalPL[currencyPayableEvalPL.length - 1] as unknown as Record<string, number>)?.[selectedCurrency] || 0) >= 0 ? '+' : ''}
                              {((currencyPayableEvalPL[currencyPayableEvalPL.length - 1] as unknown as Record<string, number>)?.[selectedCurrency] || 0).toFixed(1)}억
                            </>
                          )}
                        </div>
                        {/* YoY 비교 */}
                        {selectedCurrency === 'ALL' && (
                          <div className="text-[10px] text-slate-400 mt-1">
                            전년동기: {compareQ.eval_payable_pl >= 0 ? '+' : ''}{compareQ.eval_payable_pl.toFixed(1)}억
                            <span className={`ml-1 ${calcYoY(currentQ.eval_payable_pl, compareQ.eval_payable_pl) >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                              (YoY {calcYoY(currentQ.eval_payable_pl, compareQ.eval_payable_pl) >= 0 ? '+' : ''}{calcYoY(currentQ.eval_payable_pl, compareQ.eval_payable_pl).toFixed(1)}%)
                            </span>
                          </div>
                        )}
                        {/* 평가손익 통화별 구분 (ALL일 때만) */}
                        {selectedCurrency === 'ALL' && (
                          <div className="mt-2 space-y-1">
                            {['USD', 'EUR'].map(ccy => {
                              const evalPL = (currencyPayableEvalPL[currencyPayableEvalPL.length - 1] as unknown as Record<string, number>)?.[ccy] || 0;
                              if (evalPL === 0) return null;
                              return (
                                <div key={ccy} className="flex items-center justify-between text-[10px]">
                                  <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currencyColors[ccy] }}></div>
                                    <span className="text-slate-500">{ccy}</span>
                                  </div>
                                  <span className={evalPL >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                                    {evalPL >= 0 ? '+' : ''}{evalPL.toFixed(1)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 거래손익 관련 (오른쪽) */}
                  <div className="bg-white/80 rounded-xl p-4">
                    <div className="text-xs text-emerald-600 font-semibold mb-3 flex items-center gap-1">
                      <Repeat className="w-3 h-3" /> 거래손익
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-[10px] text-slate-500 mb-1">결제금액</div>
                        <div className="text-lg font-bold text-orange-700">
                          {selectedCurrency === 'ALL'
                            ? `${Math.abs(currentQ.settlement_payable).toLocaleString()}억`
                            : `${Math.abs((currencyPaySettlement[currencyPaySettlement.length - 1] as unknown as Record<string, number>)?.[selectedCurrency] || 0).toLocaleString(undefined, {maximumFractionDigits: 1})}억`
                          }
                        </div>
                        {/* YoY 비교 */}
                        {selectedCurrency === 'ALL' && (
                          <div className="text-[10px] text-slate-400 mt-1">
                            전년동기: {Math.abs(compareQ.settlement_payable).toLocaleString()}억
                            <span className={`ml-1 ${calcYoY(Math.abs(currentQ.settlement_payable), Math.abs(compareQ.settlement_payable)) >= 0 ? 'text-red-400' : 'text-emerald-500'}`}>
                              (YoY {calcYoY(Math.abs(currentQ.settlement_payable), Math.abs(compareQ.settlement_payable)) >= 0 ? '+' : ''}{calcYoY(Math.abs(currentQ.settlement_payable), Math.abs(compareQ.settlement_payable)).toFixed(1)}%)
                            </span>
                          </div>
                        )}
                        {/* 결제금액 통화별 구분 */}
                        {selectedCurrency === 'ALL' && (
                          <div className="mt-2 space-y-1">
                            {['USD', 'EUR'].map(ccy => {
                              const settlement = (currencyPaySettlement[currencyPaySettlement.length - 1] as unknown as Record<string, number>)?.[ccy] || 0;
                              if (settlement === 0) return null;
                              return (
                                <div key={ccy} className="flex items-center justify-between text-[10px]">
                                  <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currencyColors[ccy] }}></div>
                                    <span className="text-slate-500">{ccy}</span>
                                  </div>
                                  <span className="text-orange-600">
                                    {Math.abs(settlement).toLocaleString()}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div className="pt-2 border-t border-slate-200">
                        <div className="text-[10px] text-slate-500 mb-1">거래손익</div>
                        <div className={`text-xl font-bold ${(() => {
                          const val = selectedCurrency === 'ALL'
                            ? currentQ.trade_payable_pl
                            : ((currencyPayTradePL[currencyPayTradePL.length - 1] as unknown as Record<string, number>)?.[selectedCurrency] || 0);
                          return val >= 0 ? 'text-emerald-600' : 'text-red-500';
                        })()}`}>
                          {(() => {
                            const val = selectedCurrency === 'ALL'
                              ? currentQ.trade_payable_pl
                              : ((currencyPayTradePL[currencyPayTradePL.length - 1] as unknown as Record<string, number>)?.[selectedCurrency] || 0);
                            return <>{val >= 0 ? '+' : ''}{val.toFixed(1)}억</>;
                          })()}
                        </div>
                        {/* YoY 비교 */}
                        {selectedCurrency === 'ALL' && (
                          <div className="text-[10px] text-slate-400 mt-1">
                            전년동기: {compareQ.trade_payable_pl >= 0 ? '+' : ''}{compareQ.trade_payable_pl.toFixed(1)}억
                            <span className={`ml-1 ${calcYoY(currentQ.trade_payable_pl, compareQ.trade_payable_pl) >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                              (YoY {calcYoY(currentQ.trade_payable_pl, compareQ.trade_payable_pl) >= 0 ? '+' : ''}{calcYoY(currentQ.trade_payable_pl, compareQ.trade_payable_pl).toFixed(1)}%)
                            </span>
                          </div>
                        )}
                        {/* 거래손익 통화별 구분 (ALL일 때만) - 채무 거래손익 */}
                        {selectedCurrency === 'ALL' && (
                          <div className="mt-2 space-y-1">
                            {['USD', 'EUR', 'CNY'].map(ccy => {
                              const val = (currencyPayTradePL[currencyPayTradePL.length - 1] as unknown as Record<string, number>)?.[ccy] || 0;
                              if (val === 0) return null;
                              return (
                                <div key={ccy} className="flex items-center justify-between text-[10px]">
                                  <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currencyColors[ccy] }}></div>
                                    <span className="text-slate-500">{ccy}</span>
                                  </div>
                                  <span className={val >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                                    {val >= 0 ? '+' : ''}{val.toFixed(1)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 채무 총손익 */}
                <div className="mt-4 bg-red-100 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-red-700">채무 총손익</span>
                  {(() => {
                    const payEvalPL = selectedCurrency === 'ALL'
                      ? currentQ.eval_payable_pl
                      : ((currencyPayableEvalPL[currencyPayableEvalPL.length - 1] as unknown as Record<string, number>)?.[selectedCurrency] || 0);
                    const payTradePL = selectedCurrency === 'ALL'
                      ? currentQ.trade_payable_pl
                      : ((currencyPayTradePL[currencyPayTradePL.length - 1] as unknown as Record<string, number>)?.[selectedCurrency] || 0);
                    const totalPL = payEvalPL + payTradePL;
                    return (
                      <span className={`text-xl font-bold ${totalPL >= 0 ? 'text-emerald-600' : 'text-red-700'}`}>
                        {totalPL >= 0 ? '+' : ''}{totalPL.toFixed(1)}억
                      </span>
                    );
                  })()}
                </div>
              </Card>
            </div>

            {/* 3단 그래프 구성 */}
            <div className="grid grid-cols-3 gap-4">
              {/* 1. 전체 외환손익 (순액) */}
              <Card variant="elevated" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-700">
                      {selectedCurrency === 'ALL' ? '전체' : selectedCurrency} 외환손익
                    </h3>
                  </div>
                  <Badge variant="secondary">{viewMode === 'quarterly' ? '분기' : '누적'}</Badge>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <ComposedChart data={recvPayableChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${v}억`} />
                    <Tooltip content={<PLTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <ReferenceLine y={0} stroke="#94A3B8" strokeDasharray="3 3" />
                    <Bar dataKey="recv_total" fill="#3B82F6" name="채권손익" stackId="a" barSize={16} />
                    <Bar dataKey="payable_total" fill="#EF4444" name="채무손익" stackId="a" barSize={16} />
                    <Line
                      type="monotone"
                      dataKey={(d: typeof recvPayableChartData[0]) => d.recv_total + d.payable_total}
                      stroke="#10B981"
                      strokeWidth={3}
                      name="순손익"
                      dot={{ fill: '#10B981', r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>

              {/* 2. 거래손익 + 기말환율 */}
              <Card variant="elevated" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg">
                      <Repeat className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-emerald-600">거래손익</h3>
                  </div>
                  {selectedCurrency !== 'ALL' && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => setPlChartType('recv')}
                        className={`px-2 py-1 text-[10px] rounded ${plChartType === 'recv' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}
                      >
                        채권
                      </button>
                      <button
                        onClick={() => setPlChartType('payable')}
                        className={`px-2 py-1 text-[10px] rounded ${plChartType === 'payable' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}
                      >
                        채무
                      </button>
                    </div>
                  )}
                  {selectedCurrency === 'ALL' && (
                    <span className="text-xs text-slate-400">전체 추세</span>
                  )}
                </div>
                {selectedCurrency === 'ALL' ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <ComposedChart data={dataSource.slice(1).map((item) => ({
                      quarter: item.quarter,
                      recv_trade: item.trade_recv_pl,
                      payable_trade: item.trade_payable_pl,
                      net_trade: item.trade_recv_pl + item.trade_payable_pl
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="quarter" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${v}억`} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <ReferenceLine y={0} stroke="#94A3B8" strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="recv_trade" stroke="#3B82F6" strokeWidth={2} name="채권 거래손익" dot={{ fill: '#3B82F6', r: 4 }} />
                      <Line type="monotone" dataKey="payable_trade" stroke="#EF4444" strokeWidth={2} name="채무 거래손익" dot={{ fill: '#EF4444', r: 4 }} />
                      <Line type="monotone" dataKey="net_trade" stroke="#10B981" strokeWidth={3} name="순 거래손익" dot={{ fill: '#10B981', r: 5 }} strokeDasharray="5 5" />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <ComposedChart data={dataSource.slice(1).map((item, idx) => ({
                      quarter: item.quarter,
                      trade: plChartType === 'recv' ? item.trade_recv_pl : item.trade_payable_pl,
                      rate: exchangeRateData[idx + 1]?.[selectedCurrency] || 0
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="quarter" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${v}억`} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <ReferenceLine yAxisId="left" y={0} stroke="#94A3B8" strokeDasharray="3 3" />
                      <Bar yAxisId="left" dataKey="trade" fill="#10B981" name="거래손익" barSize={20} />
                      <Line yAxisId="right" type="monotone" dataKey="rate" stroke={currencyColors[selectedCurrency]} strokeWidth={2} name={`${selectedCurrency} 환율`} dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </Card>

              {/* 3. 평가손익 + 기말환율 */}
              <Card variant="elevated" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg">
                      <Scale className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-purple-600">평가손익</h3>
                  </div>
                  {selectedCurrency !== 'ALL' && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => setPlChartType('recv')}
                        className={`px-2 py-1 text-[10px] rounded ${plChartType === 'recv' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}
                      >
                        채권
                      </button>
                      <button
                        onClick={() => setPlChartType('payable')}
                        className={`px-2 py-1 text-[10px] rounded ${plChartType === 'payable' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}
                      >
                        채무
                      </button>
                    </div>
                  )}
                  {selectedCurrency === 'ALL' && (
                    <span className="text-xs text-slate-400">전체 추세</span>
                  )}
                </div>
                {selectedCurrency === 'ALL' ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <ComposedChart data={dataSource.slice(1).map((item) => ({
                      quarter: item.quarter,
                      recv_eval: item.eval_recv_pl,
                      payable_eval: item.eval_payable_pl,
                      net_eval: item.eval_recv_pl + item.eval_payable_pl
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="quarter" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${v}억`} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <ReferenceLine y={0} stroke="#94A3B8" strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="recv_eval" stroke="#3B82F6" strokeWidth={2} name="채권 평가손익" dot={{ fill: '#3B82F6', r: 4 }} />
                      <Line type="monotone" dataKey="payable_eval" stroke="#EF4444" strokeWidth={2} name="채무 평가손익" dot={{ fill: '#EF4444', r: 4 }} />
                      <Line type="monotone" dataKey="net_eval" stroke="#8B5CF6" strokeWidth={3} name="순 평가손익" dot={{ fill: '#8B5CF6', r: 5 }} strokeDasharray="5 5" />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <ComposedChart data={dataSource.slice(1).map((item, idx) => ({
                      quarter: item.quarter,
                      eval: plChartType === 'recv' ? item.eval_recv_pl : item.eval_payable_pl,
                      rate: exchangeRateData[idx + 1]?.[selectedCurrency] || 0
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="quarter" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${v}억`} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <ReferenceLine yAxisId="left" y={0} stroke="#94A3B8" strokeDasharray="3 3" />
                      <Bar yAxisId="left" dataKey="eval" fill="#8B5CF6" name="평가손익" barSize={20} />
                      <Line yAxisId="right" type="monotone" dataKey="rate" stroke={currencyColors[selectedCurrency]} strokeWidth={2} name={`${selectedCurrency} 환율`} dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </div>

            {/* 주요통화 USD/CNY 분기별 분석 테이블 */}
            <Card variant="gradient" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">
                    <FileText className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700">주요통화 (USD/CNY) 분기별 분석</h3>
                    <p className="text-xs text-slate-400">Currency Analysis by Quarter</p>
                  </div>
                </div>
                <Badge variant="secondary">{viewMode === 'quarterly' ? '분기' : '누적'}</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="py-3 text-left text-slate-600 font-semibold" rowSpan={2}>통화</th>
                      <th className="py-3 text-center text-slate-600 font-semibold" rowSpan={2}>구분</th>
                      <th className="py-2 text-center font-semibold border-b border-slate-200" colSpan={2}>
                        <div className="text-blue-600">기준분기</div>
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                          {viewMode === 'quarterly' ? baseQuarter : `${baseQuarter} 누적`}
                        </div>
                      </th>
                      <th className="py-2 text-center font-semibold border-b border-slate-200" colSpan={2}>
                        <div className="text-purple-600">YoY 비교</div>
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                          {viewMode === 'quarterly' ? `${yoyCompareQuarter} (전년동기)` : `${yoyCompareQuarter} (전기말)`}
                        </div>
                      </th>
                      <th className="py-3 text-center text-amber-600 font-semibold" rowSpan={2}>환 익스포저</th>
                      <th className="py-3 text-center text-slate-600 font-semibold" rowSpan={2}>기말환율</th>
                      <th className="py-3 text-center text-purple-600 font-semibold" rowSpan={2}>1% 민감도</th>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <th className="py-2 text-center text-slate-400 font-medium">잔액</th>
                      <th className="py-2 text-center text-slate-400 font-medium">손익</th>
                      <th className="py-2 text-center text-slate-400 font-medium">잔액</th>
                      <th className="py-2 text-center text-slate-400 font-medium">손익</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* USD */}
                    <tr className="border-b border-slate-100 bg-blue-50/30">
                      <td className="py-3" rowSpan={2}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currencyColors.USD }}></div>
                          <span className="font-bold text-slate-700">USD</span>
                        </div>
                      </td>
                      <td className="py-3 text-center text-blue-600 font-medium">채권</td>
                      <td className="py-3 text-center">{currentBalanceData.recv_USD.toFixed(0)}억</td>
                      <td className="py-3 text-center">
                        <span className={((currencyRecvEvalPL[currencyRecvEvalPL.length - 1] as unknown as Record<string, number>)?.USD || 0) >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                          {((currencyRecvEvalPL[currencyRecvEvalPL.length - 1] as unknown as Record<string, number>)?.USD || 0).toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3 text-center text-slate-600">
                        {(currencyBalanceData.find(d => d.quarter === yoyCompareQuarter)?.recv_USD || 0).toFixed(0)}억
                      </td>
                      <td className="py-3 text-center">
                        {(() => {
                          const compareRecvEval = viewMode === 'quarterly'
                            ? (currencyRecvEvalPL_Quarterly.find(d => d.quarter === yoyCompareQuarter) as unknown as Record<string, number>)?.USD || 0
                            : (currencyRecvEvalPL_Cumulative.find(d => d.quarter === yoyCompareQuarter) as unknown as Record<string, number>)?.USD || 0;
                          return (
                            <span className={compareRecvEval >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                              {compareRecvEval.toFixed(1)}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="py-3 text-center" rowSpan={2}>
                        <span className="text-red-600 font-bold">-773억</span>
                        <div className="text-[10px] text-slate-400">(순채무)</div>
                      </td>
                      <td className="py-3 text-center" rowSpan={2}>
                        <span className="font-semibold">{currentRateData.USD.toLocaleString()}원</span>
                      </td>
                      <td className="py-3 text-center" rowSpan={2}>
                        <span className="text-red-500 font-medium">-7.73억</span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-red-50/30">
                      <td className="py-3 text-center text-red-600 font-medium">채무</td>
                      <td className="py-3 text-center">{Math.abs(currentBalanceData.pay_USD).toFixed(0)}억</td>
                      <td className="py-3 text-center">
                        <span className={((currencyPayableEvalPL[currencyPayableEvalPL.length - 1] as unknown as Record<string, number>)?.USD || 0) >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                          {((currencyPayableEvalPL[currencyPayableEvalPL.length - 1] as unknown as Record<string, number>)?.USD || 0).toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3 text-center text-slate-600">
                        {Math.abs((currencyBalanceData.find(d => d.quarter === yoyCompareQuarter)?.pay_USD || 0)).toFixed(0)}억
                      </td>
                      <td className="py-3 text-center">
                        {(() => {
                          const comparePayEval = viewMode === 'quarterly'
                            ? (currencyPayableEvalPL_Quarterly.find(d => d.quarter === yoyCompareQuarter) as unknown as Record<string, number>)?.USD || 0
                            : (currencyPayableEvalPL_Cumulative.find(d => d.quarter === yoyCompareQuarter) as unknown as Record<string, number>)?.USD || 0;
                          return (
                            <span className={comparePayEval >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                              {comparePayEval.toFixed(1)}
                            </span>
                          );
                        })()}
                      </td>
                    </tr>
                    {/* CNY */}
                    <tr className="border-b border-slate-100 bg-blue-50/30">
                      <td className="py-3" rowSpan={2}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currencyColors.CNY }}></div>
                          <span className="font-bold text-slate-700">CNY</span>
                        </div>
                      </td>
                      <td className="py-3 text-center text-blue-600 font-medium">채권</td>
                      <td className="py-3 text-center">{currentBalanceData.recv_CNY.toFixed(0)}억</td>
                      <td className="py-3 text-center">
                        <span className={((currencyRecvEvalPL[currencyRecvEvalPL.length - 1] as unknown as Record<string, number>)?.CNY || 0) >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                          {((currencyRecvEvalPL[currencyRecvEvalPL.length - 1] as unknown as Record<string, number>)?.CNY || 0).toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3 text-center text-slate-600">
                        {(currencyBalanceData.find(d => d.quarter === yoyCompareQuarter)?.recv_CNY || 0).toFixed(0)}억
                      </td>
                      <td className="py-3 text-center">
                        {(() => {
                          const compareRecvEval = viewMode === 'quarterly'
                            ? (currencyRecvEvalPL_Quarterly.find(d => d.quarter === yoyCompareQuarter) as unknown as Record<string, number>)?.CNY || 0
                            : (currencyRecvEvalPL_Cumulative.find(d => d.quarter === yoyCompareQuarter) as unknown as Record<string, number>)?.CNY || 0;
                          return (
                            <span className={compareRecvEval >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                              {compareRecvEval.toFixed(1)}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="py-3 text-center" rowSpan={2}>
                        <span className="text-blue-600 font-bold">+1,154억</span>
                        <div className="text-[10px] text-slate-400">(순채권)</div>
                      </td>
                      <td className="py-3 text-center" rowSpan={2}>
                        <span className="font-semibold">{currentRateData.CNY.toFixed(2)}원</span>
                      </td>
                      <td className="py-3 text-center" rowSpan={2}>
                        <span className="text-emerald-600 font-medium">+11.54억</span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-red-50/30">
                      <td className="py-3 text-center text-red-600 font-medium">채무</td>
                      <td className="py-3 text-center">0억</td>
                      <td className="py-3 text-center text-slate-400">-</td>
                      <td className="py-3 text-center text-slate-600">0억</td>
                      <td className="py-3 text-center text-slate-400">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
