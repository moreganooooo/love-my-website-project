import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import type { Skill } from "@/types";

type SkillCardProps = {
  skill: Skill;
  index: number;
};

const SkillCard = ({ skill, index }: SkillCardProps) => {
  return (
    <div
      className="group p-[2px] rounded-2xl bg-gradient-to-br from-orange-400 via-purple-400 to-orange-200
      bg-[length:200%_200%] bg-[position:0%_0%] transition-all duration-500
      hover:bg-[position:100%_100%] animate-fade-up opacity-0 animate-fill-forwards"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Card
        className="shadow-xl transition-all duration-500 border-0
        bg-gradient-to-br from-white via-orange-50/50 to-purple-50/50 backdrop-blur-sm
        rounded-2xl group-hover:-translate-y-3 group-hover:shadow-2xl"
      >
        <CardContent className="p-6 text-center">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
            <skill.icon className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-orange-700 to-purple-700 bg-clip-text text-transparent">
            {skill.title}
          </h3>
          <p className="text-slate-600 leading-relaxed">{skill.description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export { SkillCard };
