'use client' // onSubmit encapsular posteriormente em um componente

import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { FormEvent } from "react"
import { FaRegEnvelope, FaRegUser } from "react-icons/fa"
import { MdLockOutline } from "react-icons/md"

export default function Home() {
  const router = useRouter()

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    //event.preventDefault()

    const formData = new FormData(event.currentTarget)

    await api.post('/register', {
      name: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
    })

    router.push('/')
  }

  return (
      <main className="flex flex-row items-center justify-center min-h-screen bg-gray-300">

        <div className="w-2/5 p-10">
          <span className="text-4xl leading-relaxed font-bold">Swipehome</span>
          <p>
            O Swipehome auxilia na divulgação e locação de propriedades, 
            proporcionando uma plataforma eficiente para anunciar e alugar imóveis.
          </p>
        </div>

        <div className="w-3/5 flex flex-col items-center justify-center flex-1 text-center">
          <div className="bg-white rounded-2xl shadow-2xl flex w-5/6 max-w-4xl mb-3">
            <form onSubmit={handleRegister} className="w-2/4 p-5">
              <div className="py-10">
                <h2 className="text-3 font-bold mb-2">Entrar</h2>
                <div className="border-2 w-20 border-gray-500 inline-block mb-2"></div>
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 w-64 p-2 flex items-center mb-3 rounded-xl">
                    <FaRegEnvelope className="text-gray-400 mr-2" />
                    <input type="email" name="email" placeholder="Email" className="bg-gray-100 outline-none text-sm flex-1"></input>
                  </div>
                  <div className="bg-gray-100 w-64 p-2 flex items-center mb-3 rounded-xl">
                    <MdLockOutline className="text-gray-400 mr-2" />
                    <input type="password" name="password" placeholder="Senha" className="bg-gray-100 outline-none text-sm flex-1"></input>
                  </div>
                  <button type="submit"
                          className="border-2 border-gray-100 rounded-full px-12 py-2 
                              inline-block font-semibold hover:bg-gray-100">
                    Entrar
                  </button>
                </div>
              </div>
            </form>

            <form onSubmit={handleRegister} className="w-2/4 p-5 bg-gray-100 rounded-tr-2xl rounded-br-2xl">
              <div className="py-10">
                <h2 className="text-3 font-bold mb-2">Criar nova conta</h2>
                <div className="border-2 w-20 border-gray-500 inline-block mb-2"></div>
                <div className="flex flex-col items-center">
                  <div className="bg-white w-64 p-2 flex items-center mb-3 rounded-xl">
                    <FaRegUser className="text-gray-400 mr-2" />
                    <input type="username" name="username" placeholder="Nome" className="bg-white outline-none text-sm flex-1"></input>
                  </div>
                  <div className="bg-white w-64 p-2 flex items-center mb-3 rounded-xl">
                    <FaRegEnvelope className="text-gray-400 mr-2" />
                    <input type="email" name="email" placeholder="Email" className="bg-white outline-none text-sm flex-1"></input>
                  </div>
                  <div className="bg-white w-64 p-2 flex items-center mb-3 rounded-xl">
                    <MdLockOutline className="text-gray-400 mr-2" />
                    <input type="password" name="password" placeholder="Senha" className="bg-white outline-none text-sm flex-1"></input>
                  </div>
                  <button type="submit" className="border-2 border-white rounded-full px-12 py-2 
                              inline-block font-semibold hover:bg-white">
                    Criar nova conta
                  </button>
                </div>
              </div>
            </form>

          </div>
          <p>
            <span className="font-bold">Anuncie sua propriedade</span> para uma celebridade, marca ou uma empresa.
          </p>
        </div>

      </main>
  )
}
