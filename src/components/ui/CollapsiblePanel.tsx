import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface CollapsiblePanelProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function CollapsiblePanel({ title, children, defaultOpen = true }: CollapsiblePanelProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <button
        className="w-full flex items-center justify-between px-6 py-4 focus:outline-none select-none"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`panel-content-${title.replace(/\s+/g, '-')}`}
      >
        <span className="text-lg font-semibold text-gray-900">{title}</span>
        {open ? (
          <ChevronUp className="h-5 w-5 text-navy-700" />
        ) : (
          <ChevronDown className="h-5 w-5 text-navy-700" />
        )}
      </button>
      <div
        id={`panel-content-${title.replace(/\s+/g, '-')}`}
        className={`transition-all duration-200 overflow-hidden ${open ? 'max-h-[1000px] py-4 px-6' : 'max-h-0 py-0 px-6'}`}
        style={{
          opacity: open ? 1 : 0,
        }}
      >
        {open && children}
      </div>
    </div>
  )
} 