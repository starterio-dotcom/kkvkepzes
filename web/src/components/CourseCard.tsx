import Link from "next/link";

type Props = {
  variant: "hagyomanyos" | "videos";
  lessonCount: number;
  startHref: string;
};

export default function CourseCard({ variant, lessonCount, startHref }: Props) {
  const isVideo = variant === "videos";
  return (
    <div className="course-card">
      <div className="banner">
        <i className="ri-scales-3-line" aria-hidden />
      </div>
      <div className="cbody">
        <div className="price">
          <b>Ingyenes</b>
          <s>Regisztrációhoz kötött</s>
        </div>
        <ul>
          <li><i className="ri-list-check-2" /> {lessonCount} interaktív lecke</li>
          <li><i className="ri-time-line" /> Saját tempóban, bármikor</li>
          <li><i className="ri-award-line" /> PDF oklevél a végén</li>
          <li><i className="ri-infinity-line" /> Korlátlan hozzáférés</li>
        </ul>
        <div className="cta">
          {isVideo ? (
            <Link href={startHref} className="btn btn-primary btn-block">
              <i className="ri-play-circle-line" /> Videós kurzus indítása
            </Link>
          ) : (
            <Link href={startHref} className="btn btn-primary btn-block">
              <i className="ri-shield-user-line" /> Beiratkozom
            </Link>
          )}
        </div>
        <p className="foot">A beiratkozáshoz Ügyfélkapu+ azonosítás szükséges.</p>
      </div>
    </div>
  );
}
