import { Exercise } from '@/types/gym';
import { Clock, Flame, TrendingUp } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
}

export const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-500 bg-green-500/20';
      case 'Intermediate':
        return 'text-yellow-500 bg-yellow-500/20';
      case 'Advanced':
        return 'text-red-500 bg-red-500/20';
      default:
        return 'text-gray-500 bg-gray-500/20';
    }
  };

  return (
    <div className="gym-card group cursor-pointer overflow-hidden">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={exercise.image}
          alt={exercise.exercise_name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
          {exercise.difficulty}
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
          {exercise.exercise_name}
        </h3>
        
        <p className="text-muted-foreground text-sm leading-relaxed">
          {exercise.description}
        </p>
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{exercise.duration}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm font-medium text-primary">
            <Flame className="h-4 w-4" />
            <span>{exercise.calories_burn} cal</span>
          </div>
        </div>
        
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Intensity</span>
            <span>{exercise.difficulty}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                exercise.difficulty === 'Beginner' ? 'w-1/3 bg-green-500' :
                exercise.difficulty === 'Intermediate' ? 'w-2/3 bg-yellow-500' :
                'w-full bg-red-500'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};