import {
  BarChart3, Boxes, Building2, Code2, CreditCard, FileCheck2, FileText, Headphones, HelpCircle,
  LayoutDashboard, Megaphone, Newspaper, Plug, Rocket, Scale, Server, ShieldCheck, ShoppingBag,
  Sparkles, TrendingUp, UserCog, Users, Wallet, Workflow, type LucideIcon,
} from 'lucide-react';

/** Icon names referenced by name in the data files (nav, teams, resources). */
export const iconMap: Record<string, LucideIcon> = {
  BarChart3, Boxes, Building2, Code2, CreditCard, FileCheck2, FileText, Headphones, HelpCircle,
  LayoutDashboard, Megaphone, Newspaper, Plug, Rocket, Scale, Server, ShieldCheck, ShoppingBag,
  Sparkles, TrendingUp, UserCog, Users, Wallet, Workflow,
};

export function getIcon(name?: string): LucideIcon {
  return (name && iconMap[name]) || Sparkles;
}
