import { Card, CardContent } from "@/components/ui/card";
import { BarChart } from "lucide-react";

const polls = [
  {
    question: "Should AI development be regulated?",
    options: [
      { label: "Yes, strictly", percentage: 45 },
      { label: "Yes, moderately", percentage: 35 },
      { label: "No regulation", percentage: 20 }
    ]
  }
];

export function OpinionPolls() {
  return (
    <section className="bg-background rounded-lg p-6 border">
      <div className="flex items-center gap-2 mb-6">
        <BarChart className="text-accent h-5 w-5" />
        <h2 className="font-serif text-xl font-bold">Opinion Polls</h2>
      </div>
      {polls.map((poll, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">{poll.question}</h3>
            <div className="space-y-3">
              {poll.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{option.label}</span>
                    <span>{option.percentage}%</span>
                  </div>
                  <div className="w-full bg-accent/10 rounded-full h-2">
                    <div 
                      className="bg-accent rounded-full h-2 transition-all duration-500"
                      style={{ width: `${option.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}