import Button from "./Button";

const ButtonSet = ({ buttons }) => {
  return (
    <div className="flex gap-5 px-5">
      {Array.isArray(buttons) ? (
        // If buttons is a flat array, map directly over it
        buttons.map((button, index) => (
          <Button
            key={index}
            text={button.text}
            bgColor={button.bgColor}
            textColor={button.textColor}
            action={button.action}
            textSize={button.textSize}
          />
        ))
      ) : (
        // If buttons is an object of arrays, map over each button group
        Object.values(buttons).map((buttonGroup, index) =>
          Array.isArray(buttonGroup) ? (
            buttonGroup.map((button, btnIndex) => (
              <Button
                key={`${index}-${btnIndex}`}
                text={button.text}
                bgColor={button.bgColor}
                textColor={button.textColor}
                action={button.action}
                textSize={button.textSize}
              />
            ))
          ) : null
        )
      )}
    </div>
  );
};

export default ButtonSet;