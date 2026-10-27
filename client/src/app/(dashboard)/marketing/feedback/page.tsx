'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Star,
  CheckCircle2,
  Check,
  X,
  ChevronRight,
  MessageSquare,
  Building2,
  TrendingUp,
  ThumbsUp,
  Heart,
  Lock,
} from 'lucide-react';
import {
  CustomerFeedbackSurveyItem,
  SurveyTargetAudience,
  SurveyStatus,
} from '@/types/marketing';

const INITIAL_SURVEYS: CustomerFeedbackSurveyItem[] = [
  {
    id: 'surv-1',
    surveyCode: 'SURV-260012',
    title: 'Q1 Post-Delivery Precision & On-Time Performance Audit',
    targetAudience: 'OEM_CLIENTS',
    channel: 'POST_DELIVERY_PORTAL',
    status: 'PUBLISHED',
    totalResponses: 24,
    averageCSATScore: 4.85,
    brandPerceptionScore: 92.4,
    keyStrengths: [
      'Sub-Micron Machining Tolerances',
      'Zero-Defect Quality Batches',
      'Prompt Design Engineering Support',
      'Comprehensive Material Test Reports (MTR)',
    ],
    improvementAreas: [
      'Packaging Carton Corner Reinforcement',
      'Expedited Sea-Freight Tracking Links',
    ],
    questionsJson: [
      { id: 'q1', text: 'How satisfied are you with the dimensional accuracy of the delivered batch?' },
      { id: 'q2', text: 'How would you rate the speed of technical inquiry response?' },
    ],
    feedbackResponses: [
      {
        responseId: 'RESP-01',
        respondentCompany: 'Mahindra Heavy Electric Vehicles',
        csatRating: 5,
        brandPerceptionRating: 95,
        feedbackText: 'Exceptional consistency across all 1,200 transmission shafts. Runout was within 1.5 microns.',
        submittedAt: '2026-03-02T14:00:00Z',
      },
      {
        responseId: 'RESP-02',
        respondentCompany: 'Tata Advanced Systems Tooling Div',
        csatRating: 4.7,
        brandPerceptionRating: 90,
        feedbackText: 'Flawless surface finish on titanium brackets. Delivery was 2 days ahead of schedule.',
        submittedAt: '2026-03-04T11:30:00Z',
      },
    ],
    publishedBy: 'Vikram Sethi',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-03-05T12:00:00Z',
  },
  {
    id: 'surv-2',
    surveyCode: 'SURV-260016',
    title: 'Tier-1 Automotive Vendor Partnership & Collaboration Index',
    targetAudience: 'TIER_1_SUPPLIERS',
    channel: 'EMAIL_CAMPAIGN',
    status: 'PUBLISHED',
    totalResponses: 18,
    averageCSATScore: 4.72,
    brandPerceptionScore: 89.1,
    keyStrengths: [
      'Consistent Contract Compliance',
      'Transparent Tooling Requisitions',
      'High Volume Production Stability',
    ],
    improvementAreas: [
      'EDI Dispatch Integration',
    ],
    questionsJson: [
      { id: 'q1', text: 'Rate our long-term supply chain predictability.' },
    ],
    feedbackResponses: [
      {
        responseId: 'RESP-03',
        respondentCompany: 'Sundram Fasteners Aerospace Unit',
        csatRating: 5,
        brandPerceptionRating: 92,
        feedbackText: 'Apex has been our most dependable precision manufacturing partner for 4 consecutive quarters.',
        submittedAt: '2026-03-01T09:00:00Z',
      },
    ],
    publishedBy: 'Ananya Roy',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-03-04T16:00:00Z',
  },
  {
    id: 'surv-3',
    surveyCode: 'SURV-260019',
    title: 'Authorized Channel Distributor Brand Perception Survey 2026',
    targetAudience: 'DISTRIBUTORS',
    channel: 'PUBLIC_INDUSTRY_LINK',
    status: 'PUBLISHED',
    totalResponses: 12,
    averageCSATScore: 4.6,
    brandPerceptionScore: 87.5,
    keyStrengths: [
      'Marketing Spec Sheet Availability',
      'CAD Catalog Download Speed',
    ],
    improvementAreas: [
      'Co-Branded Exhibition Signage Subsidies',
    ],
    questionsJson: [
      { id: 'q1', text: 'How easily can your sales team access technical brochures?' },
    ],
    publishedBy: 'Vikram Sethi',
    createdAt: '2026-02-05T10:00:00Z',
    updatedAt: '2026-03-02T10:00:00Z',
  },
];

export default function BrandFeedbackPage() {
  const [surveys, setSurveys] = useState<CustomerFeedbackSurveyItem[]>(INITIAL_SURVEYS);
  const [searchTerm, setSearchTerm] = useState('');
  const [audienceFilter, setAudienceFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals state
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedSurveyForResponse, setSelectedSurveyForResponse] = useState<CustomerFeedbackSurveyItem | null>(null);

  // Forms
  const [publishForm, setPublishForm] = useState({
    title: '',
    targetAudience: 'OEM_CLIENTS' as SurveyTargetAudience,
    channel: 'POST_DELIVERY_PORTAL',
    publishedBy: 'Marketing Communications',
  });

  const [responseForm, setResponseForm] = useState({
    respondentCompany: '',
    csatRating: 5,
    brandPerceptionRating: 95,
    feedbackText: '',
    keyStrengths: 'Sub-Micron Machining Tolerances, On-Time Dispatch SLA',
    improvementAreas: '',
  });

  const [notification, setNotification] = useState<string | null>(null);

  const fetchSurveys = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/v1/marketing/feedback');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSurveys(data);
        }
      }
    } catch (err) {
      console.warn('API fallback', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handlePublishSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    const newSurvey: CustomerFeedbackSurveyItem = {
      id: `surv-${Date.now()}`,
      surveyCode: `SURV-2600${surveys.length + 25}`,
      title: publishForm.title,
      targetAudience: publishForm.targetAudience,
      channel: publishForm.channel,
      status: 'PUBLISHED',
      totalResponses: 0,
      averageCSATScore: 5.0,
      brandPerceptionScore: 90.0,
      keyStrengths: [],
      improvementAreas: [],
      questionsJson: [{ id: 'q1', text: 'Overall satisfaction with manufactured parts quality' }],
      publishedBy: publishForm.publishedBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await fetch('/api/v1/marketing/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...publishForm,
          questions: newSurvey.questionsJson,
        }),
      });
    } catch (err) {
      console.warn('Offline fallback', err);
    }

    setSurveys([newSurvey, ...surveys]);
    setShowPublishModal(false);
    setNotification(`Survey [${newSurvey.surveyCode}] published to ${newSurvey.channel}!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRecordResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSurveyForResponse) return;

    const strengthsList = responseForm.keyStrengths
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const improvementsList = responseForm.improvementAreas
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      await fetch('/api/v1/marketing/feedback/record-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyId: selectedSurveyForResponse.id,
          respondentCompany: responseForm.respondentCompany,
          csatRating: Number(responseForm.csatRating),
          brandPerceptionRating: Number(responseForm.brandPerceptionRating),
          feedbackText: responseForm.feedbackText,
          keyStrengths: strengthsList,
          improvementAreas: improvementsList,
        }),
      });
    } catch (err) {
      console.warn('Offline fallback', err);
    }

    // Update local survey
    setSurveys((prev) =>
      prev.map((s) => {
        if (s.id !== selectedSurveyForResponse.id) return s;
        const newTotal = s.totalResponses + 1;
        const newCsat = Number(
          (((s.averageCSATScore * s.totalResponses) + Number(responseForm.csatRating)) / newTotal).toFixed(2),
        );
        const newBrand = Number(
          (((s.brandPerceptionScore * s.totalResponses) + Number(responseForm.brandPerceptionRating)) / newTotal).toFixed(1),
        );
        const updatedResponses = [
          {
            responseId: `RESP-${Date.now()}`,
            respondentCompany: responseForm.respondentCompany || 'OEM Partner',
            csatRating: Number(responseForm.csatRating),
            brandPerceptionRating: Number(responseForm.brandPerceptionRating),
            feedbackText: responseForm.feedbackText,
            submittedAt: new Date().toISOString(),
          },
          ...(s.feedbackResponses || []),
        ];

        return {
          ...s,
          totalResponses: newTotal,
          averageCSATScore: newCsat,
          brandPerceptionScore: newBrand,
          keyStrengths: Array.from(new Set([...s.keyStrengths, ...strengthsList])),
          improvementAreas: Array.from(new Set([...s.improvementAreas, ...improvementsList])),
          feedbackResponses: updatedResponses,
        };
      }),
    );

    setShowResponseModal(false);
    setNotification(
      `Feedback recorded for ${responseForm.respondentCompany || 'Partner'}! CSAT: ${responseForm.csatRating}/5, Brand: ${responseForm.brandPerceptionRating}%`,
    );
    setTimeout(() => setNotification(null), 5000);
  };

  const filteredSurveys = surveys.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.surveyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.channel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.keyStrengths.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAudience = audienceFilter === 'ALL' || s.targetAudience === audienceFilter;

    return matchesSearch && matchesAudience;
  });

  const totalResponses = surveys.reduce((sum, s) => sum + s.totalResponses, 0);
  const overallCsat =
    surveys.length > 0
      ? (surveys.reduce((sum, s) => sum + s.averageCSATScore, 0) / surveys.length).toFixed(2)
      : '4.85';
  const overallBrand =
    surveys.length > 0
      ? (surveys.reduce((sum, s) => sum + s.brandPerceptionScore, 0) / surveys.length).toFixed(1)
      : '91.4';

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-6 space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/marketing" className="hover:text-amber-400">
              Marketing
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-200">Brand Perception & CSAT</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Brand Perception & Customer Satisfaction (CSAT)
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-500/30">
                  Voice of Customer
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Post-delivery audit surveys, verified client quotes, and mathematical moving-average brand equity index
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSurveys}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowPublishModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-semibold shadow-lg shadow-amber-500/20 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            Publish New Survey
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block font-medium">Overall CSAT Score</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-2xl font-black text-white">{overallCsat}</span>
            <span className="text-xs text-slate-500 font-semibold">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-amber-400 block font-medium">Brand Perception Equity</span>
          <span className="text-2xl font-black text-amber-300 mt-1 block">{overallBrand}%</span>
          <span className="text-[11px] text-slate-500">Tier-1 OEM market positioning</span>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block font-medium">Total Responses Collected</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">{totalResponses} Audits</span>
          <span className="text-[11px] text-slate-500">From procurement & quality directors</span>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block font-medium">Published Survey Streams</span>
          <span className="text-2xl font-black text-white mt-1 block">{surveys.length} Channels</span>
          <span className="text-[11px] text-slate-500">Portal, email & industry links</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search surveys, strengths, codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#090d16] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <span>Target Audience:</span>
            <select
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value)}
              className="bg-[#090d16] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
            >
              <option value="ALL">All Audiences</option>
              <option value="OEM_CLIENTS">OEM Clients</option>
              <option value="TIER_1_SUPPLIERS">Tier-1 Suppliers</option>
              <option value="DISTRIBUTORS">Distributor Network</option>
              <option value="PUBLIC_INDUSTRY">Public Industry</option>
            </select>
          </div>
        </div>
      </div>

      {/* Surveys List */}
      <div className="space-y-4">
        {filteredSurveys.map((s) => (
          <div
            key={s.id}
            className="bg-[#0d1322] border border-slate-800 rounded-xl p-5 hover:border-amber-500/30 transition space-y-4"
          >
            {/* Header: code, title, audience, status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded">
                  {s.surveyCode}
                </span>
                <h3 className="text-sm font-bold text-white">{s.title}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                  {s.targetAudience.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
                  {s.status}
                </span>
                <button
                  onClick={() => {
                    setSelectedSurveyForResponse(s);
                    setShowResponseModal(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Record Client Feedback
                </button>
              </div>
            </div>

            {/* Score Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#090d16] border border-slate-800/80 text-xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Average CSAT</span>
                  <div className="text-base font-bold text-white flex items-center gap-1">
                    <span>{s.averageCSATScore}</span>
                    <span className="text-xs text-slate-500">/ 5.0</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Heart className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Brand Perception</span>
                  <div className="text-base font-bold text-emerald-400">
                    {s.brandPerceptionScore}% Positive
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Building2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Total Submissions</span>
                  <div className="text-base font-bold text-white">
                    {s.totalResponses} Verified Responses
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Strengths & Improvements */}
            <div className="space-y-2 text-xs">
              {s.keyStrengths.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Recognized Operational Strengths:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {s.keyStrengths.map((str, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 font-medium inline-flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-emerald-400" /> {str}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {s.improvementAreas.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Identified Areas for Enhancement:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {s.improvementAreas.map((imp, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/20 text-amber-300 font-medium inline-flex items-center gap-1"
                      >
                        <TrendingUp className="w-3 h-3 text-amber-400" /> {imp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recent Response Testimonials */}
            {s.feedbackResponses && s.feedbackResponses.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Recent OEM Testimonials & Reviews:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {s.feedbackResponses.slice(0, 2).map((r, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-white">{r.respondentCompany}</span>
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="h-3 w-3 fill-amber-400" /> {r.csatRating}/5
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300 italic">"{r.feedbackText}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal: Publish New Survey */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                Publish Customer Satisfaction (CSAT) Survey
              </h3>
              <button onClick={() => setShowPublishModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handlePublishSurvey} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Survey Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q2 Precision Machining Quality & Delivery Audit"
                  value={publishForm.title}
                  onChange={(e) => setPublishForm({ ...publishForm, title: e.target.value })}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Target Audience *</label>
                  <select
                    value={publishForm.targetAudience}
                    onChange={(e) =>
                      setPublishForm({
                        ...publishForm,
                        targetAudience: e.target.value as SurveyTargetAudience,
                      })
                    }
                    className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="OEM_CLIENTS">OEM Direct Clients</option>
                    <option value="TIER_1_SUPPLIERS">Tier-1 Suppliers</option>
                    <option value="DISTRIBUTORS">Distributor Network</option>
                    <option value="PUBLIC_INDUSTRY">Public Industry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Distribution Channel</label>
                  <input
                    type="text"
                    required
                    placeholder="POST_DELIVERY_PORTAL / EMAIL"
                    value={publishForm.channel}
                    onChange={(e) => setPublishForm({ ...publishForm, channel: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Publishing Officer</label>
                <input
                  type="text"
                  required
                  value={publishForm.publishedBy}
                  onChange={(e) =>
                    setPublishForm({ ...publishForm, publishedBy: e.target.value })
                  }
                  className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold"
                >
                  Publish Survey Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Customer Feedback */}
      {showResponseModal && selectedSurveyForResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-[#0d1322] border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-amber-400" />
                  Record Client Feedback Response
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Survey: {selectedSurveyForResponse.title} ({selectedSurveyForResponse.surveyCode})
                </p>
              </div>
              <button onClick={() => setShowResponseModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRecordResponse} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Respondent Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Advanced Systems Tooling Div"
                  value={responseForm.respondentCompany}
                  onChange={(e) =>
                    setResponseForm({ ...responseForm, respondentCompany: e.target.value })
                  }
                  className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    CSAT Rating: {responseForm.csatRating} / 5
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={0.5}
                    value={responseForm.csatRating}
                    onChange={(e) =>
                      setResponseForm({ ...responseForm, csatRating: Number(e.target.value) })
                    }
                    className="w-full mt-2 accent-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    Brand Equity: {responseForm.brandPerceptionRating}%
                  </label>
                  <input
                    type="range"
                    min={50}
                    max={100}
                    value={responseForm.brandPerceptionRating}
                    onChange={(e) =>
                      setResponseForm({
                        ...responseForm,
                        brandPerceptionRating: Number(e.target.value),
                      })
                    }
                    className="w-full mt-2 accent-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Client Testimonial & Remarks</label>
                <textarea
                  rows={2}
                  placeholder="Dimensional accuracy feedback, inspection reports, lead time satisfaction..."
                  value={responseForm.feedbackText}
                  onChange={(e) =>
                    setResponseForm({ ...responseForm, feedbackText: e.target.value })
                  }
                  className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  Recognized Strengths (Comma-Separated)
                </label>
                <input
                  type="text"
                  placeholder="Sub-Micron Machining, Zero Defects, Fast Response"
                  value={responseForm.keyStrengths}
                  onChange={(e) =>
                    setResponseForm({ ...responseForm, keyStrengths: e.target.value })
                  }
                  className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  Areas for Improvement (Comma-Separated)
                </label>
                <input
                  type="text"
                  placeholder="Packaging Corners, Live Shipment GPS"
                  value={responseForm.improvementAreas}
                  onChange={(e) =>
                    setResponseForm({ ...responseForm, improvementAreas: e.target.value })
                  }
                  className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowResponseModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold"
                >
                  Record Response & Recalculate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
