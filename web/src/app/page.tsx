'use client' // onSubmit encapsular posteriormente em um componente

import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { FormEvent } from "react"
import { FaRegAddressCard, FaRegEnvelope, FaRegUser } from "react-icons/fa"
import { MdLockOutline } from "react-icons/md"
import { IMaskInput } from "react-imask"
import Alert from "@/components/Alert"
import { ToastContainer } from "react-toastify"
import { validate } from 'gerador-validador-cpf'


export default function Home() {
  const router = useRouter()

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    // eslint-disable-next-line
    if (formData.get('cpf').length < 14 || // sem problemas
        !formData.get('username') ||
        !formData.get('email') ||
        !formData.get('password')) {
          Alert('Preencha todos os campos!')
          return
    }

    if (!validate(formData.get('cpf'))) {
      Alert('CPF inválido!')
      return
    }


    try {
      await api.post('/register', {
        name: formData.get('username'),
        cpf: formData.get('cpf'),
        email: formData.get('email'),
        password: formData.get('password'),
      }).then((response) => {
        if (response.status >= 200 && response.status < 300) {
          console.log('Registro bem-sucedido!', response.data);

          const { token } = response.data
          const cookieExpiresInSeconds = 60 * 60 * 24 * 30
          document.cookie = `token=${token}; path=/; max-age=${cookieExpiresInSeconds}`;

          router.push('/home')
        }
      })
    } catch (error) {
      Alert('Email ou CPF já em uso')
    }

  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    try{
      await api.post('login', {
        email: formData.get('email'),
        password: formData.get('password'),
      }).then((response) => {
        if (response.status >= 200 && response.status < 300) {
          console.log('Login bem-sucedido!', response.data);

          const { token } = response.data
          const cookieExpiresInSeconds = 60 * 60 * 24 * 30
          document.cookie = `token=${token}; path=/; max-age=${cookieExpiresInSeconds}`;

          router.push('/home')
        }
      })
    } catch (error) {
      Alert('Login ou senha inválidos')
    }
  }

  return (
      <main className="flex flex-row items-center justify-center min-h-screen bg-gray-300">
        <ToastContainer />
        {/** Grid esquerdo */}
        <div className="w-2/5 p-2 ml-16">
          <span className="text-4xl leading-relaxed font-bold">Swipehome</span>
          <p>
            O Swipehome auxilia na divulgação e locação de propriedades, 
            proporcionando uma plataforma eficiente para anunciar e alugar imóveis.
          </p>
        </div>

        {/** Grid direito */}
        <div className="w-3/5 flex flex-col items-center justify-center flex-1 text-center">

          {/** Access Box */}
          <div className="bg-white rounded-2xl shadow-2xl flex w-5/6 max-w-4xl mb-3">  
            {/** Login box */}
            <form onSubmit={handleLogin} className="w-2/4 p-5">
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

            {/** Register box */}
            <form onSubmit={handleRegister} className="w-2/4 p-5 bg-gray-100 rounded-tr-2xl rounded-br-2xl">
              <div className="py-10">
                <h2 className="text-3 font-bold mb-2">Criar nova conta</h2>
                <div className="border-2 w-20 border-gray-500 inline-block mb-2"></div>
                <div className="flex flex-col items-center">
                  <div className="bg-white w-64 p-2 flex items-center mb-3 rounded-xl">
                    <FaRegUser className="text-gray-400 mr-2" />
                    <input type="text" name="username" placeholder="Nome" className="bg-white outline-none text-sm flex-1"></input>
                  </div>
                  <div className="bg-white w-64 p-2 flex items-center mb-3 rounded-xl">
                    <FaRegAddressCard className="text-gray-400 mr-2"/>
                    <IMaskInput
                      mask="000.000.000-00"
                      placeholder="Digite o seu CPF"
                      className="bg-white outline-none text-sm flex-1"
                      name="cpf"
                    />
                    {/*<input type="number" name="cpf" placeholder="CPF" className="bg-white outline-none text-sm flex-1"></input>*/}
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

          {/** Subline */}
          <p>
            <span className="font-bold">Anuncie sua propriedade</span> para uma celebridade, marca ou uma empresa.
          </p>
        </div>

      </main>
  )
}
