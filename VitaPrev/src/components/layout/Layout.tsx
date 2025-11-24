import { Outlet } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "../ui/sidebar";
import { Link } from "react-router-dom";

import {
  IconArrowLeft,
  IconTarget,
  IconApple,
  IconHeartFilled,
  IconHeartbeat,
  IconChefHat,
  IconPresentationAnalytics,
  IconUser
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

export default function Layout() {
  const links = [
    { label: "Dashboard", href: "/dashboard", icon: <IconPresentationAnalytics /> },
    { label: "Métricas de salud", href: "/metricas", icon: <IconHeartbeat /> },
    { label: "Registro de Comidas", href: "/registro-comida", icon: <IconApple /> },
    { label: "Recomendaciones saludables", href: "/recomendaciones", icon: <IconChefHat  /> },
    { label: "Metas", href: "/metas", icon: <IconTarget  /> },
    { label: "Cerrar sesión", href: "/auth/logout", icon: <IconArrowLeft /> },
  ];

  return (
    <div className="flex min-h-screen bg-emerald-50">
      <Sidebar>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col">
            <VitaPrevLogo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <Link key={idx} to={link.href}>
                  <SidebarLink link={link} />
                </Link>
              ))}
            </div>
          </div>

          <Link to="/user/me">
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
          </Link>
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 p-6 ml-20 md:ml-[300px]">
        <Outlet />
      </main>
    </div>
  );
}
