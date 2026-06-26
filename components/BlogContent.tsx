import { Fragment } from 'react'
import type { BlogBlock, BlogBlockChild } from '@/lib/types'

// Renderuje pojedynczy element inline (tekst z formatowaniem lub link).
function renderChild(child: BlogBlockChild, key: number) {
  if (child.type === 'link' && child.url) {
    return (
      <a
        key={key}
        href={child.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground underline underline-offset-2 hover:opacity-80"
      >
        {child.children?.map((c, i) => renderChild(c, i))}
      </a>
    )
  }

  let node: React.ReactNode = child.text ?? ''
  if (child.bold) node = <strong>{node}</strong>
  if (child.italic) node = <em>{node}</em>
  if (child.underline) node = <u>{node}</u>
  if (child.strikethrough) node = <s>{node}</s>
  if (child.code) {
    node = <code className="px-1 py-0.5 rounded bg-foreground/10 text-sm font-mono">{node}</code>
  }
  return <Fragment key={key}>{node}</Fragment>
}

function renderChildren(children?: BlogBlockChild[]) {
  return children?.map((c, i) => renderChild(c, i))
}

// Renderuje listę bloków treści Strapi (format "blocks").
export function BlogContent({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading': {
            const cls =
              block.level === 1
                ? 'text-3xl font-black text-foreground'
                : block.level === 2
                ? 'text-2xl font-bold text-foreground'
                : 'text-xl font-bold text-foreground'
            return (
              <p key={i} className={cls}>
                {renderChildren(block.children)}
              </p>
            )
          }
          case 'list': {
            const items = block.children ?? []
            const itemCls = 'text-base text-foreground leading-relaxed'
            return block.format === 'ordered' ? (
              <ol key={i} className="list-decimal pl-6 flex flex-col gap-1">
                {items.map((li, j) => (
                  <li key={j} className={itemCls}>
                    {renderChildren(li.children)}
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="list-disc pl-6 flex flex-col gap-1">
                {items.map((li, j) => (
                  <li key={j} className={itemCls}>
                    {renderChildren(li.children)}
                  </li>
                ))}
              </ul>
            )
          }
          case 'quote':
            return (
              <blockquote
                key={i}
                className="border-l-2 border-foreground/30 pl-4 italic text-muted-foreground"
              >
                {renderChildren(block.children)}
              </blockquote>
            )
          case 'code':
            return (
              <pre
                key={i}
                className="rounded-lg bg-foreground/10 p-4 overflow-x-auto text-sm font-mono text-foreground"
              >
                <code>{renderChildren(block.children)}</code>
              </pre>
            )
          case 'paragraph':
          default:
            return (
              <p key={i} className="text-base text-foreground leading-relaxed">
                {renderChildren(block.children)}
              </p>
            )
        }
      })}
    </div>
  )
}
