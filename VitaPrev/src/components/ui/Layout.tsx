import { Outlet } from "react-router-dom";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  useSidebar,
} from "./sidebar";
import { cn } from "../lib/utils";

import {
  IconArrowLeft,
  IconTarget,
  IconApple,
  IconHeartFilled,
  IconHeartbeat,
  IconChefHat,
  IconPresentationAnalytics,
  IconUser,
} from "@tabler/icons-react";

function VitaPrevLogo() {
  const { open } = useSidebar();

  return (
    <div className="py-2 px-1 flex items-center gap-2">
      <IconHeartFilled className="text-emerald-600" size={28} />
      {open && (
        <span className="text-emerald-700 font-semibold text-lg transition-opacity duration-300">
          VitaPrev
        </span>
      )}
    </div>
  );
}

function MainContent() {
  const { open } = useSidebar();

  return (
    <main
      className={cn(
        "flex-1 p-6 ml-0 transition-all duration-300",
        open ? "md:ml-[280px]" : "md:ml-20" // 280px abierto, 80px cerrado
      )}
    >
      <Outlet />
    </main>
  );
}

export default function Layout() {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconPresentationAnalytics />,
    },
    { label: "Métricas de salud", href: "/metricas", icon: <IconHeartbeat /> },
    {
      label: "Registro de Comidas",
      href: "/registro-comida",
      icon: <IconApple />,
    },
    {
      label: "Recomendaciones saludables",
      href: "/recomendaciones",
      icon: <IconChefHat />,
    },
    { label: "Metas", href: "/metas", icon: <IconTarget /> },
    { label: "Cerrar sesión", href: "/auth/logout", icon: <IconArrowLeft /> },
  ];

  return (
    <Sidebar>
      <div className="flex min-h-screen bg-emerald-50">
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col">
            <VitaPrevLogo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link) => (
                <SidebarLink key={link.href} link={link} />
              ))}
            </div>
          </div>

          <SidebarLink
            link={{
              label: "Mi perfil",
              href: "/user/me",
              icon: (
                <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center">
                  <IconUser className="text-emerald-600" size={18} />
                </div>
              ),
            }}
          />
        </SidebarBody>

        {/* contenido principal que se mueve con el sidebar */}
        <MainContent />
      </div>
    </Sidebar>
  );
}
