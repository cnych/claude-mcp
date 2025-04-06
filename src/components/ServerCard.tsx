import type { MCPServer } from "@/types/server";
import { Link } from "@/i18n/routing";

function getRandomColor(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, 70%, 90%)`;
}

export function ServerCard({ server }: { server: MCPServer }) {
  const initials = server.name[0];
  const bgColor = getRandomColor(server.name);

  return (
    <Link
      href={{ pathname: "/servers/[id]", params: { id: server.id } }}
      className="group"
    >
      <div className="p-6 duration-300 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-md hover:scale-105 transition-all group">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2
              className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 
              hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {server.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-3 leading-relaxed line-clamp-2 min-h-[3rem]">
              {server.digest}
            </p>
          </div>
          {server.icon ? (
            <div
              className="flex-shrink-0 ml-4 w-16 h-16 p-1 rounded-full flex items-center justify-center bg-white dark:bg-gray-700 shadow-sm overflow-hidden"
              style={{
                backgroundColor: bgColor,
              }}
            >
              <img
                src={server.icon}
                alt={server.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          ) : (
            <div
              className="flex-shrink-0 ml-4 w-16 h-16 rounded-full flex items-center justify-center text-lg font-semibold
                group-hover:scale-110 transition-transform duration-300 ease-in-out"
              style={{
                backgroundColor: bgColor,
                color: `hsl(${
                  getRandomColor(server.name).match(/\d+/)?.[0] ?? 0
                }, 70%, 30%)`,
              }}
            >
              {initials}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {server.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 
                rounded-full text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-gray-600 dark:text-gray-300 
          mt-6 pt-4 border-t border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">By</span>
            <span className="font-medium">{server.author}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(server.capabilities).map(
              ([key, value]) =>
                value && (
                  <span
                    key={key}
                    className="text-sm capitalize text-blue-600 dark:text-blue-400"
                  >
                    {key}
                  </span>
                )
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
