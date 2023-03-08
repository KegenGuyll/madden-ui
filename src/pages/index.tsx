import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Select, { SingleValue } from "react-select";
import TeamImage from "@/components/common/image/teamImage";
import { Team } from "@/models/team";
import getTeams from "@/endpoints/team/getTeams";
import getAvailableSeasons from "@/endpoints/schedule/getAvailableSeasons";
import { AvailableSeason } from "@/models/schedule";

export default function Home() {
  const [data, setData] = useState<Team[]>([]);
  const [seasons, setSeasons] = useState<AvailableSeason[]>([]);
  const [activeSeason, setActiveSeason] = useState<AvailableSeason>();
  const router = useRouter();

  const handleFetch = useCallback(async () => {
    const code = localStorage.getItem("leagueId");

    if (code) {
      const blah = await getTeams(Number(code));
      if (blah.success) {
        setData(blah.body);
      }
      const getSeasons = await getAvailableSeasons(Number(code));
      if (getSeasons.success) {
        setSeasons(getSeasons.body);
      }
    }
  }, [activeSeason]);

  const handleSetActiveSeason = (
    newValue: SingleValue<{ label: number; value: number }>
  ) => {
    if (!newValue) return;

    setActiveSeason({
      _id: {
        seasonIndex: newValue.value,
      },
      seasonIndex: newValue.value,
      year: newValue.label,
    });
  };

  useEffect(() => {
    handleFetch();
  }, [handleFetch, activeSeason]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Select
          options={seasons.map((season) => ({
            label: season.year,
            value: season.seasonIndex,
          }))}
          onChange={handleSetActiveSeason}
        />
        <div className="flex justify-center flex-wrap p-4">
          {data.length &&
            activeSeason &&
            data.map((v) => (
              <button
                type="button"
                className="border p-2 flex flex-col space-x-2 w-max m-1 rounded"
                onClick={() =>
                  router.push(
                    `/team/${v.displayName}/${v.teamId}/${activeSeason.seasonIndex}`
                  )
                }
              >
                <div className="flex items-center">
                  <div className=" h-12 w-12 relative">
                    <TeamImage teamLogoId={v.logoId} />
                  </div>
                </div>
              </button>
            ))}
        </div>
      </main>
    </>
  );
}
