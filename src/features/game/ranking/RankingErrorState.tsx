type Props = {
  error: string;
};

export default function RankingErrorState({ error }: Props) {
  return (
    <div className="flex justify-center py-12">
      <p className="text-destructive">{error}</p>
    </div>
  );
}
