export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="
      w-full min-h-screen
      flex justify-center items-center
      bg-gradient-to-tr from-lime-100 to-green-300
    "
    >
      {children}
    </div>
  )
}
