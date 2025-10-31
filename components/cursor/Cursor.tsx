import CursorSVG from "@/public/assets/CursorSVG";

type CursorProps = {
  color: string;
  x: number;
  y: number;
  message: string;
}

const Cursor = ({ color, x, y, message }: CursorProps) => {
  return (
    <div className="pointer-events-none absolute top-0 left-0" style={{ transform: `translate(${x}px, ${y}px)` }}>
      <CursorSVG color={color} />

      {/* message */}
      {message && <div className="absolute left-2 top-5 rounded-3xl px-4 py-2" style={{ backgroundColor: color }}>
        <p className="text-white text-sm whitespace-nowrap leading-relaxed">{message}</p>
      </div>}
    </div>
  )
}

export default Cursor