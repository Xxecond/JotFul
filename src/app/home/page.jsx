'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks'
import { useRouter } from 'next/navigation'
import { Header, BlogCard, SearchBar } from '@/components'
import { getUserPosts, deletePost } from '@/lib/postService'
import { Button } from '@/components/ui'
import Link from 'next/link'

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [blogs, setBlogs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/auth/login')
      return
    }

    const fetchBlogs = async () => {
      try {
        const data = await getUserPosts()
        setBlogs(Array.isArray(data) ? data : [])
      } catch {
        setBlogs([])
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [user, authLoading, router])

  if (authLoading || loading) return <div className="flex justify-center items-center h-screen">Loading...</div>

  const filtered = blogs.filter((b) => b?.title?.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return
    try {
      await deletePost(id)
      setBlogs((prev) => prev.filter((b) => b._id !== id))
    } catch {
      alert('Failed to delete post')
    }
  }

  return (
    <>
      <Header />
      <SearchBar setSearchTerm={setSearchTerm} />
      <section className="home px-4 py-6">
        {filtered.length > 0 ? (
          filtered.map((blog) => blog && <BlogCard key={blog._id} blog={blog} onDelete={handleDelete} />)
        ) : (
          <div className="flex justify-center">
            <Button variant="special" className="mt-40">
              <Link href="/create">CREATE NEW BLOG</Link>
            </Button>
          </div>
        )}
      </section>
    </>
  )
}
