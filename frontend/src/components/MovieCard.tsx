import React, { useState } from "react";
import defaultPoster from "../assets/default-movie.png";

interface Props {
  title: string;
  poster: string;
  year: string;
  genres: string[];
  actors?: string[];
  description: string;
}

const MovieCard: React.FC<Props> = ({
  title,
  poster,
  year,
  genres,
  actors = [],
  description,
}) => {
  const [src, setSrc] = useState(poster?.trim() || defaultPoster);

  return (
    <div className="rounded-lg shadow-md p-4 bg-white text-black max-w-xs flex flex-col">
      <div className="aspect-[2/3] overflow-hidden rounded">
        <img
          src={src}
          alt={title}
          className="w-full h-full object-cover"
          onError={() => setSrc(defaultPoster)}
        />
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <h3 className="text-base font-semibold text-center line-clamp-1">
          {title} ({year})
        </h3>

        {genres.length > 0 && (
          <p className="text-xs text-gray-700 text-center italic line-clamp-1">
            {genres.join(", ")}
          </p>
        )}

        {actors.length > 0 && (
          <p className="text-xs text-gray-700">
            <span className="font-semibold">Actors:</span> {actors.join(", ")}
          </p>
        )}

        {description && (
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
