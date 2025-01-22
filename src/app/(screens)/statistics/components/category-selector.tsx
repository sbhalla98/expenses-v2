import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type CategorySelectorProps = {
  category: string;
  setCategory: (number: number) => void;
};

export default function CategorySelector({
  category,
  setCategory,
}: CategorySelectorProps) {
  return (
    <div className="flex items-center justify-between p-2">
      <Button variant="outline" size="icon" onClick={() => setCategory(-1)}>
        <ArrowLeft />
      </Button>
      <p className="font-semibold text-primary flex-1 text-center">
        {category}
      </p>
      <Button variant="outline" size="icon" onClick={() => setCategory(1)}>
        <ArrowRight />
      </Button>
    </div>
  );
}
