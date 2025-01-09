import { Card } from "@/components/ui/card";
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-[500px] w-full">
        <img
          src={coverImage}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-12 w-12 border-2 border-white">
                <AvatarImage src={author.image} alt={author.name} />
                <AvatarFallback>{author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="text-white">
                <h4 className="font-medium text-lg">{author.name}</h4>
                <p className="text-sm opacity-80">{author.role}</p>
              </div>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {title}
            </h2>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-3xl">
              {excerpt}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}