import {
  HomeModernIcon,
  BookOpenIcon,
  FireIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

import { NavigationInterface } from "@/lib/types/navigation.type";

export const sidebarNavigation: Array<NavigationInterface> = [
  {
    route: "/",
    label: "Home",
    icon: HomeModernIcon,
  },
  {
    route: "/library",
    label: "Library",
    icon: BookOpenIcon,
  },
  {
    route: "/plan",
    label: "Plan",
    icon: ClipboardDocumentCheckIcon,
  },
  {
    route: "/workout",
    label: "Workout",
    icon: FireIcon,
  },
];
