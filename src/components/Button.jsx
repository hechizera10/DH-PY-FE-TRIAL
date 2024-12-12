
const Button = ({ text, bgColor, textColor, textSize, widthSize, heightSize, action }) => {
  return (
    <button
      className={`bg-${bgColor} text-${textColor} border-${textColor} text-${textSize} border-2 border-black px-3 py-1 rounded-xl flex items-center justify-center w-${widthSize} h-${heightSize}`}
      onClick={action} // Llama a la función de acción al hacer clic
    >
      {text}
    </button>
  );
};

export default Button;
