import React, { useState } from "react";
import defaultPoster from "../assets/default-movie.png";

interface Props {
  title: string;
  poster: string;
  year: string;
}

const MovieCard: React.FC<Props> = ({ title, poster, year }) => {
  const [src, setSrc] = useState(poster?.trim() || defaultPoster);
  return (
    <div className="rounded-lg shadow-md p-3 bg-white text-black max-w-xs">
      <div className="aspect-[2/3] overflow-hidden rounded">
        <img
          src={src}
          alt={title}
          className="w-full h-full object-cover"
          onError={() => setSrc(defaultPoster)}
        />
      </div>
      <div className="mt-3">
        <h3 className="text-base font-semibold text-center line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 text-center">{year}</p>
      </div>
    </div>
  );
};

export default MovieCard;
