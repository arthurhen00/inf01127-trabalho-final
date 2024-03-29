import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default function Alert(message : string) {
    toast.warn(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    })
  }