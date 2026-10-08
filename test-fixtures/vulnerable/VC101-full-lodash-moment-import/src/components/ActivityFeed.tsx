import { useMemo, useState } from "react";
import _ from "lodash";
import moment from "moment";

type Activity = {
  id: string;
  actor: string;
  action: string;
  createdAt: string;
};

export function ActivityFeed({ items }: { items: Activity[] }) {
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const filtered = items.filter((item) =>
      item.action.toLowerCase().includes(query.toLowerCase()),
    );
    return _.groupBy(_.orderBy(filtered, ["createdAt"], ["desc"]), (item) =>
      moment(item.createdAt).format("MMMM D, YYYY"),
    );
  }, [items, query]);

  const onSearch = _.debounce((value: string) => setQuery(value), 300);

  return (
    <section className="space-y-6">
      <input
        className="w-full rounded border px-3 py-2"
        placeholder="Filter activity"
        onChange={(e) => onSearch(e.target.value)}
      />
      {Object.entries(grouped).map(([day, entries]) => (
        <div key={day}>
          <h3 className="text-sm font-medium text-gray-500">{day}</h3>
          <ul className="mt-2 space-y-1">
            {entries.map((entry) => (
              <li key={entry.id} className="text-sm">
                <span className="font-medium">{entry.actor}</span> {entry.action}{" "}
                <span className="text-gray-400">{moment(entry.createdAt).fromNow()}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
