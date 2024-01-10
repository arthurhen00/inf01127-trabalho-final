export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-300">
      <p className="text-4xl font-bold mb-4">Sem permissão para acessar esta página</p>
      <p className="text-lg mb-4">Você precisa ter as permissões adequadas para visualizar este conteúdo.</p>
      <a href="/home" className="text-blue-500 hover:underline text-lg">Página Inicial</a>
    </div>
  )
}