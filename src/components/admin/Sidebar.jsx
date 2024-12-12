import { useContextGlobal } from "../../utils/global.context";  // Importamos el contexto
import { AiFillPicture } from "react-icons/ai";
import { ImUsers } from "react-icons/im";
import { MdCategory } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa";


const Sidebar = () => {
  const { dispatch } = useContextGlobal();

  const handleSectionChange = (section) => {
    console.log("Cambiando a la sección aside: ", section);
    dispatch({ type: "SET_ACTIVE_SECTION", payload: section });
  };

  return (
    <aside id="sidebar-nav" className="flex flex-col justify-between w-16 duration-300 bg-black transition-width hover:w-48 border-primary/50 pt-28">
      <div className="mt-10 mb-10">
        <ul className="flex flex-col w-full gap-8 pl-4 sidebar-list">
          <li className="w-full py-2">
            <a onClick={() => handleSectionChange("obras")}>
              <span className="flex items-center gap-4 text-sm text-white hover:cursor-pointer">
                <AiFillPicture className="text-lg" />
                <h3 className="hidden sidebar-text">Obras</h3>
              </span>
            </a>
          </li>
          
          <li className="w-full py-2">
            <a onClick={() => handleSectionChange("categorias")}>
              <span className="flex items-center gap-4 text-sm text-white hover:cursor-pointer">
                <MdCategory />
                <h3 className="hidden sidebar-text">Categorías</h3>
              </span>
            </a>
          </li>
          <li className="w-full py-2">
            <a onClick={() => handleSectionChange("usuarios")}>
              <span className="flex items-center gap-4 text-sm text-white hover:cursor-pointer">
                <ImUsers />
                <h3 className="hidden sidebar-text">Usuarios</h3>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
