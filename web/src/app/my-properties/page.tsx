import Header from '@/components/Header'
import ListProperty from '@/components/ListProperty';
import Menu from '@/components/Menu'

export default function MyPropertiesPage() {

  return(
    <div className='flex flex-col h-screen bg-gray-100'>
      <Header />
      <Menu />

      <main className='bg-gray-100 px-24 flex'>
        <ListProperty />
        <div className='bg-green-200 w-2/3 py-4'>edit painel</div>
      </main>
    </div>
  )
}


