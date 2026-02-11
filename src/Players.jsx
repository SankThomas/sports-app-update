import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

export default function Players() {
  const { teamId } = useParams();
  const location = useLocation();
  const { primaryColour, secondaryColour } = location.state || {};
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!teamId) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://www.thesportsdb.com/api/v1/json/123/lookup_all_players.php?id=${teamId}`,
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
  }, [teamId]);

  const getContrastColor = (hexColor) => {
    if (!hexColor) return "#000";
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? "#000000" : "#FFFFFF";
  };

  const ensureHttps = (url) =>
    url ? (url.startsWith("http") ? url : `https://${url}`) : undefined;

  const calculateAge = (dateString) => {
    if (!dateString) return null;
    const birthDate = new Date(dateString);
    const diff = Date.now() - birthDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
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

  const players = data?.player || [];
  const textColour = getContrastColor(primaryColour);

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link to="/">&larr; Back</Link>

          <h1 className="text-4xl font-bold text-center">
            {players[0]?.strTeam || "Players"}
          </h1>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 place-items-center sm:place-items-stretch gap-4">
          {players.map((player) => {
            const age = calculateAge(player.dateBorn);

            return (
              <div
                key={player.idPlayer}
                className="rounded-3xl overflow-hidden transform hover:scale-101 transition-transform duration-300 border"
                style={{
                  backgroundColor: `${secondaryColour}20`,
                  borderColor: `${primaryColour}30`,
                }}
              >
                <div
                  className="p-6 text-center"
                  style={{ backgroundColor: primaryColour, color: textColour }}
                >
                  {player.strCutout || player.strThumb ? (
                    <img
                      src={player.strCutout || player.strThumb}
                      alt={player.strPlayer}
                    />
                  ) : null}

                  <h2 className="mt-4 text-2xl font-bold">
                    {player.strPlayer}
                  </h2>
                  <p className="text-sm opacity-90">
                    #{player.strNumber || "–"} • {player.strPosition || "–"}
                  </p>
                </div>

                <div className="p-5 text-gray-800 text-sm space-y-2">
                  <p>
                    <strong>Age:</strong> {age || "–"}
                  </p>
                  <p>
                    <strong>Nationality:</strong> {player.strNationality || "–"}
                  </p>
                  <p>
                    <strong>Height:</strong> {player.strHeight || "–"}
                  </p>
                  <p>
                    <strong>Weight:</strong> {player.strWeight || "–"}
                  </p>
                  <p>
                    <strong>Status:</strong> {player.strStatus || "–"}
                  </p>
                  <p>
                    <strong>Kit:</strong> {player.strKit || "–"}
                  </p>
                  <p>
                    <strong>Signing:</strong> {player.strSigning || "–"}
                  </p>

                  <div className="pt-3 flex gap-3 flex-wrap justify-center">
                    {player.strTwitter && (
                      <a
                        href={ensureHttps(player.strTwitter)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs font-medium"
                      >
                        Twitter
                      </a>
                    )}
                    {player.strInstagram && (
                      <a
                        href={ensureHttps(player.strInstagram)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs font-medium"
                      >
                        Instagram
                      </a>
                    )}
                    {player.strFacebook && (
                      <a
                        href={ensureHttps(player.strFacebook)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs font-medium"
                      >
                        Facebook
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
