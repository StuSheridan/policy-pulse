import { Lightbulb, Search, ShieldCheck, FileText, TrendingUp } from 'lucide-react'
import SectionCard from './SectionCard'
import CtaBanner from './CtaBanner'

const SECTION_CAP = 5

function SectionHeading({ icon: Icon, children }) {
  return (
    <h2
      className="flex items-center gap-2 mt-8 mb-4 pb-2 text-xl font-bold text-gray-700 border-b-2 border-gray-200"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {Icon && <Icon className="w-5 h-5 text-blue-500" />}
      {children}
    </h2>
  )
}

function EmptySection() {
  return (
    <p className="text-sm italic text-gray-400 mb-4" style={{ fontFamily: 'Open Sans, sans-serif' }}>
      Nothing to report this week — check back next issue.
    </p>
  )
}

function CappedItems({ items }) {
  if (!items?.length) return <EmptySection />
  const visible = items.slice(0, SECTION_CAP)
  const remaining = items.length - SECTION_CAP
  return (
    <>
      {visible.map((item, i) => (
        <SectionCard
          key={i}
          headline={item?.headline}
          summary={item?.summary}
          action={item?.action}
          source={item?.source}
          url={item?.original_url}
          sector_tags={item?.sector_tags}
        />
      ))}
      {remaining > 0 && (
        <p className="text-sm text-gray-500 mb-4 text-center" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          {remaining} more item{remaining !== 1 ? 's' : ''} available
        </p>
      )}
    </>
  )
}

export default function IssuePreview({ issueData }) {
  const s = issueData?.sections

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Editor's overview placeholder */}
      <div className="bg-gray-200 rounded-lg p-4 mb-6 text-center">
        <p className="text-sm text-gray-500" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          This week's overview will appear here after your review.
        </p>
      </div>

      {/* Regulatory Updates */}
      <SectionHeading icon={FileText}>Regulatory Updates</SectionHeading>
      <CappedItems items={s?.regulatory_updates} />

      {/* Recent Judgements */}
      <SectionHeading icon={ShieldCheck}>Recent Judgements</SectionHeading>
      <CappedItems items={s?.judgements} />

      {/* Under Review */}
      <SectionHeading icon={Search}>Under Review</SectionHeading>
      <CappedItems items={s?.under_review} />

      {/* Evergreen Tip */}
      <SectionHeading icon={Lightbulb}>Compliance Tip of the Week</SectionHeading>
      {s?.evergreen_tip ? (
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4">
          <h3
            className="font-bold text-gray-800 mb-2"
            style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px' }}
          >
            {s.evergreen_tip.tip}
          </h3>
          <p className="text-base text-gray-600" style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px' }}>
            {s.evergreen_tip.body}
          </p>
        </div>
      ) : (
        <EmptySection />
      )}

      {/* Sector Spotlight */}
      <SectionHeading icon={TrendingUp}>Sector Spotlight</SectionHeading>
      {s?.sector_spotlight ? (
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4">
          <h3
            className="font-bold text-gray-800 mb-2"
            style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px' }}
          >
            {s.sector_spotlight.headline || `${s.sector_spotlight.sector} Update`}
          </h3>
          <p className="text-base text-gray-600" style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px' }}>
            {s.sector_spotlight.body}
          </p>
        </div>
      ) : (
        <EmptySection />
      )}

      {/* Checkedit Check of the Month */}
      <SectionHeading icon={ShieldCheck}>Checkedit Check of the Month</SectionHeading>
      {s?.checkedit_check ? (
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4">
          <div className="mb-2">
            <span className="bg-gray-100 text-gray-500 text-xs rounded-full px-2 py-0.5">
              {s.checkedit_check.brand}
            </span>
          </div>
          <h3
            className="font-bold text-gray-800 mb-1"
            style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px' }}
          >
            {s.checkedit_check.product}
          </h3>
          <p className="text-base text-gray-600 mb-2" style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px' }}>
            {s.checkedit_check.finding}
          </p>
          <div className="border-l-4 border-blue-500 pl-3 mb-2 text-sm text-gray-700" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            <strong>Verdict:</strong> {s.checkedit_check.verdict}
          </div>
          <p className="italic text-sm text-gray-500" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            {s.checkedit_check.checkedit_note}
          </p>
        </div>
      ) : (
        <EmptySection />
      )}

      {/* CTA Banner */}
      <CtaBanner />
    </div>
  )
}
