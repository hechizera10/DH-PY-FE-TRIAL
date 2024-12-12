import Buscador from '../components/Buscador'
import Categorias from '../components/categorias/Categorias'
import Recomendaciones from '../components/Recomendaciones'

const Home = () => {
  return (
    <div className="flex flex-col w-full h-full min-h-screen ">
        <Buscador />
        <Categorias />
        <Recomendaciones />
    </div>
  )
}

export default Home