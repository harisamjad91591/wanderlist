import { NavLink } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { useBucketList } from "@/context/BucketListContext"

/**
 * <Navbar />
 * Identical on every page — only the active link changes, and that's
 * handled automatically by NavLink. The list count comes straight
 * from BucketListContext, so it's always in sync everywhere.
 */
function Navbar() {
  const { bucketList } = useBucketList()

  return (
    <nav className="flex items-center justify-between bg-white border border-card-border rounded-[11px] px-[18px] py-[13px]">
      <div className="flex items-center gap-[9px] font-mono text-sm tracking-[0.14em] uppercase text-ink font-bold">
        <span className="w-[9px] h-[9px] rounded-full bg-terracotta inline-block" />
        Wanderlist
      </div>

      <div className="flex items-center gap-[26px] text-[15px]">
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
          <Badge>{bucketList.length}</Badge>
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar
