import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-2 border border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-500/10 dark:shadow-slate-900/20",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/40 data-[state=active]:scale-[1.02] data-[state=inactive]:text-gray-600 data-[state=inactive]:dark:text-slate-400 data-[state=inactive]:hover:text-indigo-600 data-[state=inactive]:dark:hover:text-indigo-400 data-[state=inactive]:hover:bg-gray-50/80 data-[state=inactive]:dark:hover:bg-slate-700/50",
        className
      )}
      {...props}
    />
  )
)
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }

