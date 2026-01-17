import type { Metadata, ResolvingMetadata } from "next";
import { locations } from "../../data";
import RestaurantClient from "./RestaurantClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const restaurant = locations.find((l) => l.id === parseInt(id));

  if (!restaurant) {
    return {
      title: "Restaurant Not Found | GidiSpots",
      description: "The restaurant you're looking for doesn't exist.",
    };
  }

  return {
    title: `${restaurant.name} on GidiSpots`,
    description: restaurant.description,
    openGraph: {
      images: [restaurant.image],
    },
  };
}

export default async function RestaurantPage({ params }: Props) {
  const { id } = await params;
  const restaurant = locations.find((l) => l.id === parseInt(id));

  return <RestaurantClient restaurant={restaurant} />;
}