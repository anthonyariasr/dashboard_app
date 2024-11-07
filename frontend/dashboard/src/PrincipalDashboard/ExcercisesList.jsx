import React from "react";

export default function ExercisesList({ exercises }) {
    // Asegurarse de que exercises sea un array
    const validExercises = Array.isArray(exercises) ? exercises : [];

    return (
        <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Ejercicios por día</h3>
            {validExercises.length > 0 ? (
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 bg-gray-200">Ejercicio</th>
                            <th className="border border-gray-300 px-4 py-2 bg-gray-200">Duración</th>
                        </tr>
                    </thead>
                    <tbody>
                        {validExercises.map((exercise, index) => (
                            <tr key={index} className="odd:bg-white even:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{exercise.exercise_name}</td>
                                <td className="border border-gray-300 px-4 py-2">{exercise.duration}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500">No hay ejercicios disponibles</p>
            )}
        </div>
    );
}
