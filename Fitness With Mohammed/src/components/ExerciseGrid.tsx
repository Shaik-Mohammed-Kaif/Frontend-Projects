import { useState } from 'react';
import { ExerciseCard } from './ExerciseCard';
import { exercises } from '@/data/mockData';
import { Filter } from 'lucide-react';

export const ExerciseGrid = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  
  const filteredExercises = selectedDifficulty === 'All' 
    ? exercises 
    : exercises.filter(exercise => exercise.difficulty === selectedDifficulty);

  return (
    <section className="py-20 px-4" id="exercises">
      <div className="container mx-auto">
        <h2 className="section-title">Our Exercise Programs</h2>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Filter by difficulty:</span>
          </div>
          {difficulties.map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedDifficulty === difficulty
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-secondary text-secondary-foreground hover:bg-primary/20 hover:text-primary'
              }`}
            >
              {difficulty}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          {filteredExercises.map((exercise, index) => (
            <div
              key={exercise.id}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
              className="animate-slide-up"
            >
              <ExerciseCard exercise={exercise} />
            </div>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No exercises found for the selected difficulty level.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};