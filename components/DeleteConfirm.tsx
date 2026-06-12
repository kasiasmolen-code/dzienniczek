'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

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
          <DialogDescription className="text-muted-foreground">
            Tej operacji nie można cofnąć.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="secondary" size="lg" onClick={onCancel} className="w-full sm:w-auto">
            Anuluj
          </Button>
          <Button variant="destructive" size="lg" onClick={onConfirm} className="w-full sm:w-auto">
            Usuń
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
