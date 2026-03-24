import { Building2, MapPin, ChevronRight } from "lucide-react";
import { CreateVenueDialog } from "@/components/venues/CreateVenueDialog";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

interface Venue {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}

export default async function VenuesDashboard() {
  const venues = await fetchApi<Venue[]>("/venues", { cache: "no-store" });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Venues
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your AR-enabled buildings and locations.
          </p>
        </div>
        <CreateVenueDialog />
      </div>

      {venues.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Venues Yet</h3>
          <p className="text-gray-500 mt-1 mb-4">
            Get started by adding your first building.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <Link
              key={venue.id}
              href={`/venues/${venue.id}`}
              className="group relative block focus:outline-none"
            >
              <Card className="h-full hover:shadow-md transition-all hover:border-indigo-300 overflow-hidden group-focus-visible:ring-2 group-focus-visible:ring-indigo-500">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {venue.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                    {venue.description || "No description provided."}
                  </p>
                  <div className="flex items-center text-xs text-gray-400 gap-4 pt-4 border-t">
                    <span className="flex items-center gap-1.5 font-mono">
                      <MapPin className="w-3.5 h-3.5" />
                      {venue.latitude
                        ? `${venue.latitude.toFixed(4)}, ${venue.longitude.toFixed(4)}`
                        : "No Coordinates"}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
