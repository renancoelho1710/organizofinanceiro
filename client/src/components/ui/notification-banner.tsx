import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { FiAlertCircle, FiInfo, FiCheckCircle, FiXCircle } from "react-icons/fi";

const notificationVariants = cva(
  "w-full py-3 flex items-center justify-center text-white text-center",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "bg-green-600",
        warning: "bg-amber-500",
        error: "bg-red-600",
        info: "bg-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconMap: Record<string, React.ComponentType<any>> = {
  default: FiInfo,
  success: FiCheckCircle,
  warning: FiAlertCircle,
  error: FiXCircle,
  info: FiInfo,
};

export interface NotificationBannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  onClose?: () => void;
}

const NotificationBanner = React.forwardRef<
  HTMLDivElement,
  NotificationBannerProps
>(({ className, variant = "default", children, onClose, ...props }, ref) => {
  const Icon = iconMap[variant || "default"];

  return (
    <div
      ref={ref}
      className={cn(notificationVariants({ variant }), className)}
      {...props}
    >
      <div className="container mx-auto px-4 flex items-center justify-center">
        <Icon className="w-5 h-5 mr-2 flex-shrink-0" />
        <div className="flex-1 text-center font-medium">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Fechar notificação"
          >
            <FiXCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
});

NotificationBanner.displayName = "NotificationBanner";

export { NotificationBanner };