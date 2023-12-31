import Header from '@/components/Header'
import ListProperty from '@/components/ListProperty';
import Menu from '@/components/Menu'

export default function MyPropertiesPage() {

  return(
    <div className='flex flex-col h-screen bg-gray-100'>
      <Header />
      <Menu />

      <main className='bg-gray-100 px-24 flex flex-col'>
        <h1 className='text-2xl font-bold'>Meus imóveis</h1>
        <ListProperty />
      </main>
    </div>
  )
}


