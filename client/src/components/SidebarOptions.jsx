export function SidebarOptions({
  label,
  icon,
  isactive,
  handleClick,
  color,
  setColor,
}) {
  const classname =
    "flex items-center space-x-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 w-full py-2 justify-center cursor-pointer gap-2";

  return (
    <>
      <p
        className={
          !isactive
            ? classname
            : "bg-gray-100 flex items-center space-x-2  text-blue-600 hover:bg-gray-100 w-full py-2 justify-center cursor-pointer gap-2"
        }
        onClick={handleClick}
      >
        {icon} {label}
        {label === "Color" && (
          <input
            type="color"
            className=" relative text-black"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          ></input>
        )}
      </p>
    </>
  );
}
