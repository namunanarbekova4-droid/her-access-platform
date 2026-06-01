import Link from "next/link";
import { Video, Library, Users, MessageCircle, ArrowRight } from "lucide-react";

interface AdminOverviewProps {
  stats: {
    userCount: number;
    videoCount: number;
    libraryCount: number;
    messageCount: number;
  };
}

export function AdminOverview({ stats }: AdminOverviewProps) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage Her Access content and users
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Users", value: stats.userCount, icon: Users, color: "bg-purple-50 text-purple-600" },
          { label: "Video Lessons", value: stats.videoCount, icon: Video, color: "bg-blue-50 text-blue-600" },
          { label: "Library Items", value: stats.libraryCount, icon: Library, color: "bg-green-50 text-green-600" },
          { label: "AI Messages", value: stats.messageCount, icon: MessageCircle, color: "bg-pink-50 text-pink-600" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <Icon size={18} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            href: "/admin/videos",
            title: "Manage Video Lessons",
            desc: "Upload, edit, and organize video lessons for students",
            icon: Video,
            color: "bg-blue-600",
          },
          {
            href: "/admin/library",
            title: "Manage Library",
            desc: "Add and edit offline reading materials and resources",
            icon: Library,
            color: "bg-green-600",
          },
          {
            href: "/admin/users",
            title: "View Users",
            desc: "See registered students and their activity",
            icon: Users,
            color: "bg-purple-600",
          },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-start gap-4"
            >
              <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 group-hover:text-brand-purple transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">{action.desc}</p>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-brand-purple mt-1 flex-shrink-0 transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
