export function CharacterPreview() {
  return (
    <figure className="relative m-0 grid justify-items-center pb-6 lg:col-start-2" aria-label="Podgląd zawodnika">
      <svg
        className="relative z-10 h-auto w-[min(48vw,12rem)] fill-[#15151c] stroke-blood stroke-3 drop-shadow-[0_0_18px_rgb(225_25_45/0.45)] lg:w-56"
        viewBox="0 0 200 320"
        aria-hidden="true"
      >
        <circle cx="100" cy="58" r="34" />
        <path d="M52 112c0-14 12-24 26-24h44c14 0 26 10 26 24v86H52z" />
        <path d="M36 118l16-8v78l-18 4zM164 118l-16-8v78l18 4z" />
        <path d="M62 198h76l-6 92h-24l-8-64-8 64H68z" />
      </svg>
      <span
        className="clip-octagon absolute bottom-4 aspect-[4/1] w-[min(80vw,22rem)] bg-blood-deep bg-[radial-gradient(closest-side,rgb(225_25_45/0.75),rgb(225_25_45/0.12)_80%)] lg:w-96"
        aria-hidden="true"
      />
      <figcaption className="relative z-10 mt-2 text-sm text-ash">Podgląd postaci pojawi się wkrótce</figcaption>
    </figure>
  );
}
