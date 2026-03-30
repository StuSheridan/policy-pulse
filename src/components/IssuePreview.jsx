import SectionCard from './SectionCard'
import CtaBanner from './CtaBanner'

function SectionHeading({ children }) {
  return (
    <h2
      className="mt-8 mb-4 pb-2"
      style={{
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '16px',
        color: '#374151',
        borderBottom: '2px solid #E5E7EB'
      }}
    >
      {children}
    </h2>
  )
}

function EmptySection() {
  return (
    <p className="text-sm italic mb-4" style={{ color: '#9CA3AF' }}>
      Nothing to report this week — check back next issue.
    </p>
  )
}

export default function IssuePreview({ issueData }) {
  const s = issueData?.sections

  return (
    <div className="mx-auto px-4" style={{ maxWidth: '680px' }}>
      {/* Editor's overview placeholder */}
      <div
        className="rounded-lg p-4 mb-6 text-center"
        style={{ background: '#E5E7EB', borderRadius: '8px' }}
      >
        <p className="text-sm" style={{ color: '#6B7280' }}>
          This week's overview will appear here after your review.
        </p>
      </div>

      {/* Regulatory Updates */}
      <SectionHeading>Regulatory Updates</SectionHeading>
      {s?.regulatory_updates?.length > 0 ? (
        s.regulatory_updates.map((item, i) => (
          <SectionCard
            key={i}
            headline={item?.headline}
            summary={item?.summary}
            action={item?.action}
            source={item?.source}
            url={item?.original_url}
            sector_tags={item?.sector_tags}
          />
        ))
      ) : (
        <EmptySection />
      )}

      {/* Recent Judgements */}
      <SectionHeading>Recent Judgements</SectionHeading>
      {s?.judgements?.length > 0 ? (
        s.judgements.map((item, i) => (
          <SectionCard
            key={i}
            headline={item?.headline}
            summary={item?.summary}
            action={item?.action}
            source={item?.source}
            url={item?.original_url}
            sector_tags={item?.sector_tags}
          />
        ))
      ) : (
        <EmptySection />
      )}

      {/* Under Review */}
      <SectionHeading>Under Review</SectionHeading>
      {s?.under_review?.length > 0 ? (
        s.under_review.map((item, i) => (
          <SectionCard
            key={i}
            headline={item?.headline}
            summary={item?.summary}
            action={item?.action}
            source={item?.source}
            url={item?.original_url}
            sector_tags={item?.sector_tags}
          />
        ))
      ) : (
        <EmptySection />
      )}

      {/* Evergreen Tip */}
      <SectionHeading>Compliance Tip of the Week</SectionHeading>
      {s?.evergreen_tip ? (
        <div
          className="p-4 mb-4"
          style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
        >
          <h3
            className="font-bold mb-2"
            style={{ fontSize: '15px', color: '#1F2937', fontFamily: 'Montserrat, sans-serif' }}
          >
            {s.evergreen_tip.tip}
          </h3>
          <p style={{ fontSize: '13px', color: '#4B5563', fontFamily: 'Open Sans, sans-serif' }}>
            {s.evergreen_tip.body}
          </p>
        </div>
      ) : (
        <EmptySection />
      )}

      {/* Sector Spotlight */}
      <SectionHeading>Sector Spotlight</SectionHeading>
      {s?.sector_spotlight ? (
        <div
          className="p-4 mb-4"
          style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
        >
          <h3
            className="font-bold mb-2"
            style={{ fontSize: '15px', color: '#1F2937', fontFamily: 'Montserrat, sans-serif' }}
          >
            {s.sector_spotlight.headline || `${s.sector_spotlight.sector} Update`}
          </h3>
          <p style={{ fontSize: '13px', color: '#4B5563', fontFamily: 'Open Sans, sans-serif' }}>
            {s.sector_spotlight.body}
          </p>
        </div>
      ) : (
        <EmptySection />
      )}

      {/* Checkedit Check of the Month */}
      <SectionHeading>Checkedit Check of the Month</SectionHeading>
      {s?.checkedit_check ? (
        <div
          className="p-4 mb-4"
          style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
        >
          <div className="mb-2">
            <span
              className="inline-block px-2 py-0.5 rounded-full mr-2"
              style={{ background: '#F3F4F5', color: '#6B7280', fontSize: '11px' }}
            >
              {s.checkedit_check.brand}
            </span>
          </div>
          <h3
            className="font-bold mb-1"
            style={{ fontSize: '15px', color: '#1F2937', fontFamily: 'Montserrat, sans-serif' }}
          >
            {s.checkedit_check.product}
          </h3>
          <p className="mb-2" style={{ fontSize: '13px', color: '#4B5563', fontFamily: 'Open Sans, sans-serif' }}>
            {s.checkedit_check.finding}
          </p>
          <div
            className="mb-2"
            style={{
              borderLeft: '3px solid #3B82F6',
              paddingLeft: '10px',
              fontSize: '13px',
              color: '#374151'
            }}
          >
            <strong>Verdict:</strong> {s.checkedit_check.verdict}
          </div>
          <p className="italic" style={{ fontSize: '12px', color: '#6B7280' }}>
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
