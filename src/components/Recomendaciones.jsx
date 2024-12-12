import { useContextGlobal } from '../utils/global.context';
import Card from './Card';
import { useMemo } from 'react';

const Recomendaciones = () => {
    const { state } = useContextGlobal();

    // Evita recalcular los productos aleatorios a menos que el arreglo cambie
    const randomProducts = useMemo(() => {
        if (!state.data || state.data.length === 0) return [];

        // Función para obtener productos aleatorios sin ordenar completamente la lista
        const getRandomProducts = (array, count) => {
            let result = [];
            let set = new Set();
            while (set.size < count && set.size < array.length) {
                let randomIndex = Math.floor(Math.random() * array.length);
                if (!set.has(randomIndex)) {
                    set.add(randomIndex);
                    result.push(array[randomIndex]);
                }
            }
            return result;
        };

        return getRandomProducts(state.data, 10);
    }, [state.data]);

    return (
        <section className="bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-10xl mx-auto px-4 lg:px-32">
                <h2 className="text-3xl text-primary text-left mb-8">
                    Recomendaciones
                </h2>
                {randomProducts.length > 0 ? (
                    <div className="flex grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {randomProducts.map((producto) => {
                            console.log("Producto para Card:", producto)
                            return <Card key={producto.id} producto={producto} isFavorite={state.favorites.some((fav) => fav.id === producto.id)} />
                    })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-xl text-secondary">Algo pasó. No hay obras disponibles. 😔</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Recomendaciones;