export default function SectionLabel({ index, children }) {
  return (
    <p className="section-label">
      <span className="section-label__index">{index}</span>
      <span aria-hidden="true">/</span>
      <span>{children}</span>
    </p>
  )
}
