"use client";
import { useState } from "react";

/** Bemutató videó — facade (stílusos placeholder), kattintásra betölti a YouTube iframe-et. */
export default function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="demo-video">
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button className="demo-video-facade" onClick={() => setPlay(true)} aria-label={`${title} lejátszása`}>
          <span className="demo-video-inner"><i className="ri-play-fill" /></span>
        </button>
      )}
      <span className="demo-video-cap"><i className="ri-youtube-line" /> {title}</span>
    </div>
  );
}
