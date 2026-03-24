import { ArrowLeft, Layers } from "lucide-react";
import Link from "next/link";
import { CreateFloorDialog } from "@/components/floors/CreateFloorDialog";
import { fetchApi } from "@/lib/api";

interface Floor {
  id: string;
  venueId: string;
  levelNumber: number;
  name: string;
  assetBundleUrl: string;
}

export const dynamic = "force-dynamic";

export default async function VenueDetails({
  params,
}: {
  params: Promise<{ venueId: string }>;
}) {
  const { venueId } = await params;

  const floors = await fetchApi<Floor[]>(`/venues/${venueId}/floors`, {
    cache: "no-store",
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Manage Floors
          </h1>
          <p className="text-gray-500 mt-1">
            Upload Unity AssetBundles and track multiple levels.
          </p>
        </div>
        <div className="ml-auto">
          <CreateFloorDialog venueId={venueId} />
        </div>
      </div>

      {floors.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Floors Added</h3>
          <p className="text-gray-500 mt-1 mb-4">
            You need at least one floor scan for AR tracking.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Floor Name</th>
                <th className="px-6 py-4">AR Assets (Bundle)</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {floors.map((floor) => (
                <tr
                  key={floor.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-gray-900">
                    Level {floor.levelNumber}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {floor.name}
                  </td>
                  <td className="px-6 py-4">
                    {floor.assetBundleUrl ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        Uploaded
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                        Missing Bundle
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link
                      href={`/venues/${venueId}/floors/${floor.id}`}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      Manage POIs
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
