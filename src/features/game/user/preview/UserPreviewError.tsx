export default function UserPreviewError({ error }) {
  if (!error) return null;

  return (
    <div className="text-center py-12">
      <p className="text-red-400 text-lg">{error}</p>
    </div>
  );
}
