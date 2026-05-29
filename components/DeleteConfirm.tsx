'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

interface Props {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirm({ open, onConfirm, onCancel }: Props) {
  return (
    <Dialog open={open} onOpenChange={open => !open && onCancel()}>
      <DialogContent className="rounded-3xl bg-background border-foreground/10 max-w-xs mx-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground font-bold">Usunąć wpis?</DialogTitle>
          <DialogDescription className="text-muted">
            Tej operacji nie można cofnąć.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-foreground/20 text-foreground text-sm font-medium hover:bg-foreground/5 transition-colors"
          >
            Anuluj
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Usuń
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
