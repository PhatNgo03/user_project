import Link from 'next/link'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'HomePage',
  description: 'Description',
}
export default function Home() {
  return (
    <>
      <div className='container'>
        <ul>
          <li>
            <Link href={"/User"}>
              <span>User</span>
            </Link>
          </li>

        </ul>

      </div>
    </>
  )
}
