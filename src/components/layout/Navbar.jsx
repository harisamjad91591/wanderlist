import { NavLink } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { useBucketList } from "@/context/BucketListContext"
import ThemeToggle from "@/components/layout/ThemeToggle"

function Navbar() {
  const { displayCount } = useBucketList()

  return (
    <nav className="flex items-center justify-between bg-white dark:bg-card-border border border-card-border rounded-[11px] px-[18px] py-[13px] shadow-sm transition-colors">
      <div className="flex items-center gap-[10px] select-none cursor-pointer">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta opacity-65"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-terracotta"></span>
        </span>
        <span className="font-display font-extrabold text-[18px] tracking-[0.08em] uppercase bg-gradient-to-r from-teal via-[#142d37] to-terracotta dark:from-teal dark:via-teal-ghost dark:to-terracotta bg-clip-text text-transparent drop-shadow-sm">
          Wanderlist
        </span>
      </div>

      <div className="flex items-center gap-[18px] text-[15px]">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Search
        </NavLink>
        <NavLink
          to="/list"
          className={({ isActive }) =>
            `nav-link inline-flex items-center gap-[7px]${isActive ? " active" : ""}`
          }
        >
          My List
          <Badge>{displayCount}</Badge>
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          History
        </NavLink>

        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Navbar