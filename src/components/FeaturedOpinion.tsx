import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FeaturedOpinionProps {
  title: string;
  excerpt: string;
  author: {
    name: string;
    image: string;
    role: string;
  };
  coverImage: string;
}

export function FeaturedOpinion({ title, excerpt, author, coverImage }: FeaturedOpinionProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-[400px] w-full">
        <img
          src={coverImage}
          alt={title}
          className="object-cover w-full h-full"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar>
              <AvatarImage src={author.image} alt={author.name} />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-white">
              <h4 className="font-medium">{author.name}</h4>
              <p className="text-sm opacity-80">{author.role}</p>
            </div>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
            {title}
          </h2>
          <p className="text-white/80">{excerpt}</p>
        </div>
      </div>
    </Card>
  );
}