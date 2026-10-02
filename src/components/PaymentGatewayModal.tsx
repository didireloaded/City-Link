import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CreditCard } from "lucide-react";

interface PaymentGatewayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amountNAD: number;
  description: string;
  onSuccess: (paymentMethod: string, reference: string) => void;
}

export function PaymentGatewayModal({ open, onOpenChange, amountNAD, description }: PaymentGatewayModalProps) {
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md rounded-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Pay for your ride</DialogTitle>
        <DialogDescription>Online payments are not available yet. No payment has been taken and no ride has been confirmed.</DialogDescription>
      </DialogHeader>
      <p className="text-sm text-muted-foreground">{description}</p>
      <p className="text-2xl font-extrabold">N${amountNAD.toLocaleString()}</p>
      <button type="button" onClick={() => onOpenChange(false)} className="h-12 rounded-lg bg-primary font-bold text-white">Back to summary</button>
    </DialogContent>
  </Dialog>;
}
