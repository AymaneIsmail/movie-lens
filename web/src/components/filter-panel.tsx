import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RecommendationsRequest } from "@/api/recommendations";

interface FilterPanelProps {
  filters: RecommendationsRequest;
  onChange: (f: RecommendationsRequest) => void;
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userid = Number(e.target.value);
    onChange({ ...filters, userid });
  };

  const handleMovieIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const movieid = Number(e.target.value);
    onChange({ ...filters, movieid });
  };

  const handleScoreChange = (value: number[]) => {
    onChange({ ...filters, minscore: value[0] });
  };

  const clearFilters = (): void => {
    onChange({ ...filters, minscore: 0, userid: undefined });
  };

  const hasFilters = (): boolean => {
    return (
      (filters.minscore && filters.minscore > 0) || filters.userid !== undefined
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="userId">ID utilisateur</Label>
            <Input
              type="number"
              id="userId"
              placeholder="ID utilisateur"
              onChange={handleUserIdChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="userId">ID film</Label>
            <Input
              type="number"
              id="movieId"
              placeholder="ID film"
              onChange={handleMovieIdChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="minScore" className="text-sm font-medium">
              Minimum Score:{" "}
              <span className="font-bold text-primary">{filters.minscore}</span>
            </label>
            <span className="text-xs text-muted-foreground">0-10</span>
          </div>
          <Slider
            id="minScore"
            min={0}
            max={10}
            step={0.5}
            value={[filters.minscore || 0]}
            onValueChange={handleScoreChange}
            className="py-2"
          />
        </div>
      </div>

      {hasFilters() && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
