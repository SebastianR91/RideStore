export default function PaginaSimple({ titulo, descripcion }) {
  return (
    <main className="max-w-5xl mx-auto px-6 pt-32 pb-10">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-orange-500 mb-4">{titulo}</h1>
        <p className="text-gray-700">{descripcion}</p>
      </div>
    </main>
  );
}
