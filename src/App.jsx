import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://www.thesportsdb.com/api/v1/json/123/search_all_teams.php?l=English_Premier_League",
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (error) {
        setError(error.message);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const ensureHttps = (url) =>
    url ? (url.startsWith("http") ? url : `https://${url}`) : undefined;

  const getContrastColor = (hexColor) => {
    if (!hexColor) return "#000";

    const hex = hexColor.replace("#", "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.6 ? "#000000" : "#FFFFFF";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="border-t-2 border-red-500 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 font-medium">
          The following error occurred: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
        Teams
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 place-items-center sm:place-items-stretch gap-4">
        {data.teams.map((team) => {
          const primaryColour = team.strColour1 || "#111827";
          const secondaryColour = team.strColour2 || "#ffffff";
          const textColour = getContrastColor(primaryColour);
          const leagues = [
            team.strLeague,
            team.strLeague2,
            team.strLeague3,
            team.strLeague4,
            team.strLeague5,
            team.strLeague6,
            team.strLeague7,
          ].filter(Boolean);

          return (
            <Link
              to={`/team/${team.idTeam}`}
              key={team.idTeam}
              state={{
                primaryColour: team.strColour1,
                secondaryColour: team.strColour2,
              }}
              className="max-w-md rounded-2xl overflow-hidden border border-gray-200"
              style={{ backgroundColor: `${secondaryColour}20` }}
            >
              <div
                className="p-6 flex items-center gap-4"
                style={{ backgroundColor: primaryColour, color: textColour }}
              >
                {team.strBadge && (
                  <img
                    src={team.strBadge}
                    alt={team.strTeam}
                    className="size-20 object-contain bg-white rounded-xl p-2"
                  />
                )}

                <div>
                  <h2 className="text-2xl font-bold">{team.strTeam}</h2>

                  <p className="text-sm opacity-80">
                    {team.strTeamShort} &middot; Founded {team.intFormedYear}
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 border-b border-gray-300 pb-2">
                    Stadium
                  </h3>
                  <p className="text-gray-600 text-sm pt-2">
                    {team.strStadium} (
                    {Number(team.intStadiumCapacity).toLocaleString()} seats)
                  </p>
                  <p className="text-gray-500 text-xs">{team.strLocation}</p>
                </div>

                {leagues.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 border-b border-gray-300 pb-2">
                      Competitions
                    </h3>
                    <ul className="text-gray-600 text-sm list-disc list-inside pt-2">
                      {leagues.map((league, index) => (
                        <li key={index}>{league}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {team.strDescriptionEN && (
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-4 border-t border-gray-300 pt-2">
                    {team.strDescriptionEN}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  {team.strWebsite && (
                    <a
                      href={ensureHttps(team.strWebsite)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Website
                    </a>
                  )}
                  {team.strTwitter && (
                    <a
                      href={ensureHttps(team.strTwitter)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Twitter
                    </a>
                  )}
                  {team.strInstagram && (
                    <a
                      href={ensureHttps(team.strInstagram)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
