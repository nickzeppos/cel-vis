import { getScorecardData, getTableData } from "@/services/api";
import { sortAscending } from "@/services/api.utils";
import { useCallback, useEffect, useState } from "react";
import PerformanceBar from "./PerformanceBar";

interface Props {
  bioguideID: string;
  congress: number;
}

type PerformanceData = {
  congress: number;
  chamber: "H" | "S";
  score: number;
  benchmark: number;
};

function PerformanceView({ bioguideID, congress }: Props) {
  const [data, setData] = useState<PerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: single endpoint to get all this data
  const getPerformanceData = useCallback(
    (bioguideID: string) =>
      getScorecardData(congress, bioguideID)
        .then(({ data: { validCongresses } }) => validCongresses)
        .then((congresses) =>
          Promise.all(congresses.map(([congress]) => getTableData(congress)))
        )
        .then((tables) =>
          tables
            .map((t) => {
              const legislator = t.data.find((l) => l.bioguide === bioguideID);
              return legislator
                ? {
                    congress: t.congress,
                    chamber: legislator.chamber,
                    score: legislator.les,
                    benchmark: legislator.benchmark,
                  }
                : null;
            })
            .filter(notNull)
        )
        .then((data) => sortAscending(data, (d) => d.congress)),
    [congress]
  );

  useEffect(() => {
    setIsLoading(true);
    getPerformanceData(bioguideID)
      .then(setData)
      .finally(() => {
        setIsLoading(false);
      });
  }, [bioguideID, getPerformanceData]);

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  if (data.length === 0) {
    return <div>No data</div>;
  }

  return (
    <div className="flex flex-row space-x-4">
      <div>{bioguideID}</div>
      {data.map((d) => (
        <PerformanceBar
          key={d.congress}
          score={d.score}
          benchmark={d.benchmark}
        />
      ))}
    </div>
  );
}

export default function WithCongressList(props: Props) {
  return <PerformanceView {...props} />;
}

function notNull<T>(value: T | null): value is T {
  return value !== null;
}
