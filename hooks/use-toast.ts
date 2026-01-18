import { toast as sonnerToast } from "sonner";

export function toast(props: { title?: string; description?: string; variant?: string }) {
  if (props.variant === "destructive") {
    sonnerToast.error(props.description || props.title);
  } else {
    sonnerToast.success(props.description || props.title);
  }
}
