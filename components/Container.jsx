import { cn } from "@/lib/utils.js";




export default function Container({ children, className}) {
  return <div className={cn("mx-auto max-w-350 px-3 md:px-6 ", className)}>{children}</div>;
}