import { useContextGlobal } from '../../utils/global.context';
import CategoryCard from './CategoryCard';

const Categorias = () => {
  const { state } = useContextGlobal();
  const categorias = state.categories.slice(0, 4);
  
  return (
    <section className="mx-auto bg-gradient-to-t from-[#000000] to-[#FFD557] px-12 py-16 categories-section w-full lg:px-32">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
        {categorias.map((categoria) => (
          <CategoryCard key={categoria.id} categoria={categoria} />
        ))}
      </div>
    </section>
  )
}

export default Categorias