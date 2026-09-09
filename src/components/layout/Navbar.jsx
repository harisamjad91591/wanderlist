import { History, Globe, Heart } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import ThemeToggle from "@/components/layout/ThemeToggle"
import { Badge } from "@/components/ui/badge"
import { useBucketList } from "@/store/useBucketListStore"

function Navbar() {
  const { bucketList, history } = useBucketList()
  const location = useLocation()

  return (
    <nav className="flex items-center justify-between pb-6 border-b border-card-border dark:border-slate-800">
      <Link to="/" className="flex items-center gap-2.5 no-underline group">
        <div className="p-2 rounded-xl bg-teal text-white shadow-sm group-hover:scale-105 transition-transform">
          <Globe className="size-5" />
        </div>
        <span className="font-display font-bold text-xl text-ink dark:text-white tracking-tight">
          Wanderlist
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <Link
          to="/my-list"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold no-underline transition-all ${
            location.pathname === "/my-list"
              ? "bg-teal text-white shadow-sm"
              : "bg-white dark:bg-slate-800 text-ink dark:text-white border border-card-border dark:border-slate-700 hover:border-teal"
          }`}
        >
          <Heart className="size-3.5" />
          <span>My List</span>
          {bucketList.length > 0 && (
            <Badge
              size="sm"
              className={
                location.pathname === "/my-list"
                  ? "bg-white text-teal font-bold"
                  : "bg-teal text-white"
              }
            >
              {bucketList.length}
            </Badge>
          )}
        </Link>

        <Link
          to="/history"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold no-underline transition-all ${
            location.pathname === "/history"
              ? "bg-teal text-white shadow-sm"
              : "bg-white dark:bg-slate-800 text-ink dark:text-white border border-card-border dark:border-slate-700 hover:border-teal"
          }`}
        >
          <History className="size-3.5" />
          <span>History</span>
          {history.length > 0 && (
            <Badge
              size="sm"
              className={
                location.pathname === "/history"
                  ? "bg-white text-teal font-bold"
                  : "bg-teal text-white"
              }
            >
              {history.length}
            </Badge>
          )}
        </Link>

        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Navbar