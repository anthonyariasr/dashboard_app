import React from "react";

export default function ExcercisesList({ exercises }) {
    // Asegurarse de que `exercises` sea un array
    const validExercises = Array.isArray(exercises) ? exercises : [];

    return (
        <div>
            <h3>Exercises per day</h3>
            {validExercises.length > 0 ? (
                <ul>
                    {validExercises.map((exercise, index) => (
                        <li key={index}>
                            {exercise.exercise_name}: {exercise.duration}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No exercises available</p>
            )}
        </div>
    );
}
