import { ReactNode } from 'react'
import NavigationMenu from './NavigationMenu'
import SignOutButton from './SignOutButton'

const LayoutPages = ({
  children,
  blockPageScroll = false,
}: {
  children: ReactNode
  blockPageScroll?: boolean
}) => {
  return (
    <div
      className={`flex flex-col min-h-screen ${blockPageScroll ? ' max-h-screen overflow-hidden' : ''}`}
    >
      <div className="flex justify-between w-full bg-bg_secondary border-b-[1px] border-white/10 p-4">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
          <p className="font-semibold">Logs View</p>
        </div>

        <SignOutButton />
      </div>

      <NavigationMenu />

      {children}
    </div>
  )
}

export default LayoutPages
