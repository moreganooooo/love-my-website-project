import { Card, CardContent } from '@/components/ui/card';
// Update the path below to the actual location of your Skill type definition
// Define Skill type here if not available elsewhere
export type Skill = {
  icon: React.ElementType;
  title: string;
  description: string;
};

type SkillCardProps = {
  skill: Skill;
};

const SkillCard = ({ skill }: SkillCardProps) => (
  <div className="group p-[2px] rounded-2xl bg-gradient-to-br from-orange-400 via-purple-400 to-orange-200 bg-[length:200%_200%] bg-[position:0%_0%] transition-all duration-500 hover:bg-[position:100%_100%]">
    <Card className="shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-white via-orange-50/50 to-purple-50/50 backdrop-blur-sm rounded-2xl group-hover:-translate-y-3 group-hover:shadow-2xl">
      <CardContent className="p-6 text-center">
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
          <skill.icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-orange-700 to-purple-700 bg-clip-text text-transparent">
          {skill.title}
        </h3>
        <p className="text-slate-600 leading-relaxed transition-opacity duration-700 delay-150">
          {skill.description}
        </p>
      </CardContent>
    </Card>
  </div>
);

export { SkillCard };
