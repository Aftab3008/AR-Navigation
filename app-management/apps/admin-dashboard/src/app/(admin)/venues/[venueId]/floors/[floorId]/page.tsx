import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { CreatePoiDialog } from "@/components/pois/CreatePoiDialog";
import { fetchApi } from "@/lib/api";

interface POI {
  id: string;
  floorId: string;
  name: string;
  category: string;
  x: number;
  y: number;
  z: number;
}

export const dynamic = "force-dynamic";

export default async function FloorPointsOfInterest({
  params,
}: {
  params: Promise<{ venueId: string; floorId: string }>;
}) {
  const { venueId, floorId } = await params;

  const pois = await fetchApi<POI[]>(`/venues/floors/${floorId}/pois`, {
    cache: "no-store",
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href={`/venues/${venueId}`}
          className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Points of Interest
          </h1>
          <p className="text-gray-500 mt-1">Map destinations for this floor.</p>
        </div>
        <div className="ml-auto">
          <CreatePoiDialog venueId={venueId} floorId={floorId} />
        </div>
      </div>

      {pois.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No POIs Added</h3>
          <p className="text-gray-500 mt-1 mb-4">
            Add points of interest for users to navigate to.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Coordinates (x, y, z)</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pois.map((poi) => (
                <tr key={poi.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {poi.name}
                  </td>
                  <td className="px-6 py-4 capitalize text-gray-600">
                    {poi.category}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {poi.x}, {poi.y}, {poi.z}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-gray-400 hover:text-indigo-600 font-medium text-sm transition-colors">
                      Edit
                    </button>
                    <button className="text-red-400 hover:text-red-600 font-medium text-sm transition-colors">
                      Delete
                    </button>
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
