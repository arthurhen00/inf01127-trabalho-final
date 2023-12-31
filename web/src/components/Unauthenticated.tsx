export default function Unauthenticated() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-300">
      <p className="text-2xl font-bold mb-4">Não autenticado, faça login</p>
      <a href="/" className="text-blue-500 hover:underline">Página de login</a>
    </div>
  )
}
