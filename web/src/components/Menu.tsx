export default function Menu() {

  return (
        <div className='flex px-24 py-2 justify-center bg-gray-100 '>
            <a href='' className='px-6 py-2 border-b-2 border-gray-100 hover:border-gray-200'>Perfil</a>
            <a href='/explore' className='px-6 py-2 border-b-2 border-gray-100 hover:border-gray-200'>Buscar</a>
            <a href='/add-property' className='px-6 py-2 border-b-2 border-gray-100 hover:border-gray-200'>Anunciar propriedade</a>
            <a href='/my-properties' className='px-6 py-2 border-b-2 border-gray-100 hover:border-gray-200'>Minhas propriedades</a>
            <a href='' className='px-6 py-2 border-b-2 border-gray-100 hover:border-gray-200'>Pedidos</a>
        </div>
  )
  
}
